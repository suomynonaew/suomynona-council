@echo off
title Suomynona Council - Build Windows Portable Executable (.exe)
color 0B

echo ============================================================================
echo   SUOMYNONA COUNCIL - PORTABLE WINDOWS .EXE BUILD SCRIPT
echo   - Standalone Native Desktop App (Embedded Server + Multi-Window Engine)
echo   - Local GPU (NVIDIA / Ollama / llama.cpp) + Remote (Colab / Kaggle)
echo   - Targets:
echo       dist-native\Suomynona-Council-Portable.exe
echo       dist-native\win-unpacked\Suomynona Council.exe
echo ============================================================================
echo.

cd /d "%~dp0"
set "ELECTRON_RUN_AS_NODE="

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
  call npm install --no-audit --no-fund
  if errorlevel 1 call npm install --legacy-peer-deps --no-audit --no-fund
  if not exist "node_modules\express" goto :DEP_FAIL
)
goto :CHECK_ELECTRON

:DEP_FAIL
color 0C
echo [ERROR] Failed to install application dependencies.
pause
exit /b 1

:CHECK_ELECTRON
:: 3. Ensure electron and electron-builder are installed and Electron binary exists
echo [STEP 2/4] Checking Electron and electron-builder packaging toolchain...
if not exist "node_modules\electron" (
  echo [*] Installing electron and electron-builder...
  call npm install --save-dev electron electron-builder --no-audit --no-fund
  if errorlevel 1 goto :ELECTRON_FAIL
)
if not exist "node_modules\electron-builder" (
  echo [*] Installing electron-builder...
  call npm install --save-dev electron-builder --no-audit --no-fund
  if errorlevel 1 goto :ELECTRON_FAIL
)
if not exist "node_modules\electron\dist\electron.exe" (
  echo [*] Completing Electron Windows binary download...
  call node node_modules\electron\install.js
  if errorlevel 1 goto :ELECTRON_FAIL
)
echo [OK] Electron packaging toolchain ready.
echo.
goto :BUILD_DESKTOP

:ELECTRON_FAIL
color 0C
echo [ERROR] Failed to install electron packaging tools.
pause
exit /b 1

:BUILD_DESKTOP
:: 4. Build Vite production bundle + standalone desktop server bundle
echo [STEP 3/4] Building production frontend and standalone backend bundle...
call npm run build:desktop
if errorlevel 1 goto :BUILD_FAIL
echo [OK] Production desktop bundles built into dist/ and dist-server/.
echo.
goto :RUN_BUILDER

:BUILD_FAIL
color 0C
echo [ERROR] Desktop build failed.
pause
exit /b 1

:RUN_BUILDER
:: 5. Run electron-builder to compile portable + unpacked Windows .exe
echo [STEP 4/4] Packaging standalone Windows .exe targets into dist-native\...
echo           Please wait 1-2 minutes while electron-builder packages the runtime...
echo.

if not exist "dist-native" mkdir "dist-native" >nul 2>nul
set "CSC_IDENTITY_AUTO_DISCOVERY=false"
call npx electron-builder --win portable dir

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
echo   Portable .exe : %CD%\dist-native\Suomynona-Council-Portable.exe
echo   Fast Unpacked : %CD%\dist-native\win-unpacked\Suomynona Council.exe
echo   Quick Launcher: %CD%\LAUNCH_SUOMYNONA_DESKTOP.bat
echo ============================================================================
echo.

set "RUN_NOW=Y"
set /p "RUN_NOW=Would you like to launch Suomynona Council Desktop now? [Y/N] (default=Y): "
if /i "%RUN_NOW%"=="N" goto :DONE

if exist "dist-native\win-unpacked\Suomynona Council.exe" (
  start "" "dist-native\win-unpacked\Suomynona Council.exe"
  goto :DONE
)

if exist "dist-native\Suomynona-Council-Portable.exe" (
  start "" "dist-native\Suomynona-Council-Portable.exe"
  goto :DONE
)

:DONE
echo Done.
pause
