# MCP SuperAssistant User Manual

## Overview

MCP SuperAssistant is a Chrome extension that bridges the Model Context Protocol (MCP) with web-based AI platforms like ChatGPT, Claude, Perplexity, and others. It allows you to use your local tools and data directly within these AI interfaces, enhancing their capabilities with file system access, command execution, and more.

## Getting Started

### Installation

1.  **Install the Extension**: Load the extension in Chrome (Developer Mode) or install from the Chrome Web Store.
2.  **Install the Proxy**: To connect to local MCP servers, you need to run the MCP SuperAssistant Proxy.

### Proxy Setup

The proxy bridges the browser (extension) to your local MCP servers.

1.  **Create a Configuration File**: Create a `config.json` file defining your MCP servers.

    ```json
    {
      "mcpServers": {
        "filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/folder"]
        }
      }
    }
    ```

2.  **Run the Proxy**:

    ```bash
    npx -y @srbhptl39/mcp-superassistant-proxy@latest --config ./config.json
    ```

    By default, this starts an SSE server on port 3006.

## Connection Configuration

Open the extension sidebar and go to the **Settings** tab or click the **Settings** icon in the Server Status area.

### Connection Types

*   **SSE (Server-Sent Events)**: The default connection type. Standard HTTP streaming.
*   **WebSocket**: Faster, full-duplex communication. Requires running the proxy with WebSocket support or using a WebSocket-enabled MCP server.
*   **Streamable HTTP**: Standard MCP transport over HTTP.

### Server URI

Enter the URL where your local proxy or remote MCP server is running.
*   Default SSE: `http://localhost:3006/sse`
*   Default WebSocket: `ws://localhost:3006/message`

## Features

### Tool Detection
The extension automatically detects when the AI wants to call a tool based on the conversation context. It presents a "Call Tool" card in the chat interface.

### Automation Settings

These settings can be found in the **Settings** tab.

*   **Auto Insert**: Automatically inserts the tool result into the chat input box after the tool finishes execution.
    *   *Delay*: Time in seconds to wait before inserting. Set to 0 for instant insertion.
*   **Auto Submit**: Automatically submits the chat message after the tool result has been inserted.
    *   *Requirement*: Requires 'Auto Insert' to be enabled.
    *   *Delay*: Time in seconds to wait before submitting.
*   **Auto Execute**: Automatically runs the tool when a "Call Tool" card appears, without requiring you to click "Run".
    *   *Warning*: Use with caution. This enables fully autonomous tool execution.

### Push Content Mode
Toggle this in the Sidebar settings. It adjusts the page layout so the sidebar pushes the main content aside instead of overlaying it. This is useful for smaller screens to prevent the sidebar from blocking chat content.

### Tool Management
In the **Available Tools** tab, you can:
*   View all connected tools.
*   Enable or disable specific tools or groups of tools.
*   View tool descriptions and schemas (click on a tool to expand).

## Troubleshooting

### Connection Refused / 404
*   Ensure your proxy server is running.
*   Check if the port (default 3006) matches the URI in Server Status.
*   Verify `config.json` syntax.

### Tools Not Showing
*   Click the "Refresh" button in the Available Tools tab.
*   Ensure your MCP server is healthy and sending the tool list.

### Extension Context Invalidated
This happens if the extension is updated or reloaded while the page is open. Simply refresh the web page to reconnect.

## FAQ

**Q: Is my data secure?**
A: Yes. The extension communicates directly with your local proxy. Your data (files, etc.) stays local unless you explicitly send it to the AI as a tool result.

**Q: Which AI models work best?**
A: Models with strong function calling capabilities (like GPT-4, Claude 3.5 Sonnet) work best.
