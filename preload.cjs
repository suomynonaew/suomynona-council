// ============================================================================
//   ◈ SUOMYNONA COUNCIL — ELECTRON PRELOAD SCRIPT
//   Exposes window.suomynonaNative for multi-window management & local GPU
// ============================================================================

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("suomynonaNative", {
  isElectron: true,
  platform: process.platform,
  openDetachedCli: (cliKey) => ipcRenderer.invoke("open-detached-cli", cliKey),
  closeDetachedCli: (cliKey) => ipcRenderer.invoke("close-detached-cli", cliKey),
  toggleAlwaysOnTop: () => ipcRenderer.invoke("toggle-always-on-top"),
  detectLocalEngines: () => ipcRenderer.invoke("detect-local-engines"),
});
