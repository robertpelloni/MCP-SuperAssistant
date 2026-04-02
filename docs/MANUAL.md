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

### Activity Monitoring & Logs
The new **Activity** tab provides a real-time timeline of extension actions:
*   **Log Entries**: Tracks every tool execution, connection event, and error.
*   **Filtering**: Filter logs by type (Tools, Connection, Errors).
*   **Details**: Click on any log entry to view full details, including execution metadata and raw JSON results.
*   **Persistence**: Logs are saved locally so you can review recent history even after reloading the page.
*   **Virtualization**: The log view is highly optimized to handle thousands of entries smoothly without crashing your browser.

### Notifications (Toasts)
The extension now provides non-intrusive toast notifications for:
*   Successful connections.
*   Tool execution results (success/failure).
*   Settings updates.

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

## Macros & Agentic Mode

### Overview
Macros allow you to automate sequences of tool executions. With "Agentic Mode," you can add conditional logic and loops to create powerful workflows that adapt based on tool outputs.

### Creating a Macro
1.  Go to the **Macros** tab in the sidebar.
2.  Click **New Macro**.
3.  Enter a name and description.
4.  Add steps:
    *   **Tool**: Execute a specific tool with predefined arguments.
    *   **Condition**: Check a condition (JavaScript expression) and branch execution (Continue, Stop, Go to Step).
    *   **Delay**: Wait for a specified duration.

### Agentic Capabilities
*   **Variables**: Access previous results using `{{lastResult}}` in tool arguments.
*   **Conditionals**: Evaluate expressions like `lastResult.status === 'success'` to decide the next step.
*   **Loops**: Use "Go to Step" actions to retry steps or iterate until a condition is met.

### Running Macros
Click the **Play** button on a macro card to execute it. Progress and results are shown in the Activity Log and via toast notifications.

### Macro Management
*   **Import/Export**: Use the 'Export' button in the Macro Builder to save your workflows as JSON files. Use the 'Import' button in the main Macro list to load them. This allows you to share complex automations with others.

### Dashboard Analytics
The Dashboard now provides deeper insights:
*   **Activity Chart**: View your tool usage over the last 7 days.
*   **Quick Access**: Run your most recently updated macros directly from the dashboard.

### Context Manager
Located in the input area (click the book icon), the Context Manager allows you to:
*   **Save Context**: Store frequently used prompts, instructions, or data snippets.
*   **Insert Context**: Quickly inject saved snippets into your current conversation.
*   **Manage**: Edit or delete snippets as your workflow evolves.

## Cloud Sync (Beta)

### Overview
Synchronize your Macros, Contexts, and Settings across multiple devices using Chrome Sync.

### Setup
1.  Go to **Settings** -> **Cloud Sync**.
2.  Toggle "Enable Sync".
3.  Click "Push Now" to upload your local data to the cloud.
4.  On another device, enable sync and click "Pull Now" to download.

**Note**: Storage limits apply (approx. 100KB). Use for critical configurations only.

## Version 1.5.0 Features

### Default Macros
New installations come with pre-loaded macros to help you get started:
*   **Summarize Selection**: Sends selected text to an AI tool for summarization.
*   **Explain Code**: Analyzes code snippets.
*   **Fix Grammar**: Corrects text.

### Accessibility
*   **Text-to-Speech**: Click the speaker icon in the Activity Log to read tool outputs aloud.

### Data Management
*   **Log Export**: Download your entire session history as a JSON file from the Activity Log.

## Version 1.6.0 Features

### Multi-Modal Support
You can now drag and drop images directly into the Input Area.
*   **Thumbnails**: Images appear as thumbnails above the text box.
*   **Format**: They are sent as Base64-encoded strings, typically appended to the prompt for tool consumption.

### Featured Macros
Discover community-created workflows:
1.  Go to the **Macros** tab.
2.  Click the **Star** icon in the header.
3.  Browse the list and click **+** to import into your library.

## Version 1.7.0 Features

### Resources
MCP Resources allow servers to expose data that can be read by the client.
*   **Resources Tab**: Navigate to the new "Resources" tab in the sidebar to see available resources.
*   **Read**: Click the "Read" button (book icon) next to a resource to fetch its content.
*   **Insert**: The content is automatically inserted into the chat input area.

### Prompts
MCP Prompts are pre-defined templates provided by the server.
*   **Prompts Tab**: Navigate to the "Prompts" tab to browse available prompts.
*   **Arguments**: If a prompt requires arguments, input fields will appear when you expand the prompt card.
*   **Use**: Click "Use Prompt" to fetch the messages and insert them into the chat input area.

### MCP Sampling
The extension now supports MCP Sampling, allowing servers to request LLM generations from you (the user).
*   **Request Modal**: When a server sends a sampling request, a modal will appear overlaying the sidebar.
*   **Context**: You can see the messages/context provided by the server.
*   **Response**: Type your response in the text area and click "Send Response" to return it to the server. Or click "Reject" to decline.

### Push Content Mode
*   **Toggle**: You can now toggle "Push Content Mode" directly from the Settings tab (under Appearance).

## Version 1.8.0 Features

### Context Pinning
Keep your most important context snippets at the top of the list.
*   **Pin/Unpin**: Click the pin icon on any context card in the Context Manager.
*   **Sorting**: Pinned items always appear first.

### Developer Tools
*   **Reload Extension**: A new "Reload Extension" button in the System Info panel (Settings -> Info icon) allows developers to quickly reload the extension without navigating to `chrome://extensions`.
*   **Console Cleanup**: Significant improvements to console logging reduce noise and improve performance.

## Version 1.9.0 Features: Universal Memory & Web Clipper

### Web Clipper
Integrated features from Obsidian Web Clipper and ByteRover.
*   **Memory Tab**: A new tab in the sidebar for capturing content.
*   **Clip Page**: Capture the current page content as clean Markdown (using Reader mode).
*   **Clip Selection**: Capture selected text as Markdown.
*   **Actions**:
    *   **Copy**: Copy Markdown to clipboard.
    *   **Download**: Save as a `.md` file.
    *   **Save to Obsidian**: One-click save to your local Obsidian vault (requires vault name).
    *   **Omni-Memory Save**: In the "Raw" tab, select multiple destinations (Local, Vector DB, AnythingLLM) and push your clip to all of them concurrently with one click. This mixes and matches backend capabilities (inspired by ByteRover).

### Vector & Long-Term Memory
Connects to MCP Memory Servers (like OpenMemory, SuperMemory, Core).
*   **Memory Server**: Configure any MCP tool for saving and searching memory (e.g., `save_memory`, `search_memory`).
*   **Omni-Search**: Search your memory across *all* connected backends simultaneously directly from the Memory Tab.
*   **Global Omni-Search**: Press `Cmd+K` to open the Command Palette, then type `?` to instantly search across all your saved memories from anywhere.
*   **Save**: Send clipped content to your Vector DB with metadata.

### AnythingLLM Integration
Connects directly to your AnythingLLM instance.
*   **Configuration**: Set your AnythingLLM Base URL and API Key in the "AnythingLLM" tab.
*   **Send Content**: Upload clipped web pages or selections directly to your AnythingLLM workspace for RAG.
