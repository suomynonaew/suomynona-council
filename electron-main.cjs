// ============================================================================
//   ◈ SUOMYNONA COUNCIL — ELECTRON NATIVE DESKTOP MAIN PROCESS
//   - Self-Contained Standalone Desktop App (Embedded Node Server, Zero Browser)
//   - Multi-Window Desktop Engine: Freely detach any CLI anywhere across monitors
//   - Local GPU & Model Detection: Ollama, llama.cpp, LM Studio, vLLM & NVIDIA GPU
// ============================================================================

const { app, BrowserWindow, ipcMain, Menu, nativeTheme, screen, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const net = require("net");
const { spawn, exec } = require("child_process");

nativeTheme.themeSource = "dark";

app.setName("Suomynona Council");
app.setPath("userData", path.join(app.getPath("appData"), "Suomynona Council"));

const BUNDLED_APP_ROOT = __dirname;
const APP_ROOT = BUNDLED_APP_ROOT;
const DATA_ROOT = app.isPackaged ? app.getPath("userData") : APP_ROOT;
const LIVE_RUNTIME_DIR = path.join(DATA_ROOT, "live-app-runtime");
const WINDOWS_DATA_FILE = path.join(DATA_ROOT, ".council_data", "desktop_windows.json");
const DESKTOP_RUNTIME_STATUS_FILE = path.join(DATA_ROOT, ".council_data", "desktop_runtime_status.json");

function loadDesktopEditionConfig() {
  const candidates = [
    path.join(BUNDLED_APP_ROOT, "desktop-edition.json"),
    path.join(BUNDLED_APP_ROOT, "dist-server", "desktop-edition.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      }
    } catch (_) {}
  }
  return { edition: "master", ed25519PublicKeyPem: "", serverBundleSha256: "" };
}

const EDITION_CONFIG = loadDesktopEditionConfig();
const IS_CLIENT_EDITION =
  String(process.env.COUNCIL_EDITION || EDITION_CONFIG.edition || "master").toLowerCase() === "client";

// ── Anti-Reverse-Engineering & Anti-Debugger Guard (Client Edition) ──
if (IS_CLIENT_EDITION) {
  delete process.env.NODE_OPTIONS;
  delete process.env.ELECTRON_ENABLE_INSPECT;
  const suspiciousFlags = [
    "--inspect",
    "--inspect-brk",
    "--inspect-port",
    "--debug",
    "--debug-brk",
    "--remote-debugging-port",
    "--js-flags",
  ];
  const allArgs = [...process.argv, ...(process.execArgv || [])].join(" ").toLowerCase();
  if (suspiciousFlags.some((flag) => allArgs.includes(flag))) {
    process.exit(1);
  }
}

let serverPort = Number(process.env.PORT) || 3077;
let serverUrl = `http://127.0.0.1:${serverPort}`;
let mainWindow = null;
let serverProcess = null;
let hotReloadInProgress = false;
const detachedWindows = new Map(); // key -> BrowserWindow

function readRepoBuiltTimestamp(dir) {
  try {
    const p1 = path.join(dir, "desktop-repo-config.json");
    const p2 = path.join(dir, "dist-server", "desktop-repo-config.json");
    for (const p of [p1, p2]) {
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
        return Number(parsed?.builtTimestamp || 0);
      }
    }
  } catch (_) { }
  return 0;
}

function resolveActiveAppRoot() {
  // Disallow unverified external runtime directory overrides in protected Client Edition
  if (IS_CLIENT_EDITION) {
    return BUNDLED_APP_ROOT;
  }
  try {
    const liveServer = path.join(LIVE_RUNTIME_DIR, "dist-server", "server.cjs");
    const liveDist = path.join(LIVE_RUNTIME_DIR, "dist", "index.html");
    if (fs.existsSync(liveServer) && fs.existsSync(liveDist)) {
      const bundledTs = readRepoBuiltTimestamp(BUNDLED_APP_ROOT);
      const liveTs = readRepoBuiltTimestamp(LIVE_RUNTIME_DIR);
      if (liveTs > bundledTs || !fs.existsSync(path.join(BUNDLED_APP_ROOT, "dist-server", "server.cjs"))) {
        return LIVE_RUNTIME_DIR;
      }
    }
  } catch (_) { }
  return BUNDLED_APP_ROOT;
}

