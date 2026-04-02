import type { MemoryAdapter } from '../MemoryAdapter.interface';
import { useContextStore } from '../../../stores/context.store';

export class LocalContextAdapter implements MemoryAdapter {
  id = 'local-context';
  name = 'Local Context';
  description = 'Saves clips to the built-in Context Manager.';

  async connect(): Promise<boolean> {
    return true; // Always connected
  }

  async save(content: string, metadata: any): Promise<boolean> {
    try {
      useContextStore.getState().addContext({
        title: metadata.title,
        content: content,
        type: 'text',
      });
      return true;
    } catch (e) {
      console.error('Failed to save to Local Context:', e);
      return false;
    }
  }

  async search(query: string): Promise<any[]> {
    const contexts = useContextStore.getState().contexts;
    return contexts
      .filter(
        c =>
          c.content.toLowerCase().includes(query.toLowerCase()) || c.title.toLowerCase().includes(query.toLowerCase()),
      )
      .map(c => ({
        content: c.content,
        metadata: { title: c.title, id: c.id },
      }));
  }
}
