import type { MemoryAdapter } from '../MemoryAdapter.interface';

export interface AnythingLLMConfig {
  baseUrl: string;
  apiKey: string;
  workspaceSlug: string;
}

export class AnythingLLMAdapter implements MemoryAdapter {
  id = 'anything-llm';
  name = 'AnythingLLM';
  description = 'Connects to your AnythingLLM instance for RAG.';

  private config: AnythingLLMConfig;

  constructor(config: AnythingLLMConfig = { baseUrl: 'http://localhost:3001', apiKey: '', workspaceSlug: 'default' }) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/auth`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (e) {
      console.error('Failed to connect to AnythingLLM:', e);
      return false;
    }
  }

  async save(content: string, metadata: any): Promise<boolean> {
    try {
      // 1. Upload raw text
      const response = await fetch(`${this.config.baseUrl}/api/v1/document/raw-text`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textContent: content,
          metadata: {
            title: metadata.title,
            url: metadata.url,
            source: 'browser-extension',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // 2. Update embeddings for workspace (if document path returned)
      // This step depends on AnythingLLM API specifics, often upload triggers processing or needs explicit call.
      // Assuming upload is enough for now or user manages it in UI.

      return true;
    } catch (e) {
      console.error('Failed to save to AnythingLLM:', e);
      throw e;
    }
  }

  async search(query: string): Promise<any[]> {
    // AnythingLLM search API usually is chat-based or specific retrieval endpoint.
    // For now, return empty or implement chat endpoint query.
    return [];
  }
}
