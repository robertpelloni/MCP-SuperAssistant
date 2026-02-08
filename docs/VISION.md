# Project Vision

**MCP SuperAssistant** aims to be the ultimate, universally compatible bridge between web-based AI platforms (ChatGPT, Claude, Perplexity, etc.) and the Model Context Protocol (MCP).

## Core Philosophy
1.  **Universal Compatibility**: Works on *any* AI platform that supports basic DOM interaction.
2.  **Privacy First**: All tool execution happens locally via a proxy; no data leaves the user's machine unless explicitly sent to the AI.
3.  **Robust & Resilient**: Handles connection drops, errors, and edge cases gracefully with comprehensive logging and notifications.
4.  **Power User Friendly**: Highly configurable (automation delays, favorites, keyboard shortcuts) yet accessible to beginners (rich help, setup guides).

## Ultimate Goal
To create an "Operating System for AI" that runs inside the browser, empowering LLMs to interact with the real world (files, databases, APIs) securely and efficiently.

## Design Pillars
*   **Non-Intrusive**: The sidebar and UI should feel native to the host AI platform.
*   **Observability**: Users must always know *what* the extension is doing (Activity Logs, Toasts).
*   **Safety**: Dangerous actions (like tool execution) should have safeguards (Whitelist, Confirmation prompts).
