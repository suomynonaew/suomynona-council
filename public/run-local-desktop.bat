@echo off
title Suomynona Council - Native Desktop Multi-Window Launcher
color 0B

echo ============================================================================
echo   SUOMYNONA COUNCIL - NATIVE DESKTOP MULTI-WINDOW LAUNCHER
echo   - Native OS desktop windows: Drag any CLI to any monitor
echo   - Local GPU execution + Remote Colab, Kaggle, and RunPod orchestration
echo ============================================================================
echo.

cd /d "%~dp0"

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
  call npm install --legacy-peer-deps --no-audit --no-fund
)

if not exist "node_modules\electron" (
  echo [INFO] Installing Electron for desktop multi-window support...
  call npm install --save-dev electron --legacy-peer-deps --no-audit --no-fund
)

:: 3. Free port 3000 if occupied
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
  if not "%%a"=="0" (
    taskkill /F /PID %%a >nul 2>nul
  )
)

echo [OK] Launching Suomynona Council in native desktop mode...
call npx electron .

if errorlevel 1 (
  echo.
  echo [INFO] Desktop process closed.
)
pause
