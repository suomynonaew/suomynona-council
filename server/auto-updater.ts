import { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import { PROJECT_ROOT, DATA_ROOT } from "./platform.ts";
import { readJson, writeJson, pushLiveConsole, log } from "./state-and-hosts.ts";

const execFileAsync = promisify(execFile);

const DEFAULT_REPO_URL = "https://github.com/suomynonaew/suomynona-council.git";
const DEFAULT_BRANCH = "main";
const UPDATER_STATE_FILE = "auto_updater.json";

export interface AutoUpdaterState {
  enabled: boolean;
  auto_pull: boolean;
  poll_interval_sec: number;
  repo_url: string;
  branch: string;
  repo_dir: string;
  git_available: boolean;
  status:
    | "idle"
    | "checking"
    | "up_to_date"
    | "ahead_of_remote"
    | "update_available"
    | "pulling"
    | "building"
    | "applied"
    | "error";
  local_sha: string;
  local_short: string;
  remote_sha: string;
  remote_short: string;
  installed_sha: string;
  installed_short: string;
  commits_behind: number;
  commits_ahead: number;
  remote_subject: string;
  remote_date: string;
  last_checked_at: string;
  last_updated_at: string;
  updates_applied_count: number;
  live_runtime_dir: string;
  live_runtime_active: boolean;
  daemon_running: boolean;
  last_error: string;
  error_definition: string;
  repair_steps: string[];
}

function loadBundledRepoConfig(): Record<string, any> {
  const candidates = [
    path.join(PROJECT_ROOT, "desktop-repo-config.json"),
    path.join(PROJECT_ROOT, "dist-server", "desktop-repo-config.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      }
    } catch {
      // ignore invalid metadata
    }
  }
  return {};
}

function defaultUpdaterState(): AutoUpdaterState {
  const cfg = loadBundledRepoConfig();
  const saved = readJson<Partial<AutoUpdaterState>>(UPDATER_STATE_FILE, {});
  const initialSha = String(saved.installed_sha || cfg.commitSha || "").trim();
  const liveDir = path.join(DATA_ROOT, "live-app-runtime");
  return {
    enabled: saved.enabled !== undefined ? Boolean(saved.enabled) : true,
    auto_pull: saved.auto_pull !== undefined ? Boolean(saved.auto_pull) : true,
    poll_interval_sec: Math.max(15, Number(saved.poll_interval_sec) || 60),
    repo_url: String(saved.repo_url || cfg.repoUrl || DEFAULT_REPO_URL).trim(),
    branch: String(saved.branch || cfg.branch || DEFAULT_BRANCH).trim() || DEFAULT_BRANCH,
    repo_dir: String(saved.repo_dir || "").trim(),
    git_available: true,
    status: (saved.status as AutoUpdaterState["status"]) || "idle",
    local_sha: String(saved.local_sha || cfg.commitSha || "").trim(),
    local_short: String(saved.local_short || cfg.commitShort || (initialSha ? initialSha.slice(0, 7) : "")).trim(),
    remote_sha: String(saved.remote_sha || "").trim(),
    remote_short: String(saved.remote_short || "").trim(),
    installed_sha: initialSha,
    installed_short: initialSha ? initialSha.slice(0, 7) : "",
    commits_behind: Number(saved.commits_behind) || 0,
    commits_ahead: Number(saved.commits_ahead) || 0,
    remote_subject: String(saved.remote_subject || "").trim(),
    remote_date: String(saved.remote_date || "").trim(),
    last_checked_at: String(saved.last_checked_at || "").trim(),
    last_updated_at: String(saved.last_updated_at || "").trim(),
    updates_applied_count: Number(saved.updates_applied_count) || 0,
    live_runtime_dir: liveDir,
    live_runtime_active: path.resolve(PROJECT_ROOT) === path.resolve(liveDir),
    daemon_running: false,
    last_error: String(saved.last_error || "").trim(),
    error_definition: String(saved.error_definition || "").trim(),
    repair_steps: Array.isArray(saved.repair_steps) ? saved.repair_steps : [],
  };
}

let UPDATER_STATE: AutoUpdaterState = defaultUpdaterState();
let _daemonTimer: ReturnType<typeof setTimeout> | null = null;
let _activeCheckPromise: Promise<AutoUpdaterState> | null = null;
let _activePullPromise: Promise<{ ok: boolean; state: AutoUpdaterState; message: string }> | null = null;

function persistUpdaterState(): void {
  try {
    writeJson(UPDATER_STATE_FILE, UPDATER_STATE);
  } catch {
    // ignore state save failure
  }
}

export function getAutoUpdaterState(): AutoUpdaterState {
  UPDATER_STATE.live_runtime_active =
    path.resolve(PROJECT_ROOT) === path.resolve(UPDATER_STATE.live_runtime_dir);
  return { ...UPDATER_STATE };
}

function isGitRepoDir(dir: string): boolean {
  return Boolean(dir && fs.existsSync(path.join(dir, ".git")));
}

async function runGit(args: string[], cwd?: string, timeout = 15000): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  try {
    const res = await execFileAsync("git", args, {
      cwd,
      timeout,
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 8,
    });
    return {
      ok: true,
      stdout: String(res.stdout || "").trim(),
      stderr: String(res.stderr || "").trim(),
    };
  } catch (err: any) {
    return {
      ok: false,
      stdout: String(err?.stdout || "").trim(),
      stderr: String(err?.stderr || err?.message || err || "").trim(),
    };
  }
}

async function runShellCmdAsync(cmd: string, args: string[], cwd: string, timeoutMs = 180000): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: process.platform === "win32",
      windowsHide: true,
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (process.platform === "win32" && child.pid) {
          spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        }
        child.kill();
      } catch {
        // ignore kill error
      }
    }, timeoutMs);

    child.stdout?.on("data", (d) => {
      output += d.toString();
      if (output.length > 24000) output = output.slice(-18000);
    });
    child.stderr?.on("data", (d) => {
      output += d.toString();
      if (output.length > 24000) output = output.slice(-18000);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) {
        resolve({ ok: false, output: `${output}\n[Timed out after ${Math.round(timeoutMs / 1000)}s]` });
      } else {
        resolve({ ok: code === 0, output: output.trim() });
      }
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ ok: false, output: `${output}\n${err?.message || String(err)}` });
    });
  });
}

function parseGitHubOwnerRepo(repoUrl: string): { owner: string; repo: string } | null {
  const m = String(repoUrl || "").match(/github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

export async function resolveGitRepoDir(allowClone = false): Promise<string> {
  const cfg = loadBundledRepoConfig();
  const candidates: string[] = [];
  if (process.env.COUNCIL_GIT_REPO_DIR) candidates.push(process.env.COUNCIL_GIT_REPO_DIR);
  if (UPDATER_STATE.repo_dir) candidates.push(UPDATER_STATE.repo_dir);
  if (cfg.sourceRepoDir) candidates.push(String(cfg.sourceRepoDir));

  let cur = path.resolve(PROJECT_ROOT);
  for (let i = 0; i < 6; i++) {
    candidates.push(cur);
    const parent = path.dirname(cur);
    if (!parent || parent === cur) break;
    cur = parent;
  }
  if (process.env.PORTABLE_EXECUTABLE_DIR) {
    let pCur = path.resolve(process.env.PORTABLE_EXECUTABLE_DIR);
    for (let i = 0; i < 4; i++) {
      candidates.push(pCur);
      const pParent = path.dirname(pCur);
      if (!pParent || pParent === pCur) break;
      pCur = pParent;
    }
  }
  candidates.push(path.join(DATA_ROOT, "repo-mirror"));

  for (const cand of candidates) {
    const resolved = path.resolve(cand);
    if (isGitRepoDir(resolved)) {
      return resolved;
    }
  }

  if (allowClone) {
    const gitCheck = await runGit(["--version"], undefined, 4000);
    if (gitCheck.ok) {
      const mirrorDir = path.join(DATA_ROOT, "repo-mirror");
      if (fs.existsSync(mirrorDir) && !isGitRepoDir(mirrorDir)) {
        fs.rmSync(mirrorDir, { recursive: true, force: true });
      }
      fs.mkdirSync(path.dirname(mirrorDir), { recursive: true });
      const cloneRes = await runGit(
        ["clone", "--branch", UPDATER_STATE.branch || DEFAULT_BRANCH, UPDATER_STATE.repo_url || DEFAULT_REPO_URL, mirrorDir],
        DATA_ROOT,
        45000
      );
      if (cloneRes.ok && isGitRepoDir(mirrorDir)) {
        return mirrorDir;
      }
    }
  }

  return "";
}

function copyDirectoryTree(srcDir: string, dstDir: string): number {
  let copied = 0;
  if (!fs.existsSync(srcDir)) return copied;
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist-native") continue;
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copied += copyDirectoryTree(srcPath, dstPath);
    } else if (entry.isFile()) {
      try {
        fs.copyFileSync(srcPath, dstPath);
        copied += 1;
      } catch {
        // ignore locked non-critical binary if running in unpacked dir
      }
    }
  }
  return copied;
}

