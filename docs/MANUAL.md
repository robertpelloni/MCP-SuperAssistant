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
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/folder"],
          "env": {
            "DEBUG": "true"
          }
        }
      }
    }
    ```

2.  **Run the Proxy**:

    ```bash
    npx -y @srbhptl39/mcp-superassistant-proxy@latest --config ./config.json
    ```

    By default, this starts an SSE server on port 3006. You can change the port using environment variables: `PORT=3007 npx ...`

## Connection Configuration

Open the extension sidebar and go to the **Settings** tab or click the **Settings** icon in the Server Status area.

### Connection Types

*   **SSE (Server-Sent Events)**: The default connection type. Standard HTTP streaming.
    *   URI: `http://localhost:3006/sse`
*   **WebSocket**: Faster, full-duplex communication. Requires running the proxy with WebSocket support or using a WebSocket-enabled MCP server.
    *   URI: `ws://localhost:3006/message`
*   **Streamable HTTP**: Standard MCP transport over HTTP.
    *   URI: `http://localhost:3006/mcp`

### Server URI

Enter the URL where your local proxy or remote MCP server is running.

### Testing Connection

You can test the latency of your connection by clicking the **Test** button in the Connection Details panel (click the info icon next to the settings gear). This will measure the round-trip time to your MCP server.

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
*   **Search**: Filter tools by name or description.
*   **Favorites**: Click the sun icon next to a tool to mark it as a favorite. Toggle sort order to prioritize favorites.
*   **Enable/Disable**: Toggle individual tools or entire server groups.
*   **View Details**: Click on a tool to expand its description and view the JSON schema.

## Advanced Usage

### Developing Custom Tools

You can create your own MCP server to expose custom tools (e.g., internal API access, database queries). Refer to the [Official MCP Documentation](https://modelcontextprotocol.io/docs/server) to learn how to build an MCP server in Python or TypeScript.

Once built, simply add it to your `config.json` and restart the proxy.

### Security Best Practices

*   **Local Execution**: Tools run on your local machine. Be careful with tools that modify files or execute system commands. Always review the tool call before clicking "Run" unless you trust the source completely.
*   **Data Privacy**: Your data (files, database content) remains local. It is only sent to the AI provider (OpenAI, Anthropic, etc.) when a tool result is explicitly inserted into the chat.
*   **API Keys**: Never hardcode API keys in your `config.json` if you plan to share it. Use environment variables instead.

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

### Latency Issues
If the "Test Connection" shows high latency (>200ms) for a local server:
*   Check your CPU usage.
*   Ensure no other process is blocking the port.
*   Try switching to WebSocket if supported.

## FAQ

**Q: Is my data secure?**
A: Yes. The extension communicates directly with your local proxy. Your data (files, etc.) stays local unless you explicitly send it to the AI as a tool result.

**Q: Which AI models work best?**
A: Models with strong function calling capabilities (like GPT-4, Claude 3.5 Sonnet) work best.
