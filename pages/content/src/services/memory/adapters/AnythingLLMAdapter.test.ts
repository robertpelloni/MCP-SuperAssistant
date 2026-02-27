import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnythingLLMAdapter } from './AnythingLLMAdapter';

// Mock Fetch
global.fetch = vi.fn();

describe('AnythingLLMAdapter', () => {
  let adapter: AnythingLLMAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new AnythingLLMAdapter({ baseUrl: 'http://test', apiKey: 'key', workspaceSlug: 'ws' });
  });

  it('connects successfully', async () => {
    (fetch as any).mockResolvedValue({ ok: true });
    const connected = await adapter.connect();
    expect(connected).toBe(true);
    expect(fetch).toHaveBeenCalledWith('http://test/api/v1/auth', expect.any(Object));
  });

  it('saves content by uploading raw text', async () => {
    (fetch as any).mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    await adapter.save('content', { title: 'Test' });

    expect(fetch).toHaveBeenCalledWith('http://test/api/v1/document/raw-text', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('content')
    }));
  });

  it('chats successfully', async () => {
    (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ textResponse: 'Hello' })
    });

    const response = await adapter.chat('Hi');
    expect(response).toBe('Hello');
    expect(fetch).toHaveBeenCalledWith('http://test/api/v1/workspace/ws/chat', expect.any(Object));
  });
});
