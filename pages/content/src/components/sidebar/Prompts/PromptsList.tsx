import type React from 'react';
import { useState, useMemo } from 'react';
import { usePromptStore } from '../../../stores/prompt.store';
import { useToastStore } from '../../../stores/toast.store';
import { Typography, Icon, Button } from '../ui';
import { cn } from '@src/lib/utils';
import { Card, CardHeader, CardContent } from '@src/components/ui/card';
import { createLogger } from '@extension/shared/lib/logger';

const logger = createLogger('PromptsList');

const PromptsList: React.FC = () => {
  const { availablePrompts, getPrompt, isGetting } = usePromptStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePromptName, setActivePromptName] = useState<string | null>(null);
  const [promptArgs, setPromptArgs] = useState<Record<string, string>>({});

  const toggleComponentExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredPrompts = useMemo(() => {
    return availablePrompts.filter(
      p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [availablePrompts, searchTerm]);

  const handleArgChange = (argName: string, value: string) => {
    setPromptArgs(prev => ({ ...prev, [argName]: value }));
  };

  const handleUsePrompt = async (promptName: string, args: Record<string, string> = {}) => {
    setActivePromptName(promptName);
    try {
      const result = await getPrompt(promptName, args);

      // Format messages for insertion
      // Result has { description, messages: [{role, content: {type: 'text', text: '...'}}] }
      const messages = result.messages || [];
      const content = messages.map((m: any) => {
          const role = m.role.toUpperCase();
          const text = m.content.type === 'text' ? m.content.text : JSON.stringify(m.content);
          return `${role}: ${text}`;
      }).join('\n\n');

      const formattedContent = `Prompt: ${promptName}\n\n${content}`;

      window.dispatchEvent(new CustomEvent('mcp:insert-text', {
          detail: { text: formattedContent }
      }));

      useToastStore.getState().addToast({
        title: 'Prompt Used',
        message: `Successfully used ${promptName}`,
        type: 'success',
      });

      // Reset args if successful?
      // setPromptArgs({});
    } catch (error) {
      useToastStore.getState().addToast({
        title: 'Failed to use prompt',
        message: error instanceof Error ? error.message : String(error),
        type: 'error',
      });
    } finally {
      setActivePromptName(null);
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
              aria-label={isExpanded ? 'Collapse prompts' : 'Expand prompts'}>
              <Icon
                name="chevron-right"
                size="sm"
                className={cn('text-slate-600 dark:text-slate-300 transition-transform', isExpanded ? 'rotate-90' : '')}
              />
            </button>
            <Typography variant="h3">Prompts</Typography>
          </div>
          <Typography variant="small" className="text-slate-500 dark:text-slate-400">
            {availablePrompts.length}
          </Typography>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-4 bg-white dark:bg-slate-900">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search prompts..."
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
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Typography variant="body">No prompts found</Typography>
              </div>
            ) : (
              filteredPrompts.map(prompt => {
                  const hasArgs = prompt.arguments && prompt.arguments.length > 0;
                  const isProcessing = activePromptName === prompt.name;

                  return (
                    <div
                      key={prompt.name}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                            <Typography variant="subtitle" className="font-semibold text-slate-800 dark:text-slate-200">
                            {prompt.name}
                            </Typography>
                        </div>
                        {!hasArgs && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUsePrompt(prompt.name)}
                                disabled={isProcessing}
                                className="ml-2"
                            >
                                {isProcessing ? (
                                    <Icon name="refresh" size="xs" className="animate-spin" />
                                ) : (
                                    <Icon name="terminal" size="xs" />
                                )}
                                <span className="ml-1">Use</span>
                            </Button>
                        )}
                      </div>
                      {prompt.description && (
                        <Typography variant="body" className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                          {prompt.description}
                        </Typography>
                      )}

                      {hasArgs && (
                          <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                              <Typography variant="caption" className="font-semibold mb-1 block">Arguments</Typography>
                              {prompt.arguments?.map(arg => (
                                  <div key={arg.name} className="mb-2 last:mb-0">
                                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                                          {arg.name} {arg.required && <span className="text-red-500">*</span>}
                                      </label>
                                      <input
                                          type="text"
                                          placeholder={arg.description}
                                          className="w-full px-2 py-1 text-xs border rounded dark:bg-slate-900 dark:border-slate-600"
                                          value={promptArgs[arg.name] || ''}
                                          onChange={e => handleArgChange(arg.name, e.target.value)}
                                      />
                                  </div>
                              ))}
                              <Button
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => handleUsePrompt(prompt.name, promptArgs)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? <Icon name="refresh" size="xs" className="animate-spin" /> : 'Use Prompt'}
                              </Button>
                          </div>
                      )}
                    </div>
                  );
              })
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PromptsList;
