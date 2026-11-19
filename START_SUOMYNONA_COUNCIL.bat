@echo off
setlocal EnableDelayedExpansion
title Suomynona Council — One-Click Windows Launcher (GitHub ZIP Edition)
color 0B

rem ============================================================================
rem   ◈ SUOMYNONA COUNCIL — ONE-CLICK WINDOWS LAUNCHER (START_SUOMYNONA_COUNCIL.bat)
rem   Just download the ZIP from GitHub, extract it anywhere, and double-click
rem   this file! It automatically checks Node.js, installs packages, creates
rem   your .env file, starts the server on port 3000, and opens your browser.
rem ============================================================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
cd /d "%~dp0"

rem 1. Handle nested GitHub ZIP folder if the user placed/ran this .bat one level up
if not exist "package.json" (
  for /d %%D in (*) do (
    if exist "%%D\package.json" (
      if exist "%%D\server.ts" (
        echo [INFO] Found Suomynona Council inside subfolder "%%D" — switching directory...
        cd /d "%~dp0%%D"
      )
    )
  )
)

echo ============================================================================
echo   ◈ SUOMYNONA COUNCIL — AUTOMATIC WINDOWS LAUNCHER
echo   Working Folder : %CD%
echo   Local App URL  : http://localhost:3000
echo ============================================================================
echo.

rem 2. Ensure standard Node.js install locations are in PATH for this session
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "PATH=%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%PATH%"
if exist "%LocalAppData%\Programs\nodejs\node.exe" set "PATH=%LocalAppData%\Programs\nodejs;%APPDATA%\npm;%PATH%"

rem 3. Check if Node.js is installed; if missing, auto-install via winget or open nodejs.org
where node >nul 2>nul
if %errorlevel% neq 0 (
  color 0E
  echo [!] Node.js was not detected on this computer.
  echo     Suomynona Council needs Node.js ^(LTS^) to run its local server and tools.
  echo.
  where winget >nul 2>nul
  if !errorlevel! equ 0 (
    echo [*] Attempting automatic Node.js LTS install via Windows Package Manager ^(winget^)...
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
    if exist "%LocalAppData%\Programs\nodejs\node.exe" set "PATH=%LocalAppData%\Programs\nodejs;%APPDATA%\npm;%PATH%"
  )
  where node >nul 2>nul
  if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [ERROR] Please install Node.js LTS from https://nodejs.org/ ^(takes 1 minute^),
    echo         then double-click START_SUOMYNONA_COUNCIL.bat again.
    start "" "https://nodejs.org/"
    echo.
    pause
    exit /b 1
  )
  color 0B
)

for /f "delims=" %%v in ('node -v 2^>nul') do set "NODE_VER=%%v"
for /f "delims=" %%v in ('npm -v 2^>nul') do set "NPM_VER=%%v"
echo [OK] Node.js %NODE_VER% and npm v%NPM_VER% detected.

rem 4. Verify package.json and server.ts exist
if not exist "package.json" (
  color 0C
  echo.
  echo [ERROR] Could not find package.json in %CD%
  echo         Make sure you EXTRACTED the entire GitHub ZIP file to a folder first
  echo         ^(do not double-click the .bat from inside an un-extracted .zip preview^).
  echo.
  pause
  exit /b 1
)

rem 5. Ensure .env configuration file and workspace directories exist
if not exist ".env" (
  if exist ".env.example" (
    echo [SETUP] Creating .env from .env.example...
    copy /y ".env.example" ".env" >nul
  ) else (
    echo [SETUP] Creating default .env configuration...
    (
      echo GEMINI_API_KEY=""
      echo OPENAI_API_KEY=""
      echo XAI_API_KEY=""
      echo OPENROUTER_API_KEY=""
      echo HF_TOKEN=""
      echo GH_TOKEN=""
      echo APP_URL="http://localhost:3000"
    ) > ".env"
  )
)

if not exist ".council_data" mkdir ".council_data" >nul 2>nul
if not exist "council_outputs" mkdir "council_outputs" >nul 2>nul
if not exist "council_builds" mkdir "council_builds" >nul 2>nul

rem 6. Automatically run npm install if node_modules or tsx is missing
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
if not exist "node_modules\.bin\tsx.cmd" set "NEED_INSTALL=1"
if not exist "node_modules\express" set "NEED_INSTALL=1"

if "%NEED_INSTALL%"=="1" (
  echo.
  echo ============================================================================
  echo   [STEP 1/2] Installing Suomynona Council packages ^(first-time setup after unzip^)...
  echo              Please wait 30-60 seconds while npm downloads dependencies.
  echo ============================================================================
  call npm install --no-audit --no-fund
  if !errorlevel! neq 0 (
    echo [WARN] Standard npm install reported a warning — retrying with --legacy-peer-deps...
    call npm install --legacy-peer-deps --no-audit --no-fund
  )
  if not exist "node_modules\express" (
    color 0C
    echo.
    echo [ERROR] npm install did not complete. Check your internet connection and try again.
    echo.
    pause
    exit /b 1
  )
  echo [OK] All dependencies installed successfully!
) else (
  echo [OK] Dependencies already installed in node_modules.
)

:LAUNCH_SERVER
echo.
echo ============================================================================
echo   [STEP 2/2] Starting Suomynona Council Server on http://localhost:3000 ...
echo   Your browser will open automatically in a few seconds!
echo   ^(Keep this window open while using Suomynona Council^)
echo ============================================================================
echo.

rem 7. If port 3000 is held by an old orphaned node.exe process, free it cleanly
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
  if not "%%a"=="0" (
    echo [INFO] Port 3000 is currently in use by PID %%a — freeing port for fresh start...
    taskkill /F /PID %%a >nul 2>nul
  )
)

rem 8. Open http://localhost:3000 automatically in the default browser once server boots
start "" /b cmd /c "ping 127.0.0.1 -n 4 >nul & start "" http://localhost:3000"

rem 9. Run the Suomynona Council server (tsx server.ts)
if exist "node_modules\.bin\tsx.cmd" (
  call "node_modules\.bin\tsx.cmd" server.ts
) else (
  call npm run dev
)

set "EXIT_CODE=%errorlevel%"
echo.
echo ============================================================================
echo   Suomynona Council Server stopped ^(Exit Code: %EXIT_CODE%^).
echo ============================================================================
echo   [R] Restart Suomynona Council Server
echo   [I] Re-install / Repair npm packages ^(npm install^)
echo   [D] Run Claude Code Guardian Self-Repair Doctor
echo   [Q] Quit and close window
echo ============================================================================
set /p "USER_CHOICE=Choose an option [R/I/D/Q] (default=R): "
if /i "%USER_CHOICE%"=="Q" goto :EOF
if /i "%USER_CHOICE%"=="I" (
  call npm install --legacy-peer-deps --no-audit --no-fund
  goto :LAUNCH_SERVER
)
if /i "%USER_CHOICE%"=="D" (
  call npx tsx guardian_claude_code.ts --repair
  goto :LAUNCH_SERVER
)
goto :LAUNCH_SERVER
