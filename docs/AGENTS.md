# Universal Agent Instructions

**Project**: MCP SuperAssistant (Chrome Extension)
**Current Version**: v1.9.0
**Status**: Active Maintenance & Feature Development

## Session Protocol

**Session Start**:
1.  Use your memory tools to recall context.
2.  Read all rule documentation (`AGENTS.md`, `VISION.md`, `ROADMAP.md`).
3.  Learn the repo structure.

**Session End**:
1.  Use your memory tools to record learnings.
2.  Update all rule documentation.
3.  Ensure `HANDOFF.md` is current for the next model.

## The 7-Step Development Protocol
Execute this protocol for every session/feature loop:
1.  Intelligently and selectively merge all feature branches into `main` (especially under `robertpelloni` forks), update submodules (`--recursive`), and merge upstream changes. Resolve conflicts carefully without losing progress.
2.  Reanalyze the project and history to identify missing features.
3.  Comprehensively update the roadmap (`ROADMAP.md`) and documentation (`TODO.md`, `MANUAL.md`) to reflect all progress.
4.  Update the submodule dashboard (in `SystemInfo.tsx`) to list all submodules, versions, and locations.
5.  Update the `CHANGELOG.md` and increment the version number in the `VERSION` file (the single source of truth), `package.json`, and `manifest.ts`.
6.  Commit and push all changes to the remote repository. Ensure the version bump is in the commit message.
7.  Redeploy the application (if applicable).

## Core Directives

1.  **Deep Analysis First**: Before making any changes, engage in a deep planning mode. Ask clarifying questions until you have absolute certainty of the goals. Test and verify every assumption.
2.  **Autonomous Execution**: Once a plan is approved, proceed autonomously. Do not stop. You may complete a feature, commit, push, and continue development without pausing.
3.  **Comprehensive UI & Polish**: Ensure *every single* implemented feature is very well represented in full detail in the UI with all possible functionality (labels, descriptions, tooltips). No hidden functionality.
4.  **Code Comments**: Comment your code in depth: what it's doing, *why* it's there, side effects, optimizations, alternate methods. Leave self-explanatory code bare.
5.  **Robustness**: Combine redundant functionality as much as possible to make the most complete, robust, useful project. Handle errors gracefully.
6.  **Type Safety**: Strictly avoid `any` types in favor of explicit types or `Record<string, unknown>`.
7.  **Tailwind Scoping**: Preflight base styles must be explicitly scoped to `:host` to prevent leaking out of the Shadow DOM into the host page.

## Documentation Structure
-   `AGENTS.md`: This file. Universal instructions. Model-specific files (`CLAUDE.md`, `GEMINI.md`, etc.) must reference this file and append their proprietary quirks.
-   `VISION.md`: Ultimate goal and design of the project.
-   `ROADMAP.md`: Major long-term structural plans.
-   `TODO.md`: Granular features, bug fixes, and short-term details.
-   `MANUAL.md` / `HELP.md`: User-facing documentation.
-   `DEPENDENCIES.md`: Audit of tech stack and submodules.
-   `IDEAS.md`: Creative list of potential refactors, pivots, and improvements.
-   `MEMORY.md`: Ongoing observations about the codebase and design preferences.
-   `DEPLOY.md`: Latest deployment instructions.
-   `HANDOFF.md`: Exhaustive session history and analysis for cross-model transitions.
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
