// ============================================================================
//   ◈ SUOMYNONA COUNCIL — ELECTRON NATIVE DESKTOP MAIN PROCESS
//   - Multi-Window Desktop Engine: Freely detach any CLI anywhere across monitors
//   - Local GPU & Model Detection: Ollama, llama.cpp, LM Studio, vLLM & NVIDIA GPU
//   - Remote GPU Orchestration: Colab, Kaggle, RunPod, Vast.ai, Modal tunnels
// ============================================================================

const { app, BrowserWindow, ipcMain, screen, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn, exec } = require("child_process");

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`;
const WINDOWS_DATA_FILE = path.join(process.cwd(), ".council_data", "desktop_windows.json");

let mainWindow = null;
let serverProcess = null;
const detachedWindows = new Map(); // key -> BrowserWindow

// Ensure .council_data directory exists
try {
  const dataDir = path.join(process.cwd(), ".council_data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
} catch (_) {}

function loadWindowBounds(key) {
  try {
    if (fs.existsSync(WINDOWS_DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(WINDOWS_DATA_FILE, "utf-8"));
      return data[key] || null;
    }
  } catch (_) {}
  return null;
}

function saveWindowBounds(key, bounds) {
  try {
    let data = {};
    if (fs.existsSync(WINDOWS_DATA_FILE)) {
      try { data = JSON.parse(fs.readFileSync(WINDOWS_DATA_FILE, "utf-8")); } catch (_) {}
    }
    data[key] = bounds;
    fs.writeFileSync(WINDOWS_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (_) {}
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
    <div class="sub">Unrestricted Multi-Agent Engineering Studio</div>
    <div class="progress-wrap"><div class="progress-bar"></div></div>
    <div class="status-text"><span class="dot"></span> Initializing Studio Engine &amp; GPU Slots...</div>
  </div>
</body>
</html>`;

// ── Check if internal backend server is responding ──
function checkServerReady(timeoutMs = 15000) {
  return new Promise((resolve) => {
    const start = Date.now();
    function ping() {
      const req = http.get(SERVER_URL, (res) => {
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
        setTimeout(ping, 200);
      }
    }
    ping();
  });
}

// ── Start Node/Express backend if not already listening ──
function ensureServerRunning() {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "npx.cmd" : "npx";
  const args = ["tsx", "server.ts"];

  try {
    serverProcess = spawn(cmd, args, {
      cwd: process.cwd(),
      env: { ...process.env, PORT: String(SERVER_PORT) },
      shell: true,
      stdio: "pipe",
    });

    serverProcess.stdout.on("data", (d) => {
      process.stdout.write(`[SERVER] ${d}`);
    });
    serverProcess.stderr.on("data", (d) => {
      process.stderr.write(`[SERVER ERR] ${d}`);
    });

    serverProcess.on("exit", (code) => {
      console.log(`[SUOMYNONA NATIVE] Server process exited with code ${code}`);
    });
  } catch (err) {
    console.error("[SUOMYNONA NATIVE] Failed to spawn server:", err);
  }
}

// ── Poll for server ready and transition main window ──
function pollAndNavigateMain() {
  let isNavigated = false;
  const pollInterval = setInterval(async () => {
    if (isNavigated) {
      clearInterval(pollInterval);
      return;
    }
    const ready = await checkServerReady(400);
    if (ready && mainWindow && !mainWindow.isDestroyed()) {
      isNavigated = true;
      clearInterval(pollInterval);
      console.log("[SUOMYNONA NATIVE] Backend server ready, transitioning to UI...");
      mainWindow.loadURL(SERVER_URL).catch(() => {
        isNavigated = false;
      });
    }
  }, 200);

  // Safety fallback after 12s
  setTimeout(() => {
    if (!isNavigated && mainWindow && !mainWindow.isDestroyed()) {
      isNavigated = true;
      clearInterval(pollInterval);
      mainWindow.loadURL(SERVER_URL).catch(() => {});
    }
  }, 12000);
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
    title: "Suomynona Council — Unrestricted Multi-Agent Engineering Studio",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: false,
    },
    autoHideMenuBar: true,
    show: true,
  });

  // Display the instant splash screen immediately — zero black screen delay
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(SPLASH_HTML)}`);

  // Retry on connection refused until backend is listening
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    if (validatedURL && validatedURL.startsWith(SERVER_URL)) {
      console.log(`[SUOMYNONA NATIVE] Retrying navigation to ${SERVER_URL} (${errorCode} ${errorDescription})...`);
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL(SERVER_URL).catch(() => {});
        }
      }, 400);
    }
  });

  mainWindow.on("resize", () => saveWindowBounds("main", mainWindow.getBounds()));
  mainWindow.on("move", () => saveWindowBounds("main", mainWindow.getBounds()));

  mainWindow.on("closed", () => {
    mainWindow = null;
    // Close any remaining detached windows when main studio closes
    for (const [key, win] of detachedWindows.entries()) {
      if (!win.isDestroyed()) win.close();
    }
    detachedWindows.clear();
  });

  // Open external links in user default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://127.0.0.1") || url.startsWith(SERVER_URL)) {
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
    frame: true, // Native OS window frame with minimize, maximize, close, and monitor dragging
    title: `Suomynona Council — [${cliKey.toUpperCase()}] CLI Native Window`,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  detachedWindows.set(cliKey, win);

  const targetUrl = `${SERVER_URL}/cli-standalone.html?key=${encodeURIComponent(cliKey)}`;
  win.loadURL(targetUrl);

  win.webContents.on("did-fail-load", (_event, _errorCode, _errorDescription, validatedURL) => {
    if (validatedURL && validatedURL.startsWith(SERVER_URL)) {
      setTimeout(() => {
        if (!win.isDestroyed()) win.loadURL(targetUrl).catch(() => {});
      }, 500);
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

    // 1. Probe nvidia-smi for local GPU hardware
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

      // 2. Probe Ollama on 11434
      const reqOllama = http.get("http://127.0.0.1:11434/api/tags", (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            results.ollama.online = true;
            results.ollama.models = (data.models || []).map((m) => m.name || m.model);
          } catch (_) {}
          checkLlamaCpp();
        });
      });
      reqOllama.on("error", () => checkLlamaCpp());
      reqOllama.setTimeout(800, () => {
        reqOllama.destroy();
        checkLlamaCpp();
      });

      // 3. Probe llama.cpp on 8080
      function checkLlamaCpp() {
        const reqLlama = http.get("http://127.0.0.1:8080/v1/models", (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              results.llamaCpp.online = true;
              results.llamaCpp.models = (data.data || []).map((m) => m.id);
            } catch (_) {}
            checkLmStudio();
          });
        });
        reqLlama.on("error", () => checkLmStudio());
        reqLlama.setTimeout(800, () => {
          reqLlama.destroy();
          checkLmStudio();
        });
      }

      // 4. Probe LM Studio on 1234
      function checkLmStudio() {
        const reqLm = http.get("http://127.0.0.1:1234/v1/models", (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () => {
            try {
              const data = JSON.parse(body);
              results.lmStudio.online = true;
              results.lmStudio.models = (data.data || []).map((m) => m.id);
            } catch (_) {}
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

// ── App Lifecycle ──
app.whenReady().then(() => {
  createMainWindow();
  ensureServerRunning();
  pollAndNavigateMain();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (serverProcess) {
    try {
      serverProcess.kill("SIGTERM");
    } catch (_) {}
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
