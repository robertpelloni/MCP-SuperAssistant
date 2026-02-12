# Vision: The AI Operating System

**MCP SuperAssistant** is building toward a single, unified experience for interacting with *any* AI model, *any* tool, on *any* platform — directly from your browser.

---

## Core Philosophy

### 1. Universal Compatibility
One extension to rule them all. Whether you're using ChatGPT, Claude, Gemini, Perplexity, DeepSeek, or any other AI platform, MCP SuperAssistant provides the same powerful sidebar experience. The adapter architecture means adding new platforms is just a plugin — the core stays unchanged.

### 2. Privacy First
Everything runs locally. Tool execution happens through your local proxy server, connecting to your own MCP servers. No cloud relay, no data collection, no phoning home. Your conversations, your tools, your data — all staying on your machine.

### 3. Robustness Over Features
We'd rather have 10 features that work flawlessly than 100 that break. Every feature goes through our quality checklist: type safety, state persistence, error handling, and documentation.

### 4. Power-User Friendly
Keyboard shortcuts, trusted tool whitelists, automation pipelines, custom instructions — built for people who spend hours a day in AI interfaces and need efficiency at every turn.

### 5. Non-Intrusive
The sidebar complements the AI platform; it never replaces or blocks it. Minimize to a single icon. Expand when you need power. The AI conversation should always feel natural.

### 6. Observability
Every tool execution is logged, every error is surfaced, every state change is traceable. The Activity Log and Dashboard give you full visibility into what your tools are doing.

---

## Ultimate Goal

> **An Operating System for AI**: A universal layer that makes every AI model more capable, more connected, and more useful — while keeping users fully in control.

---

## Architecture Philosophy

```
┌──────────────────────────────────┐
│          AI Web Platform          │  
│    (ChatGPT, Claude, Gemini...)   │
├──────────────────────────────────┤
│   Content Script (Sidebar UI)     │ ← React, Zustand, Tailwind
│   Adapters (per-platform hooks)   │ ← Plugin architecture
├──────────────────────────────────┤
│   MCP Client (SSE/WebSocket)      │ ← Talks to proxy
├──────────────────────────────────┤
│   Local Proxy Server              │ ← Node.js, bridges MCP
├──────────────────────────────────┤
│   MCP Servers (filesystem, git…)  │ ← Your tools
└──────────────────────────────────┘
```

Each layer is independent. Adapters are swappable. The proxy is replaceable. MCP servers are composable. This modularity is what makes the "universal" vision achievable.
