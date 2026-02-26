import type React from 'react';
import { useState, useMemo } from 'react';
import { useResourceStore } from '../../../stores/resource.store';
import { useToastStore } from '../../../stores/toast.store';
import { Typography, Icon, Button } from '../ui';
import { cn } from '@src/lib/utils';
import { Card, CardHeader, CardContent } from '@src/components/ui/card';
import { createLogger } from '@extension/shared/lib/logger';

const logger = createLogger('ResourcesList');

const ResourcesList: React.FC = () => {
  const { availableResources, readResource, isReading } = useResourceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [readingUri, setReadingUri] = useState<string | null>(null);

  const toggleComponentExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredResources = useMemo(() => {
    return availableResources.filter(
      res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.description && res.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        res.uri.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [availableResources, searchTerm]);

  const handleRead = async (uri: string, name: string) => {
    setReadingUri(uri);
    try {
      const result = await readResource(uri);

      // Format the result for insertion
      const content = result.contents?.map((c: any) => c.text || c.blob).join('\n\n') || JSON.stringify(result);

      // Insert into active element (assuming it's the chat input)
      // Or we can dispatch a custom event that InputArea listens to
      // For now, let's try to find the active element or dispatch event

      const formattedContent = `Resource: ${name}\nURI: ${uri}\n\n${content}`;

      // Dispatch event for InputArea to pick up
      window.dispatchEvent(
        new CustomEvent('mcp:insert-text', {
          detail: { text: formattedContent },
        }),
      );

      useToastStore.getState().addToast({
        title: 'Resource Read',
        message: `Successfully read ${name}`,
        type: 'success',
      });
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Read Failed',
        message: error instanceof Error ? error.message : String(error),
        type: 'error',
      });
    } finally {
      setReadingUri(null);
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-4">
      <CardHeader className="p-4 pb-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleComponentExpansion}
              className="p-1 mr-2 rounded transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              aria-label={isExpanded ? 'Collapse resources' : 'Expand resources'}>
              <Icon
                name="chevron-right"
                size="sm"
                className={cn('text-slate-600 dark:text-slate-300 transition-transform', isExpanded ? 'rotate-90' : '')}
              />
            </button>
            <Typography variant="h3">Resources</Typography>
          </div>
          <Typography variant="small" className="text-slate-500 dark:text-slate-400">
            {availableResources.length}
          </Typography>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-4 bg-white dark:bg-slate-900">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <div className="absolute left-3 top-2.5">
                <Icon name="search" size="sm" className="text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Typography variant="body">No resources found</Typography>
              </div>
            ) : (
              filteredResources.map(resource => (
                <div
                  key={resource.uri}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Typography variant="subtitle" className="font-semibold text-slate-800 dark:text-slate-200">
                        {resource.name}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 dark:text-slate-400 block break-all">
                        {resource.uri}
                      </Typography>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRead(resource.uri, resource.name)}
                      disabled={readingUri === resource.uri}
                      className="ml-2">
                      {readingUri === resource.uri ? (
                        <Icon name="refresh" size="xs" className="animate-spin" />
                      ) : (
                        <Icon name="book-open" size="xs" />
                      )}
                      <span className="ml-1">Read</span>
                    </Button>
                  </div>
                  {resource.description && (
                    <Typography variant="body" className="text-slate-600 dark:text-slate-300 text-sm mb-1">
                      {resource.description}
                    </Typography>
                  )}
                  {resource.mimeType && (
                    <span className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800">
                      {resource.mimeType}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ResourcesList;