function stageBuiltFilesToTarget(repoDir: string, targetAppRoot: string): number {
  let copied = 0;
  fs.mkdirSync(targetAppRoot, { recursive: true });
  const dirTargets = ["dist", "dist-server", "public", path.join("src", "data")];
  for (const rel of dirTargets) {
    const src = path.join(repoDir, rel);
    const dst = path.join(targetAppRoot, rel);
    if (fs.existsSync(src)) {
      copied += copyDirectoryTree(src, dst);
    }
  }
  const fileTargets = [
    path.join("src", "council_catalog.json"),
    "electron-main.cjs",
    "preload.cjs",
    "index.html",
    "desktop-repo-config.json",
    "package.json",
  ];
  for (const rel of fileTargets) {
    const src = path.join(repoDir, rel);
    const dst = path.join(targetAppRoot, rel);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      try {
        fs.copyFileSync(src, dst);
        copied += 1;
      } catch {
        // ignore
      }
    }
  }
  return copied;
}

async function fetchGitHubHeadViaApi(repoUrl: string, branch: string): Promise<{ sha: string; subject: string; date: string } | null> {
  const parsed = parseGitHubOwnerRepo(repoUrl);
  if (!parsed) return null;
  try {
    const r = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits/${encodeURIComponent(branch)}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "suomynona-council-updater",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    const data: any = await r.json();
    const sha = String(data?.sha || "").trim();
    const subject = String(data?.commit?.message || "").split(/\r?\n/)[0].trim();
    const date = String(data?.commit?.committer?.date || data?.commit?.author?.date || "").trim();
    if (!sha) return null;
    return { sha, subject, date };
  } catch {
    return null;
  }
}

