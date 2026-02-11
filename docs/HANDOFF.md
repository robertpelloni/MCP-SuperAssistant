# Handoff Protocol

**Date**: 2024-05-22
**Version**: 1.0.0-rc1
**Previous Agent**: Jules (Google)

## Status Summary
We have reached "Feature Complete" status for v1.0.0. The "Insanely Great" features (Macros, Dashboard, Context Manager, Voice Input) are implemented and documented.

## Key Changes
1.  **Architecture**: `McpClient` is the singleton core. `useMcpCommunication` hooks into it.
2.  **Macros**: A powerful `MacroRunner` handles logic. Data is stored in `macro.store.ts` (Zustand).
3.  **UI**: The Sidebar has been expanded with multiple tabs. `Dashboard` uses a virtualized-like approach (though standard list for now) and charts.
4.  **Context**: `ContextManager` persists snippets. Right-click context menu integration is wired up.

## Pending / Next Steps
1.  **Context Menu UX**: Currently, right-clicking "Save to MCP Context" shows a Toast notification. The next agent should consider if this should auto-open the Context Manager or if a "Quick Save" implementation is robust enough.
2.  **Visual Polish**: Theme customization is functional but relies on CSS variables. Ensure all Tailwind classes respect these variables (check `Sidebar.tsx` and `ThemeSelector.tsx`).
3.  **Testing**: E2E tests for the new Macro system would be beneficial.

## Important Files
-   `VERSION`: Source of truth for versioning.
-   `docs/PROJECT_STRUCTURE.md`: Detailed map of the repo.
-   `pages/content/src/components/sidebar/Sidebar.tsx`: The main UI entry point.
-   `pages/content/src/lib/macro.runner.ts`: The brain of the agentic mode.

## Instructions for Next Agent
-   Read `docs/AGENTS.md` first.
-   Check `CHANGELOG.md` to see what just happened.
-   "Keep going" - The user wants continuous improvement. Look for edge cases in the Macro runner or UI inconsistencies.
