export interface MemoryAdapter {
  id: string;
  name: string;
  description: string;

  // Connect to the backend (e.g., check API key, MCP connection)
  connect(): Promise<boolean>;

  // Save content to memory
  save(content: string, metadata: any): Promise<boolean>;

  // Search memory
  search(query: string): Promise<any[]>;

  // Get all memories (optional, for list view)
  getAll?(): Promise<any[]>;

  // Delete memory
  delete?(id: string): Promise<boolean>;
}
