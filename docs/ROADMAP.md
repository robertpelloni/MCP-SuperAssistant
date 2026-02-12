# Roadmap

## Phase 1: Foundation ✅
- [x] MCP Client implementation
- [x] Chrome Extension scaffold (Manifest V3)
- [x] Sidebar UI with tab navigation
- [x] Tool discovery and display
- [x] Tool execution pipeline
- [x] Result insertion into chat
- [x] Proxy server for SSE/WebSocket bridging
- [x] Multi-platform adapters (ChatGPT, Claude, Gemini, Perplexity, DeepSeek, etc.)

## Phase 2: Power Features ✅
- [x] Auto-Submit: Automatically submit the AI's response button
- [x] Auto-Insert: Automatically insert tool results into the chat
- [x] Auto-Execute: Automatically execute tool calls detected in AI output
- [x] Multi-Profile: Save and switch between MCP server configurations
- [x] Push Mode: Real-time tool result streaming
- [x] Custom Instructions: Inject system-level instructions per conversation
- [x] Connection Health: Ping latency and server status monitoring
- [x] FunctionBlock Parser: Detect and parse tool calls from rendered HTML

## Phase 3: Polish & Documentation ✅
- [x] Activity Log with rich rendering (JSON, Markdown, Images)
- [x] Toast notification system
- [x] Analytics Dashboard (runs, success rate, most-used tool)
- [x] Dashboard version display & keyboard shortcuts reference
- [x] Global keyboard shortcuts (Alt+Shift+S, /, Ctrl+Arrow, Escape)
- [x] Auto-Execute trusted tools whitelist (Settings UI + store persistence)
- [x] Documentation overhaul (AGENTS.md, CLAUDE.md, GEMINI.md, GPT.md, VISION.md)
- [x] Version synchronization system (VERSION file as source of truth)
- [x] Settings data export/import
- [x] Favorites & sorting for tools

## Phase 4: Advanced (Planned)
- [ ] Test suite: Unit tests (Vitest), e2e tests (Playwright)
- [ ] Tool chaining: Compose multi-step tool pipelines
- [ ] Resource browser: Browse MCP server resources
- [ ] Prompt templates: Save and reuse common prompts
- [ ] Plugin marketplace: Community adapters and extensions
- [ ] Notification center: Aggregated error/success history
- [ ] Accessibility audit: WCAG 2.1 AA compliance
- [ ] i18n: Multi-language support
- [ ] Firefox extension: Full cross-browser support
