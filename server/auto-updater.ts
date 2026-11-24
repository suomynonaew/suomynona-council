import { Express, Request, Response } from "express";
import crypto from "crypto";
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
  edition: "master" | "client";
  app_version: string;
  built_at: string;
  update_mode: "release_exe" | "git_hot_reload" | "hybrid";
  portable_exe_path: string;
  git_available: boolean;
  status:
  | "idle"
  | "checking"
  | "up_to_date"
  | "ahead_of_remote"
  | "update_available"
  | "downloading"
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
  release_tag: string;
  release_name: string;
  release_url: string;
  release_asset_name: string;
  release_download_url: string;
  release_asset_size: number;
  release_asset_sha256: string;
  release_published_at: string;
  release_update_available: boolean;
  release_downloaded_path: string;
  download_progress_pct: number;
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

function loadBundledJson(filename: string): Record<string, any> {
  const candidates = [
    path.join(PROJECT_ROOT, filename),
    path.join(PROJECT_ROOT, "dist-server", filename),
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

function loadBundledRepoConfig(): Record<string, any> {
  return loadBundledJson("desktop-repo-config.json");
}

function detectBundledEdition(): "master" | "client" {
  const envEd = String(process.env.COUNCIL_EDITION || "").trim().toLowerCase();
  if (envEd === "client") return "client";
  if (envEd === "master") return "master";
  const edCfg = loadBundledJson("desktop-edition.json");
  return String(edCfg?.edition || "").toLowerCase() === "client" ? "client" : "master";
}

function detectBundledAppVersion(): string {
  const edCfg = loadBundledJson("desktop-edition.json");
  if (edCfg?.appVersion) return String(edCfg.appVersion).trim();
  const repoCfg = loadBundledRepoConfig();
  if (repoCfg?.appVersion) return String(repoCfg.appVersion).trim();
  const pkg = loadBundledJson("package.json");
  return String(pkg?.version || "1.1.0").trim();
}

export function compareSemver(aRaw: string, bRaw: string): number {
  const parse = (s: string) =>
    String(s || "")
      .trim()
      .replace(/^v/i, "")
      .split("-")[0]
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  const a = parse(aRaw);
  const b = parse(bRaw);
  const len = Math.max(a.length, b.length, 3);
  for (let i = 0; i < len; i++) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }
  return 0;
}

function expectedPortableAssetName(edition: "master" | "client"): string {
  return edition === "client"
    ? "Suomynona-Council-Client-Portable.exe"
    : "Suomynona-Council-Master-Portable.exe";
}

function defaultUpdaterState(): AutoUpdaterState {
  const cfg = loadBundledRepoConfig();
  const saved = readJson<Partial<AutoUpdaterState>>(UPDATER_STATE_FILE, {});
  const edition = detectBundledEdition();
  const appVersion = detectBundledAppVersion();
  const bundledSha = String(cfg.commitSha || "").trim();
  const initialSha = bundledSha || String(saved.installed_sha || "").trim();
  const liveDir = path.join(DATA_ROOT, "live-app-runtime");
  const portableExe = String(process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
  const updateMode: AutoUpdaterState["update_mode"] =
    edition === "client" ? "release_exe" : portableExe ? "hybrid" : "git_hot_reload";

  return {
    enabled: saved.enabled !== undefined ? Boolean(saved.enabled) : true,
    auto_pull: saved.auto_pull !== undefined ? Boolean(saved.auto_pull) : true,
    poll_interval_sec: Math.max(15, Number(saved.poll_interval_sec) || 300),
    repo_url: String(saved.repo_url || cfg.repoUrl || DEFAULT_REPO_URL).trim(),
    branch: String(saved.branch || cfg.branch || DEFAULT_BRANCH).trim() || DEFAULT_BRANCH,
    repo_dir: String(saved.repo_dir || "").trim(),
    edition,
    app_version: appVersion,
    built_at: String(cfg.builtAt || "").trim(),
    update_mode: updateMode,
    portable_exe_path: portableExe,
    git_available: true,
    status: "idle",
    local_sha: bundledSha || String(saved.local_sha || "").trim(),
    local_short: (bundledSha || String(saved.local_sha || "")).slice(0, 7),
    remote_sha: String(saved.remote_sha || "").trim(),
    remote_short: String(saved.remote_short || "").trim(),
    installed_sha: initialSha,
    installed_short: initialSha ? initialSha.slice(0, 7) : "",
    commits_behind: 0,
    commits_ahead: 0,
    remote_subject: String(saved.remote_subject || "").trim(),
    remote_date: String(saved.remote_date || "").trim(),
    release_tag: String(saved.release_tag || "").trim(),
    release_name: String(saved.release_name || "").trim(),
    release_url: String(saved.release_url || "").trim(),
    release_asset_name: expectedPortableAssetName(edition),
    release_download_url: String(saved.release_download_url || "").trim(),
    release_asset_size: Number(saved.release_asset_size) || 0,
    release_asset_sha256: String(saved.release_asset_sha256 || "").trim(),
    release_published_at: String(saved.release_published_at || "").trim(),
    release_update_available: false,
    release_downloaded_path: "",
    download_progress_pct: 0,
    last_checked_at: String(saved.last_checked_at || "").trim(),
    last_updated_at: String(saved.last_updated_at || "").trim(),
    updates_applied_count: Number(saved.updates_applied_count) || 0,
    live_runtime_dir: liveDir,
    live_runtime_active: path.resolve(PROJECT_ROOT) === path.resolve(liveDir),
    daemon_running: false,
    last_error: "",
    error_definition: "",
    repair_steps: [],
  };
}

let UPDATER_STATE: AutoUpdaterState = defaultUpdaterState();
let _daemonTimer: ReturnType<typeof setTimeout> | null = null;
let _activeCheckPromise: Promise<AutoUpdaterState> | null = null;
let _activePullPromise: Promise<{ ok: boolean; state: AutoUpdaterState; message: string }> | null = null;
let _activeReleaseInstallPromise: Promise<{ ok: boolean; state: AutoUpdaterState; message: string }> | null = null;

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
  UPDATER_STATE.edition = detectBundledEdition();
  UPDATER_STATE.app_version = detectBundledAppVersion();
  UPDATER_STATE.portable_exe_path = String(process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
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

interface GitHubReleaseCheckResult {
  found: boolean;
  tag: string;
  name: string;
  htmlUrl: string;
  publishedAt: string;
  assetName: string;
  downloadUrl: string;
  assetSize: number;
  sha256: string;
  isNewer: boolean;
}

export async function fetchLatestGitHubRelease(
  repoUrl: string,
  edition: "master" | "client",
  currentVersion: string,
  builtAtIso = ""
): Promise<GitHubReleaseCheckResult | null> {
  const parsed = parseGitHubOwnerRepo(repoUrl);
  if (!parsed) return null;
  const targetAsset = expectedPortableAssetName(edition);
  try {
    const r = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "suomynona-council-updater",
      },
      signal: AbortSignal.timeout(7000),
    });
    if (!r.ok) return null;
    const rel: any = await r.json();
    const tag = String(rel?.tag_name || "").trim();
    const name = String(rel?.name || tag).trim();
    const htmlUrl = String(rel?.html_url || "").trim();
    const publishedAt = String(rel?.published_at || rel?.created_at || "").trim();
    const assets: any[] = Array.isArray(rel?.assets) ? rel.assets : [];

    const matchedAsset = assets.find(
      (a) => String(a?.name || "").toLowerCase() === targetAsset.toLowerCase()
    );
    let sha256 = "";
    if (typeof matchedAsset?.digest === "string" && matchedAsset.digest.startsWith("sha256:")) {
      sha256 = matchedAsset.digest.slice(7).trim().toLowerCase();
    }
    if (!sha256) {
      const checksumAsset = assets.find((a) => /checksums?\.sha256|sha256sums/i.test(String(a?.name || "")));
      if (checksumAsset?.browser_download_url) {
        try {
          const cr = await fetch(checksumAsset.browser_download_url, {
            headers: { "User-Agent": "suomynona-council-updater" },
            signal: AbortSignal.timeout(5000),
          });
          if (cr.ok) {
            const cText = await cr.text();
            for (const line of cText.split(/\r?\n/)) {
              const m = line.trim().match(/^([a-fA-F0-9]{64})\s+\*?(.+)$/);
              if (m && m[2].trim().toLowerCase() === targetAsset.toLowerCase()) {
                sha256 = m[1].toLowerCase();
                break;
              }
            }
          }
        } catch {
          // optional checksum fetch failed
        }
      }
    }

    const semverDiff = compareSemver(tag, currentVersion);
    let isNewer = semverDiff > 0;
    // Same-semver hotfix detection: compare actual running portable .exe SHA-256 against published checksum
    // (NEVER use timestamps, so slow upload times can never cause a same-version self-update loop!)
    if (!isNewer && semverDiff === 0 && sha256) {
      const runningExe = String(process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
      if (runningExe && fs.existsSync(runningExe)) {
        try {
          const runningSha = crypto.createHash("sha256").update(fs.readFileSync(runningExe)).digest("hex").toLowerCase();
          if (runningSha && runningSha !== sha256.toLowerCase()) {
            isNewer = true;
          }
        } catch {
          // ignore read error; keep isNewer = false for same semver
        }
      }
    }

    return {
      found: Boolean(matchedAsset?.browser_download_url),
      tag,
      name,
      htmlUrl,
      publishedAt,
      assetName: matchedAsset?.name || targetAsset,
      downloadUrl: String(matchedAsset?.browser_download_url || "").trim(),
      assetSize: Number(matchedAsset?.size) || 0,
      sha256,
      isNewer: Boolean(isNewer && matchedAsset?.browser_download_url),
    };
  } catch {
    return null;
  }
}

export async function downloadAndInstallPortableExeUpdate(
  opts: { force?: boolean; triggerRelaunch?: boolean } = {}
): Promise<{ ok: boolean; state: AutoUpdaterState; message: string }> {
  if (_activeReleaseInstallPromise) return _activeReleaseInstallPromise;

  _activeReleaseInstallPromise = (async () => {
    const edition = detectBundledEdition();
    const currentVersion = detectBundledAppVersion();
    const rel = await fetchLatestGitHubRelease(
      UPDATER_STATE.repo_url || DEFAULT_REPO_URL,
      edition,
      currentVersion,
      UPDATER_STATE.built_at
    );
    if (!rel || !rel.found || !rel.downloadUrl) {
      const msg = `No published GitHub Release asset (${expectedPortableAssetName(edition)}) found yet.`;
      UPDATER_STATE.last_error = "";
      return { ok: false, state: getAutoUpdaterState(), message: msg };
    }

    UPDATER_STATE.release_tag = rel.tag;
    UPDATER_STATE.release_name = rel.name;
    UPDATER_STATE.release_url = rel.htmlUrl;
    UPDATER_STATE.release_asset_name = rel.assetName;
    UPDATER_STATE.release_download_url = rel.downloadUrl;
    UPDATER_STATE.release_asset_size = rel.assetSize;
    UPDATER_STATE.release_asset_sha256 = rel.sha256;
    UPDATER_STATE.release_published_at = rel.publishedAt;
    UPDATER_STATE.release_update_available = rel.isNewer;

    if (!rel.isNewer && !opts.force) {
      UPDATER_STATE.status = "up_to_date";
      persistUpdaterState();
      return {
        ok: true,
        state: getAutoUpdaterState(),
        message: `Already on latest release ${rel.tag} (${edition.toUpperCase()} Edition v${currentVersion}).`,
      };
    }

    const updatesDir = path.join(DATA_ROOT, "updates");
    fs.mkdirSync(updatesDir, { recursive: true });
    const stagedPath = path.join(updatesDir, `${rel.assetName}.new.exe`);

    UPDATER_STATE.status = "downloading";
    UPDATER_STATE.download_progress_pct = 0;
    UPDATER_STATE.last_error = "";
    persistUpdaterState();

    pushLiveConsole(
      `⬇️ [Auto-Updater] Downloading ${rel.assetName} (${rel.tag}${rel.assetSize ? ` · ${(rel.assetSize / 1024 / 1024).toFixed(1)} MB` : ""})…`,
      { category: "SYSTEM", level: "info" }
    );

    try {
      const resp = await fetch(rel.downloadUrl, {
        headers: { "User-Agent": "suomynona-council-updater" },
        redirect: "follow",
        signal: AbortSignal.timeout(300_000),
      });
      if (!resp.ok || !resp.body) {
        throw new Error(`Download failed with HTTP ${resp.status}`);
      }

      const totalBytes = Number(resp.headers.get("content-length")) || rel.assetSize || 0;
      const hash = crypto.createHash("sha256");
      const outStream = fs.createWriteStream(stagedPath);
      const reader = resp.body.getReader();
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length) {
          hash.update(value);
          outStream.write(value);
          received += value.length;
          if (totalBytes > 0) {
            UPDATER_STATE.download_progress_pct = Math.min(99, Math.round((received / totalBytes) * 100));
          }
        }
      }
      await new Promise<void>((resolve, reject) => {
        outStream.end(() => resolve());
        outStream.on("error", reject);
      });

      // Verify PE header ("MZ") and optional SHA-256 digest before ever replacing the running .exe
      const fd = fs.openSync(stagedPath, "r");
      const hdr = Buffer.alloc(2);
      fs.readSync(fd, hdr, 0, 2, 0);
      fs.closeSync(fd);
      if (hdr[0] !== 0x4d || hdr[1] !== 0x5a) {
        fs.rmSync(stagedPath, { force: true });
        throw new Error("Downloaded update failed Windows PE (MZ) signature validation");
      }

      const actualSha = hash.digest("hex").toLowerCase();
      if (rel.sha256 && actualSha !== rel.sha256.toLowerCase()) {
        fs.rmSync(stagedPath, { force: true });
        throw new Error(`SHA-256 mismatch (expected ${rel.sha256.slice(0, 16)}…, got ${actualSha.slice(0, 16)}…)`);
      }

      UPDATER_STATE.download_progress_pct = 100;
      UPDATER_STATE.release_downloaded_path = stagedPath;
      UPDATER_STATE.status = "applied";
      UPDATER_STATE.updates_applied_count += 1;
      UPDATER_STATE.last_updated_at = new Date().toISOString();
      UPDATER_STATE.last_error = "";
      persistUpdaterState();

      const targetExe = String(process.env.PORTABLE_EXECUTABLE_FILE || "").trim();
      const canSwapInPlace = Boolean(
        process.platform === "win32" &&
        process.env.COUNCIL_DESKTOP_MODE === "1" &&
        targetExe &&
        targetExe.toLowerCase().endsWith(".exe") &&
        fs.existsSync(targetExe)
      );

      if (canSwapInPlace && opts.triggerRelaunch !== false) {
        pushLiveConsole(
          `✅ [Auto-Updater] Verified ${rel.assetName} (${rel.tag} · SHA-256 OK). Swapping executable & relaunching…`,
          { category: "SYSTEM", level: "ok" }
        );
        try {
          process.stdout.write(
            `__SUOMYNONA_SELF_UPDATE_EXE__:${JSON.stringify({
              targetExe,
              stagedExe: stagedPath,
              releaseTag: rel.tag,
              edition,
              sha256: actualSha,
            })}\n`
          );
        } catch {
          // ignore pipe error
        }
        return {
          ok: true,
          state: getAutoUpdaterState(),
          message: `✅ Verified ${rel.assetName} (${rel.tag}). Self-updating and relaunching now…`,
        };
      }

      const msg = `✅ Downloaded & verified ${rel.assetName} (${rel.tag}) to ${stagedPath}`;
      pushLiveConsole(msg, { category: "SYSTEM", level: "ok" });
      return { ok: true, state: getAutoUpdaterState(), message: msg };
    } catch (err: any) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = `Release download failed: ${err?.message || String(err)}`;
      UPDATER_STATE.error_definition = `Could not download/verify ${rel.assetName} from ${rel.downloadUrl}.`;
      UPDATER_STATE.repair_steps = [
        "1. Verify internet connectivity to GitHub Releases.",
        `2. Manual download link: ${rel.htmlUrl || rel.downloadUrl}`,
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }
  })().finally(() => {
    _activeReleaseInstallPromise = null;
  });

  return _activeReleaseInstallPromise;
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
    "desktop-edition.json",
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
    const edition = detectBundledEdition();
    // Engine 1: If a newer binary GitHub Release .exe exists (or we are in Normal/Client Edition), install the signed/verified release .exe!
    const rel = await fetchLatestGitHubRelease(
      UPDATER_STATE.repo_url || DEFAULT_REPO_URL,
      edition,
      detectBundledAppVersion(),
      UPDATER_STATE.built_at
    );
    if (rel && rel.found && (rel.isNewer || edition === "client")) {
      if (rel.isNewer || opts.forceRebuild) {
        return await downloadAndInstallPortableExeUpdate({ force: Boolean(opts.forceRebuild), triggerRelaunch: true });
      }
      UPDATER_STATE.release_tag = rel.tag;
      UPDATER_STATE.release_update_available = false;
      UPDATER_STATE.status = "up_to_date";
      persistUpdaterState();
      return {
        ok: true,
        state: getAutoUpdaterState(),
        message: `Already on latest ${edition.toUpperCase()} Edition release (${rel.tag}).`,
      };
    }

    if (edition === "client") {
      UPDATER_STATE.status = "up_to_date";
      persistUpdaterState();
      return {
        ok: true,
        state: getAutoUpdaterState(),
        message: `Normal (Client) Edition v${detectBundledAppVersion()} is up-to-date (checks GitHub Releases automatically).`,
      };
    }

    // Engine 2: Master / Dev Git Hot-Reload fallback
    const gitVer = await runGit(["--version"], undefined, 4000);
    UPDATER_STATE.git_available = Boolean(gitVer && gitVer.ok);
    if (!gitVer.ok) {
      UPDATER_STATE.status = "up_to_date";
      UPDATER_STATE.last_error = "";
      persistUpdaterState();
      return {
        ok: true,
        state: getAutoUpdaterState(),
        message: `v${detectBundledAppVersion()} is current (GitHub Releases auto-updater active; Git CLI not required).`,
      };
    }

    const repoDir = await resolveGitRepoDir(true);
    if (!repoDir) {
      UPDATER_STATE.status = "error";
      UPDATER_STATE.last_error = `Could not locate or clone Git repository (${UPDATER_STATE.repo_url})`;
      UPDATER_STATE.error_definition =
        `No local '.git' workspace was found above ${PROJECT_ROOT} and cloning ${UPDATER_STATE.repo_url} into ${DATA_ROOT}\\repo-mirror failed.`;
      UPDATER_STATE.repair_steps = [
        "1. Verify internet connectivity and GitHub access to https://github.com/suomynonaew/suomynona-council.git.",
        "2. Or wait for the next published GitHub Release (.exe auto-update requires zero Git).",
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
      UPDATER_STATE.error_definition = `Unable to contact origin (${UPDATER_STATE.repo_url}) on branch '${branch}'.`;
      UPDATER_STATE.repair_steps = [
        "1. Check internet/DNS connectivity and ensure GitHub is reachable.",
        `2. Test manually: git -C "${repoDir}" fetch origin ${branch}`,
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    const behindRes = await runGit(["rev-list", "--count", `HEAD..origin/${branch}`], repoDir);
    const commitsBehind = Number(behindRes.stdout || "0") || 0;

    if (commitsBehind > 0) {
      pushLiveConsole(
        `⬇️ [Auto-Updater] Pulling ${commitsBehind} new commit(s) from origin/${branch} in ${repoDir}…`,
        { category: "SYSTEM", level: "info" }
      );
      const pullRes = await runGit(["pull", "--rebase", "--autostash", "origin", branch], repoDir, 30000);
      if (!pullRes.ok) {
        await runGit(["rebase", "--abort"], repoDir, 5000);
        UPDATER_STATE.status = "error";
        UPDATER_STATE.last_error = `git pull failed: ${pullRes.stderr || pullRes.stdout}`;
        UPDATER_STATE.error_definition =
          "Automatic 'git pull --rebase --autostash' could not merge upstream commits cleanly due to local conflicting modifications.";
        UPDATER_STATE.repair_steps = [
          `1. Inspect local changes: git -C "${repoDir}" status`,
          `2. Stash or commit local edits, then pull: git -C "${repoDir}" stash && git -C "${repoDir}" pull origin ${branch}`,
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
        ];
        persistUpdaterState();
        return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
      }
    }

    UPDATER_STATE.status = "building";
    persistUpdaterState();
    pushLiveConsole(`🛠️ [Auto-Updater] Rebuilding desktop frontend & server bundle…`, {
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
      ];
      persistUpdaterState();
      return { ok: false, state: getAutoUpdaterState(), message: UPDATER_STATE.last_error };
    }

    const headNow = (await runGit(["rev-parse", "HEAD"], repoDir)).stdout || UPDATER_STATE.remote_sha || UPDATER_STATE.local_sha;
    const subjectNow = (await runGit(["log", "-1", "--format=%s"], repoDir)).stdout || UPDATER_STATE.remote_subject;
    const dateNow = (await runGit(["log", "-1", "--format=%cI"], repoDir)).stdout || UPDATER_STATE.remote_date;

    const liveRuntimeDir = UPDATER_STATE.live_runtime_dir || path.join(DATA_ROOT, "live-app-runtime");
    const copiedLive = stageBuiltFilesToTarget(repoDir, liveRuntimeDir);

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

export async function checkForGitUpdates(opts: { autoApply?: boolean; manual?: boolean } = {}): Promise<AutoUpdaterState> {
  if (_activeCheckPromise) return _activeCheckPromise;

  _activeCheckPromise = (async () => {
    const branch = UPDATER_STATE.branch || DEFAULT_BRANCH;
    const edition = detectBundledEdition();
    const currentVersion = detectBundledAppVersion();
    UPDATER_STATE.edition = edition;
    UPDATER_STATE.app_version = currentVersion;
    UPDATER_STATE.status = "checking";
    UPDATER_STATE.last_error = "";
    UPDATER_STATE.error_definition = "";
    UPDATER_STATE.repair_steps = [];
    persistUpdaterState();

    // ── ENGINE 1: ALWAYS CHECK GITHUB RELEASES FOR BINARY .EXE AUTO-UPDATE (Works on ALL Windows PCs, Master & Client!) ──
    const rel = await fetchLatestGitHubRelease(
      UPDATER_STATE.repo_url || DEFAULT_REPO_URL,
      edition,
      currentVersion,
      UPDATER_STATE.built_at
    );
    UPDATER_STATE.last_checked_at = new Date().toISOString();
    if (rel) {
      UPDATER_STATE.release_tag = rel.tag;
      UPDATER_STATE.release_name = rel.name;
      UPDATER_STATE.release_url = rel.htmlUrl;
      UPDATER_STATE.release_asset_name = rel.assetName;
      UPDATER_STATE.release_download_url = rel.downloadUrl;
      UPDATER_STATE.release_asset_size = rel.assetSize;
      UPDATER_STATE.release_asset_sha256 = rel.sha256;
      UPDATER_STATE.release_published_at = rel.publishedAt;
      UPDATER_STATE.release_update_available = rel.isNewer;

      if (rel.isNewer) {
        UPDATER_STATE.status = "update_available";
        UPDATER_STATE.remote_subject = rel.name || `Release ${rel.tag}`;
        UPDATER_STATE.remote_date = rel.publishedAt;
        persistUpdaterState();
        pushLiveConsole(
          `🔔 [Auto-Updater] New ${edition.toUpperCase()} Edition release ${rel.tag} available (${rel.assetName})`,
          { category: "SYSTEM", level: "info" }
        );
        if (opts.autoApply !== false && UPDATER_STATE.auto_pull && process.env.COUNCIL_DESKTOP_MODE === "1") {
          const instRes = await downloadAndInstallPortableExeUpdate({ triggerRelaunch: true });
          return instRes.state;
        }
        return getAutoUpdaterState();
      }
    }

    // On Normal (Client) Edition, rely strictly on verified GitHub Releases (never require Git CLI!)
    if (edition === "client") {
      UPDATER_STATE.status = "up_to_date";
      UPDATER_STATE.commits_behind = 0;
      persistUpdaterState();
      return getAutoUpdaterState();
    }

    // ── ENGINE 2: MASTER EDITION GIT HOT-RELOAD CHECK ──
    const gitVer = await runGit(["--version"], undefined, 4000);
    UPDATER_STATE.git_available = gitVer.ok;
    const repoDir = await resolveGitRepoDir(Boolean(opts.manual));

    if (!gitVer.ok || !repoDir) {
      const apiHead = await fetchGitHubHeadViaApi(UPDATER_STATE.repo_url || DEFAULT_REPO_URL, branch);
      if (apiHead) {
        UPDATER_STATE.remote_sha = apiHead.sha;
        UPDATER_STATE.remote_short = apiHead.sha.slice(0, 7);
        UPDATER_STATE.remote_subject = apiHead.subject;
        UPDATER_STATE.remote_date = apiHead.date;
        const knownSha = UPDATER_STATE.installed_sha || UPDATER_STATE.local_sha;
        const diff = Boolean(knownSha && knownSha !== apiHead.sha);
        UPDATER_STATE.commits_behind = diff ? 1 : 0;
        UPDATER_STATE.status = diff ? "update_available" : "up_to_date";
      } else {
        UPDATER_STATE.status = rel ? "up_to_date" : "error";
        if (!rel) {
          UPDATER_STATE.last_error = "Could not reach GitHub to check for updates";
        }
      }
      persistUpdaterState();
      return getAutoUpdaterState();
    }

    UPDATER_STATE.repo_dir = repoDir;
    const fetchRes = await runGit(["fetch", "origin", branch, "--quiet"], repoDir, 15000);

    if (!fetchRes.ok) {
      UPDATER_STATE.status = rel ? "up_to_date" : "error";
      if (!rel) {
        UPDATER_STATE.last_error = `git fetch failed: ${fetchRes.stderr || "offline"}`;
      }
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
        `🔔 [Auto-Updater] ${UPDATER_STATE.commits_behind} new commit(s) detected on origin/${branch} (${UPDATER_STATE.remote_short}: "${UPDATER_STATE.remote_subject}")`,
        { category: "SYSTEM", level: "info" }
      );
      if (opts.autoApply !== false && UPDATER_STATE.auto_pull) {
        const pullRes = await pullAndApplyGitUpdate();
        return pullRes.state;
      }
    } else if (UPDATER_STATE.installed_sha && UPDATER_STATE.local_sha && UPDATER_STATE.installed_sha !== UPDATER_STATE.local_sha) {
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
        const nextSec = Math.max(30, Number(UPDATER_STATE.poll_interval_sec) || 300);
        scheduleNext(nextSec * 1000);
      }
    }, delayMs);
    if (typeof _daemonTimer.unref === "function") {
      _daemonTimer.unref();
    }
  };

  // Run first check 6s after server listens so startup stays instant & non-blocking
  scheduleNext(6000);
}

export function formatUpdaterCliReport(st: AutoUpdaterState = getAutoUpdaterState()): string {
  const edLabel = st.edition === "client" ? "Normal (Client) Edition" : "Master Edition";
  const lines = [
    `╔══════════════════════════════════════════════════════════════════════════════╗`,
    `║  🔄 SUOMYNONA COUNCIL — BUILT-IN AUTO-UPDATER (${edLabel.toUpperCase()})`,
    `╠══════════════════════════════════════════════════════════════════════════════╣`,
    `║  Version      : v${st.app_version}  (Mode: ${st.update_mode} · Auto-Update: ${st.auto_pull ? "ON" : "OFF"} every ${st.poll_interval_sec}s)`,
    `║  Repository   : ${st.repo_url} (${st.branch})`,
    `║  Latest Rel.  : ${st.release_tag || "(checking)"} · Asset: ${st.release_asset_name}${st.release_update_available ? " [UPDATE READY]" : ""}`,
    `║  Installed    : ${st.installed_short || st.local_short || "v" + st.app_version} (${st.live_runtime_active ? "Hot-Reloaded Live Runtime" : "Packaged Portable EXE"})`,
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
  lines.push(`Commands: '/update' (check & auto-update) | '/update pull' (force install now) | '/update status'`);
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

  app.post("/api/updater/install-release", async (req: Request, res: Response) => {
    const force = Boolean(req.body?.force);
    const triggerRelaunch = req.body?.trigger_relaunch !== false;
    const r = await downloadAndInstallPortableExeUpdate({ force, triggerRelaunch });
    res.json({ ok: r.ok, message: r.message, updater: r.state, formatted: formatUpdaterCliReport(r.state) });
  });

  app.post("/api/updater/config", (req: Request, res: Response) => {
    const b = req.body || {};
    if (b.enabled !== undefined) UPDATER_STATE.enabled = Boolean(b.enabled);
    if (b.auto_pull !== undefined) UPDATER_STATE.auto_pull = Boolean(b.auto_pull);
    if (b.poll_interval_sec !== undefined) {
      UPDATER_STATE.poll_interval_sec = Math.max(30, Math.min(3600, Number(b.poll_interval_sec) || 300));
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
