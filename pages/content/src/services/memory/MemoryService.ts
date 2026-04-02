import type { MemoryAdapter } from './MemoryAdapter.interface';
import { ContentParser } from './ContentParser';

export class MemoryService {
  private parser: ContentParser;
  private adapters: Map<string, MemoryAdapter> = new Map();

  constructor() {
    this.parser = new ContentParser();
  }

  registerAdapter(adapter: MemoryAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  async parseCurrentPage(doc: Document): Promise<any> {
    return this.parser.parse(doc, window.location.href);
  }

  async parseSelection(selection: Selection): Promise<any> {
    return this.parser.parseSelection(selection, window.location.href);
  }

  async saveToMemory(adapterId: string, content: any): Promise<boolean> {
    const adapter = this.adapters.get(adapterId);
    if (!adapter) throw new Error(`Adapter ${adapterId} not found`);
    return adapter.save(content.content, content);
  }

  async searchMemory(adapterId: string, query: string): Promise<any[]> {
    const adapter = this.adapters.get(adapterId);
    if (!adapter) throw new Error(`Adapter ${adapterId} not found`);
    return adapter.search(query);
  }
}
