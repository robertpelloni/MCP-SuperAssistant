# Universal Agent Instructions (For Claude, Gemini, GPT, Copilot, et al.)

**Project**: MCP SuperAssistant (Chrome Extension)
**Current Version**: v1.9.0
**Status**: Active Maintenance & Feature Development

## Core Directives

1.  **Deep Analysis First**: Before making any changes, re-analyze the project in extreme detail. Read all documentation (`MANUAL.md`, `ROADMAP.md`, `TODO.md`, `VISION.md`, `CHANGELOG.md`). Understand the *intent* behind every feature.
2.  **Autonomous Execution**: Proceed with execution autonomously once a plan is set. Do not ask for confirmation unless absolutely necessary.
3.  **Comprehensive Documentation**:
    - **Update Documentation**: Always update `MANUAL.md`, `TODO.md`, and `CHANGELOG.md` when adding features or fixing bugs.
    - **Code Comments**: Comment code in depth—explain *why* something is done, potential side effects, and alternatives considered.
    - **Vision Alignment**: Ensure all changes align with `VISION.md`.
4.  **Strict Versioning**:
    - **Single Source of Truth**: The `VERSION` file contains the current version string (e.g., `1.9.0`).
    - **Synchronization**: Ensure `package.json` (root & packages), `manifest.ts`, and `CHANGELOG.md` are always synchronized with `VERSION`.
    - **Commit Messages**: Reference the version bump in commit messages (e.g., `chore: bump version to v1.9.1`).
5.  **Git Hygiene**:
    - **Pull/Merge Often**: Regularly pull from `main` and merge upstream changes.
    - **Intelligent Merging**: Solve conflicts carefully to preserve *all* features. Never regress.
    - **Submodules**: Update submodules recursively and commit their pointers.
6.  **"Insanely Great" Quality**:
    - **UI/UX**: Every feature must have a comprehensive UI representation (labels, tooltips, descriptions). No "hidden" features.
    - **Robustness**: Handle errors gracefully. Use `toast` notifications for feedback.
    - **Testing**: Run relevant tests (`vitest`) before submitting.

## Project Structure

-   **`pages/content`**: The main extension logic (React + Zustand).
    -   `src/components/sidebar`: All UI components (Tabs, Sidebar, etc.).
    -   `src/services/memory`: Universal Memory system (Adapters, Parsers).
    -   `src/stores`: State management (Zustand).
    -   `src/core`: Core logic (`McpClient`).
-   **`chrome-extension`**: Manifest and background scripts.
-   **`packages`**: Shared utilities and configuration.
-   **`docs`**: Documentation center.

## Feature Implementation Guidelines

-   **Universal Memory**: The project now includes a "Memory" system. When adding new memory backends, implement the `MemoryAdapter` interface.
-   **Web Clipper**: Use `ContentParser` for robust extraction.
-   **MCP Integration**: All external tools (except specific hardcoded ones) should interact via the `McpClient`.

## Handoff Protocol

When finishing a session:
1.  Run `lint` and tests.
2.  Update `TODO.md` with completed items.
3.  Update `CHANGELOG.md` with a summary of changes.
4.  Commit and push to the remote repository.
5.  Leave a detailed note in `HANDOFF.md` for the next agent/model.

---
*Proceed with confidence. Build extraordinary software.*
