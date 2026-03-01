import { useState, useCallback } from 'react';
import { useMemoryStore } from '../../stores/memory.store';
import { useToast } from '../../components/ui/use-toast';
import { VectorAdapter } from '../services/memory/adapters/VectorAdapter';
import { AnythingLLMAdapter } from '../services/memory/adapters/AnythingLLMAdapter';
import { LocalContextAdapter } from '../services/memory/adapters/LocalContextAdapter';

export const useMemoryActions = () => {
  const { capturedContent, vectorSaveTool, vectorSearchTool, anythingLlmBaseUrl, anythingLlmApiKey, setSearchResults } =
    useMemoryStore();

  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const getAdapter = useCallback(
    (type: 'vector' | 'anything' | 'local') => {
      switch (type) {
        case 'vector':
          return new VectorAdapter({ saveToolName: vectorSaveTool, searchToolName: vectorSearchTool });
        case 'anything':
          return new AnythingLLMAdapter({
            baseUrl: anythingLlmBaseUrl,
            apiKey: anythingLlmApiKey,
            workspaceSlug: 'default',
          });
        case 'local':
          return new LocalContextAdapter();
        default:
          throw new Error('Unknown adapter type');
      }
    },
    [vectorSaveTool, vectorSearchTool, anythingLlmBaseUrl, anythingLlmApiKey],
  );

  const saveContent = useCallback(
    async (type: 'vector' | 'anything' | 'local', content: string, title: string) => {
      if (!content) return;
      setIsSaving(true);
      try {
        const adapter = getAdapter(type);
        const success = await adapter.save(content, {
          title,
          url: capturedContent?.url || window.location.href,
          siteName: capturedContent?.siteName || '',
          timestamp: new Date().toISOString(),
        });

        if (success) {
          toast({ title: 'Saved', description: `Content saved to ${adapter.name}.`, variant: 'default' });
        }
      } catch (error) {
        toast({ title: 'Save Failed', description: String(error), variant: 'destructive' });
      } finally {
        setIsSaving(false);
      }
    },
    [getAdapter, capturedContent, toast],
  );

  const searchMemory = useCallback(
    async (type: 'vector' | 'anything' | 'local', query: string) => {
      if (!query) return;
      setIsSearching(true);
      try {
        const adapter = getAdapter(type);
        const results = await adapter.search(query);
        setSearchResults(results);
      } catch (error) {
        toast({ title: 'Search Failed', description: String(error), variant: 'destructive' });
      } finally {
        setIsSearching(false);
      }
    },
    [getAdapter, setSearchResults, toast],
  );

  return {
    saveContent,
    searchMemory,
    isSearching,
    isSaving,
  };
};
