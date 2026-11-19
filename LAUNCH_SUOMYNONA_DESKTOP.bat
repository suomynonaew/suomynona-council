@echo off
cd /d "%~dp0"
set "ELECTRON_RUN_AS_NODE="
if exist "%~dp0dist-native\win-unpacked\Suomynona Council.exe" (
  start "" "%~dp0dist-native\win-unpacked\Suomynona Council.exe"
  exit /b 0
)
if exist "%~dp0dist-native\Suomynona-Council-Portable.exe" (
  start "" "%~dp0dist-native\Suomynona-Council-Portable.exe"
  exit /b 0
)
call "%~dp0run-local-desktop.bat"