function discoverSourceGitRepoDir() {
  const candidates = [];
  try {
    for (const base of [LIVE_RUNTIME_DIR, BUNDLED_APP_ROOT]) {
      const cfgPath = path.join(base, "desktop-repo-config.json");
      if (fs.existsSync(cfgPath)) {
        const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
        if (cfg?.sourceRepoDir) candidates.push(cfg.sourceRepoDir);
      }
    }
  } catch (_) { }

  for (const startDir of [process.env.PORTABLE_EXECUTABLE_DIR, path.dirname(process.execPath), BUNDLED_APP_ROOT]) {
    if (!startDir) continue;
    let cur = path.resolve(startDir);
    for (let i = 0; i < 6; i++) {
      candidates.push(cur);
      const parent = path.dirname(cur);
      if (!parent || parent === cur) break;
      cur = parent;
    }
  }

  for (const dir of candidates) {
    try {
      if (dir && fs.existsSync(path.join(dir, ".git"))) {
        return path.resolve(dir);
      }
    } catch (_) { }
  }
  return "";
}

function ensureDesktopDataDir() {
  try {
    const dataDir = path.join(DATA_ROOT, ".council_data");
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(path.join(DATA_ROOT, "council_outputs"), { recursive: true });
    fs.mkdirSync(path.join(DATA_ROOT, "council_builds"), { recursive: true });

    if (app.isPackaged) {
      const seedDir = path.join(APP_ROOT, "seed_data");
      if (fs.existsSync(seedDir)) {
        for (const entry of fs.readdirSync(seedDir)) {
          const src = path.join(seedDir, entry);
          const dst = path.join(dataDir, entry);
          if (!fs.existsSync(dst) && fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dst);
          }
        }
      }
      const targetEnv = path.join(DATA_ROOT, ".env");
      if (!fs.existsSync(targetEnv)) {
        const portableDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
        const sidecarEnv = path.join(portableDir, ".env");
        const fallbackEnv = path.join(APP_ROOT, ".env.example");
        if (fs.existsSync(sidecarEnv)) {
          fs.copyFileSync(sidecarEnv, targetEnv);
        } else if (fs.existsSync(fallbackEnv)) {
          fs.copyFileSync(fallbackEnv, targetEnv);
        }
      }
    }
  } catch (_) { }
}

function writeDesktopRuntimeStatus(extra = {}) {
  try {
    fs.mkdirSync(path.dirname(DESKTOP_RUNTIME_STATUS_FILE), { recursive: true });
    const hasWindow = Boolean(mainWindow && !mainWindow.isDestroyed());
    const payload = {
      pid: process.pid,
      serverPort,
      serverUrl,
      dataRoot: DATA_ROOT,
      isVisible: hasWindow ? mainWindow.isVisible() : false,
      isDestroyed: !hasWindow,
      title: hasWindow ? mainWindow.getTitle() : "",
      bounds: hasWindow ? mainWindow.getBounds() : null,
      updatedAt: new Date().toISOString(),
      ...extra,
    };
    fs.writeFileSync(DESKTOP_RUNTIME_STATUS_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (_) { }
}

function loadWindowBounds(key) {
  try {
    if (fs.existsSync(WINDOWS_DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(WINDOWS_DATA_FILE, "utf-8"));
      return data[key] || null;
    }
  } catch (_) { }
  return null;
}

function saveWindowBounds(key, bounds) {
  try {
    fs.mkdirSync(path.dirname(WINDOWS_DATA_FILE), { recursive: true });
    let data = {};
    if (fs.existsSync(WINDOWS_DATA_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(WINDOWS_DATA_FILE, "utf-8"));
      } catch (_) { }
    }
    data[key] = bounds;
    fs.writeFileSync(WINDOWS_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (_) { }
}

const SPLASH_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Suomynona Council — Initializing Studio</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #020409;
    color: #e6edf3;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    overflow: hidden;
  }
  .splash-card {
    text-align: center;
    max-width: 520px;
    padding: 44px 40px;
    background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.14), transparent 70%), #0d1117;
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 14px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15);
  }
  .emblem {
    font-size: 54px;
    line-height: 1;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: pulse 2.2s infinite ease-in-out;
  }
  h1 {
    font-size: 22px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 800;
    color: #f0f6fc;
    margin-bottom: 6px;
  }
  .sub {
    font-size: 13px;
    color: #8b949e;
    letter-spacing: 0.5px;
    margin-bottom: 26px;
  }
  .progress-wrap {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    overflow: hidden;
    position: relative;
    margin-bottom: 18px;
  }
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 45%;
    background: linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8);
    border-radius: 999px;
    animation: slide 1.5s infinite ease-in-out;
  }
  .status-text {
    font-size: 12px;
    color: #58a6ff;
    font-family: monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .dot {
    width: 7px;
    height: 7px;
    background: #38bdf8;
    border-radius: 50%;
    box-shadow: 0 0 10px #38bdf8;
    animation: blink 0.9s infinite alternate;
  }
  @keyframes slide {
    0% { left: -45%; width: 45%; }
    50% { width: 65%; }
    100% { left: 100%; width: 45%; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.4)); }
    50% { transform: scale(1.05); filter: drop-shadow(0 0 22px rgba(129, 140, 248, 0.7)); }
  }
  @keyframes blink {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }
