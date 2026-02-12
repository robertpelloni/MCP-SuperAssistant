# Universal Agent Instructions

This document serves as the master instruction file for all AI agents (Claude, Gemini, GPT, etc.) working on the `mcp-superassistant` repository.

## Core Directives

1.  **Deep Planning**: Before making changes, engage in "Deep Planning Mode". Ask clarifying questions until you have absolute certainty of the user's goals. Use `set_plan` to formalize the strategy.
2.  **Autonomous Execution**: Once the plan is approved, execute it autonomously. Do not ask for confirmation between steps unless a critical blocker arises or the scope changes significantly.
3.  **Comprehensive Implementation**: Implement features fully. Ensure UI representation is detailed (tooltips, labels, descriptions) and documentation is updated (`MANUAL.md`, `ROADMAP.md`).
4.  **No Regressions**: When merging or refactoring, ensure existing functionality is preserved. Use intelligent merging logic.
5.  **Documentation First**: Update documentation *as you go*, not just at the end. Keep `CHANGELOG.md` and `VERSION` in sync.

## Coding Standards & Patterns

### 1. State Management (Zustand)
*   **Accessing State in React**: Use `useStores.ts` or specific hooks like `useUIStore`. Always wrap selectors with `useShallow` to prevent render loops.
    ```typescript
    const { theme } = useUIStore(useShallow(state => ({ theme: state.theme })));
    ```
*   **Accessing State Outside React**: Import the store directly and use `getState()`.
    ```typescript
    import { useUIStore } from '@src/stores/ui.store';
    const prefs = useUIStore.getState().preferences;
    ```

### 2. Services & Singletons
*   Use the Singleton pattern for core services (`McpClient`, `AutomationService`) to ensure a single source of truth for connection state and logic.
*   Do not instantiate these classes inside components. Use the exported instance.

### 3. Theming
*   Use `text-primary-*`, `bg-primary-*` classes.
*   Do NOT use `indigo-*` or hardcoded colors unless strictly necessary for semantic meaning (e.g., Red for error).
*   Theming is handled dynamically via CSS variables injected in `Sidebar.tsx`.

### 4. Safety
*   **Macros**: Never use `eval()` or `new Function()` for user input. Use the safe expression parsers in `MacroRunner`.
*   **Communication**: Always handle `sendMessage` failures gracefully with try/catch and Toast notifications.

## Project Structure
*   `chrome-extension/`: Background scripts (Service Worker) and Manifest.
*   `pages/content/`: Main React App (Sidebar).
*   `docs/`: `MANUAL.md`, `ROADMAP.md`, `DEEP_ANALYSIS.md`.

## Versioning Protocol
1.  Update `VERSION` file.
2.  Update `package.json` (root) and `chrome-extension/package.json`.
3.  Update `CHANGELOG.md`.
4.  Commit: `Bump version to <version>`.
