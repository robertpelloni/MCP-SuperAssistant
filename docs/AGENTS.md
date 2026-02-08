# Universal Agent Instructions

**Project**: MCP SuperAssistant
**Goal**: Create the ultimate browser-based AI operating system via MCP.

## Core Directives for All Agents
1.  **Read the Vision**: Always consult `docs/VISION.md` before making architectural decisions.
2.  **Update Documentation**: Never commit code without updating the relevant documentation in `docs/` and `README.md`.
3.  **Versioning**:
    *   Read the current version from the `VERSION` file.
    *   If you make *any* change, increment the version (patch for fixes, minor for features).
    *   Update `CHANGELOG.md` with a new entry for the version.
    *   Run `pnpm run update-version` (to be implemented) to sync all package.json files.
4.  **Testing**: Always run `pnpm type-check` and `pnpm lint` before submitting.
5.  **Git Protocol**:
    *   Branch naming: `feature/description` or `fix/issue`.
    *   Commit messages: Conventional Commits (`feat: ...`, `fix: ...`).
    *   Always merge feature branches into `main`.

## Project Structure
*   `chrome-extension/`: Manifest and background scripts.
*   `pages/content/`: Main UI logic (React + Tailwind).
*   `packages/`: Shared libraries.
*   `docs/`: Single source of truth for documentation.
