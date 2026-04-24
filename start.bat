@echo off
setlocal
title MCP Superassistant
cd /d "%~dp0"

echo [MCP Superassistant] Starting...
where npm >nul 2>nul
if errorlevel 1 (
    echo [MCP Superassistant] npm not found. Please install it.
    pause
    exit /b 1
)

npm run dev

if errorlevel 1 (
    echo [MCP Superassistant] Exited with error code %errorlevel%.
    pause
)
endlocal