</style>
</head>
<body>
  <div class="splash-card">
    <div class="emblem">◈</div>
    <h1>Suomynona Council</h1>
    <div class="sub">Standalone Native Desktop Engineering Studio</div>
    <div class="progress-wrap"><div class="progress-bar"></div></div>
    <div class="status-text"><span class="dot"></span> Starting Embedded Engine &amp; Local GPU Slots...</div>
  </div>
</body>
</html>`;

// ── Probe preferred loopback port (3077 keeps Chromium localStorage origin stable) ──
function probePort(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.unref();
    srv.once("error", () => resolve(null));
    srv.listen(port, "127.0.0.1", () => {
      const addr = srv.address();
      const chosen = addr && typeof addr === "object" ? addr.port : port;
      srv.close(() => resolve(chosen));
    });
  });
}

async function resolveDesktopPort(preferred = 3077) {
  const first = await probePort(preferred);
  if (first) return first;
  const fallback = await probePort(0);
  return fallback || preferred;
}

// ── Check if embedded backend is responding ──
function checkServerReady(timeoutMs = 15000) {
  return new Promise((resolve) => {
    const start = Date.now();
    function ping() {
      const req = http.get(`${serverUrl}/api/state`, (res) => {
        res.resume();
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      });
      req.on("error", retry);
      req.setTimeout(800, () => {
        req.destroy();
        retry();
      });
    }
    function retry() {
      if (Date.now() - start > timeoutMs) {
        resolve(false);
      } else {
        setTimeout(ping, 150);
      }
    }
    ping();
  });
}

// ── Start Embedded Backend via Electron's Node Runtime (ELECTRON_RUN_AS_NODE=1) ──
function startEmbeddedBackend(port) {
  const activeAppRoot = resolveActiveAppRoot();
  const gitRepoDir = discoverSourceGitRepoDir();
  const bundledServer = path.join(activeAppRoot, "dist-server", "server.cjs");
  const useBundled = fs.existsSync(bundledServer);

  try {
    if (useBundled) {
      if (IS_CLIENT_EDITION && app.isPackaged && EDITION_CONFIG.serverBundleSha256) {
        const actualHash = crypto.createHash("sha256").update(fs.readFileSync(bundledServer)).digest("hex");
        if (actualHash !== EDITION_CONFIG.serverBundleSha256) {
          console.error("[SUOMYNONA NATIVE] Protected server bundle integrity check failed.");
          app.quit();
          return;
        }
      }
      serverProcess = spawn(process.execPath, [bundledServer], {
        cwd: DATA_ROOT,
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
          NODE_ENV: "production",
          COUNCIL_DESKTOP_MODE: "1",
          COUNCIL_EDITION: IS_CLIENT_EDITION ? "client" : "master",
          ...(EDITION_CONFIG.ed25519PublicKeyPem ? { COUNCIL_PUBLIC_KEY_PEM: EDITION_CONFIG.ed25519PublicKeyPem } : {}),
          COUNCIL_APP_ROOT: activeAppRoot,
          COUNCIL_DATA_ROOT: DATA_ROOT,
          ...(gitRepoDir ? { COUNCIL_GIT_REPO_DIR: gitRepoDir } : {}),
          PORT: String(port),
        },
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } else if (!app.isPackaged) {
      const isWin = process.platform === "win32";
      serverProcess = spawn(isWin ? "npx.cmd" : "npx", ["tsx", "server.ts"], {
        cwd: activeAppRoot,
        env: {
          ...process.env,
          COUNCIL_DESKTOP_MODE: "1",
          COUNCIL_APP_ROOT: activeAppRoot,
          COUNCIL_DATA_ROOT: DATA_ROOT,
          ...(gitRepoDir ? { COUNCIL_GIT_REPO_DIR: gitRepoDir } : {}),
          PORT: String(port),
        },
        shell: isWin,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } else {
      console.error("[SUOMYNONA NATIVE] Missing dist-server/server.cjs in packaged build.");
      return;
    }

    let stdoutBuf = "";
    if (serverProcess.stdout) {
      serverProcess.stdout.on("data", (d) => {
        const chunk = d.toString();
        process.stdout.write(`[SERVER] ${chunk}`);
        stdoutBuf += chunk;
        let nlIdx = stdoutBuf.indexOf("\n");
        while (nlIdx !== -1) {
          const line = stdoutBuf.slice(0, nlIdx).trim();
          stdoutBuf = stdoutBuf.slice(nlIdx + 1);
          if (line.startsWith("__SUOMYNONA_HOT_RELOAD_RUNTIME__:")) {
            try {
              const info = JSON.parse(line.slice("__SUOMYNONA_HOT_RELOAD_RUNTIME__:".length));
              handleRuntimeHotReload(info);
            } catch (_) { }
          }
          nlIdx = stdoutBuf.indexOf("\n");
        }
      });
    }
    if (serverProcess.stderr) {
      serverProcess.stderr.on("data", (d) => {
        process.stderr.write(`[SERVER ERR] ${d}`);
      });
    }
    serverProcess.on("exit", (code) => {
      console.log(`[SUOMYNONA NATIVE] Embedded backend exited with code ${code}`);
    });
  } catch (err) {
    console.error("[SUOMYNONA NATIVE] Failed to start embedded backend:", err);
  }
}

function stopEmbeddedBackend() {
  if (!serverProcess) return;
  const proc = serverProcess;
  serverProcess = null;
  try {
    if (process.platform === "win32" && proc.pid) {
      spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    }
    proc.kill();
  } catch (_) { }
}

async function stopEmbeddedBackendAndWait(port) {
  stopEmbeddedBackend();
  const deadline = Date.now() + 3500;
  while (Date.now() < deadline) {
    const free = await probePort(port);
    if (free === port) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

async function handleRuntimeHotReload(info) {
  if (hotReloadInProgress) return;
  hotReloadInProgress = true;
  try {
    console.log(`[SUOMYNONA NATIVE] Hot-reloading runtime from updated commit ${info?.commitShort || ""}...`);
    await stopEmbeddedBackendAndWait(serverPort);
    startEmbeddedBackend(serverPort);
    const ready = await checkServerReady(12000);
    if (ready) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.reloadIgnoringCache();
      }
      for (const [, win] of detachedWindows.entries()) {
        if (win && !win.isDestroyed()) {
          win.webContents.reloadIgnoringCache();
        }
      }
    }
  } catch (err) {
    console.error("[SUOMYNONA NATIVE] Runtime hot-reload failed:", err);
  } finally {
    hotReloadInProgress = false;
  }
}

// ── Poll for backend ready and transition main window ──
function pollAndNavigateMain() {
  let isNavigated = false;
  let checking = false;
  const pollInterval = setInterval(async () => {
    if (isNavigated || checking) {
      if (isNavigated) clearInterval(pollInterval);
      return;
    }
    checking = true;
    try {
      const ready = await checkServerReady(400);
      if (ready && !isNavigated && mainWindow && !mainWindow.isDestroyed()) {
        isNavigated = true;
        clearInterval(pollInterval);
        console.log(`[SUOMYNONA NATIVE] Embedded backend ready on ${serverUrl}, loading Studio UI...`);
        mainWindow.loadURL(serverUrl).catch(() => {
          isNavigated = false;
        });
      }
    } finally {
      checking = false;
    }
  }, 150);

  setTimeout(() => {
    if (!isNavigated && mainWindow && !mainWindow.isDestroyed()) {
      isNavigated = true;
      clearInterval(pollInterval);
      mainWindow.loadURL(serverUrl).catch(() => { });
    }
  }, 15000);
}

function requestLocalApi(method, apiPath, bodyObj) {
  return new Promise((resolve) => {
    try {
      const payload = bodyObj ? JSON.stringify(bodyObj) : "";
      const req = http.request(
        `${serverUrl}${apiPath}`,
        {
          method,
          headers: payload
            ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
            : {},
          timeout: 25000,
        },
        (res) => {
          let raw = "";
          res.on("data", (c) => (raw += c));
          res.on("end", () => {
            try {
              resolve(JSON.parse(raw));
            } catch (_) {
              resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, raw });
            }
          });
        }
      );
      req.on("error", (err) => resolve({ ok: false, error: err?.message || String(err) }));
      if (payload) req.write(payload);
      req.end();
    } catch (err) {
      resolve({ ok: false, error: err?.message || String(err) });
    }
  });
}

// ── Build Native Application Menu & Keyboard Shortcuts ──
function buildApplicationMenu() {
  const getFocused = () => BrowserWindow.getFocusedWindow() || mainWindow;
  const template = [
    {
      label: "Studio",
      submenu: [
        {
          label: "Open Detached Master CLI",
          accelerator: "CmdOrCtrl+Shift+T",
          click: () => openDetachedCliWindow("master"),
        },
        {
          label: "Open Local Data Folder",
          accelerator: "CmdOrCtrl+Shift+D",
          click: () => shell.openPath(DATA_ROOT),
        },
        { type: "separator" },
        {
          label: "Check & Pull Git Updates Now",
          accelerator: "CmdOrCtrl+Shift+U",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.executeJavaScript("window.runInteractiveUpdaterInWorkspace?.('check')").catch(() => { });
            } else {
              requestLocalApi("POST", "/api/updater/check", { auto_apply: true });
            }
          },
        },
        {
          label: "Run Full System /doctor",
          accelerator: "CmdOrCtrl+Shift+H",
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.executeJavaScript("window.runInteractiveDoctorInWorkspace?.()").catch(() => { });
            } else {
              requestLocalApi("POST", "/api/doctor", { auto_fix: true });
            }
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload Studio",
          accelerator: "CmdOrCtrl+R",
          click: () => getFocused()?.reload(),
        },
        {
          label: "Reload Studio (F5)",
          accelerator: "F5",
          visible: false,
          click: () => getFocused()?.reload(),
        },
        { role: "togglefullscreen" },
        ...(!IS_CLIENT_EDITION
          ? [
              {
                label: "Toggle Developer Tools",
                accelerator: "F12",
                click: () => getFocused()?.webContents.toggleDevTools(),
              },
              {
                label: "Toggle Developer Tools (Ctrl+Shift+I)",
                accelerator: "CmdOrCtrl+Shift+I",
                visible: false,
                click: () => getFocused()?.webContents.toggleDevTools(),
              },
            ]
          : []),
        { type: "separator" },
        { role: "zoomIn", accelerator: "CmdOrCtrl+=" },
        { role: "zoomOut", accelerator: "CmdOrCtrl+-" },
        { role: "resetZoom", accelerator: "CmdOrCtrl+0" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function hardenBrowserWindowForClientEdition(win) {
  if (!IS_CLIENT_EDITION || !win) return;
  win.webContents.on("devtools-opened", () => {
    try {
      win.webContents.closeDevTools();
    } catch (_) {}
  });
  win.webContents.on("before-input-event", (event, input) => {
    const key = String(input.key || "").toUpperCase();
    const isDevShortcut =
      key === "F12" ||
      (input.control && input.shift && (key === "I" || key === "J" || key === "C")) ||
      (input.control && key === "U");
    if (isDevShortcut) {
      event.preventDefault();
    }
  });
}

// ── Create Primary Main Dashboard Window ──
function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const savedBounds = loadWindowBounds("main") || {
    width: Math.min(1480, Math.floor(width * 0.95)),
    height: Math.min(940, Math.floor(height * 0.92)),
    x: undefined,
    y: undefined,
  };

  mainWindow = new BrowserWindow({
    ...savedBounds,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#020409",
    title: IS_CLIENT_EDITION
      ? "Suomynona Council — Native Desktop Studio"
      : "Suomynona Council — Master Edition Studio",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: false,
      devTools: !IS_CLIENT_EDITION,
    },
    autoHideMenuBar: true,
    show: true,
  });

  hardenBrowserWindowForClientEdition(mainWindow);

  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(SPLASH_HTML)}`);

  mainWindow.webContents.on("did-finish-load", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      writeDesktopRuntimeStatus({
        didFinishLoad: true,
        loadedUrl: mainWindow.webContents.getURL(),
      });
    }
  });

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL && validatedURL.startsWith(serverUrl)) {
      console.log(`[SUOMYNONA NATIVE] Retrying navigation to ${serverUrl} (${errorCode} ${errorDescription})...`);
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL(serverUrl).catch(() => { });
        }
      }, 300);
    }
  });

  mainWindow.on("resize", () => saveWindowBounds("main", mainWindow.getBounds()));
  mainWindow.on("move", () => saveWindowBounds("main", mainWindow.getBounds()));

  mainWindow.on("closed", () => {
    mainWindow = null;
    for (const [, win] of detachedWindows.entries()) {
      if (!win.isDestroyed()) win.close();
    }
    detachedWindows.clear();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://127.0.0.1") || url.startsWith(serverUrl)) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// ── Open Detached Desktop Window for ANY CLI across any screen ──
function openDetachedCliWindow(cliKey = "master") {
  if (detachedWindows.has(cliKey)) {
    const existing = detachedWindows.get(cliKey);
    if (!existing.isDestroyed()) {
      existing.focus();
      return;
    }
    detachedWindows.delete(cliKey);
  }

  const savedBounds = loadWindowBounds(`cli-${cliKey}`) || {
    width: 1040,
    height: 720,
    x: undefined,
    y: undefined,
  };

  const win = new BrowserWindow({
    ...savedBounds,
    minWidth: 640,
    minHeight: 460,
    backgroundColor: "#020409",
    frame: true,
    title: `Suomynona Council — [${cliKey.toUpperCase()}] CLI Native Window`,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !IS_CLIENT_EDITION,
    },
    autoHideMenuBar: true,
  });

  hardenBrowserWindowForClientEdition(win);

  detachedWindows.set(cliKey, win);

  const targetUrl = `${serverUrl}/cli-standalone.html?key=${encodeURIComponent(cliKey)}`;
  win.loadURL(targetUrl);

  win.webContents.on("did-fail-load", (_event, _errorCode, _errorDescription, validatedURL) => {
    if (validatedURL && validatedURL.startsWith(serverUrl)) {
      setTimeout(() => {
        if (!win.isDestroyed()) win.loadURL(targetUrl).catch(() => { });
      }, 400);
    }
  });

  win.on("resize", () => saveWindowBounds(`cli-${cliKey}`, win.getBounds()));
  win.on("move", () => saveWindowBounds(`cli-${cliKey}`, win.getBounds()));

  win.on("closed", () => {
    detachedWindows.delete(cliKey);
  });
}

// ── Local GPU & Inference Engine Prober ──
function detectLocalEngines() {
  return new Promise((resolve) => {
    const results = {
      nvidiaGpu: null,
      ollama: { online: false, url: "http://127.0.0.1:11434", models: [] },
      llamaCpp: { online: false, url: "http://127.0.0.1:8080", models: [] },
      lmStudio: { online: false, url: "http://127.0.0.1:1234", models: [] },
      vllm: { online: false, url: "http://127.0.0.1:8000", models: [] },
    };

    exec("nvidia-smi --query-gpu=name,memory.total,memory.free,driver_version --format=csv,noheader,nounits", (err, stdout) => {
      if (!err && stdout.trim()) {
        const parts = stdout.trim().split("\n")[0].split(",").map((s) => s.trim());
        results.nvidiaGpu = {
          name: parts[0] || "NVIDIA GPU",
          totalVramMb: parseInt(parts[1] || "0", 10),
          freeVramMb: parseInt(parts[2] || "0", 10),
          driver: parts[3] || "N/A",
        };
      }

      const reqOllama = http.get("http://127.0.0.1:11434/api/tags", (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            results.ollama.online = true;
            results.ollama.models = (data.models || []).map((m) => m.name || m.model);
          } catch (_) { }
          checkLlamaCpp();
        });
      });
      reqOllama.on("error", () => checkLlamaCpp());
      reqOllama.setTimeout(800, () => {
        reqOllama.destroy();
        checkLlamaCpp();
      });

      function checkLlamaCpp() {
        const reqLlama = http.get("http://127.0.0.1:8080/v1/models", (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              results.llamaCpp.online = true;
              results.llamaCpp.models = (data.data || []).map((m) => m.id);
            } catch (_) { }
            checkLmStudio();
          });
        });
        reqLlama.on("error", () => checkLmStudio());
        reqLlama.setTimeout(800, () => {
          reqLlama.destroy();
          checkLmStudio();
        });
      }

      function checkLmStudio() {
        const reqLm = http.get("http://127.0.0.1:1234/v1/models", (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              results.lmStudio.online = true;
              results.lmStudio.models = (data.data || []).map((m) => m.id);
            } catch (_) { }
            finish();
          });
        });
        reqLm.on("error", () => finish());
        reqLm.setTimeout(800, () => {
          reqLm.destroy();
          finish();
        });
      }

      function finish() {
        resolve(results);
      }
    });
  });
}

