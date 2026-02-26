import type { MemoryAdapter } from '../MemoryAdapter.interface';
import { McpClient } from '../../../core/mcp-client';

export interface VectorAdapterConfig {
  saveToolName: string;
  searchToolName: string;
  deleteToolName?: string;
}

export class VectorAdapter implements MemoryAdapter {
  id = 'vector-mcp';
  name = 'MCP Memory Server';
  description = 'Connects to any MCP server supporting memory tools (OpenMemory, SuperMemory, Core)';

  private config: VectorAdapterConfig;

  constructor(config: VectorAdapterConfig = { saveToolName: 'save_memory', searchToolName: 'search_memory' }) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    // Check if tools exist
    try {
      const tools = await McpClient.getInstance().listTools();
      const saveTool = tools.find(t => t.name === this.config.saveToolName);
      const searchTool = tools.find(t => t.name === this.config.searchToolName);
      return !!(saveTool && searchTool);
    } catch (e) {
      console.error('Failed to connect to MCP Memory:', e);
      return false;
    }
  }

  async save(content: string, metadata: any): Promise<boolean> {
    try {
      await McpClient.getInstance().callTool(this.config.saveToolName, {
        content,
        metadata: JSON.stringify(metadata),
        tags: ['browser-clip', metadata.siteName || 'web'],
      });
      return true;
    } catch (e) {
      console.error('Failed to save to MCP Memory:', e);
      throw e;
    }
  }

  async search(query: string): Promise<any[]> {
    try {
      const result = await McpClient.getInstance().callTool(this.config.searchToolName, {
        query,
        limit: 10,
      });

      // Parse result - assume it returns a list of strings or objects
      if (Array.isArray(result.content)) {
        return result.content.map((item: any) => {
          if (item.type === 'text') return { content: item.text };
          return item;
        });
      }
      return [];
    } catch (e) {
      console.error('Failed to search MCP Memory:', e);
      return [];
    }
  }

  setConfig(config: VectorAdapterConfig) {
    this.config = config;
  }
}
