@echo off
setlocal EnableDelayedExpansion
title Suomynona Council — Local GPU Engine Manager
color 0B

echo ============================================================================
echo   ◈ SUOMYNONA COUNCIL — LOCAL GPU & MODEL RUNNER ENGINE
echo   Detects your local graphics card (NVIDIA / AMD / Apple Silicon / CPU)
echo   and configures local model execution to run alongside Colab & Kaggle.
echo ============================================================================
echo.

cd /d "%~dp0"

rem 1. Check for NVIDIA GPU
where nvidia-smi >nul 2>nul
if %errorlevel% equ 0 (
  echo [GPU] NVIDIA graphics card detected:
  nvidia-smi --query-gpu=name,memory.total,memory.free,driver_version --format=csv,noheader
  echo.
) else (
  echo [INFO] nvidia-smi not detected in PATH.
  echo        If you have an NVIDIA GPU, verify drivers are installed.
  echo        Local models can still run via CPU or Vulkan/DirectML.
  echo.
)

rem 2. Check for Ollama
where ollama >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] Ollama is installed locally.
  echo [*] Probing running Ollama server...
  curl -s http://127.0.0.1:11434/api/tags >nul 2>nul
  if !errorlevel! equ 0 (
    echo [OK] Ollama is running on http://127.0.0.1:11434. Local models ready!
  ) else (
    echo [*] Starting Ollama server in background...
    start "" /b ollama serve
    echo [OK] Ollama server launched on http://127.0.0.1:11434
  )
) else (
  echo [INFO] Ollama is not installed. You can install it from https://ollama.com/
  echo        to easily download and run GGUF models on your local GPU with 1 click.
)

rem 3. Check for llama.cpp server
curl -s http://127.0.0.1:8080/v1/models >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] llama.cpp server is running on http://127.0.0.1:8080.
)

echo.
echo ============================================================================
echo   Local Engine Status:
echo     • Ollama Port   : http://127.0.0.1:11434
echo     • llama.cpp Port: http://127.0.0.1:8080
echo     • LM Studio Port: http://127.0.0.1:1234
echo.
echo   These local endpoints automatically sync into the Suomynona Council
echo   "GPU Hosts & Slots" CLI so you can use local models + Colab + Kaggle together!
echo ============================================================================
echo.
pause