// ── IPC Handlers ──
ipcMain.handle("open-detached-cli", (_event, cliKey) => {
  openDetachedCliWindow(cliKey);
  return { ok: true, cliKey };
});

ipcMain.handle("close-detached-cli", (_event, cliKey) => {
  if (detachedWindows.has(cliKey)) {
    const win = detachedWindows.get(cliKey);
    if (!win.isDestroyed()) win.close();
    detachedWindows.delete(cliKey);
  }
  return { ok: true };
});

ipcMain.handle("toggle-always-on-top", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const current = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!current);
    return !current;
  }
  return false;
});

ipcMain.handle("detect-local-engines", async () => {
  return await detectLocalEngines();
});

ipcMain.handle("open-data-folder", () => {
  return shell.openPath(DATA_ROOT);
});

ipcMain.handle("updater-status", () => requestLocalApi("GET", "/api/updater/status"));
ipcMain.handle("updater-check", (_event, opts) => requestLocalApi("POST", "/api/updater/check", opts || { auto_apply: true }));
ipcMain.handle("updater-pull", (_event, opts) => requestLocalApi("POST", "/api/updater/pull", opts || {}));
ipcMain.handle("run-doctor", (_event, opts) => requestLocalApi("POST", "/api/doctor", opts || { auto_fix: true }));

// ── App Lifecycle with Single-Instance Lock ──
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    ensureDesktopDataDir();
    buildApplicationMenu();
    serverPort = await resolveDesktopPort(Number(process.env.PORT) || 3077);
    serverUrl = `http://127.0.0.1:${serverPort}`;

    createMainWindow();
    startEmbeddedBackend(serverPort);
    pollAndNavigateMain();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });
}

app.on("before-quit", () => {
  stopEmbeddedBackend();
});

app.on("window-all-closed", () => {
  stopEmbeddedBackend();
  if (process.platform !== "darwin") {
    app.quit();
  }
});
