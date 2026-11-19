import { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import net from "net";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  PROJECT_ROOT,
  DATA_ROOT,
  IS_WIN,
  getEffectivePythonBin,
  getEffectiveGoBin,
} from "./platform.ts";
import {
  verifyCouncilSyntax,
  runCouncilSelfRepair,
  resolveHostPythonBin,
} from "../guardian_claude_code.ts";
import {
  DATA_DIR,
  WORKSPACE_OUTPUT_ROOT,
  BUILD_ROOT,
  BACKENDS,
  HOST_VERIFIED_STATE,
  LIVE_HOST_TUNNELS,
  enabledColabHosts,
  refreshBackends,
  readConf,
  saveConf,
  loadMcp,
  loadTools,
  isInternalBridgeUrl,
  getValidGeminiApiKey,
  inspectGeminiKeyHealth,
  pushLiveConsole,
  log,
} from "./state-and-hosts.ts";
import {
  HOST_CIRCUIT_BREAKERS,
  resetHostCircuit,
  isBuiltInLoopbackStubUrl,
  probeHostEndpoint,
  syncGistTunnels,
  computeClusterVramSnapshot,
  rebalanceLineupAcrossHostsFFD,
  completeBackend,
} from "./vram-and-inference.ts";
import { runStatefulPythonInterpreter } from "./shared-services.ts";
import {
  getAutoUpdaterState,
  checkForGitUpdates,
  pullAndApplyGitUpdate,
} from "./auto-updater.ts";

const execFileAsync = promisify(execFile);

export type DoctorSeverity = "ok" | "repaired" | "warn" | "error";

export interface DoctorCheckItem {
  id: string;
  domain: string;
  title: string;
  status: DoctorSeverity;
  summary: string;
  auto_repaired?: boolean;
  repair_action_taken?: string;
  error_code?: string;
  error_definition?: string;
  repair_steps?: string[];
  meta?: Record<string, any>;
}

export interface DoctorRepairScriptArtifact {
  generated: boolean;
  script_path: string;
  relative_disk_path: string;
  launcher_path?: string;
  platform: "windows_ps1" | "posix_sh";
  targeted_issue_codes: string[];
  script_content: string;
  executed: boolean;
  exec_ok: boolean;
  exec_output: string;
  generated_at: string;
}

export interface DoctorReport {
  ok: boolean;
  healthy: boolean;
  ts: string;
  duration_ms: number;
  auto_fix: boolean;
  focus: string;
  counts: {
    total: number;
    ok: number;
    repaired: number;
    warn: number;
    error: number;
  };
  domains: string[];
  auto_repairs: string[];
  checks: DoctorCheckItem[];
  updater?: ReturnType<typeof getAutoUpdaterState>;
  repair_script?: DoctorRepairScriptArtifact;
  repair_summary: string;
}

async function execVersionAsync(bin: string, args: string[], timeout = 4500): Promise<{ ok: boolean; out: string; err: string }> {
  try {
    const r = await execFileAsync(bin, args, {
      timeout,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    });
    const txt = String(r.stdout || r.stderr || "").trim();
    return { ok: true, out: txt.split(/\r?\n/)[0] || "OK", err: "" };
  } catch (err: any) {
    return {
      ok: false,
      out: "",
      err: String(err?.stderr || err?.message || err || "").trim().slice(0, 200),
    };
  }
}

function probeTcpFast(port: number, host = "127.0.0.1", timeoutMs = 400): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = net.createConnection({ host, port });
    const done = (ok: boolean) => {
      try {
        sock.destroy();
      } catch {}
      resolve(ok);
    };
    sock.setTimeout(timeoutMs, () => done(false));
    sock.once("connect", () => done(true));
    sock.once("error", () => done(false));
  });
}

function matchesFocus(focus: string, domain: string, id = ""): boolean {
  if (!focus || focus === "all" || focus === "full") return true;
  const f = focus.toLowerCase();
  const d = domain.toLowerCase();
  const k = id.toLowerCase();
  if (f.includes("host") || f.includes("endpoint") || f.includes("tunnel") || f.includes("gpu") || f.includes("vram")) {
    return d.includes("host") || d.includes("circuit") || d.includes("local_gpu") || d.includes("cloud");
  }
  if (f.includes("key") || f.includes("auth") || f.includes("env") || f.includes("cred") || f.includes("token")) {
    return d.includes("credential") || d.includes("cloud");
  }
  if (f.includes("update") || f.includes("git")) {
    return d.includes("updater");
  }
  if (f.includes("py") || f.includes("tool") || f.includes("go") || f.includes("git")) {
    return d.includes("toolchain");
  }
  return d.includes(f) || k.includes(f);
}

function psSingleQuote(val: string): string {
  return `'${String(val || "").replace(/'/g, "''")}'`;
}

function shSingleQuote(val: string): string {
  return `'${String(val || "").replace(/'/g, "'\\''")}'`;
}

