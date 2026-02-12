# Project Dashboard

**Version**: `0.7.0`
**Last Updated**: 2026-02-12
**Status**: Phase 3 Complete ✅

---

## Package Versions

| Package | Version | Location |
|---------|---------|----------|
| `mcp-superassistant` (root) | 0.7.0 | `package.json` |
| `chrome-extension` | 0.7.0 | `chrome-extension/package.json` |
| `@extension/content` | 0.7.0 | `pages/content/package.json` |

## Key Dependencies

| Dependency | Version |
|-----------|---------|
| React | 19.1.0 |
| Zustand | 5.0.5 |
| MCP SDK | 1.20.2 |
| Vite | 6.3.5 |
| TypeScript | 5.8.3 |
| Turbo | 2.5.4 |

## Directory Structure

```
mcp-superassistant/
├── chrome-extension/   # Manifest V3 config, background, popup
├── pages/
│   └── content/        # Main content script (sidebar, tools, MCP client)
│       └── src/
│           ├── components/sidebar/   # Tab components
│           ├── hooks/                # React hooks & stores
│           ├── stores/               # Zustand state management
│           ├── plugins/adapters/     # Per-platform adapters
│           ├── services/             # Business logic
│           ├── types/                # TypeScript interfaces
│           └── render_prescript/     # DOM rendering
├── packages/           # Shared libs (ui, shared, storage, env)
├── docs/               # Documentation
├── scripts/            # Build utilities
└── bash-scripts/       # Shell maintenance scripts
```

## Build Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Dev build (watch mode) |
| `pnpm build` | Production build → `dist/` |
| `pnpm build:firefox` | Firefox build |
| `pnpm zip` | Package as ZIP |
| `pnpm type-check` | TypeScript compilation check |
| `pnpm lint` | ESLint check |

## Documentation Index

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Universal LLM agent instructions |
| [CLAUDE.md](./CLAUDE.md) | Claude-specific addenda |
| [GEMINI.md](./GEMINI.md) | Gemini-specific addenda |
| [GPT.md](./GPT.md) | GPT-specific addenda |
| [VISION.md](./VISION.md) | Project philosophy & architecture |
| [ROADMAP.md](./ROADMAP.md) | Phased feature checklist |
| [MANUAL.md](./MANUAL.md) | User-facing setup & usage guide |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |
