import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VectorAdapter } from './VectorAdapter';
import { McpClient } from '../../../core/mcp-client';

// Mock McpClient
vi.mock('../../../core/mcp-client', () => {
  const mockCallTool = vi.fn();
  const mockListTools = vi.fn();
  return {
    McpClient: {
      getInstance: () => ({
        callTool: mockCallTool,
        listTools: mockListTools,
      }),
    },
  };
});

describe('VectorAdapter', () => {
  let adapter: VectorAdapter;
  let mockClient: any;

  beforeEach(() => {
    mockClient = McpClient.getInstance();
    vi.clearAllMocks();
    adapter = new VectorAdapter({ saveToolName: 'save', searchToolName: 'search' });
  });

  it('connects successfully if tools exist', async () => {
    mockClient.listTools.mockResolvedValue([{ name: 'save' }, { name: 'search' }]);
    const connected = await adapter.connect();
    expect(connected).toBe(true);
  });

  it('fails to connect if tools are missing', async () => {
    mockClient.listTools.mockResolvedValue([{ name: 'other_tool' }]);
    const connected = await adapter.connect();
    expect(connected).toBe(false);
  });

  it('saves content correctly', async () => {
    mockClient.callTool.mockResolvedValue({ content: [] });
    await adapter.save('test content', { title: 'Test' });

    expect(mockClient.callTool).toHaveBeenCalledWith(
      'save',
      expect.objectContaining({
        content: 'test content',
        tags: expect.arrayContaining(['browser-clip']),
      }),
    );
  });

  it('searches content correctly', async () => {
    mockClient.callTool.mockResolvedValue({
      content: [{ type: 'text', text: 'result 1' }],
    });

    const results = await adapter.search('query');
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('result 1');
    expect(mockClient.callTool).toHaveBeenCalledWith('search', { query: 'query', limit: 10 });
  });
});
