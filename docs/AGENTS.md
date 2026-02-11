# Universal Agent Instructions

This document serves as the master instruction file for all AI agents (Claude, Gemini, GPT, etc.) working on the `mcp-superassistant` repository.

## Core Directives

1.  **Deep Planning**: Before making changes, engage in "Deep Planning Mode". Ask clarifying questions until you have absolute certainty of the user's goals. Use `set_plan` to formalize the strategy.
2.  **Autonomous Execution**: Once the plan is approved, execute it autonomously. Do not ask for confirmation between steps unless a critical blocker arises or the scope changes significantly.
3.  **Comprehensive Implementation**: Implement features fully. Ensure UI representation is detailed (tooltips, labels, descriptions) and documentation is updated (`MANUAL.md`, `ROADMAP.md`).
4.  **No Regressions**: When merging or refactoring, ensure existing functionality is preserved. Use intelligent merging logic.
5.  **Documentation First**: Update documentation *as you go*, not just at the end. Keep `CHANGELOG.md` and `VERSION` in sync.

## Project Context

*   **Name**: MCP SuperAssistant
*   **Goal**: Bridge the Model Context Protocol (MCP) with web-based AI platforms (ChatGPT, Claude, etc.) via a Chrome Extension.
*   **Tech Stack**: React 19, TypeScript, Zustand, Vite, Turbo, pnpm.
*   **Key Features**: Sidebar UI, Tool Discovery, Agentic Mode (Macros), Context Management, Dashboard.

## Workflow Protocols

### 1. Versioning
*   **Source of Truth**: The `VERSION` file in the root directory.
*   **Update Process**:
    1.  Bump version in `VERSION`.
    2.  Update `package.json` and `chrome-extension/package.json`.
    3.  Update `CHANGELOG.md` with a new entry.
    4.  Commit with message: `Bump version to <new_version>`.

### 2. Feature Implementation
*   **UI**: Ensure every backend feature has a corresponding frontend representation. "Hidden" features are considered incomplete.
*   **Robustness**: Add error handling, retry logic (already implemented in `useMcpCommunication`), and user feedback (Toasts).
*   **Macros**: When touching macro logic, ensure safety. Do not use `eval()`. Use the `MacroRunner`'s safe expression evaluator.

### 3. Commit Standards
*   Use descriptive commit messages.
*   Merge feature branches into `main` intelligently.
*   Push regularly.

## Model-Specific Notes

### Claude / Anthropic
*   Focus on generating "Insanely Great" UI polish and detailed documentation.
*   Double-check `MacroRunner` logic for edge cases.

### Gemini / Google
*   Focus on performance optimizations (VirtualList was a good attempt, re-evaluate if needed for large logs).
*   Ensure Context Menu integration is seamless.

### GPT / OpenAI
*   Focus on architectural consistency (e.g., ensuring `McpClient` singleton usage).
*   Review TypeScript types for strictness.

## Directory Map
*   `docs/`: All documentation.
*   `pages/content/`: The main React application (Sidebar).
*   `chrome-extension/`: Background scripts and manifest.
*   `packages/`: Shared internal libraries.