export async function pullAndApplyGitUpdate(opts: { forceRebuild?: boolean } = {}): Promise<{ ok: boolean; state: AutoUpdaterState; message: string }> {
  if (_activePullPromise) return _activePullPromise;

  _activePullPromise = (async () => {
    const gitVer = await runGit(["--version"], undefined, 4000);
    UPDATER_STATE.git_available = gitCheckOk(gitVer);
    if (!gitVer.ok) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = "Git CLI is not installed or not in PATH";
      UPDATER_STATE.error_definition =
        "The desktop auto-updater could not run 'git pull' because the 'git' executable was not found in Windows PATH.";
      UPDATER_STATE.repair_steps = [
        "1. Install Git for Windows from https://git-scm.com/download/win (or run: winget install Git.Git).",
        "2. Restart Suomynona Council Desktop.",
        "3. Run '/update pull' or '/doctor' again.",
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    const repoDir = await resolveGitRepoDir(true);
    if (!repoDir) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = `Could not locate or clone Git repository (${UPDATER_STATE.repo_url})`;
      UPDATER_STATE.error_definition =
        `No local '.git' workspace was found above ${PROJECT_ROOT} and cloning ${UPDATER_STATE.repo_url} into ${DATA_ROOT}\\repo-mirror failed.`;
      UPDATER_STATE.repair_steps = [
        "1. Verify internet connectivity and GitHub access to https://github.com/suomynonaew/suomynona-council.git.",
        "2. Check if launching from your cloned workspace folder preserves the parent '.git' folder.",
        "3. Run '/doctor' to verify Git and network diagnostics.",
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    UPDATER_STATE.repo_dir = repoDir;
    UPDATER_STATE.status = "pulling";
    UPDATER_STATE.last_error = "";
    UPDATER_STATE.error_definition = "";
    UPDATER_STATE.repair_steps = [];
    persistUpdaterState();

    const branch = UPDATER_STATE.branch || DEFAULT_BRANCH;
    const fetchRes = await runGit(["fetch", "origin", branch, "--quiet"], repoDir, 20000);
    if (!fetchRes.ok) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = `git fetch failed: ${fetchRes.stderr || "network/remote error"}`;
      UPDATER_STATE.error_definition =
        `Unable to contact origin (${UPDATER_STATE.repo_url}) on branch '${branch}'.`;
      UPDATER_STATE.repair_steps = [
        "1. Check internet/DNS connectivity and ensure GitHub is reachable.",
        `2. Test manually: git -C "${repoDir}" fetch origin ${branch}`,
        "3. Run '/doctor' to re-check Git updater health.",
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    const behindRes = await runGit(["rev-list", "--count", `HEAD..origin/${branch}`], repoDir);
    const commitsBehind = Number(behindRes.stdout || "0") || 0;

    if (commitsBehind > 0) {
      pushLiveConsole(
        `⬇️ [Git Auto-Updater] Pulling ${commitsBehind} new commit(s) from origin/${branch} in ${repoDir}…`,
        { category: "SYSTEM", level: "info" }
      );
      const pullRes = await runGit(["pull", "--rebase", "--autostash", "origin", branch], repoDir, 30000);
      if (!pullRes.ok) {
        // Abort conflicted rebase if one started so repo is never left wedged
        await runGit(["rebase", "--abort"], repoDir, 5000);
        UPDATER_STATE.status = "error";
        UPDATER_STATE.last_error = `git pull failed: ${pullRes.stderr || pullRes.stdout}`;
        UPDATER_STATE.error_definition =
          "Automatic 'git pull --rebase --autostash' could not merge upstream commits cleanly due to local conflicting modifications.";
        UPDATER_STATE.repair_steps = [
          `1. Inspect local changes: git -C "${repoDir}" status`,
          `2. Stash or commit local edits, then pull: git -C "${repoDir}" stash && git -C "${repoDir}" pull origin ${branch}`,
          "3. Run 'npm run build:desktop' (or click '/update pull' in the desktop app) afterwards.",
        ];
        persistUpdaterState();
        return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
      }
    } else if (!opts.forceRebuild) {
      const headRes = await runGit(["rev-parse", "HEAD"], repoDir);
      const sha = headRes.stdout || UPDATER_STATE.local_sha;
      UPDATER_STATE.local_sha = sha;
      UPDATER_STATE.local_short = sha ? sha.slice(0, 7) : "";
      UPDATER_STATE.commits_behind = 0;
      if (UPDATER_STATE.installed_sha && sha && UPDATER_STATE.installed_sha === sha) {
        UPDATER_STATE.status = "up_to_date";
        persistUpdaterState();
        return { ok: true, state: getAutoUpdaterState(), message: `Already up-to-date (${UPDATER_STATE.local_short})` };
      }
    }

    // Ensure node_modules exists if building inside repo-mirror
    if (!fs.existsSync(path.join(repoDir, "node_modules", "esbuild"))) {
      UPDATER_STATE.status = "building";
      persistUpdaterState();
      const installRes = await runShellCmdAsync("npm", ["install", "--no-audit", "--no-fund"], repoDir, 180000);
      if (!installRes.ok) {
        UPDATER_STATE.status = "error";
        UPDATER_STATE.last_error = "Failed installing dependencies inside update mirror";
        UPDATER_STATE.error_definition = `npm install failed inside ${repoDir}: ${installRes.output.slice(-300)}`;
        UPDATER_STATE.repair_steps = [
          "1. Ensure Node.js & npm are installed and internet is connected.",
          `2. Run manually: cd "${repoDir}" && npm install`,
          "3. Run '/update pull' afterwards.",
        ];
        persistUpdaterState();
        return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
      }
    }

    UPDATER_STATE.status = "building";
    persistUpdaterState();
    pushLiveConsole(`🛠️ [Git Auto-Updater] Rebuilding desktop frontend & server bundle…`, {
      category: "SYSTEM",
      level: "info",
    });

    const buildRes = await runShellCmdAsync("npm", ["run", "build:desktop"], repoDir, 180000);
    if (!buildRes.ok) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = "Desktop bundle rebuild failed during auto-update";
      UPDATER_STATE.error_definition = `npm run build:desktop failed inside ${repoDir}: ${buildRes.output.slice(-350)}`;
      UPDATER_STATE.repair_steps = [
        `1. Run manually in terminal to inspect compile error: cd "${repoDir}" && npm run build:desktop`,
        "2. Run '/doctor' to check TypeScript/Vite/esbuild toolchain health.",
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    const headNow = (await runGit(["rev-parse", "HEAD"], repoDir)).stdout || UPDATER_STATE.remote_sha || UPDATER_STATE.local_sha;
    const subjectNow = (await runGit(["log", "-1", "--format=%s"], repoDir)).stdout || UPDATER_STATE.remote_subject;
    const dateNow = (await runGit(["log", "-1", "--format=%cI"], repoDir)).stdout || UPDATER_STATE.remote_date;

    const liveRuntimeDir = UPDATER_STATE.live_runtime_dir || path.join(DATA_ROOT, "live-app-runtime");
    const copiedLive = stageBuiltFilesToTarget(repoDir, liveRuntimeDir);
    const unpackedResourcesApp = path.join(repoDir, "dist-native", "win-unpacked", "resources", "app");
    if (fs.existsSync(path.join(repoDir, "dist-native", "win-unpacked"))) {
      stageBuiltFilesToTarget(repoDir, unpackedResourcesApp);
    }

    UPDATER_STATE.local_sha = headNow;
    UPDATER_STATE.local_short = headNow ? headNow.slice(0, 7) : "";
    UPDATER_STATE.remote_sha = headNow;
    UPDATER_STATE.remote_short = headNow ? headNow.slice(0, 7) : "";
    UPDATER_STATE.installed_sha = headNow;
    UPDATER_STATE.installed_short = headNow ? headNow.slice(0, 7) : "";
    UPDATER_STATE.remote_subject = subjectNow;
    UPDATER_STATE.remote_date = dateNow;
    UPDATER_STATE.commits_behind = 0;
    UPDATER_STATE.status = "applied";
    UPDATER_STATE.updates_applied_count += 1;
    UPDATER_STATE.last_updated_at = new Date().toISOString();
    UPDATER_STATE.last_error = "";
    UPDATER_STATE.error_definition = "";
    UPDATER_STATE.repair_steps = [];
    persistUpdaterState();

    const okMsg = `✅ Pulled & built update ${UPDATER_STATE.installed_short} (${subjectNow || "latest commit"}) — staged ${copiedLive} files to ${liveRuntimeDir}`;
    log(okMsg);
    pushLiveConsole(okMsg, { category: "SYSTEM", level: "ok" });

    if (process.env.COUNCIL_DESKTOP_MODE === "1") {
      try {
        process.stdout.write(
          `__SUOMYNONA_HOT_RELOAD_RUNTIME__:${JSON.stringify({
            commitSha: headNow,
            commitShort: UPDATER_STATE.installed_short,
            subject: subjectNow,
            appRoot: liveRuntimeDir,
          })}\n`
        );
      } catch {
        // ignore pipe write error
      }
    }

    return { ok: true, state: getAutoUpdaterState(), message: okMsg };
  })().finally(() => {
    _activePullPromise = null;
  });

  return _activePullPromise;
}

function gitCheckOk(res: { ok: boolean }): boolean {
  return Boolean(res && res.ok);
}

export async function checkForGitUpdates(opts: { autoApply?: boolean; manual?: boolean } = {}): Promise<AutoUpdaterState> {
  if (_activeCheckPromise) return _activeCheckPromise;

  _activeCheckPromise = (async () => {
    const branch = UPDATER_STATE.branch || DEFAULT_BRANCH;
    UPDATER_STATE.status = "checking";
    UPDATER_STATE.last_error = "";
    UPDATER_STATE.error_definition = "";
    UPDATER_STATE.repair_steps = [];
    persistUpdaterState();

    const gitVer = await runGit(["--version"], undefined, 4000);
    UPDATER_STATE.git_available = gitVer.ok;
    const repoDir = await resolveGitRepoDir(Boolean(opts.manual));

    if (!gitVer.ok || !repoDir) {
      // Fallback: check GitHub REST API directly even without local git CLI
      const apiHead = await fetchGitHubHeadViaApi(UPDATER_STATE.repo_url || DEFAULT_REPO_URL, branch);
      UPDATER_STATE.last_checked_at = new Date().toISOString();
      if (apiHead) {
        UPDATER_STATE.remote_sha = apiHead.sha;
        UPDATER_STATE.remote_short = apiHead.sha.slice(0, 7);
        UPDATER_STATE.remote_subject = apiHead.subject;
        UPDATER_STATE.remote_date = apiHead.date;
        const knownSha = UPDATER_STATE.installed_sha || UPDATER_STATE.local_sha;
        const diff = Boolean(knownSha && knownSha !== apiHead.sha);
        UPDATER_STATE.commits_behind = diff ? 1 : 0;
        UPDATER_STATE.status = !gitVer.ok && diff ? "update_available" : diff ? "update_available" : "up_to_date";
        if (!gitVer.ok && diff) {
          UPDATER_STATE.error_definition =
            "A newer commit exists on GitHub, but 'git' CLI was not found in PATH so the .exe cannot run 'git pull' automatically.";
          UPDATER_STATE.repair_steps = [
            "1. Install Git for Windows (winget install Git.Git).",
            "2. Restart Suomynona Council Desktop and run '/update pull'.",
          ];
        }
      } else {
        UPDATER_STATE.status = "error";
        UPDATER_STATE.last_error = !gitVer.ok ? "Git CLI unavailable & GitHub API check failed" : "Local Git repo directory not found";
        UPDATER_STATE.error_definition =
          "Could not check remote updates because either Git for Windows is missing or GitHub API could not be reached.";
        UPDATER_STATE.repair_steps = [
          "1. Install Git for Windows (winget install Git.Git) and ensure internet access is online.",
          "2. Run '/doctor' to inspect network and GitHub API diagnostics.",
        ];
      }
      persistUpdaterState();
      return getAutoUpdaterState();
    }

    UPDATER_STATE.repo_dir = repoDir;
    const fetchRes = await runGit(["fetch", "origin", branch, "--quiet"], repoDir, 15000);
    UPDATER_STATE.last_checked_at = new Date().toISOString();

    if (!fetchRes.ok) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = `git fetch failed: ${fetchRes.stderr || "offline"}`;
      UPDATER_STATE.error_definition =
        `Failed to fetch updates from ${UPDATER_STATE.repo_url} (${branch}). Either internet is offline or remote access was denied.`;
      UPDATER_STATE.repair_steps = [
        "1. Verify internet connectivity.",
        `2. Test manually: git -C "${repoDir}" fetch origin ${branch}`,
      ];
      persistUpdaterState();
      return getAutoUpdaterState();
    }

    const [localRes, remoteRes, behindRes, aheadRes, subjRes, dateRes] = await Promise.all([
      runGit(["rev-parse", "HEAD"], repoDir),
      runGit(["rev-parse", `origin/${branch}`], repoDir),
      runGit(["rev-list", "--count", `HEAD..origin/${branch}`], repoDir),
      runGit(["rev-list", "--count", `origin/${branch}..HEAD`], repoDir),
      runGit(["log", "-1", "--format=%s", `origin/${branch}`], repoDir),
      runGit(["log", "-1", "--format=%cI", `origin/${branch}`], repoDir),
    ]);

    UPDATER_STATE.local_sha = localRes.stdout || UPDATER_STATE.local_sha;
    UPDATER_STATE.local_short = UPDATER_STATE.local_sha ? UPDATER_STATE.local_sha.slice(0, 7) : "";
    UPDATER_STATE.remote_sha = remoteRes.stdout || UPDATER_STATE.remote_sha;
    UPDATER_STATE.remote_short = UPDATER_STATE.remote_sha ? UPDATER_STATE.remote_sha.slice(0, 7) : "";
    if (!UPDATER_STATE.installed_sha) {
      UPDATER_STATE.installed_sha = UPDATER_STATE.local_sha;
      UPDATER_STATE.installed_short = UPDATER_STATE.local_short;
    }
    UPDATER_STATE.commits_behind = Number(behindRes.stdout || "0") || 0;
    UPDATER_STATE.commits_ahead = Number(aheadRes.stdout || "0") || 0;
    UPDATER_STATE.remote_subject = subjRes.stdout || "";
    UPDATER_STATE.remote_date = dateRes.stdout || "";

    if (UPDATER_STATE.commits_behind > 0) {
      UPDATER_STATE.status = "update_available";
      persistUpdaterState();
      pushLiveConsole(
        `🔔 [Git Auto-Updater] ${UPDATER_STATE.commits_behind} new commit(s) detected on origin/${branch} (${UPDATER_STATE.remote_short}: "${UPDATER_STATE.remote_subject}")`,
        { category: "SYSTEM", level: "info" }
      );
      if (opts.autoApply !== false && UPDATER_STATE.auto_pull) {
        const pullRes = await pullAndApplyGitUpdate();
        return pullRes.state;
      }
    } else if (UPDATER_STATE.installed_sha && UPDATER_STATE.local_sha && UPDATER_STATE.installed_sha !== UPDATER_STATE.local_sha) {
      // Local repo is already ahead of what the bundled .exe packaged; rebuild live-app-runtime if auto_pull enabled
      UPDATER_STATE.status = "ahead_of_remote";
      persistUpdaterState();
      if (opts.autoApply !== false && UPDATER_STATE.auto_pull && opts.manual) {
        const pullRes = await pullAndApplyGitUpdate({ forceRebuild: true });
        return pullRes.state;
      }
    } else {
      UPDATER_STATE.status = UPDATER_STATE.commits_ahead > 0 ? "ahead_of_remote" : "up_to_date";
      persistUpdaterState();
    }

    return getAutoUpdaterState();
  })().finally(() => {
    _activeCheckPromise = null;
  });

  return _activeCheckPromise;
}

export function startGitAutoUpdateDaemon(): void {
  if (_daemonTimer) {
    clearTimeout(_daemonTimer);
    _daemonTimer = null;
  }
  UPDATER_STATE.daemon_running = true;

  const scheduleNext = (delayMs: number) => {
    _daemonTimer = setTimeout(async () => {
      try {
        if (UPDATER_STATE.enabled) {
          await checkForGitUpdates({ autoApply: UPDATER_STATE.auto_pull, manual: false });
        }
      } catch {
        // keep daemon alive on transient failures
      } finally {
        const nextSec = Math.max(15, Number(UPDATER_STATE.poll_interval_sec) || 60);
        scheduleNext(nextSec * 1000);
      }
    }, delayMs);
    if (typeof _daemonTimer.unref === "function") {
      _daemonTimer.unref();
    }
  };

  // Run first check 4.5s after server listens so startup stays non-blocking
  scheduleNext(4500);
}

export function formatUpdaterCliReport(st: AutoUpdaterState = getAutoUpdaterState()): string {
  const lines = [
    `╔══════════════════════════════════════════════════════════════════════════════╗`,
    `║  🔄 SUOMYNONA COUNCIL — GIT REPOSITORY AUTO-UPDATER STATUS                   ║`,
    `╠══════════════════════════════════════════════════════════════════════════════╣`,
    `║  Repository   : ${st.repo_url}`,
    `║  Branch       : ${st.branch}  (Daemon: ${st.enabled ? `ACTIVE every ${st.poll_interval_sec}s` : "PAUSED"} · Auto-Pull: ${st.auto_pull ? "ON" : "OFF"})`,
    `║  Repo Path    : ${st.repo_dir || "(will clone on update)"}`,
    `║  Local HEAD   : ${st.local_short || "unknown"}   Remote HEAD: ${st.remote_short || "unchecked"}   Behind: ${st.commits_behind}  Ahead: ${st.commits_ahead}`,
    `║  Installed    : ${st.installed_short || st.local_short || "unknown"} (${st.live_runtime_active ? "Hot-Reloaded Live Runtime" : "Packaged Build"})`,
    `║  Status       : ${st.status.toUpperCase()}${st.remote_subject ? ` · "${st.remote_subject.slice(0, 48)}"` : ""}`,
    `║  Last Checked : ${st.last_checked_at || "not yet"}   Updates Applied: ${st.updates_applied_count}`,
    `╚══════════════════════════════════════════════════════════════════════════════╝`,
  ];
  if (st.last_error) {
    lines.push(`❌ Error: ${st.last_error}`);
    if (st.error_definition) lines.push(`   Definition: ${st.error_definition}`);
    if (st.repair_steps?.length) {
      lines.push(`   Repair Steps:`);
      st.repair_steps.forEach((s) => lines.push(`     • ${s}`));
    }
  }
  lines.push(`Commands: '/update' (check & auto-pull) | '/update pull' (force rebuild/pull) | '/update status'`);
  return lines.join("\n");
}

export function registerAutoUpdaterRoutes(app: Express): void {
  app.get("/api/updater/status", (_req: Request, res: Response) => {
    res.json({ ok: true, updater: getAutoUpdaterState(), formatted: formatUpdaterCliReport() });
  });

  app.post("/api/updater/check", async (req: Request, res: Response) => {
    const autoApply = req.body?.auto_apply !== undefined ? Boolean(req.body.auto_apply) : UPDATER_STATE.auto_pull;
    const state = await checkForGitUpdates({ autoApply, manual: true });
    res.json({ ok: state.status !== "error", updater: state, formatted: formatUpdaterCliReport(state) });
  });

  app.post("/api/updater/pull", async (req: Request, res: Response) => {
    const forceRebuild = Boolean(req.body?.force_rebuild);
    const r = await pullAndApplyGitUpdate({ forceRebuild });
    res.json({ ok: r.ok, message: r.message, updater: r.state, formatted: formatUpdaterCliReport(r.state) });
  });

  app.post("/api/updater/config", (req: Request, res: Response) => {
    const b = req.body || {};
    if (b.enabled !== undefined) UPDATER_STATE.enabled = Boolean(b.enabled);
    if (b.auto_pull !== undefined) UPDATER_STATE.auto_pull = Boolean(b.auto_pull);
    if (b.poll_interval_sec !== undefined) {
      UPDATER_STATE.poll_interval_sec = Math.max(15, Math.min(3600, Number(b.poll_interval_sec) || 60));
    }
    if (typeof b.branch === "string" && b.branch.trim()) {
      UPDATER_STATE.branch = b.branch.trim();
    }
    if (typeof b.repo_url === "string" && b.repo_url.trim()) {
      UPDATER_STATE.repo_url = b.repo_url.trim();
    }
    persistUpdaterState();
    res.json({ ok: true, updater: getAutoUpdaterState() });
  });
}
