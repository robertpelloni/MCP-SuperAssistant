import { create } from 'zustand';
import type { MemoryAdapter } from '../services/memory/MemoryAdapter.interface';
import type { ParsedContent } from '../services/memory/ContentParser';

interface MemoryState {
  activeAdapterId: string;
  availableAdapters: MemoryAdapter[];
  searchQuery: string;
  searchResults: any[];
  isSyncing: boolean;
  capturedContent: ParsedContent | null;

  // Vector Adapter Config
  vectorSaveTool: string;
  vectorSearchTool: string;

  setActiveAdapter: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setCapturedContent: (content: ParsedContent | null) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  addAdapter: (adapter: MemoryAdapter) => void;

  setVectorConfig: (save: string, search: string) => void;

  // AnythingLLM Config
  anythingLlmBaseUrl: string;
  anythingLlmApiKey: string;
  setAnythingLlmConfig: (baseUrl: string, apiKey: string) => void;
}

export const useMemoryStore = create<MemoryState>(set => ({
  activeAdapterId: 'local', // Default to local browser storage or similar
  availableAdapters: [],
  searchQuery: '',
  searchResults: [],
  isSyncing: false,
  capturedContent: null,

  vectorSaveTool: 'save_memory',
  vectorSearchTool: 'search_memory',

  anythingLlmBaseUrl: 'http://localhost:3001',
  anythingLlmApiKey: '',

  setActiveAdapter: id => set({ activeAdapterId: id }),
  setSearchQuery: query => set({ searchQuery: query }),
  setSearchResults: results => set({ searchResults: results }),
  setCapturedContent: content => set({ capturedContent: content }),
  setIsSyncing: isSyncing => set({ isSyncing }),
  addAdapter: adapter =>
    set(state => ({
      availableAdapters: [...state.availableAdapters, adapter],
    })),
  setVectorConfig: (save, search) => set({ vectorSaveTool: save, vectorSearchTool: search }),
  setAnythingLlmConfig: (baseUrl, apiKey) => set({ anythingLlmBaseUrl: baseUrl, anythingLlmApiKey: apiKey }),
}));
