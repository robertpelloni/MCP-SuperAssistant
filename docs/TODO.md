# Granular TODO List

**Status**: Active Maintenance (v1.9.0)

This file tracks granular tasks, bugs, and polish items that are too small for the high-level ROADMAP.

## Memory & Integration (v1.9.0)
- [x] **Web Clipper**: Implement Obsidian-like clipper (Readability + Markdown).
- [x] **Vector Memory**: Implement generic MCP client for memory storage/search.
- [x] **AnythingLLM**: Implement direct integration for uploading content.
- [x] **Global Memory Search**: Command Palette (`Cmd+K`) integration via `?` prefix.
- [x] **Omni-Memory Engine**: Concurrent saving to multiple backends (ByteRover inspired).

## Immediate Polish
- [x] **Console Cleanup**: Remove debug `console.log` statements in production builds (verify `logger` config).
- [ ] **Type Safety**: Audit `any` types in `McpClient` and ensure generic types are used where possible.
- [ ] **E2E Testing**: Add Playwright tests for the new `MacroBuilder` flow.

## UX Improvements
- [x] **Context Manager**: Add ability to "Pin" contexts to the top of the list.
- [x] **Macro Builder**: Add "Test Step" button to run a single step during creation.
- [x] **System Info**: Add a dynamic "Reload Extension" button for developers.

## Future Features (Phase 5)
- [x] **Multi-Modal Support**: Add image drag-and-drop to Input Area (handled by MCP `image` resource).
- [x] **Cloud Sync Conflict Resolution**: Add UI to resolve conflicts (currently "Last Write Wins").
- [ ] **Community Registry**: Implement the backend for sharing macros via URL (currently imports JSON from any URL).

## Bugs / Technical Debt
- [ ] **Tailwind**: Verify if `preflight` styles are leaking out of Shadow DOM (should be scoped).
- [x] **Memory**: Monitor `ActivityLog` performance with >1000 items. Re-implement `VirtualList` if needed.
