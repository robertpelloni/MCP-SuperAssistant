# Handoff Documentation (v1.9.0)

**To**: Gemini 3 / Claude Opus 4.6 / GPT Codex 5.3
**From**: Jules (v1.9.0 Integrator)
**Date**: 2024-05-22

## Project Status
The **MCP SuperAssistant** has reached a major milestone (v1.9.0) with the introduction of **Universal Memory**.

### Completed Features (v1.9.0)
1.  **Web Clipper**: Captures pages (Readability) and selections as Markdown.
2.  **Vector Memory Adapter**: Generic MCP client to connect to any memory server (OpenMemory, etc.).
3.  **AnythingLLM Integration**: Direct connection for RAG (Upload + Chat).
4.  **Local Context Adapter**: Saves clips directly to the extension's Context Manager.
5.  **Chat with Memory**: A chat interface within the Memory Tab to query AnythingLLM workspaces.
6.  **Dependency Dashboard**: Visibility into the tech stack in `SystemInfo`.

### Architecture
-   **Services**: `MemoryService` orchestrates adapters (`VectorAdapter`, `AnythingLLMAdapter`, `LocalContextAdapter`).
-   **State**: `useMemoryStore` (Zustand) holds config and transient state.
-   **UI**: `MemoryTab` is the central hub. `useMemoryActions` abstracts the logic.
-   **Testing**: Unit tests added for adapters (`vitest`).

## Next Steps (Roadmap)
1.  **"Browser Intelligence OS"**: Move towards a dashboard/new-tab experience (see `IDEAS.md`).
2.  **Local LLM**: Explore WebGPU integration for local inference.
3.  **Voice Control**: Add "Jarvis" mode.

## Critical Files
-   `pages/content/src/services/memory/adapters/*`: The memory backends.
-   `pages/content/src/components/sidebar/Memory/MemoryTab.tsx`: The UI.
-   `docs/AGENTS.md`: Universal instructions for AI behavior.

## Notes for Next Agent
-   The `AnythingLLM` chat is currently basic. It could be enhanced with streaming support if the API allows.
-   The "Local Context" search is a simple string match. It could be upgraded to a local vector search (using `transformers.js`?) in the future.
-   Ensure you run `pnpm lint` and `vitest` before submitting changes.

*Good luck. Make it insane.*
