@echo off
title Claude Code Guardian — Isolated Council NG Self-Repair & Builder Terminal
cd /d "%~dp0"

echo ============================================================================
echo   CLAUDE CODE GUARDIAN — STANDALONE ISOLATED TERMINAL FOR COUNCIL NG
echo   Target Council NG Workspace: %~dp0
echo   Self-Protection Lock: ACTIVE (guardian_claude_code.ts + claude_guardian.bat)
echo ============================================================================
echo.

rem 1. Protect Guardian files as Read-Only at OS level so nothing can corrupt them
attrib +R "%~dp0claude_guardian.bat" >nul 2>nul
if exist "%~dp0guardian_claude_code.ts" attrib +R "%~dp0guardian_claude_code.ts" >nul 2>nul

rem 2. If native Claude Code CLI (@anthropic-ai/claude-code) is installed, attach it
rem    directly to the Council NG workspace with self-protection rules injected:
where claude >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] Native Claude Code CLI detected! Attaching to Council NG workspace...
  echo [LOCK] Self-protection active: claude_guardian.bat and guardian_claude_code.ts are locked.
  claude --append-system-prompt "You are attached to Council NG in %~dp0. You may inspect, self-repair, tweak, and add features to any Council NG file (council_gui.py, council_ng/server.py, server.ts, index.html, public/app.js, public/styles.css), but NEVER modify or delete claude_guardian.bat or guardian_claude_code.ts. Always syntax-check files after editing."
  goto :eof
)

rem 3. Otherwise launch the built-in Council NG Guardian interactive repair shell:
echo [INFO] Launching built-in Isolated Guardian Repair & Coding Shell...
npx tsx guardian_claude_code.ts --cli
pause
