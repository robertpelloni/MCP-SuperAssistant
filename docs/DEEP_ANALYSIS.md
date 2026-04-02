# Deep Technical Analysis & Architecture Overview

**Version**: 1.1.0
**Date**: 2024-05-22

This document provides a comprehensive technical analysis of the `mcp-superassistant` codebase, intended for advanced AI models and senior developers. It covers architectural patterns, state management, data flow, and specific feature implementations.

## 1. Architecture Overview

The project is a **Chrome Extension** built with a **React** frontend (injected via Content Script) and a background service worker. It follows a "Thick Client" architecture where most logic resides in the React app (Sidebar), communicating with a local MCP Proxy via the background script.

### Key Components

*   **`chrome-extension/`**: The shell.
    *   **Background Script (`background/index.ts`)**: Acts as the bridge between the Content Script and the MCP Proxy (SSE/WebSocket). It handles connection management, heartbeats, and Context Menu events.
    *   **Manifest (`manifest.ts`)**: Defines permissions (`storage`, `clipboardWrite`, `contextMenus`) and host matches.
*   **`pages/content/`**: The core application.
    *   **`Sidebar.tsx`**: The main React entry point. It manages visibility, theming, and routing (tabs).
    *   **`McpClient` (`core/mcp-client.ts`)**: A **Singleton** class managing the protocol layer. It handles JSON-RPC communication, error recovery, and tool discovery.
    *   **`AutomationService` (`services/automation.service.ts`)**: A **Singleton** service managing auto-execution logic and whitelisting.

## 2. State Management (Zustand)

We use **Zustand** with `persist` middleware for state management. This ensures state survives page reloads.

*   **`ui.store.ts`**: UI state (Sidebar visibility, Theme, Notifications).
    *   *Critical Pattern*: Use `useUIStore.getState()` for non-React access (e.g., in Services).
*   **`connection.store.ts`**: Connection status (Connected, Error, Retry logic).
*   **`tool.store.ts`**: Available tools and execution history.
*   **`macro.store.ts`**: User-defined automation macros (Steps, Logic).
*   **`context.store.ts`**: User-saved text snippets.

**Hook Pattern**: We use `useShallow` in `hooks/useStores.ts` to prevent unnecessary re-renders. Always prefer using these composed hooks in components.

## 3. Feature Deep Dives

### A. Agentic Mode (Macros)
*   **Location**: `lib/macro.runner.ts`, `components/sidebar/Macros/`
*   **Logic**: The `MacroRunner` executes a list of steps.
    *   **`tool`**: Calls `mcpClient.callTool`.
    *   **`condition`**: Evaluates simple JS expressions (safe parsing, no `eval`). Supports branching (`goto`, `stop`).
    *   **`set_variable`**: Stores data in a local `env` object for use in subsequent steps (`{{env.varName}}`).
*   **Safety**: Max step limit (1000) prevents infinite loops.

### B. Dynamic Theming
*   **Location**: `tailwind.config.ts`, `Sidebar.tsx`
*   **Mechanism**: Tailwind maps `primary-*` colors to CSS variables (e.g., `--color-primary-500`). `Sidebar.tsx` injects these variables into the root element's `style` attribute based on the user's selection in `Settings.tsx`.
*   **Palette**: Indigo (default), Blue, Green, Purple, Red, Orange.

### C. Context Integration
*   **Flow**:
    1.  User selects text -> Right Click -> "Save to MCP Context".
    2.  Background script catches event -> Broadcasts `mcp:save-context`.
    3.  `Sidebar` (via EventBus) listens and notifies user.
    4.  `InputArea` listens and opens `ContextManager` with pre-filled text.
*   **Storage**: `context.store.ts` persists items to `localStorage`.

### D. Auto-Execute Whitelist
*   **Location**: `services/automation.service.ts`
*   **Logic**:
    *   Checks `autoExecuteDelay` to determine if feature is globally active.
    *   Checks `autoExecuteWhitelist` array.
    *   **Rule**: If whitelist has items, *only* allowed tools run. If whitelist is empty, *no* tools auto-execute (Safe by default).

## 4. Communication Bridge

The `ContextBridge` pattern abstracts `chrome.runtime.sendMessage`.

*   **Content Script**: Sends `mcp:command` messages.
*   **Background**: Processes command -> calls MCP Proxy -> returns response.
*   **Events**: Background broadcasts events (e.g., `connection:status-changed`) which `McpClient` listens for and updates stores.

## 5. Known Limitations & Future Work

1.  **Tailwind Shadow DOM**: We use a custom Tailwind config. Ensure `important: true` is maintained to override host page styles.
2.  **CSP Compatibility**: The `MacroRunner` avoids `new Function` where possible, but complex logic might still trigger strict CSPs on some sites. Monitor this.
3.  **Performance**: `ActivityLog` currently renders all items. For lists >1000 items, verify if `VirtualList` is needed (it was removed for simplicity in v0.8.0 but might be needed later).

## 6. Testing Protocol

*   **Unit**: Test Stores and Services (logic).
*   **Integration**: Test `McpClient` -> Background communication.
*   **E2E**: Playwright scripts (in `e2e/`) should verify the Sidebar interaction flows.
