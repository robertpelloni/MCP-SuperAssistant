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

  // Omni-Memory Harvesting Config
  omniHarvestingEnabled: boolean;
  omniHarvestDestinations: {
    local: boolean;
    vector: boolean;
    anything: boolean;
  };
  setOmniHarvesting: (enabled: boolean) => void;
  setOmniDestinations: (dests: Partial<{ local: boolean; vector: boolean; anything: boolean }>) => void;
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

  omniHarvestingEnabled: false,
  omniHarvestDestinations: {
    local: true,
    vector: false,
    anything: false,
  },

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
  setOmniHarvesting: enabled => set({ omniHarvestingEnabled: enabled }),
  setOmniDestinations: dests =>
    set(state => ({
      omniHarvestDestinations: { ...state.omniHarvestDestinations, ...dests },
    })),
}));
