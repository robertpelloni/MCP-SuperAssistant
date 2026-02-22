# Universal Agent Instructions

This document serves as the MASTER instruction file for all AI agents (Claude, Gemini, GPT, Codex, etc.) working on the `mcp-superassistant` repository.

## Core Directives (ALL MODELS)

1.  **Deep Planning**: Before making changes, engage in "Deep Planning Mode". Ask clarifying questions until you have absolute certainty of the user's goals. Use `set_plan` to formalize the strategy.
2.  **Autonomous Execution**: Once the plan is approved, execute it autonomously. Do not ask for confirmation between steps unless a critical blocker arises or the scope changes significantly.
3.  **Comprehensive Implementation**: Implement features fully. Ensure UI representation is detailed (tooltips, labels, descriptions) and documentation is updated (`MANUAL.md`, `ROADMAP.md`).
4.  **No Regressions**: When merging or refactoring, ensure existing functionality is preserved. Use intelligent merging logic.
5.  **Documentation First**: Update documentation *as you go*, not just at the end. Keep `CHANGELOG.md` and `VERSION` in sync.

## Project Context

*   **Name**: MCP SuperAssistant
*   **Goal**: Bridge the Model Context Protocol (MCP) with web-based AI platforms (ChatGPT, Claude, etc.) via a Chrome Extension.
*   **Tech Stack**: React 19, TypeScript, Zustand, Vite, Turbo, pnpm.
*   **Key Features**: Sidebar UI, Tool Discovery, Agentic Mode (Macros), Context Management, Dashboard, Cloud Sync.

## Model-Specific Instructions

### Claude / Anthropic
*   **Strength**: UI/UX Polish, Documentation, Complex Logic.
*   **Task**: Focus on the "Insanely Great" experience. Ensure animations are smooth (Tailwind transitions), tooltips are helpful, and documentation (`MANUAL.md`) is user-friendly.
*   **Check**: Verify `MacroRunner` logic for edge cases in conditional branching.

### Gemini / Google
*   **Strength**: Performance, Large Refactors, Modern Standards.
*   **Task**: Focus on optimizations (`VirtualList` if needed), React 19 features, and ensuring the `McpClient` singleton is robust.
*   **Check**: Verify Context Menu integration efficiency and event propagation.

### GPT / OpenAI / Codex
*   **Strength**: Architectural Consistency, Type Safety, Code Generation.
*   **Task**: Enforce strict TypeScript types. Ensure `Zustand` stores are correctly typed and persist middleware is configured properly.
*   **Check**: Verify `AutomationService` security logic (whitelist enforcement).

## Coding Standards

1.  **State**: Use `useStores.ts` hooks. Wrap selectors in `useShallow`.
2.  **Styles**: Use `primary-*` Tailwind classes. Do NOT hardcode colors.
3.  **Services**: Use Singletons (`McpClient`, `AutomationService`).
4.  **Security**: No `eval()`. Use `crypto.randomUUID()`.

## Versioning Protocol
1.  Update `VERSION` file.
2.  Update `package.json` (root & chrome-extension).
3.  Update `CHANGELOG.md`.
4.  Commit: `Bump version to <version>`.
