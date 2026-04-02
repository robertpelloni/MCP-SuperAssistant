# Deployment Guide

**Version**: 1.1.0+
**Date**: 2024-05-22

This document details the build and deployment process for the `mcp-superassistant` Chrome Extension.

## Prerequisites

*   **Node.js**: v22.12.0+
*   **pnpm**: v9.15.1+
*   **Chrome**: Latest version

## Build Process

1.  **Clean Clean Clean**:
    ```bash
    pnpm clean
    ```
    This removes `node_modules`, `.turbo`, and `dist` folders to ensure a pristine build.

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Set Environment Variables**:
    Ensure `.env` is configured (copy from `.example.env` if needed).
    Run:
    ```bash
    pnpm set-global-env
    ```

4.  **Build All Packages**:
    ```bash
    pnpm build
    ```
    This triggers Turbo to build:
    *   Shared packages (`@extension/shared`, etc.)
    *   `chrome-extension` (Background, Manifest)
    *   `pages/content` (Sidebar UI)

5.  **Zip for Distribution**:
    ```bash
    pnpm zip
    ```
    Creates a `.zip` file in `dist/` ready for the Chrome Web Store.

## Manual Load (Development)

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable "Developer mode" (top right).
3.  Click "Load unpacked".
4.  Select the `dist/` folder.

## Release Protocol

1.  **Bump Version**:
    Update `VERSION`, `package.json`, and `CHANGELOG.md`.
2.  **Commit**:
    `git commit -am "Bump version to X.Y.Z"`
    `git push`
3.  **Build**:
    Run the full build process above.
4.  **Upload**:
    Upload the generated zip to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

## Troubleshooting

*   **Shadow DOM Styles Missing**: Check `tailwind.config.ts` has `important: true`.
*   **Connection Errors**: Ensure the local MCP Proxy is running (`npx @srbhptl39/mcp-superassistant-proxy`).