export async function synthesizeAndOptionallyRunDoctorScript(
  checks: DoctorCheckItem[],
  opts: { execute: boolean; port?: number }
): Promise<DoctorRepairScriptArtifact> {
  const repairsDir = path.join(WORKSPACE_OUTPUT_ROOT, "doctor_repairs");
  fs.mkdirSync(repairsDir, { recursive: true });

  const tsStamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const flaggedChecks = checks.filter((c) => c.status !== "ok");
  const targetedCodes = Array.from(
    new Set(flaggedChecks.map((c) => c.error_code || c.id.toUpperCase()).filter(Boolean))
  );
  const port = Number(opts.port || process.env.PORT || 3077);
  const upState = getAutoUpdaterState();
  const repoDir = upState.repo_dir || (!PROJECT_ROOT.toLowerCase().includes(".asar") ? PROJECT_ROOT : "");
  const issueBanner = flaggedChecks.length
    ? flaggedChecks.map((c) => `#   - [${c.status.toUpperCase()}] ${c.error_code || c.id}: ${c.summary}`).join("\n")
    : "#   - Baseline preventative health & state verification";

  if (IS_WIN) {
    const fileName = `doctor_repair_${tsStamp}.ps1`;
    const scriptPath = path.join(repairsDir, fileName);
    const latestPs1 = path.join(repairsDir, "latest_repair.ps1");
    const latestBat = path.join(repairsDir, "latest_repair.bat");
    const relativeDiskPath = `council_outputs/doctor_repairs/${fileName}`;

    const hasKeyIssue = flaggedChecks.some((c) => /GEMINI|ORCA|CREDENTIAL|GITHUB/i.test(`${c.id} ${c.error_code || ""}`));
    const hasToolchainIssue = flaggedChecks.some((c) => /TOOLCHAIN|PYTHON|REPL/i.test(`${c.id} ${c.error_code || ""}`));
    const hasHostIssue = flaggedChecks.some((c) => /HOST|CIRCUIT|VRAM|ENDPOINT|ORCA/i.test(`${c.id} ${c.error_code || ""} ${c.domain}`));

    const scriptContent = `<#
  ============================================================================
  SUOMYNONA COUNCIL — AUTO-GENERATED /DOCTOR REPAIR SCRIPT (Windows PowerShell)
  Generated : ${new Date().toISOString()}
  Data Root : ${DATA_ROOT}
  App Root  : ${PROJECT_ROOT}
  Targeted Issues:
${issueBanner}
  ============================================================================
#>
param(
  [switch]$NonInteractiveAutoFix,
  [switch]$InstallMissingToolchains
)

$ErrorActionPreference = "Continue"
$DataRoot = ${psSingleQuote(DATA_ROOT)}
$DataDir = Join-Path $DataRoot ".council_data"
$OutputsDir = Join-Path $DataRoot "council_outputs"
$BuildsDir = Join-Path $DataRoot "council_builds"
$ServerPort = ${port}
$RepoDir = ${psSingleQuote(repoDir)}

Write-Host "[REPAIR-START] Suomynona Council Diagnostic Auto-Repair Running..." -ForegroundColor Cyan

# 1. Ensure Persistent Data Directories & Quarantine Corrupt JSON State
foreach ($d in @($DataRoot, $DataDir, $OutputsDir, $BuildsDir)) {
  if (-not (Test-Path -LiteralPath $d)) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
    Write-Host "[REPAIR-OK] Created missing directory: $d"
  }
}

Get-ChildItem -LiteralPath $DataDir -Filter "*.json" -File -ErrorAction SilentlyContinue | ForEach-Object {
  try {
    $raw = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8 -ErrorAction Stop
    if ([string]::IsNullOrWhiteSpace($raw)) { throw "Empty JSON file" }
    $null = $raw | ConvertFrom-Json -ErrorAction Stop
  } catch {
    $bak = "$($_.FullName).corrupt_$(Get-Date -Format 'yyyyMMddHHmmss').bak"
    Copy-Item -LiteralPath $_.FullName -Destination $bak -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue
    Write-Host "[REPAIR-OK] Quarantined corrupt JSON $($_.Name) -> $bak"
  }
}
Write-Host "[REPAIR-OK] Verified .council_data JSON integrity."

# 2. Clean Template Placeholders in .env & Normalize conf.json
$EnvFile = Join-Path $DataRoot ".env"
if (Test-Path -LiteralPath $EnvFile) {
  $envRaw = Get-Content -LiteralPath $EnvFile -Raw -Encoding UTF8
  $envFixed = $envRaw -replace '(?im)^GEMINI_API_KEY\s*=\s*["'']?MY_GEMINI_API_KEY["'']?\s*$', '# GEMINI_API_KEY="" (cleared placeholder by /doctor repair script)' -replace '(?im)^APP_URL\s*=\s*["'']?MY_APP_URL["'']?\s*$', '# APP_URL="" (cleared placeholder by /doctor repair script)'
  if ($envFixed -ne $envRaw) {
    Set-Content -LiteralPath $EnvFile -Value $envFixed -Encoding UTF8 -NoNewline
    Write-Host "[REPAIR-OK] Cleaned template placeholders in $EnvFile"
  }
}

$ConfFile = Join-Path $DataDir "conf.json"
if (Test-Path -LiteralPath $ConfFile) {
  try {
    $confObj = Get-Content -LiteralPath $ConfFile -Raw -Encoding UTF8 | ConvertFrom-Json
    $changed = $false
    foreach ($k in @("ORCAROUTER_API_KEY", "OPENROUTER_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY", "GH_TOKEN", "HF_TOKEN", "GIST_ID")) {
      $prop = $confObj.PSObject.Properties[$k]
      if ($prop -and $prop.Value -is [string]) {
        $cleanVal = $prop.Value.Trim().Trim('"').Trim("'")
        if ($cleanVal -ne $prop.Value) {
          $prop.Value = $cleanVal
          $changed = $true
          Write-Host "[REPAIR-OK] Stripped stray whitespace/quotes from $k in conf.json"
        }
      }
    }
    if ($confObj.OPENAI_API_KEY -and ($confObj.OPENAI_API_KEY -like "sk-or-v1-*") -and (-not $confObj.OPENROUTER_API_KEY)) {
      $confObj | Add-Member -NotePropertyName "OPENROUTER_API_KEY" -NotePropertyValue $confObj.OPENAI_API_KEY -Force
      $changed = $true
      Write-Host "[REPAIR-OK] Routed OpenRouter key into OPENROUTER_API_KEY"
    }
    if ($confObj.OPENAI_API_KEY -and ($confObj.OPENAI_API_KEY -like "sk-orca-*" -or $confObj.OPENAI_API_KEY -like "orca_*") -and (-not $confObj.ORCAROUTER_API_KEY)) {
      $confObj | Add-Member -NotePropertyName "ORCAROUTER_API_KEY" -NotePropertyValue $confObj.OPENAI_API_KEY -Force
      $changed = $true
      Write-Host "[REPAIR-OK] Routed OrcaRouter key into ORCAROUTER_API_KEY"
    }
    ${hasKeyIssue ? `
    if (-not $NonInteractiveAutoFix) {
      Write-Host ""
      Write-Host "[INTERACTIVE-FIX] API key warning detected earlier. Leave blank to skip." -ForegroundColor Yellow
      $newGem = Read-Host "Paste fresh Gemini AIzaSy... API key (or Enter to skip)"
      if ($newGem -match '^AIzaSy') {
        $confObj | Add-Member -NotePropertyName "GEMINI_API_KEY" -NotePropertyValue $newGem.Trim() -Force
        $changed = $true
        Write-Host "[REPAIR-OK] Saved new GEMINI_API_KEY to conf.json"
      }
      $newOrca = Read-Host "Paste fresh ORCAROUTER_API_KEY (or Enter to skip)"
      if (-not [string]::IsNullOrWhiteSpace($newOrca)) {
        $confObj | Add-Member -NotePropertyName "ORCAROUTER_API_KEY" -NotePropertyValue $newOrca.Trim() -Force
        $changed = $true
        Write-Host "[REPAIR-OK] Saved new ORCAROUTER_API_KEY to conf.json"
      }
    }` : ""}
    if ($changed) {
      $confObj | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ConfFile -Encoding UTF8
    }
  } catch {
    Write-Host "[REPAIR-WARN] conf.json parse warning: $($_.Exception.Message)"
  }
}

# 3. Clear Stale Git Lock Files & Verify Local Listeners / Backend Endpoints
if (-not [string]::IsNullOrWhiteSpace($RepoDir)) {
  $gitLock = Join-Path $RepoDir ".git\\index.lock"
  if (Test-Path -LiteralPath $gitLock) {
    $ageMin = ((Get-Date) - (Get-Item -LiteralPath $gitLock).LastWriteTime).TotalMinutes
    if ($ageMin -gt 10) {
      Remove-Item -LiteralPath $gitLock -Force -ErrorAction SilentlyContinue
      Write-Host "[REPAIR-OK] Cleared stale .git\\index.lock (age: $([math]::Round($ageMin, 1)) min)"
    }
  }
}

${hasHostIssue ? `# Probe local GPU / bridge ports
foreach ($p in @(8080, 8081, 8082, 8083, 11434, 1234, 8000)) {
  try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $ar = $tcp.BeginConnect("127.0.0.1", $p, $null, $null)
    $ok = $ar.AsyncWaitHandle.WaitOne(220, $false)
    if ($ok -and $tcp.Connected) {
      Write-Host "[REPAIR-OK] Port 127.0.0.1:$p listening cleanly."
    }
    $tcp.Close()
  } catch {}
}
` : ""}# Probe running backend & reset host health if online
try {
  $uri = "http://127.0.0.1:$ServerPort/api/hosts/heartbeat"
  $hb = Invoke-RestMethod -Uri $uri -Method GET -TimeoutSec 2 -ErrorAction Stop
  if ($hb.ok) {
    Write-Host "[REPAIR-OK] Backend heartbeat on 127.0.0.1:$ServerPort responded OK."
  }
} catch {
  Write-Host "[REPAIR-INFO] Backend port $ServerPort probe skipped (normal during isolated shutdown/cli run)."
}

# 4. Verify Windows Toolchains (Real Python, Git, .NET x64 csc.exe)
$pyReal = (where.exe python 2>$null | Where-Object { $_ -notmatch 'WindowsApps' } | Select-Object -First 1)
if ($pyReal) {
  $pyV = (& $pyReal --version 2>&1) -join " "
  Write-Host "[REPAIR-OK] Host Python verified: $pyV ($pyReal)"
} else {
  Write-Host "[REPAIR-WARN] Real Python 3 binary missing from PATH (only WindowsApps alias found)."
  ${hasToolchainIssue ? `if ($InstallMissingToolchains -and (Get-Command winget -ErrorAction SilentlyContinue)) {
    winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
  }` : ""}
}

$csc64 = "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe"
if (Test-Path -LiteralPath $csc64) {
  Write-Host "[REPAIR-OK] Native Windows x64 PE32+ compiler ready ($csc64)"
} else {
  Write-Host "[REPAIR-WARN] Windows .NET csc.exe not found at $csc64"
}

if (Get-Command git -ErrorAction SilentlyContinue) {
  $gv = (& git --version 2>&1) -join " "
  Write-Host "[REPAIR-OK] Git verified: $gv"
} else {
  Write-Host "[REPAIR-WARN] Git not found in PATH — install with: winget install -e --id Git.Git"
  if ($InstallMissingToolchains -and (Get-Command winget -ErrorAction SilentlyContinue)) {
    winget install -e --id Git.Git --accept-package-agreements --accept-source-agreements
  }
}

Write-Host "[REPAIR-DONE] Auto-repair script finished." -ForegroundColor Green
`;

    fs.writeFileSync(scriptPath, scriptContent, "utf-8");
    fs.writeFileSync(latestPs1, scriptContent, "utf-8");
    const batContent = `@echo off\r\ntitle Suomynona Council — /doctor Auto-Repair Script\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "${latestPs1}"\r\npause\r\n`;
    fs.writeFileSync(latestBat, batContent, "utf-8");

    let executed = false;
    let execOk = true;
    let execOutput = "";
    if (opts.execute) {
      executed = true;
      try {
        const res = await execFileAsync(
          "powershell.exe",
          ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath, "-NonInteractiveAutoFix"],
          { timeout: 14000, windowsHide: true, maxBuffer: 1024 * 1024 }
        );
        execOutput = [String(res.stdout || "").trim(), String(res.stderr || "").trim()].filter(Boolean).join("\n") || "[REPAIR-DONE] Completed cleanly.";
      } catch (err: any) {
        execOk = false;
        execOutput = [String(err?.stdout || "").trim(), String(err?.stderr || err?.message || err).trim()].filter(Boolean).join("\n");
      }
    }

    return {
      generated: true,
      script_path: scriptPath,
      relative_disk_path: relativeDiskPath,
      launcher_path: latestBat,
      platform: "windows_ps1",
      targeted_issue_codes: targetedCodes,
      script_content: scriptContent,
      executed,
      exec_ok: execOk,
      exec_output: execOutput,
      generated_at: new Date().toISOString(),
    };
  } else {
    const fileName = `doctor_repair_${tsStamp}.sh`;
    const scriptPath = path.join(repairsDir, fileName);
    const relativeDiskPath = `council_outputs/doctor_repairs/${fileName}`;
    const scriptContent = `#!/usr/bin/env bash
set -u
# SUOMYNONA COUNCIL — AUTO-GENERATED /DOCTOR REPAIR SCRIPT
# Generated: ${new Date().toISOString()}
${issueBanner}
DATA_ROOT=${shSingleQuote(DATA_ROOT)}
mkdir -p "$DATA_ROOT/.council_data" "$DATA_ROOT/council_outputs" "$DATA_ROOT/council_builds"
echo "[REPAIR-OK] Verified data directories in $DATA_ROOT"
command -v python3 >/dev/null 2>&1 && echo "[REPAIR-OK] Python: $(python3 --version)" || echo "[REPAIR-WARN] python3 missing"
command -v git >/dev/null 2>&1 && echo "[REPAIR-OK] Git: $(git --version)" || echo "[REPAIR-WARN] git missing"
echo "[REPAIR-DONE] Auto-repair script finished."
`;
    fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
    let executed = false;
    let execOk = true;
    let execOutput = "";
    if (opts.execute) {
      executed = true;
      try {
        const res = await execFileAsync("bash", [scriptPath], { timeout: 12000, maxBuffer: 1024 * 1024 });
        execOutput = String(res.stdout || "").trim() || "[REPAIR-DONE] Completed cleanly.";
      } catch (err: any) {
        execOk = false;
        execOutput = String(err?.stderr || err?.message || err);
      }
    }
    return {
      generated: true,
      script_path: scriptPath,
      relative_disk_path: relativeDiskPath,
      platform: "posix_sh",
      targeted_issue_codes: targetedCodes,
      script_content: scriptContent,
      executed,
      exec_ok: execOk,
      exec_output: execOutput,
      generated_at: new Date().toISOString(),
    };
  }
}

