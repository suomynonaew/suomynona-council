@echo off
title Suomynona Council - Build Windows Portable Executable (.exe)
color 0B

echo ============================================================================
echo   SUOMYNONA COUNCIL - PORTABLE WINDOWS .EXE BUILD SCRIPT
echo   - Native Desktop Multi-Monitor Multi-Window Engine
echo   - Local GPU (NVIDIA / Ollama / llama.cpp) + Remote (Colab / Kaggle)
echo   - Target: dist-native\Suomynona-Council-Portable.exe
echo ============================================================================
echo.

cd /d "%~dp0"

:: 1. Check Node.js
where node >nul 2>nul
if errorlevel 1 (
  color 0C
  echo [ERROR] Node.js is required to build the executable.
  echo         Please install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node -v 2^>nul') do set "NODE_VER=%%v"
for /f "delims=" %%v in ('npm -v 2^>nul') do set "NPM_VER=%%v"
echo [OK] Node.js %NODE_VER% and npm v%NPM_VER% detected.
echo.

:: 2. Ensure application dependencies are installed
if not exist "node_modules\express" (
  echo [STEP 1/4] Installing application dependencies...
  call npm install --legacy-peer-deps --no-audit --no-fund
  if errorlevel 1 goto :DEP_FAIL
)
goto :CHECK_ELECTRON

:DEP_FAIL
color 0C
echo [ERROR] Failed to install application dependencies.
pause
exit /b 1

:CHECK_ELECTRON
:: 3. Ensure electron and electron-builder are installed
echo [STEP 2/4] Checking Electron and electron-builder packaging toolchain...
if not exist "node_modules\electron" (
  echo [*] Installing electron and electron-builder...
  call npm install --save-dev electron electron-builder --legacy-peer-deps --no-audit --no-fund
  if errorlevel 1 goto :ELECTRON_FAIL
)
echo [OK] Electron packaging toolchain ready.
echo.
goto :BUILD_VITE

:ELECTRON_FAIL
color 0C
echo [ERROR] Failed to install electron packaging tools.
pause
exit /b 1

:BUILD_VITE
:: 4. Build Vite production bundle
echo [STEP 3/4] Building production frontend bundle...
call npm run build
if errorlevel 1 goto :BUILD_FAIL
echo [OK] Production frontend built into dist/
echo.
goto :RUN_BUILDER

:BUILD_FAIL
color 0C
echo [ERROR] Frontend build failed.
pause
exit /b 1

:RUN_BUILDER
:: 5. Run electron-builder to compile portable Windows .exe
echo [STEP 4/4] Packaging standalone portable .exe into dist-native\...
echo           Please wait 1-2 minutes while electron-builder packages the runtime...
echo.

if not exist "dist-native" mkdir "dist-native" >nul 2>nul
call npx electron-builder --win portable --config.directories.output=dist-native

if errorlevel 1 goto :PACK_FAIL
goto :PACK_SUCCESS

:PACK_FAIL
color 0C
echo.
echo ============================================================================
echo   [NOTICE] electron-builder encountered an issue creating the standalone .exe.
echo   You can still run the native desktop app directly anytime using:
echo   run-local-desktop.bat
echo ============================================================================
echo.
pause
exit /b 1

:PACK_SUCCESS
echo.
echo ============================================================================
echo   [SUCCESS] SUOMYNONA COUNCIL EXECUTABLE BUILT SUCCESSFULLY
echo ============================================================================
echo   Your standalone executable is located at:
echo   %CD%\dist-native\Suomynona-Council-Portable.exe
echo.
echo   Features included:
echo     - Free desktop window movement across multiple physical monitors
echo     - Local GPU acceleration (NVIDIA CUDA / Ollama / llama.cpp)
echo     - Remote Colab, Kaggle, Vast.ai, and RunPod multi-GPU bridges
echo ============================================================================
echo.

set "RUN_NOW=Y"
set /p "RUN_NOW=Would you like to launch Suomynona-Council-Portable.exe now? [Y/N] (default=Y): "
if /i "%RUN_NOW%"=="N" goto :DONE

if exist "dist-native\Suomynona-Council-Portable.exe" (
  start "" "dist-native\Suomynona-Council-Portable.exe"
  goto :DONE
)

for %%F in (dist-native\*.exe) do (
  start "" "%%F"
  goto :DONE
)

:DONE
echo Done.
pause
