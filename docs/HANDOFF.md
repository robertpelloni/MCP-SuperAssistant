# Handoff Protocol

**Date**: 2026-02-12
**Version**: 0.7.1
**Status**: Build clean (Chrome ✅ Firefox ✅ Edge ✅)

## Status Summary

The project is in a stable, buildable state at v0.7.1. All merge conflicts from feature branch integration have been resolved, build errors fixed, and documentation refreshed. Chrome, Firefox, and Edge extension builds pass 12/12 tasks.

## Recent Accomplishments (v0.7.1)

1.  **Build Error Resolution**: Fixed CRLF bash scripts, duplicate variable declaration, JSX escape error, and missing UI components.
2.  **Missing UI Components**: Created `Input.tsx`, `Textarea.tsx`, `Select.tsx` in the sidebar UI barrel for ContextManager and MacroBuilder.
3.  **Missing Icon**: Generated `icon-16.png` (16×16) from icon-128 for manifest compliance.
4.  **Documentation Refresh**: Updated all 11 docs files to reflect accurate v0.7.1 state.
5.  **Firefox/Edge Support**: Verified Firefox build (ManifestParser converts service_worker → scripts) and Edge (loads Chrome dist directly).

## Current Feature Inventory

- **16 platform adapters**: ChatGPT, Gemini, AI Studio, Perplexity, Grok, DeepSeek, OpenRouter, T3 Chat, GitHub Copilot, Mistral, Kimi, Qwen, Z Chat + base/default/example
- **14 sidebar components**: Dashboard, Tools, Activity, Settings, Help, Instructions, Macros, Context Manager, Command Palette, Server Status, Onboarding, System Info, Input Area
- **10 Zustand stores**: ui, connection, tool, app, config, activity, adapter, profile, toast + macro/context in lib
- **3 transport protocols**: SSE, WebSocket, Streamable HTTP
- **3 browser targets**: Chrome, Firefox, Edge

## Next Steps (Phase 4 Priorities)

1.  **Test Suite**: Add Vitest unit tests for stores and services; Playwright for e2e.
2.  **Tool Chaining**: Visual multi-step tool pipeline composer.
3.  **Resource Browser**: Browse and inspect MCP server resources.
4.  **Cloud Sync**: Sync macros and context across devices.
5.  **Multi-Proxy**: Connect to multiple MCP servers simultaneously.

## Critical Files for Next Agent

-   `docs/AGENTS.md`: Universal instructions — read first.
-   `docs/DEEP_ANALYSIS.md`: Technical architecture deep dive.
-   `docs/DASHBOARD.md`: Full inventory (adapters, stores, components, packages).
-   `pages/content/src/stores/`: All Zustand state management.
-   `pages/content/src/plugins/adapters/`: Per-platform adapter implementations.
-   `packages/dev-utils/lib/manifest-parser/impl.ts`: Firefox manifest transform.

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Chrome/Edge production build → dist/
pnpm build:firefox    # Firefox production build → dist/
pnpm dev              # Development watch mode
```
