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
    async (type: 'vector' | 'anything' | 'local' | 'omni', content: string, title: string) => {
      if (!content) return;
      setIsSaving(true);
      try {
        const metadata = {
          title,
          url: capturedContent?.url || window.location.href,
          siteName: capturedContent?.siteName || '',
          timestamp: new Date().toISOString(),
        };

        if (type === 'omni') {
          // Omni-save: Mix and match based on config
          const dests = useMemoryStore.getState().omniHarvestDestinations;
          const promises = [];
          const adaptersUsed = [];

          if (dests.local) {
            const ad = getAdapter('local');
            promises.push(ad.save(content, metadata));
            adaptersUsed.push(ad.name);
          }
          if (dests.vector) {
            const ad = getAdapter('vector');
            promises.push(
              ad.save(content, metadata).catch(e => {
                console.error('Vector save failed in Omni', e);
                return false;
              }),
            );
            adaptersUsed.push(ad.name);
          }
          if (dests.anything) {
            const ad = getAdapter('anything');
            promises.push(
              ad.save(content, metadata).catch(e => {
                console.error('AnythingLLM save failed in Omni', e);
                return false;
              }),
            );
            adaptersUsed.push(ad.name);
          }

          await Promise.all(promises);
          toast({
            title: 'Omni-Save Complete',
            description: `Content pushed to: ${adaptersUsed.join(', ')}`,
            variant: 'default',
          });
        } else {
          // Single adapter save
          const adapter = getAdapter(type);
          const success = await adapter.save(content, metadata);

          if (success) {
            toast({ title: 'Saved', description: `Content saved to ${adapter.name}.`, variant: 'default' });
          }
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
    async (type: 'vector' | 'anything' | 'local' | 'omni', query: string) => {
      if (!query) return;
      setIsSearching(true);
      try {
        if (type === 'omni') {
          // Search across all enabled destinations
          const dests = useMemoryStore.getState().omniHarvestDestinations;
          const promises = [];

          if (dests.local)
            promises.push(
              getAdapter('local')
                .search(query)
                .catch(() => []),
            );
          if (dests.vector)
            promises.push(
              getAdapter('vector')
                .search(query)
                .catch(() => []),
            );
          if (dests.anything)
            promises.push(
              getAdapter('anything')
                .search(query)
                .catch(() => []),
            );

          const resultsArrays = await Promise.all(promises);

          // Flatten and deduplicate (basic deduplication by content)
          const allResults = resultsArrays.flat();
          const uniqueResults = allResults.filter((v, i, a) => a.findIndex(t => t.content === v.content) === i);

          setSearchResults(uniqueResults);
        } else {
          const adapter = getAdapter(type);
          const results = await adapter.search(query);
          setSearchResults(results);
        }
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