export async function runComprehensiveDoctor(opts: {
  autoFix?: boolean;
  focus?: string;
  traceback?: string;
  generateScript?: boolean;
  runScript?: boolean;
} = {}): Promise<DoctorReport> {
  const t0 = Date.now();
  const autoFix = opts.autoFix !== false;
  const rawFocus = String(opts.focus || "").trim().toLowerCase();
  const traceback = String(opts.traceback || "").trim();
  const focus =
    rawFocus ||
    (/^(hosts?|endpoints?|tunnels?|gpus?|vram|keys?|auth|env|update|git|python|toolchains?|syntax|storage|a2a|mcp)$/i.test(traceback)
      ? traceback.toLowerCase()
      : "all");

  const checks: DoctorCheckItem[] = [];
  const autoRepairs: string[] = [];

  const pushCheck = (item: DoctorCheckItem) => {
    checks.push(item);
    if (item.auto_repaired && item.repair_action_taken) {
      autoRepairs.push(item.repair_action_taken);
    }
  };

  // ── DOMAIN 1: DESKTOP_AND_UPDATER ──
  if (matchesFocus(focus, "desktop_and_updater", "updater")) {
    pushCheck({
      id: "runtime_paths",
      domain: "DESKTOP_AND_UPDATER",
      title: "App Root & Writable User Data Isolation",
      status: fs.existsSync(DATA_ROOT) ? "ok" : "error",
      summary: `AppRoot=${PROJECT_ROOT} · DataRoot=${DATA_ROOT} · Mode=${process.env.COUNCIL_DESKTOP_MODE === "1" ? "Native Desktop (.exe)" : "Web/Node"}`,
      ...(!fs.existsSync(DATA_ROOT)
        ? {
            error_code: "DATA_ROOT_MISSING",
            error_definition: `Writable data root directory '${DATA_ROOT}' does not exist.`,
            repair_steps: [
              `1. Ensure '${DATA_ROOT}' is writable by your Windows account.`,
              "2. Launch Suomynona Council via LAUNCH_SUOMYNONA_DESKTOP.bat or run-local-desktop.bat.",
            ],
          }
        : {}),
    });

    try {
      let upState =
        focus === "update" && autoFix
          ? (await pullAndApplyGitUpdate()).state
          : await checkForGitUpdates({ autoApply: autoFix, manual: true });
      const isUpToDate = upState.status === "up_to_date" || upState.status === "applied" || upState.status === "ahead_of_remote";
      pushCheck({
        id: "git_auto_updater",
        domain: "DESKTOP_AND_UPDATER",
        title: "Git Repository Auto-Updater",
        status:
          upState.status === "applied"
            ? "repaired"
            : upState.status === "error"
            ? "error"
            : upState.commits_behind > 0
            ? "warn"
            : isUpToDate
            ? "ok"
            : "warn",
        auto_repaired: upState.status === "applied",
        repair_action_taken:
          upState.status === "applied" ? `Auto-pulled & built Git update ${upState.installed_short}` : undefined,
        summary: `${upState.repo_url} (${upState.branch}) · Status=${upState.status.toUpperCase()} · Local=${upState.local_short || "?"} · Remote=${upState.remote_short || "?"} · Behind=${upState.commits_behind} · AutoPull=${upState.auto_pull ? "ON" : "OFF"}`,
        ...(upState.last_error
          ? {
              error_code: "GIT_UPDATER_ERROR",
              error_definition: upState.error_definition || upState.last_error,
              repair_steps: upState.repair_steps?.length
                ? upState.repair_steps
                : [
                    "1. Verify Git for Windows is installed ('git --version').",
                    "2. Verify internet access to github.com/suomynonaew/suomynona-council.",
                    "3. Run '/update pull' in CLI.",
                  ],
            }
          : upState.commits_behind > 0
          ? {
              error_code: "GIT_UPDATE_PENDING",
              error_definition: `Repository is ${upState.commits_behind} commit(s) behind origin/${upState.branch} (${upState.remote_subject}).`,
              repair_steps: [
                "1. Click '🔄 Git Sync' in the top bar or run '/update pull'.",
                "2. The desktop app will automatically pull, rebuild dist/, and hot-reload.",
              ],
            }
          : {}),
      });
    } catch (err: any) {
      pushCheck({
        id: "git_auto_updater",
        domain: "DESKTOP_AND_UPDATER",
        title: "Git Repository Auto-Updater",
        status: "warn",
        summary: `Updater probe failed: ${err?.message || String(err)}`,
        error_code: "UPDATER_PROBE_FAILED",
        error_definition: `Unexpected exception while checking Git remote updates: ${err?.message || err}`,
        repair_steps: ["1. Check internet connection and 'git --version'.", "2. Try running '/update pull'."],
      });
    }
  }

  // ── DOMAIN 2: STORAGE_AND_STATE ──
  if (matchesFocus(focus, "storage_and_state", "storage")) {
    let writeOk = false;
    let writeErr = "";
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.mkdirSync(WORKSPACE_OUTPUT_ROOT, { recursive: true });
      fs.mkdirSync(BUILD_ROOT, { recursive: true });
      const probeFile = path.join(DATA_DIR, ".doctor_write_probe.tmp");
      fs.writeFileSync(probeFile, "ok", "utf-8");
      fs.unlinkSync(probeFile);
      writeOk = true;
    } catch (e: any) {
      writeErr = e?.message || String(e);
    }
    pushCheck({
      id: "data_dir_writable",
      domain: "STORAGE_AND_STATE",
      title: "Persistent Data & Output Directories Writable",
      status: writeOk ? "ok" : "error",
      summary: writeOk
        ? `Verified read/write access to ${DATA_DIR}, ${WORKSPACE_OUTPUT_ROOT}, and ${BUILD_ROOT}`
        : `Write permission test failed on ${DATA_DIR}: ${writeErr}`,
      ...(!writeOk
        ? {
            error_code: "STORAGE_NOT_WRITABLE",
            error_definition: `Suomynona Council cannot write state files to '${DATA_DIR}' (${writeErr}). Antivirus Controlled Folder Access or read-only folder permissions can cause this.`,
            repair_steps: [
              `1. Grant write permissions for your Windows user to '${DATA_ROOT}'.`,
              "2. If Windows Ransomware Protection is blocking the .exe, allow 'Suomynona Council.exe'.",
            ],
          }
        : {}),
    });

    if (autoFix) {
      const selfRepair = runCouncilSelfRepair();
      const quarantined = selfRepair.repaired.filter((r) => /Quarantined|Restored/.test(r));
      pushCheck({
        id: "council_json_integrity",
        domain: "STORAGE_AND_STATE",
        title: "JSON State & 4-Host Configuration Integrity",
        status: quarantined.length ? "repaired" : "ok",
        auto_repaired: quarantined.length > 0,
        repair_action_taken: quarantined.length ? quarantined.join("; ") : undefined,
        summary: quarantined.length
          ? `Repaired ${quarantined.length} corrupt/missing state file(s): ${quarantined.join("; ")}`
          : `All .council_data/*.json state files parsed cleanly`,
      });
    } else {
      const brokenJson: string[] = [];
      for (const f of fs.existsSync(DATA_DIR) ? fs.readdirSync(DATA_DIR) : []) {
        if (!f.endsWith(".json")) continue;
        try {
          JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf-8"));
        } catch {
          brokenJson.push(f);
        }
      }
      pushCheck({
        id: "council_json_integrity",
        domain: "STORAGE_AND_STATE",
        title: "JSON State & 4-Host Configuration Integrity",
        status: brokenJson.length ? "error" : "ok",
        summary: brokenJson.length
          ? `Corrupted JSON detected: ${brokenJson.join(", ")}`
          : "All .council_data/*.json files valid",
        ...(brokenJson.length
          ? {
              error_code: "CORRUPT_STATE_JSON",
              error_definition: `One or more JSON files in ${DATA_DIR} contain invalid JSON syntax: ${brokenJson.join(", ")}.`,
              repair_steps: ["1. Run '/doctor' (with auto-repair enabled) to quarantine corrupt JSON and restore clean defaults."],
            }
          : {}),
      });
    }
  }

  // ── DOMAIN 3: CREDENTIALS_AND_ENV ──
  if (matchesFocus(focus, "credentials_and_env", "credentials")) {
    const envPath = path.join(DATA_ROOT, ".env");
    const envFixes: string[] = [];
    if (autoFix && fs.existsSync(envPath)) {
      try {
        const rawEnv = fs.readFileSync(envPath, "utf-8");
        let nextEnv = rawEnv
          .replace(/^GEMINI_API_KEY\s*=\s*["']?MY_GEMINI_API_KEY["']?\s*$/gim, '# GEMINI_API_KEY="" (cleared template placeholder by /doctor)')
          .replace(/^APP_URL\s*=\s*["']?MY_APP_URL["']?\s*$/gim, '# APP_URL="" (cleared template placeholder by /doctor)');
        if (nextEnv !== rawEnv) {
          fs.writeFileSync(envPath, nextEnv, "utf-8");
          if (process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") delete process.env.GEMINI_API_KEY;
          if (process.env.APP_URL === "MY_APP_URL") delete process.env.APP_URL;
          envFixes.push("Cleaned template placeholder entries in .env");
        }
      } catch {
        // ignore
      }
    }

    const savedConf = readConf();
    const confFixes: Record<string, string> = {};
    for (const k of ["ORCAROUTER_API_KEY", "OPENROUTER_API_KEY", "OPENAI_API_KEY", "XAI_API_KEY", "GEMINI_API_KEY", "GH_TOKEN", "HF_TOKEN", "GIST_ID"]) {
      const val = String(savedConf[k] || "");
      const cleaned = val.trim().replace(/^["']|["']$/g, "");
      if (val && cleaned !== val) {
        confFixes[k] = cleaned;
        envFixes.push(`Normalized stray whitespace/quotes in ${k}`);
      }
    }
    const openAiKey = String(confFixes.OPENAI_API_KEY || savedConf.OPENAI_API_KEY || "").trim();
    if (openAiKey.startsWith("sk-or-v1-") && !savedConf.OPENROUTER_API_KEY) {
      confFixes.OPENROUTER_API_KEY = openAiKey;
      envFixes.push("Mapped OpenRouter 'sk-or-v1-...' key into OPENROUTER_API_KEY");
    }
    if ((openAiKey.startsWith("sk-orca-") || openAiKey.startsWith("orca_")) && !savedConf.ORCAROUTER_API_KEY) {
      confFixes.ORCAROUTER_API_KEY = openAiKey;
      envFixes.push("Mapped OrcaRouter key into ORCAROUTER_API_KEY");
    }
    if (autoFix && Object.keys(confFixes).length > 0) {
      saveConf(confFixes);
    }

    const confNow = readConf();
    const rawGem = process.env.GEMINI_API_KEY || confNow.GEMINI_API_KEY || "";
    const gemHealth = inspectGeminiKeyHealth(rawGem);
    const hasOrca = Boolean(confNow.ORCAROUTER_API_KEY);
    const hasOpenRouter = Boolean(confNow.OPENROUTER_API_KEY);
    const hasGh = Boolean(confNow.GH_TOKEN);
    const hasHf = Boolean(confNow.HF_TOKEN);

    pushCheck({
      id: "env_and_conf_sanitization",
      domain: "CREDENTIALS_AND_ENV",
      title: "API Credentials, .env & Global Auth Vault",
      status: envFixes.length ? "repaired" : !gemHealth.valid && !hasOrca && !hasOpenRouter ? "warn" : gemHealth.code === "EPHEMERAL_AISTUDIO_TOKEN" ? "warn" : "ok",
      auto_repaired: envFixes.length > 0,
      repair_action_taken: envFixes.length ? envFixes.join("; ") : undefined,
      summary:
        `OrcaRouter=${hasOrca ? "SET" : "MISSING"} · OpenRouter=${hasOpenRouter ? "SET" : "UNSET"} · Gemini=${gemHealth.valid ? "VALID" : gemHealth.code} · GitHub=${hasGh ? "SET" : "UNSET"} · HF=${hasHf ? "SET" : "UNSET"}` +
        (envFixes.length ? ` · Repaired: ${envFixes.join("; ")}` : ""),
      ...(!gemHealth.valid
        ? {
            error_code: `GEMINI_KEY_${gemHealth.code}`,
            error_definition:
              gemHealth.reason +
              (gemHealth.code === "EPHEMERAL_AISTUDIO_TOKEN"
                ? " Wait: OrcaRouter works independently if its key is valid, but Gemini fallback calls will fail until replaced."
                : ""),
            repair_steps: [
              "1. Go to https://aistudio.google.com/apikey and create a standard Gemini API key starting with 'AIzaSy...'.",
              "2. Open Configure -> /host Setup -> Global Auth (or edit %APPDATA%\\Suomynona Council\\.env) and save GEMINI_API_KEY.",
              "3. Also verify ORCAROUTER_API_KEY or OPENROUTER_API_KEY is valid in Global Auth.",
            ],
          }
        : {}),
    });
  }

  // ── DOMAIN 4: GPU_HOSTS_AND_TUNNELS ──
  let lastGistFiles: string[] = [];
  if (matchesFocus(focus, "gpu_hosts_and_tunnels", "hosts")) {
    const conf = readConf();
    if (conf.GIST_ID) {
      try {
        const gr = await fetch(`https://api.github.com/gists/${conf.GIST_ID}`, {
          headers: {
            ...(conf.GH_TOKEN ? { Authorization: `token ${conf.GH_TOKEN}` } : {}),
            Accept: "application/vnd.github+json",
            "User-Agent": "suomynona-council-doctor",
          },
          signal: AbortSignal.timeout(3500),
        });
        if (gr.ok) {
          const gJson: any = await gr.json();
          lastGistFiles = Object.keys(gJson?.files || {});
        }
      } catch {
        // ignore gist lookup failure here; cloud domain will catch network issues
      }
      if (autoFix) {
        await syncGistTunnels(true).catch(() => 0);
      }
    }

    const hasProviderGistFiles = lastGistFiles.some((f) => f.startsWith("opencode-providers"));
    const hosts = enabledColabHosts();
    const defaultPorts: Record<string, number> = { a: 8080, b: 8081, c: 8082, d: 8083 };

    for (const h of hosts) {
      const hid = String(h.id || "a").toLowerCase();
      const targetUrl = String(
        LIVE_HOST_TUNNELS[hid] || h.custom_url || h.local_url || `http://127.0.0.1:${defaultPorts[hid] || 8080}/v1`
      ).trim();
      const probe = await probeHostEndpoint(targetUrl, h, 2000);
      const isInternal = Boolean(probe.is_internal_bridge || isInternalBridgeUrl(targetUrl));

      if (probe.ok && isInternal) {
        pushCheck({
          id: `host_${hid}_endpoint`,
          domain: "GPU_HOSTS_AND_TUNNELS",
          title: `${h.name || `Host ${hid.toUpperCase()}`} Endpoint`,
          status: "ok",
          summary:
            `Built-in Cloud Fallback Bridge active on ${targetUrl} (latency ${probe.latency_ms}ms; no external GPU tunnel currently attached` +
            (hasProviderGistFiles ? ")" : `; Gist has ${lastGistFiles.length} file(s), no live opencode-providers-${hid}.json tunnel)`),
          meta: { host: hid, url: targetUrl, mode: "internal_bridge", latency_ms: probe.latency_ms },
        });
      } else if (probe.ok) {
        pushCheck({
          id: `host_${hid}_endpoint`,
          domain: "GPU_HOSTS_AND_TUNNELS",
          title: `${h.name || `Host ${hid.toUpperCase()}`} Endpoint`,
          status: "ok",
          summary: `LIVE external GPU runtime on ${targetUrl} · Engine=${probe.engine} · Models=${probe.models.length} · ${probe.latency_ms}ms`,
          meta: { host: hid, url: targetUrl, mode: "external_gpu", models: probe.models, latency_ms: probe.latency_ms },
        });
      } else {
        // Auto-repair stale localhost/custom URL pointing to dead external port by falling back to clean built-in bridge if desired?
        // Better: don't silently erase user's custom URL unless they explicitly asked; explain exact error + steps cleanly!
        pushCheck({
          id: `host_${hid}_endpoint`,
          domain: "GPU_HOSTS_AND_TUNNELS",
          title: `${h.name || `Host ${hid.toUpperCase()}`} Endpoint`,
          status: "error",
          summary: `${probe.error || "Host endpoint unreachable"} (${probe.error_code || "UNREACHABLE"})`,
          error_code: probe.error_code || "HOST_UNREACHABLE",
          error_definition: probe.error_definition || `Host ${hid.toUpperCase()} endpoint '${targetUrl}' failed health verification.`,
          repair_steps: probe.fix_steps || [
            "1. Open Configure -> /host Setup and verify this host's Custom / Localhost URL.",
            "2. If using Google Colab / Kaggle, re-run the Boot Cell and click Refresh Gist.",
          ],
          meta: { host: hid, url: targetUrl, http_status: probe.http_status },
        });
      }
    }
  }

  // ── DOMAIN 5: CIRCUIT_BREAKERS_AND_VRAM ──
  if (matchesFocus(focus, "circuit_breakers_and_vram", "vram")) {
    const openCircuits: string[] = [];
    const resetCircuits: string[] = [];
    for (const hid of ["a", "b", "c", "d"]) {
      const cb = HOST_CIRCUIT_BREAKERS[hid];
      if (cb && cb.state !== "CLOSED") {
        openCircuits.push(`${hid.toUpperCase()}:${cb.state}(${cb.last_error || "failures"})`);
        if (autoFix) {
          resetHostCircuit(hid);
          resetCircuits.push(hid.toUpperCase());
        }
      }
    }
    pushCheck({
      id: "host_circuit_breakers",
      domain: "CIRCUIT_BREAKERS_AND_VRAM",
      title: "Host Circuit Breakers",
      status: resetCircuits.length ? "repaired" : openCircuits.length ? "warn" : "ok",
      auto_repaired: resetCircuits.length > 0,
      repair_action_taken: resetCircuits.length ? `Reset circuit breakers for Host(s) ${resetCircuits.join(", ")}` : undefined,
      summary: resetCircuits.length
        ? `Reset ${resetCircuits.length} tripped circuit breaker(s): Host ${resetCircuits.join(", ")}`
        : openCircuits.length
        ? `Tripped circuit breaker(s): ${openCircuits.join(", ")}`
        : "All 4 host circuit breakers CLOSED (0 bypassed hosts)",
      ...(openCircuits.length && !resetCircuits.length
        ? {
            error_code: "CIRCUIT_BREAKER_OPEN",
            error_definition: `Repeated endpoint failures tripped circuit breakers (${openCircuits.join(", ")}), causing fast-skip routing.`,
            repair_steps: ["1. Fix the underlying host endpoint or run '/doctor' to auto-reset circuit breakers."],
          }
        : {}),
    });

    const vramBefore = computeClusterVramSnapshot();
    if (vramBefore.overcommitted_hosts.length > 0 && autoFix) {
      const reb = rebalanceLineupAcrossHostsFFD({ dryRun: false });
      const vramAfter = computeClusterVramSnapshot();
      pushCheck({
        id: "vram_cluster_balance",
        domain: "CIRCUIT_BREAKERS_AND_VRAM",
        title: "4-Host VRAM Capacity & FFD Packing",
        status: "repaired",
        auto_repaired: true,
        repair_action_taken: `Rebalanced ${reb.migrations.length} model(s) via FFD across Hosts A-D`,
        summary: `Auto-rebalanced ${vramBefore.overcommitted_hosts.join(", ")} -> cluster pressure ${vramAfter.cluster_pressure_pct}% (${vramAfter.cluster_used_gb}/${vramAfter.cluster_total_gb}GB)`,
      });
    } else {
      pushCheck({
        id: "vram_cluster_balance",
        domain: "CIRCUIT_BREAKERS_AND_VRAM",
        title: "4-Host VRAM Capacity & FFD Packing",
        status: vramBefore.overcommitted_hosts.length ? "warn" : "ok",
        summary: `Cluster VRAM ${vramBefore.cluster_used_gb}/${vramBefore.cluster_total_gb}GB (${vramBefore.cluster_pressure_pct}% · Overcommitted: ${vramBefore.overcommitted_hosts.length})`,
        ...(vramBefore.overcommitted_hosts.length
          ? {
              error_code: "VRAM_OVERCOMMITTED",
              error_definition: `Host(s) ${vramBefore.overcommitted_hosts.join(", ")} exceed usable VRAM model budget.`,
              repair_steps: ["1. Run '/rebalance' or '/doctor' to bin-pack models across Hosts A-D."],
            }
          : {}),
      });
    }
  }

  // ── DOMAIN 6: LOCAL_GPU_AND_ENGINES ──
  if (matchesFocus(focus, "local_gpu_and_engines", "local_gpu")) {
    const smi = await execVersionAsync("nvidia-smi", ["--query-gpu=name,memory.total,memory.free", "--format=csv,noheader"], 3000);
    const localPorts: Array<{ name: string; port: number }> = [
      { name: "Ollama (:11434)", port: 11434 },
      { name: "LM Studio (:1234)", port: 1234 },
      { name: "vLLM (:8000)", port: 8000 },
    ];
    const listeningNames: string[] = [];
    await Promise.all(
      localPorts.map(async (lp) => {
        if (await probeTcpFast(lp.port, "127.0.0.1", 350)) {
          listeningNames.push(lp.name);
        }
      })
    );
    pushCheck({
      id: "local_gpu_engines",
      domain: "LOCAL_GPU_AND_ENGINES",
      title: "Local NVIDIA GPU & Standalone Engine Listeners",
      status: "ok",
      summary:
        `NVIDIA GPU=${smi.ok ? smi.out : "Not detected / CPU or Cloud mode"} · Local Servers Online=${listeningNames.length ? listeningNames.join(", ") : "None (using built-in cloud/hybrid routing)"}`,
    });
  }

  // ── DOMAIN 7: CLOUD_INFERENCE_PROVIDERS ──
  if (matchesFocus(focus, "cloud_inference_providers", "cloud")) {
    const conf = readConf();
    const providerProbes: Promise<DoctorCheckItem>[] = [];

    // OrcaRouter
    providerProbes.push(
      (async () => {
        const key = conf.ORCAROUTER_API_KEY || (conf.OPENAI_API_KEY?.startsWith("sk-orca-") ? conf.OPENAI_API_KEY : "");
        try {
          const r = await fetch("https://api.orcarouter.ai/v1/models", {
            headers: key ? { Authorization: `Bearer ${key}` } : {},
            signal: AbortSignal.timeout(3000),
          });
          if (r.ok) {
            return {
              id: "provider_orcarouter",
              domain: "CLOUD_INFERENCE_PROVIDERS",
              title: "OrcaRouter Cloud Endpoint",
              status: key ? "ok" : "warn",
              summary: key
                ? `Reachable (HTTP ${r.status}) with ORCAROUTER_API_KEY saved`
                : `API reachable (HTTP ${r.status}), but no ORCAROUTER_API_KEY configured`,
              ...(!key
                ? {
                    error_code: "ORCAROUTER_KEY_MISSING",
                    error_definition: "OrcaRouter API is online, but ORCAROUTER_API_KEY is empty.",
                    repair_steps: ["1. Save ORCAROUTER_API_KEY in Configure -> /host Setup -> Global Auth."],
                  }
                : {}),
            };
          }
          return {
            id: "provider_orcarouter",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "OrcaRouter Cloud Endpoint",
            status: r.status === 401 || r.status === 403 ? "error" : "warn",
            summary: `OrcaRouter returned HTTP ${r.status}`,
            error_code: `ORCA_HTTP_${r.status}`,
            error_definition: `https://api.orcarouter.ai/v1/models returned HTTP ${r.status}. Invalid/revoked key (401/403) or rate limit (429).`,
            repair_steps: [
              "1. Check your OrcaRouter key in Configure -> /host Setup -> Global Auth.",
              "2. Test network access to https://api.orcarouter.ai.",
            ],
          };
        } catch (err: any) {
          return {
            id: "provider_orcarouter",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "OrcaRouter Cloud Endpoint",
            status: "warn",
            summary: `OrcaRouter unreachable: ${err?.message || String(err)}`,
            error_code: "ORCA_UNREACHABLE",
            error_definition: `Network request to https://api.orcarouter.ai/v1/models failed (${err?.message || err}).`,
            repair_steps: ["1. Check internet/DNS/firewall settings.", "2. Configure a local GPU (Ollama/LM Studio) or Gemini key as backup."],
          };
        }
      })()
    );

    // Gemini live API check (if valid key present)
    providerProbes.push(
      (async () => {
        const validGemKey = getValidGeminiApiKey();
        if (!validGemKey) {
          const rawGem = process.env.GEMINI_API_KEY || conf.GEMINI_API_KEY || "";
          const h = inspectGeminiKeyHealth(rawGem);
          return {
            id: "provider_gemini",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "Google Gemini API Endpoint",
            status: "warn",
            summary: `Skipped live call: ${h.reason}`,
            error_code: `GEMINI_${h.code}`,
            error_definition: `${h.reason}`,
            repair_steps: [
              "1. Get a standard Gemini API key ('AIzaSy...') at https://aistudio.google.com/apikey.",
              "2. Save it into %APPDATA%\\Suomynona Council\\.env (GEMINI_API_KEY=...) or Global Auth and restart/re-run /doctor.",
            ],
          };
        }
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(validGemKey)}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (r.ok) {
            return {
              id: "provider_gemini",
              domain: "CLOUD_INFERENCE_PROVIDERS",
              title: "Google Gemini API Endpoint",
              status: "ok",
              summary: `Authenticated & reachable (HTTP ${r.status})`,
            };
          }
          return {
            id: "provider_gemini",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "Google Gemini API Endpoint",
            status: "error",
            summary: `Gemini API rejected key or failed (HTTP ${r.status})`,
            error_code: `GEMINI_HTTP_${r.status}`,
            error_definition: `generativelanguage.googleapis.com returned HTTP ${r.status}. Usually an invalid, expired, or quota-exhausted API key.`,
            repair_steps: [
              "1. Generate a fresh Gemini API key ('AIzaSy...') at https://aistudio.google.com/apikey.",
              "2. Save it in Global Auth or %APPDATA%\\Suomynona Council\\.env.",
            ],
          };
        } catch (err: any) {
          return {
            id: "provider_gemini",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "Google Gemini API Endpoint",
            status: "warn",
            summary: `Gemini endpoint network error: ${err?.message || String(err)}`,
          };
        }
      })()
    );

    // GitHub API / Gist connectivity
    providerProbes.push(
      (async () => {
        try {
          const r = await fetch("https://api.github.com/rate_limit", {
            headers: {
              ...(conf.GH_TOKEN ? { Authorization: `token ${conf.GH_TOKEN}` } : {}),
              "User-Agent": "suomynona-council-doctor",
            },
            signal: AbortSignal.timeout(3000),
          });
          return {
            id: "provider_github",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "GitHub API & Gist Tunnel Sync",
            status: r.ok ? "ok" : "warn",
            summary: r.ok
              ? `GitHub API reachable (HTTP ${r.status}${conf.GH_TOKEN ? " · GH_TOKEN authenticated" : " · unauthenticated"})`
              : `GitHub API returned HTTP ${r.status}`,
            ...(!r.ok
              ? {
                  error_code: `GITHUB_HTTP_${r.status}`,
                  error_definition: `GitHub API returned HTTP ${r.status}. A stale GH_TOKEN returns 401; unauthenticated rate limits return 403.`,
                  repair_steps: [
                    "1. Update GH_TOKEN in Configure -> /host Setup -> Global Auth (https://github.com/settings/tokens).",
                    "2. Run '/doctor' again to verify Gist and repo auto-update access.",
                  ],
                }
              : {}),
          };
        } catch (err: any) {
          return {
            id: "provider_github",
            domain: "CLOUD_INFERENCE_PROVIDERS",
            title: "GitHub API & Gist Tunnel Sync",
            status: "warn",
            summary: `GitHub API unreachable: ${err?.message || String(err)}`,
          };
        }
      })()
    );

    const pResults = await Promise.all(providerProbes);
    pResults.forEach(pushCheck);
  }

  // ── DOMAIN 8: TOOLCHAINS_AND_PYTHON_REPL ──
  if (matchesFocus(focus, "toolchains_and_python_repl", "toolchains")) {
    const pyBin = getEffectivePythonBin() || resolveHostPythonBin();
    const goBin = getEffectiveGoBin();
    const [pyVer, gitVer, goVer, nodeVer] = await Promise.all([
      execVersionAsync(pyBin, ["--version"]),
      execVersionAsync("git", ["--version"]),
      execVersionAsync(goBin, ["version"]),
      execVersionAsync(process.execPath, ["--version"]),
    ]);

    const winAppsWarning =
      IS_WIN && /\\WindowsApps\\python/i.test(pyBin)
        ? "Resolved to Microsoft Store AppExecutionAlias stub instead of real Python installer."
        : "";

    pushCheck({
      id: "toolchains_binaries",
      domain: "TOOLCHAINS_AND_PYTHON_REPL",
      title: "Python 3, Git, Go & Embedded Node Toolchains",
      status: pyVer.ok && gitVer.ok && !winAppsWarning ? "ok" : "warn",
      summary: `Python=${pyVer.ok ? `${pyVer.out} (${pyBin})` : "MISSING"} · Git=${gitVer.ok ? gitVer.out : "MISSING"} · Go=${goVer.ok ? goVer.out : "UNAVAILABLE"} · Runtime=${nodeVer.out || process.version}`,
      ...(winAppsWarning || !pyVer.ok || !gitVer.ok
        ? {
            error_code: "TOOLCHAIN_MISSING_OR_STUB",
            error_definition: winAppsWarning || "One or more core development toolchains (Python 3 or Git) failed verification.",
            repair_steps: [
              ...(winAppsWarning || !pyVer.ok
                ? ["1. Disable Windows App Execution Aliases for python.exe/python3.exe or install Python 3.12 from https://www.python.org/downloads/."]
                : []),
              ...(!gitVer.ok ? ["2. Install Git for Windows (winget install Git.Git) for Git Auto-Updater & Guardian tools."] : []),
            ],
          }
        : {}),
    });

    try {
      const replTest = await runStatefulPythonInterpreter("21 * 2", "exec", 6000);
      const replOk = Boolean(replTest?.ok && String(replTest?.result_repr || "").trim() === "42");
      pushCheck({
        id: "python_repl_kernel",
        domain: "TOOLCHAINS_AND_PYTHON_REPL",
        title: "Stateful Python 3 REPL Kernel",
        status: replOk ? "ok" : "error",
        summary: replOk
          ? `Kernel alive (${replTest.python_version || "Python 3"} · 21 * 2 = 42 in ${replTest.elapsed_ms ?? 0}ms)`
          : `Python REPL test failed: ${replTest?.stderr || "unexpected output"}`,
        ...(!replOk
          ? {
              error_code: "PYTHON_REPL_FAILED",
              error_definition: `In-app Python 3 kernel failed sanity check (${replTest?.stderr || "no result"}).`,
              repair_steps: [
                `1. Verify '${pyBin} --version' works in PowerShell/CMD.`,
                "2. Check System -> Python REPL kernel logs and restart if locked.",
              ],
            }
          : {}),
      });
    } catch (err: any) {
      pushCheck({
        id: "python_repl_kernel",
        domain: "TOOLCHAINS_AND_PYTHON_REPL",
        title: "Stateful Python 3 REPL Kernel",
        status: "error",
        summary: `Python REPL exception: ${err?.message || String(err)}`,
      });
    }
  }

  // ── DOMAIN 9: FRONTEND_AND_BUNDLE_INTEGRITY ──
  if (matchesFocus(focus, "frontend_and_bundle_integrity", "syntax")) {
    const syntax = verifyCouncilSyntax();
    const broken = syntax.checks.filter((c) => !c.ok);
    const distHtmlExists = fs.existsSync(path.join(PROJECT_ROOT, "dist", "index.html"));
    const bundledServerExists = fs.existsSync(path.join(PROJECT_ROOT, "dist-server", "server.cjs"));

    pushCheck({
      id: "frontend_bundle_integrity",
      domain: "FRONTEND_AND_BUNDLE_INTEGRITY",
      title: "Frontend JS Syntax, Catalog & Desktop Bundle Integrity",
      status: broken.length === 0 ? "ok" : "error",
      summary:
        `${syntax.checks.length} JS/HTML/JSON syntax checks (${broken.length} failed) · dist/index.html=${distHtmlExists ? "PRESENT" : "DEV"} · dist-server/server.cjs=${bundledServerExists ? "PRESENT" : "DEV"}`,
      ...(broken.length
        ? {
            error_code: "SYNTAX_OR_CATALOG_ERROR",
            error_definition: `Syntax or JSON errors detected in: ${broken.map((b) => `${b.file} (${b.detail})`).join("; ")}`,
            repair_steps: [
              "1. Inspect the reported file and line number, or run '/rollback' in Guardian CLI to restore the last clean snapshot.",
              "2. Run 'npm run build:desktop' to regenerate dist/ and dist-server/.",
            ],
          }
        : {}),
    });
  }

  // ── DOMAIN 10: A2A_MCP_AND_NETWORK ──
  if (matchesFocus(focus, "a2a_mcp_and_network", "a2a")) {
    let refreshed = false;
    if (BACKENDS.length === 0 && autoFix) {
      refreshBackends();
      refreshed = true;
    }
    const mcps = loadMcp();
    const tools = loadTools();
    pushCheck({
      id: "backends_mcp_tools",
      domain: "A2A_MCP_AND_NETWORK",
      title: "Council Backends, MCP Servers & Agent Tools Registry",
      status: BACKENDS.length > 0 ? (refreshed ? "repaired" : "ok") : "error",
      auto_repaired: refreshed,
      repair_action_taken: refreshed ? `Refreshed ${BACKENDS.length} runtime/cloud model backends` : undefined,
      summary: `Active Backends=${BACKENDS.length} · MCP Servers=${mcps.length} · Custom Tools=${tools.length}`,
      ...(BACKENDS.length === 0
        ? {
            error_code: "NO_BACKENDS_LOADED",
            error_definition: "BACKENDS list is empty; no models are currently registered in the runtime router.",
            repair_steps: [
              "1. Check .council_data/lineup_ng.json and src/council_catalog.json.",
              "2. Run '/doctor' or click Reset State (↺).",
            ],
          }
        : {}),
    });
  }

  // ── OPTIONAL TARGETED TRACEBACK / URL DIAGNOSTIC ──
  const genericDefaultTb = /^Verify Python, Node, and GPU runtime environment$/i.test(traceback);
  if (traceback && !genericDefaultTb && !/^(all|full|hosts?|endpoints?|tunnels?|gpus?|vram|keys?|auth|env|update|git|python|toolchains?|syntax|storage|a2a|mcp)$/i.test(traceback)) {
    const urlMatch = traceback.match(/https?:\/\/[^\s"'<>]+/i);
    if (urlMatch) {
      const tbProbe = await probeHostEndpoint(urlMatch[0], undefined, 2500);
      pushCheck({
        id: "traceback_url_probe",
        domain: "TARGETED_ERROR_DIAGNOSIS",
        title: `Live Diagnostic Probe for Reported Endpoint (${urlMatch[0]})`,
        status: tbProbe.ok ? "ok" : "error",
        summary: tbProbe.ok
          ? `Endpoint ${urlMatch[0]} answered HTTP 200 (${tbProbe.engine} · ${tbProbe.latency_ms}ms)`
          : `${tbProbe.error || "Endpoint probe failed"} (${tbProbe.error_code || "UNREACHABLE"})`,
        ...(!tbProbe.ok
          ? {
              error_code: tbProbe.error_code,
              error_definition: tbProbe.error_definition,
              repair_steps: tbProbe.fix_steps,
            }
          : {}),
      });
    } else {
      let aiDiag = "";
      try {
        aiDiag = await Promise.race([
          completeBackend(0, [
            {
              role: "user",
              content:
                `You are the Suomynona Council /doctor Engine. Give an exact error definition and numbered step-by-step repair instructions for this error or question:\n\n${traceback}`,
            },
          ]),
          new Promise<string>((resolve) => setTimeout(() => resolve(""), 7000)),
        ]);
      } catch {
        aiDiag = "";
      }
      pushCheck({
        id: "traceback_ai_diagnosis",
        domain: "TARGETED_ERROR_DIAGNOSIS",
        title: "Targeted Error / Traceback Analysis",
        status: aiDiag ? "warn" : "warn",
        summary: aiDiag ? aiDiag.slice(0, 600) : `Analyzed query: "${traceback.slice(0, 120)}"`,
        error_definition: aiDiag || "No automated traceback match; review the domain diagnostics above for live endpoint/credential/toolchain health.",
        repair_steps: aiDiag
          ? ["Follow the diagnostic steps in the error definition above, then re-run '/doctor'."]
          : ["1. Copy the exact URL or HTTP status from the error into '/doctor <url or error>'.", "2. Inspect Live Backend Monitor for full stack details."],
      });
    }
  }

  const counts = {
    total: checks.length,
    ok: checks.filter((c) => c.status === "ok").length,
    repaired: checks.filter((c) => c.status === "repaired").length,
    warn: checks.filter((c) => c.status === "warn").length,
    error: checks.filter((c) => c.status === "error").length,
  };
  const domains = Array.from(new Set(checks.map((c) => c.domain)));
  const healthy = counts.error === 0;

  // Synthesize & run concrete repair script whenever errors/warnings exist (or explicitly requested)
  let repairScript: DoctorRepairScriptArtifact | undefined;
  if (opts.generateScript || opts.runScript || (autoFix && (counts.warn > 0 || counts.error > 0 || autoRepairs.length > 0))) {
    try {
      repairScript = await synthesizeAndOptionallyRunDoctorScript(checks, {
        execute: Boolean(opts.runScript || (autoFix && (counts.warn > 0 || counts.error > 0))),
      });
      if (repairScript.executed) {
        autoRepairs.push(
          `Synthesized & ran repair script '${repairScript.relative_disk_path}' (${repairScript.targeted_issue_codes.length || checks.length} check(s) covered)`
        );
      } else if (repairScript.generated) {
        autoRepairs.push(`Synthesized repair script '${repairScript.relative_disk_path}'`);
      }
    } catch {
      // keep diagnostic report intact even if script write fails
    }
  }

  const repairSummary =
    counts.error === 0 && counts.warn === 0
      ? `All ${counts.total} checks across ${domains.length} application domains verified healthy (${counts.repaired} auto-repaired).`
      : `${counts.ok} OK · ${counts.repaired} Auto-Repaired · ${counts.warn} Warning(s) · ${counts.error} Action Required across ${domains.length} domain(s).`;

  const report: DoctorReport = {
    ok: true,
    healthy,
    ts: new Date().toISOString().replace("T", " ").slice(0, 19),
    duration_ms: Date.now() - t0,
    auto_fix: autoFix,
    focus,
    counts,
    domains,
    auto_repairs: autoRepairs,
    checks,
    updater: getAutoUpdaterState(),
    repair_script: repairScript,
    repair_summary: repairSummary,
  };

  log(`🩺 [/doctor] ${repairSummary} (${report.duration_ms}ms)`);
  if (autoRepairs.length) {
    pushLiveConsole(`🩺 [/doctor Auto-Repair] ${autoRepairs.join(" | ")}`, { category: "SYSTEM", level: "ok" });
  }
  return report;
}

export function formatDoctorTerminalReport(report: DoctorReport): string {
  const icon = (s: DoctorSeverity) => (s === "ok" ? "✅ OK" : s === "repaired" ? "🛠️ REPAIRED" : s === "warn" ? "⚠️ WARN" : "❌ ERROR");
  const lines: string[] = [
    `╔══════════════════════════════════════════════════════════════════════════════╗`,
    `║  🩺 SUOMYNONA COUNCIL — FULL-APP /DOCTOR DIAGNOSTIC & AUTO-REPAIR REPORT     ║`,
    `╠══════════════════════════════════════════════════════════════════════════════╣`,
    `║  Summary : ${report.repair_summary}`,
    `║  Scope   : ${report.domains.length} Domains | Duration: ${report.duration_ms}ms | Auto-Fix: ${report.auto_fix ? "ON" : "OFF"}`,
    `╚══════════════════════════════════════════════════════════════════════════════╝`,
  ];

  if (report.auto_repairs.length > 0) {
    lines.push(``);
    lines.push(`🛠️ AUTOMATIC REPAIRS APPLIED (${report.auto_repairs.length}):`);
    report.auto_repairs.forEach((r, idx) => lines.push(`   ${idx + 1}. ${r}`));
  }

  let currentDomain = "";
  for (const c of report.checks) {
    if (c.domain !== currentDomain) {
      currentDomain = c.domain;
      lines.push(``);
      lines.push(`━━ [${currentDomain}] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    }
    lines.push(`  ${icon(c.status)} · ${c.title}`);
    lines.push(`     ${c.summary}`);
    if (c.error_definition) {
      lines.push(`     📖 Error Definition (${c.error_code || "DIAGNOSTIC"}): ${c.error_definition}`);
    }
    if (c.repair_steps && c.repair_steps.length > 0) {
      lines.push(`     🪜 Step-by-Step Repair Instructions:`);
      c.repair_steps.forEach((s) => lines.push(`        ${s}`));
    }
  }

  if (report.repair_script?.generated) {
    lines.push(``);
    lines.push(`━━ [AUTO-GENERATED REPAIR SCRIPT] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`  📜 Script File : ${report.repair_script.script_path}`);
    if (report.repair_script.launcher_path) {
      lines.push(`  ▶ Batch Runner : ${report.repair_script.launcher_path}`);
    }
    lines.push(`  🧪 Executed    : ${report.repair_script.executed ? (report.repair_script.exec_ok ? "YES (Exit 0)" : "YES (With Warnings)") : "NO"}`);
    if (report.repair_script.exec_output) {
      lines.push(`  ── Execution Log ──`);
      report.repair_script.exec_output.split(/\r?\n/).forEach((ln) => lines.push(`     ${ln}`));
    }
  }

  lines.push(``);
  lines.push(`Tip: Run '/doctor --run-script', '/doctor hosts', '/doctor keys', '/doctor update', or '/doctor <error message>' for targeted diagnosis.`);
  return lines.join("\n");
}

export function registerDoctorRoutes(app: Express): void {
  app.get("/api/doctor", async (req: Request, res: Response) => {
    try {
      const autoFix = req.query.auto_fix !== "0" && req.query.fix !== "false";
      const focus = String(req.query.focus || req.query.domain || "").trim();
      const traceback = String(req.query.q || req.query.traceback || "").trim();
      const generateScript = req.query.script === "1" || /--script/i.test(traceback);
      const runScript = req.query.run_script === "1" || /--run-script/i.test(traceback);
      const report = await runComprehensiveDoctor({ autoFix, focus, traceback, generateScript, runScript });
      res.json({
        ...report,
        output: formatDoctorTerminalReport(report),
        diagnosis: formatDoctorTerminalReport(report),
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  app.post("/api/doctor", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const autoFix = b.auto_fix !== false && b.autoFix !== false;
      const focus = String(b.focus || b.domain || "").trim();
      const rawTb = String(b.traceback || b.query || b.error || b.cmd || "").trim();
      const generateScript = Boolean(b.generate_script) || /--script/i.test(rawTb);
      const runScript = Boolean(b.run_script) || /--run-script/i.test(rawTb);
      const traceback = rawTb.replace(/--(no-fix|run-script|script)/gi, "").trim();
      const report = await runComprehensiveDoctor({ autoFix, focus, traceback, generateScript, runScript });
      res.json({
        ...report,
        output: formatDoctorTerminalReport(report),
        diagnosis: formatDoctorTerminalReport(report),
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  app.post("/api/doctor/repair-script", async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const focus = String(b.focus || "").trim();
      const traceback = String(b.traceback || "").replace(/--(no-fix|run-script|script)/gi, "").trim();
      const execute = b.execute !== false;
      const report = await runComprehensiveDoctor({
        autoFix: true,
        focus,
        traceback,
        generateScript: true,
        runScript: execute,
      });
      res.json({
        ok: true,
        report,
        repair_script: report.repair_script,
        output: formatDoctorTerminalReport(report),
        diagnosis: formatDoctorTerminalReport(report),
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });
}
