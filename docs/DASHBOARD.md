# Project Dashboard

**Current Version**: 0.6.0
**Build Date**: 2024-05-22

## Submodules & Packages

| Name | Location | Type | Version |
|------|----------|------|---------|
| `chrome-extension` | `/chrome-extension` | App | 0.6.0 |
| `content-script` | `/pages/content` | UI | 0.6.0 |
| `ui` | `/packages/ui` | Lib | 0.6.0 |
| `shared` | `/packages/shared` | Lib | 0.6.0 |
| `storage` | `/packages/storage` | Lib | 0.6.0 |

## Directory Structure

*   **`chrome-extension/`**: Contains the Manifest V3 configuration, background service workers, and popup UI. This is the entry point for the browser.
*   **`pages/content/`**: The core React application that gets injected into web pages. Contains the Sidebar, Tool Logic, and MCP Client.
*   **`packages/`**: Shared internal libraries used by both the extension and the content script.
    *   `ui/`: Shared React components (shadcn/ui).
    *   `shared/`: Common utilities and types.
*   **`docs/`**: Project documentation and manuals.
*   **`scripts/`**: Build and maintenance scripts.
