# Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2024-05-22

### Added
- **Resources Support**: New "Resources" tab to browse and read data exposed by MCP servers.
- **Prompts Support**: New "Prompts" tab to use server-defined templates with arguments.
- **MCP Sampling**: Full support for server-initiated sampling requests (LLM generation) via a user-mediated modal.
- **Push Content Mode UI**: Toggle added to Settings for controlling page layout shift.

## [1.6.0] - 2024-05-22

### Added
- **Multi-Modal Input**: Drag and drop images directly into the Input Area to attach them to messages.
- **Featured Macros**: A built-in "Store" to discover and import community macros.
- **Robustness**: Added automated unit tests for the Macro Runner logic.

## [1.5.1] - 2024-05-22

### Added
- **Deep Documentation**: New `MEMORY.md`, `DEPLOY.md`, and `TODO.md` guides.
- **Universal Instructions**: Consolidated `AGENTS.md` for better AI collaboration.
- **System Polish**: Enhanced System Info dashboard with detailed project structure visualization.

## [1.5.0] - 2024-05-22

### Added
- **Default Macro Library**: Starter macros ("Summarize Selection", "Explain Code", "Fix Grammar") pre-loaded for new users.
- **Text-to-Speech**: Read Aloud button for tool outputs in Activity Log.
- **Log Export**: Export activity logs to JSON for debugging or sharing.

## [1.4.0] - 2024-05-22

### Added
- **Cloud Sync (Beta)**: Sync Macros and Contexts across devices using Chrome Sync.
- **Sync Status**: Visualization of sync state and errors in Settings.

## [1.3.0] - 2024-05-22

### Added
- **Plugin Architecture**: New modular system for features and adapters (`plugin-registry.ts`).
- **Unified Initialization**: Centralized startup logic (`main-initializer.ts`).
- **Sidebar Plugin**: Extracted sidebar logic into a dedicated plugin module.

## [1.2.0] - 2024-05-22

### Added
- **Multi-Server Profiles**: Manage multiple MCP server configurations (e.g., Local, Remote) and switch between them instantly in Settings.
- **System Info Tab**: Dedicated view for version, build date, and project structure.
- **Community Registry**: Import Macros directly from URLs.

## [1.1.0] - 2024-05-22

### Added
- **Auto-Execute Whitelist**: Granular control to trust specific tools for automatic execution in `Settings`.
- **Dynamic Theming**: Full support for custom accent colors (Indigo, Blue, Green, Purple, Red, Orange) applied across the entire UI.
- **Context Menu Integration**: Seamless "Save to MCP Context" workflow directly from web page selections.
- **Macro Improvements**: Added support for variables (`Set Variable`) and robust error handling.

## [1.0.0-rc1] - 2024-05-22

### Added
- **Context Menu Integration**: Added 'Save to MCP Context' right-click menu item.
- **Macro Variables**: Added 'Set Variable' step to macros.

## [0.9.0] - 2024-05-22

### Added
- **Macro Import/Export**: Share your automation workflows via JSON files.
- **Enhanced Dashboard**: New analytics charts (Activity over last 7 days) and Quick Macro Access.
- **Context Manager**: Save, edit, and organize reusable context snippets for quick insertion.
- **Tooltips & Polish**: Improved UI clarity with tooltips and responsive layouts.

## [0.8.0] - 2024-05-22

### Added
- **Macros & Agentic Mode**: Build complex automation workflows with conditional logic, loops, and variable substitution.
- **Local History Search**: Instantly filter and search through your activity logs.
- **Theme Customization**: Personalize the sidebar with accent colors.
- **Voice Input**: Dictate your commands directly into the input area.
- **Floating Action Button**: Quick access to the sidebar when minimized.

## [0.6.2] - 2024-05-22

### Added
- **Quick Actions Command Palette**: Press `Cmd+K` (or `Ctrl+K`) to navigate tabs, switch profiles, and execute actions instantly.
- **Smart Context Integration**: Select text on any webpage and import it directly into the tool input or chat context.
- **Onboarding Tour**: Guided introduction for new users highlighting key features.
- **Auto-Retry**: Robust connection recovery with exponential backoff.

## [0.6.0] - 2024-05-22

### Added
- **Analytics Dashboard**: New sidebar tab showing high-level usage stats.
- **Rich Renderer**: Visualizes tool outputs in Activity Logs (JSON tree, Markdown, Images).
- **Keyboard Shortcuts**: Global shortcuts for power users.
- **Auto-Execute Whitelist**: Safe mode for automation.

## [0.5.9] - 2024-05-22

### Added
- **Activity Log**: Comprehensive logging system.
- **Notifications**: Toast notification system.
- **Settings**: Enhanced UI with sliders and grouping.
- **Documentation**: New `VISION.md`, `ROADMAP.md`.
