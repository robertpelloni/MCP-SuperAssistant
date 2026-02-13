# Project Dashboard

**Version**: `0.7.1`
**Last Updated**: 2026-02-12
**Status**: Phase 3 Complete ✅ | Build: Chrome ✅ Firefox ✅ Edge ✅

---

## Package Versions

| Package | Version | Location |
|---------|---------|----------|
| `mcp-superassistant` (root) | 0.7.1 | `package.json` |
| `chrome-extension` | 0.7.1 | `chrome-extension/package.json` |
| `@extension/content` | 0.7.1 | `pages/content/package.json` |

## Key Dependencies

| Dependency | Version |
|-----------|---------|
| React | 19.1.0 |
| Zustand | 5.0.5 |
| MCP SDK | 1.20.2 |
| Vite | 6.1.0 |
| TypeScript | 5.8.1-rc |
| Turbo | 2.4.2 |
| Firebase | 11.9.1 |
| Zod | 4.3.5 |

## Platform Adapters (16)

| Adapter | File |
|---------|------|
| ChatGPT | `chatgpt.adapter.ts` |
| Google Gemini | `gemini.adapter.ts` |
| Google AI Studio | `aistudio.adapter.ts` |
| Perplexity | `perplexity.adapter.ts` |
| Grok | `grok.adapter.ts` |
| DeepSeek | `deepseek.adapter.ts` |
| OpenRouter | `openrouter.adapter.ts` |
| T3 Chat | `t3chat.adapter.ts` |
| GitHub Copilot | `ghcopilot.adapter.ts` |
| Mistral AI | `mistral.adapter.ts` |
| Kimi | `kimi.adapter.ts` |
| Qwen Chat | `qwenchat.adapter.ts` |
| Z Chat | `z.adapter.ts` |
| Default (fallback) | `default.adapter.ts` |
| Base (abstract) | `base.adapter.ts` |
| Example Forum | `example-forum.adapter.ts` |

## Zustand Stores (10)

| Store | File | Purpose |
|-------|------|---------|
| UI | `ui.store.ts` | Sidebar visibility, theme, notifications |
| Connection | `connection.store.ts` | Server status, retry logic |
| Tool | `tool.store.ts` | Available tools, execution history |
| App | `app.store.ts` | Global app state |
| Config | `config.store.ts` | User preferences, feature flags |
| Activity | `activity.store.ts` | Activity log entries |
| Adapter | `adapter.store.ts` | Platform adapter management |
| Profile | `profile.store.ts` | Multi-profile server configs |
| Toast | `toast.store.ts` | Toast notification queue |
| Macro | `macro.store.ts` | *(in lib)* User-defined automation macros |

## Sidebar Components (14)

| Component | Path |
|-----------|------|
| Activity Log | `Activity/ActivityLog.tsx` |
| Available Tools | `AvailableTools/AvailableTools.tsx` |
| Command Palette | `CommandPalette/CommandPalette.tsx` |
| Context Manager | `ContextManager/ContextManager.tsx` |
| Dashboard | `Dashboard/Dashboard.tsx` |
| Help | `Help/Help.tsx` |
| Input Area | `InputArea/InputArea.tsx` |
| Instructions | `Instructions/InstructionManager.tsx` |
| Macro Builder | `Macros/MacroBuilder.tsx` |
| Macro List | `Macros/MacroList.tsx` |
| Onboarding | `Onboarding/Onboarding.tsx` |
| Server Status | `ServerStatus/ServerStatus.tsx` |
| Settings | `Settings/Settings.tsx` |
| System Info | `System/SystemInfo.tsx` |

## Internal Packages (12)

| Package | Path | Description |
|---------|------|-------------|
| `dev-utils` | `packages/dev-utils/` | Manifest parser, build helpers |
| `env` | `packages/env/` | Environment vars (IS_FIREFOX, IS_DEV) |
| `hmr` | `packages/hmr/` | Hot Module Replacement |
| `i18n` | `packages/i18n/` | Internationalization |
| `module-manager` | `packages/module-manager/` | Module lifecycle management |
| `shared` | `packages/shared/` | Logger, utilities |
| `storage` | `packages/storage/` | Chrome Storage wrappers |
| `tailwind-config` | `packages/tailwind-config/` | Shared Tailwind configuration |
| `tsconfig` | `packages/tsconfig/` | Shared TypeScript config |
| `ui` | `packages/ui/` | Shared UI components (shadcn) |
| `vite-config` | `packages/vite-config/` | Shared Vite configuration |
| `zipper` | `packages/zipper/` | ZIP packaging for distribution |

## Build Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Dev build (watch mode) |
| `pnpm build` | Production build → `dist/` (Chrome/Edge) |
| `pnpm build:firefox` | Firefox build → `dist/` |
| `pnpm zip` | Package Chrome build as ZIP |
| `pnpm zip:firefox` | Package Firefox build as ZIP |
| `pnpm type-check` | TypeScript compilation check |
| `pnpm lint` | ESLint check |

## Documentation Index

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Universal LLM agent instructions |
| [CLAUDE.md](./CLAUDE.md) | Claude/Opus-specific addenda |
| [GEMINI.md](./GEMINI.md) | Gemini-specific addenda |
| [GPT.md](./GPT.md) | GPT/Codex-specific addenda |
| [VISION.md](./VISION.md) | Project philosophy & architecture |
| [ROADMAP.md](./ROADMAP.md) | Phased feature checklist |
| [DEEP_ANALYSIS.md](./DEEP_ANALYSIS.md) | Technical architecture deep dive |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Monorepo structure & dependencies |
| [HANDOFF.md](./HANDOFF.md) | Agent handoff protocol |
| [MANUAL.md](./MANUAL.md) | User-facing setup & usage guide |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |
