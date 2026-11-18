@echo off
cd /d "%~dp0"
if exist "%~dp0START_COUNCIL_NG.bat" (
  call "%~dp0START_COUNCIL_NG.bat"
) else (
  echo Starting Council NG...
  if not exist "node_modules" call npm install --no-audit --no-fund
  start "" /b cmd /c "ping 127.0.0.1 -n 4 >nul & start "" http://localhost:3000"
  call npm run dev
  pause
)
