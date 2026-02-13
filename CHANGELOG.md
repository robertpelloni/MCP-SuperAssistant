# Changelog

All notable changes to this project will be documented in this file.

## [0.7.1] - 2026-02-12

### Changed
- Placeholder for changes in version 0.7.1.

## [0.7.0] - 2026-02-12

### Added
- **Dashboard Version Display**: The Dashboard tab now shows the current version badge prominently.
- **Keyboard Shortcuts Reference**: The Dashboard includes a quick-reference card for all keyboard shortcuts.

### Fixed
- **Trusted Tools Whitelist**: The Safety & Whitelist UI in Settings now persists trusted tools to the store instead of using ephemeral local state. The "Add" button is now fully functional.
- **`trustedTools` Type**: Added `trustedTools?: string[]` to the `UserPreferences` interface, resolving previously silent type errors.
- **Keyboard Shortcuts Hook**: Removed broken `useSidebarState` import and unused `useToastStore` reference from `useKeyboardShortcuts.ts`.
- **Merge Conflict Markers**: Resolved leftover `<<<<<<<`/`>>>>>>>` conflict markers in `chrome-extension/package.json`.
- **Version Sync**: Synchronized all version references (VERSION, package.json, DASHBOARD.md, Settings export) to 0.7.0.
- **Version Script**: `update_version.sh` now writes to the `VERSION` file in addition to updating package.json files.

### Changed
- **Documentation Overhaul**: Rewrote `AGENTS.md` as comprehensive universal LLM instructions. Created `GEMINI.md` and `GPT.md`. Expanded `VISION.md`, `ROADMAP.md`, and `DASHBOARD.md`.

## [0.6.0] - 2024-05-22

### Added
- **Analytics Dashboard**: New sidebar tab showing high-level usage stats (Total Runs, Success Rate, Most Used Tool).
- **Rich Renderer**: Visualizes tool outputs in Activity Logs (JSON tree, Markdown, Images).
- **Keyboard Shortcuts**: Global shortcuts for power users (`Alt+Shift+S` toggle sidebar, `/` search, etc.).
- **Auto-Execute Whitelist**: Safe mode for automation, allowing only trusted tools to run automatically.

## [0.5.9] - 2024-05-22

### Added
- **Activity Log**: Comprehensive logging system with UI.
- **Notifications**: Toast notification system.
- **Settings**: Enhanced UI with sliders and grouping.
- **Documentation**: New `VISION.md`, `ROADMAP.md`, and agent instruction files.

### Changed
- **Server Status**: Added ping latency test.
- **Tools**: Added favorites and sorting.
