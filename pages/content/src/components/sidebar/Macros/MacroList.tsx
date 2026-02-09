import type React from 'react';
import { useState } from 'react';
import { useMacroStore, type Macro } from '@src/stores/macro.store';
import { useMcpCommunication } from '@src/hooks/useMcpCommunication';
import { Card, CardContent } from '@src/components/ui/card';
import { Typography, Button, Icon } from '../ui';
import { cn } from '@src/lib/utils';
import MacroBuilder from './MacroBuilder';
import { useToastStore } from '@src/stores/toast.store';

const MacroList: React.FC = () => {
  const { macros, removeMacro } = useMacroStore();
  const { sendMessage } = useMcpCommunication();
  const { addToast } = useToastStore.getState();
  const [isCreating, setIsCreating] = useState(false);
  const [runningMacroId, setRunningMacroId] = useState<string | null>(null);

  const handleRunMacro = async (macro: Macro) => {
    setRunningMacroId(macro.id);
    addToast({ title: 'Macro Started', message: `Running "${macro.name}"...`, type: 'info' });

    try {
      for (const step of macro.steps) {
        // In a real scenario, we'd pipe the output of previous steps to the next
        // For now, we just run them sequentially
        await sendMessage({ name: step.toolName, args: step.arguments });
      }
      addToast({ title: 'Macro Completed', message: `"${macro.name}" finished successfully`, type: 'success' });
    } catch (error) {
      addToast({ title: 'Macro Failed', message: String(error), type: 'error' });
    } finally {
      setRunningMacroId(null);
    }
  };

  if (isCreating) {
    return <MacroBuilder onCancel={() => setIsCreating(false)} onSave={() => setIsCreating(false)} />;
  }

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
            Macros
          </Typography>
          <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
            Automate tasks with tool chains.
          </Typography>
        </div>
        <Button size="sm" onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Icon name="play" size="xs" className="mr-1" /> New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {macros.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <Icon name="lightning" size="lg" className="mb-2 opacity-50" />
            <Typography variant="body" className="text-sm">
              No macros created yet
            </Typography>
          </div>
        ) : (
          macros.map(macro => (
            <Card key={macro.id} className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Typography variant="subtitle" className="font-semibold text-slate-800 dark:text-slate-200">
                      {macro.name}
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 block mt-1">
                      {macro.steps.length} steps • {macro.description}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-slate-200 dark:border-slate-700"
                      onClick={() => removeMacro(macro.id)}>
                      <Icon name="x" size="xs" />
                    </Button>
                    <Button
                      size="sm"
                      className={cn(
                        'h-8 px-3',
                        runningMacroId === macro.id ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700 text-white',
                      )}
                      onClick={() => handleRunMacro(macro)}
                      disabled={!!runningMacroId}>
                      {runningMacroId === macro.id ? (
                        <Icon name="refresh" size="xs" className="animate-spin" />
                      ) : (
                        <div className="flex items-center">
                          <Icon name="play" size="xs" className="mr-1" /> Run
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Steps Preview */}
                <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
                  {macro.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center shrink-0">
                      <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 max-w-[100px] truncate">
                        {step.toolName}
                      </div>
                      {idx < macro.steps.length - 1 && (
                        <Icon name="chevron-right" size="xs" className="text-slate-300 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MacroList;
