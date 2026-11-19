@echo off
title Suomynona Council - Native Desktop Multi-Window Launcher
color 0B

echo ============================================================================
echo   SUOMYNONA COUNCIL - NATIVE DESKTOP MULTI-WINDOW LAUNCHER
echo   - Standalone Native Windows Desktop App (Zero Browser Tabs)
echo   - Native OS desktop windows: Drag any CLI to any monitor
echo   - Local GPU execution + Remote Colab, Kaggle, and RunPod orchestration
echo ============================================================================
echo.

cd /d "%~dp0"
set "ELECTRON_RUN_AS_NODE="

:: 1. Check Node.js
where node >nul 2>nul
if errorlevel 1 (
  color 0C
  echo [ERROR] Node.js is required. Install from https://nodejs.org/
  pause
  exit /b 1
)

:: 2. Install dependencies if missing
if not exist "node_modules\express" (
  echo [INFO] Installing required dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 call npm install --legacy-peer-deps --no-audit --no-fund
)

if not exist "node_modules\electron" (
  echo [INFO] Installing Electron for desktop multi-window support...
  call npm install --save-dev electron --no-audit --no-fund
)

if not exist "node_modules\electron\dist\electron.exe" (
  echo [INFO] Downloading Electron Windows binary...
  call node node_modules\electron\install.js
)

:: 3. Build frontend + standalone desktop server bundle if missing
set "NEED_BUILD=0"
if not exist "dist\index.html" set "NEED_BUILD=1"
if not exist "dist-server\server.cjs" set "NEED_BUILD=1"
if "%NEED_BUILD%"=="1" (
  echo [INFO] Building desktop frontend and standalone server bundle...
  call npm run build:desktop
  if errorlevel 1 (
    color 0C
    echo [ERROR] Desktop build failed.
    pause
    exit /b 1
  )
)

echo [OK] Launching Suomynona Council in native desktop mode...
start "" "%~dp0node_modules\electron\dist\electron.exe" "%~dp0."
exit /b 0
