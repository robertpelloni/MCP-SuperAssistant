# Dependency Audit & Technology Stack

This document lists the major dependencies, libraries, and submodules used in the **MCP SuperAssistant** project, along with their purpose and justification.

## Core Framework
*   **React (v19.1.0)**: The foundational UI library. Chosen for its component-based architecture and vast ecosystem.
*   **Vite (v6.1.0)**: The build tool and bundler. Chosen for its extreme speed in development and optimized production builds.
*   **TypeScript (v5.8.1)**: Statically typed JavaScript. Mandatory for type safety and code quality.

## State Management
*   **Zustand (v5.0.5)**: A small, fast, and scalable bearbones state-management solution.
    *   *Justification*: Chosen over Redux for its simplicity and lack of boilerplate. Used for `macro.store.ts`, `memory.store.ts`, `profile.store.ts`, etc.
*   **Immer (v10.1.1)**: Create the next immutable state by mutating the current one. Used within Zustand stores for complex state updates.

## UI & Styling
*   **Tailwind CSS (v3.4.17)**: A utility-first CSS framework. Enables rapid UI development and consistent design tokens.
*   **Shadcn UI**: Reusable components built using Radix UI and Tailwind CSS.
    *   *Justification*: Provides accessible, high-quality components (Dialogs, Cards, Inputs) that we own and can customize.
*   **Radix UI**: Headless UI primitives. Powering the accessible interactions of Shadcn components.
*   **Lucide React (v0.477.0)**: A consistent icon set. Used for all SVG icons in the sidebar.
*   **Clsx / Tailwind Merge**: Utilities for constructing `className` strings conditionally and merging Tailwind classes without conflicts.

## Universal Memory & Parsing
*   **@mozilla/readability (v0.6.0)**: A standalone version of the library used for Firefox Reader View.
    *   *Purpose*: Extracts the "main content" from a cluttered webpage, removing ads and navigation. Core to the Web Clipper.
*   **Turndown (v7.2.2)**: An HTML to Markdown converter.
    *   *Purpose*: Converts the sanitized HTML from Readability into clean Markdown for storage in Obsidian or Vector DBs.
*   **DOMPurify (v3.3.1)**: A DOM-only, super-fast, uber-tolerant XSS sanitizer.
    *   *Purpose*: Ensures that captured HTML is safe before processing or storing.

## Utilities
*   **Fast XML Parser (v5.0.9)**: Validates and parses XML. Used for handling specific data formats.
*   **AJV (v8.17.1)**: JSON Schema Validator. Used to validate MCP tool arguments against their schemas.

## Build & Monorepo
*   **Turbo (v2.4.2)**: A high-performance build system for JavaScript and TypeScript monorepos. Manages the workspace (pages, packages, chrome-extension).
*   **PNPM**: Fast, disk space efficient package manager.

## Submodules & External References
*   *Note: This project integrates logic inspired by several external projects, though they are implemented directly rather than linked as git submodules to maintain a monolithic codebase structure.*
    *   **OpenMemory**: Logic adapted for `VectorAdapter` to support memory operations.
    *   **Obsidian Web Clipper**: Logic adapted for `ContentParser` (Readability + Markdown).
    *   **AnythingLLM**: Logic adapted for `AnythingLLMAdapter` to support RAG uploads.

---
*This document is automatically maintained. Last updated: v1.9.0*
