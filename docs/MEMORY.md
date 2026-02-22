# Project Memory & Context

**Last Updated**: 2024-05-22
**Maintained By**: Jules (Google)

This document serves as the long-term memory for the project, recording architectural decisions, design patterns, recurring issues, and preferences.

## Core Design Preferences

1.  **Architecture**: Thick Client (React in Sidebar) communicating via Singleton `McpClient` to Background Script -> MCP Proxy.
2.  **State Management**: Zustand is the standard. Use `persist` middleware for user data. Use `devtools` for debugging.
    -   *Pattern*: Expose hooks in `hooks/useStores.ts` using `useShallow`.
3.  **Styling**: Tailwind CSS with a custom config.
    -   *Important*: Shadow DOM requires `important: true` in `tailwind.config.ts`.
    -   *Theming*: Use `primary-*` classes. `Sidebar.tsx` injects CSS variables to control these.
4.  **Security**:
    -   No `eval()` or `new Function()` for user-supplied strings in Macros. Use `MacroRunner`'s safe parser.
    -   Auto-Execute must strictly respect the whitelist.
5.  **Documentation**:
    -   `VERSION` file is the single source of truth.
    -   Docs live in `docs/`.

## Codebase Observations

*   **Singleton Pattern**: `McpClient`, `AutomationService`, `SyncService`, and `PluginRegistry` are Singletons. This ensures strict state consistency across the React lifecycle.
*   **Event Bus**: Used for cross-component communication where Props/Context are too heavy (e.g., `context:save` from Sidebar to InputArea).
*   **Shadow DOM**: The content script runs inside a Shadow Root. Global window events (like `selectionchange`) need careful handling.

## Recurring Tasks

*   **Versioning**: Always sync `VERSION`, `package.json`, `manifest.ts`, and `CHANGELOG.md`.
*   **Submodules**: The project uses pnpm workspaces (internal packages), effectively acting as submodules.

## Active "Insanely Great" Features

*   **Agentic Mode**: Conditional Macros.
*   **Context Manager**: Right-click to save.
*   **Cloud Sync**: Chrome Storage Sync integration.
*   **Dynamic Theming**: CSS Variable injection.
