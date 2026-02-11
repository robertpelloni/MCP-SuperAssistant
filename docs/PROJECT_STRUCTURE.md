# Project Structure & Dependencies

This document provides a detailed overview of the `mcp-superassistant` monorepo structure, its submodules (packages), and their relationships.

## Directory Layout

The project is structured as a monorepo managed by `turbo` and `pnpm`.

```
mcp-superassistant/
├── chrome-extension/       # The core Chrome Extension logic (manifest, background, build config)
│   ├── src/
│   │   ├── background/     # Service worker logic (connection management, context menus)
│   │   └── mcpclient/      # MCP protocol implementation (backwards compatibility layer)
│   └── manifest.ts         # Extension manifest source
│
├── pages/
│   └── content/            # The main UI injected into web pages (Sidebar, React App)
│       └── src/
│           ├── components/ # React components (Sidebar, Dashboard, Macros, etc.)
│           ├── hooks/      # Custom React hooks (useMcpCommunication, etc.)
│           ├── lib/        # Core logic (MacroRunner, Stores)
│           └── stores/     # Zustand state stores
│
├── packages/               # Shared internal packages (workspaces)
│   ├── dev-utils/          # Development utilities
│   ├── env/                # Environment configuration
│   ├── hmr/                # Hot Module Replacement logic
│   ├── shared/             # Shared libraries (Logger, Utils)
│   ├── storage/            # Chrome Storage wrappers
│   ├── tsconfig/           # Shared TypeScript configuration
│   └── vite-config/        # Shared Vite configuration
│
├── docs/                   # Project documentation (Roadmap, Manual, Vision)
└── bash-scripts/           # Automation scripts
```

## Submodules / Workspaces

The project uses pnpm workspaces. These are not git submodules but internal packages.

| Package | Path | Version | Description |
| :--- | :--- | :--- | :--- |
| `chrome-extension` | `chrome-extension/` | 1.0.0-rc1 | The build entry point for the extension. |
| `content` | `pages/content/` | 1.0.0-rc1 | The frontend UI (Sidebar) injected into pages. |
| `@extension/shared` | `packages/shared/` | workspace:* | Shared utilities and logger. |
| `@extension/storage` | `packages/storage/` | workspace:* | Type-safe wrappers for `chrome.storage`. |
| `@extension/env` | `packages/env/` | workspace:* | Environment variable handling. |

## Build System

-   **Build Tool**: Vite (v6.1.0)
-   **Monorepo Manager**: Turbo (v2.4.2)
-   **Package Manager**: pnpm (v9.15.1)

## Versioning

The single source of truth for the project version is the `VERSION` file in the root directory.
Currently: `1.0.0-rc1`

When updating the version:
1.  Update `VERSION`.
2.  Run `pnpm update-version` (or manually update `package.json` and `chrome-extension/package.json`).
3.  Update `CHANGELOG.md`.
