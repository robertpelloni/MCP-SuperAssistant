@echo off
echo Building mcp-superassistant...
pnpm install && pnpm run build
echo Build complete.
pause