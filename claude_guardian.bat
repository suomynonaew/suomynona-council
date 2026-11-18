@echo off
title Claude Code Guardian — Isolated Council NG Self-Repair & Builder Terminal
cd /d "%~dp0"
if exist "..\guardian_claude_code.ts" if not exist "guardian_claude_code.ts" cd /d "%~dp0.."

echo ============================================================================
echo   CLAUDE CODE GUARDIAN — STANDALONE ISOLATED TERMINAL FOR COUNCIL NG
echo   Target Council NG Workspace: %CD%
echo   Self-Protection Lock: ACTIVE (guardian_claude_code.ts + claude_guardian.bat)
echo ============================================================================
echo.

attrib +R "%~dp0claude_guardian.bat" >nul 2>nul
if exist "guardian_claude_code.ts" attrib +R "guardian_claude_code.ts" >nul 2>nul

if not exist "node_modules" (
  echo [SETUP] Installing dependencies first...
  call npm install --no-audit --no-fund
)

where claude >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] Native Claude Code CLI detected! Attaching to Council NG workspace...
  claude --append-system-prompt "You are attached to Council NG in %CD%. You may inspect, self-repair, tweak, and add features to any Council NG file (server.ts, index.html, public/app.js, public/styles.css), but NEVER modify or delete claude_guardian.bat or guardian_claude_code.ts. Always syntax-check files after editing."
  goto :eof
)

echo [INFO] Launching built-in Isolated Guardian Repair & Coding Shell...
call npx tsx guardian_claude_code.ts --cli
pause
