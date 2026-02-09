import type React from 'react';
import { useState } from 'react';
import { useMacroStore, type MacroStep } from '@src/stores/macro.store';
import { useAvailableTools } from '@src/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Typography, Button, Icon } from '../ui';
import { cn } from '@src/lib/utils';

interface MacroBuilderProps {
  onCancel: () => void;
  onSave: () => void;
}

const MacroBuilder: React.FC<MacroBuilderProps> = ({ onCancel, onSave }) => {
  const { addMacro } = useMacroStore();
  const { tools } = useAvailableTools();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<MacroStep[]>([]);
  const [selectedTool, setSelectedTool] = useState('');

  const handleAddStep = () => {
    if (!selectedTool) return;

    const tool = tools.find(t => t.name === selectedTool);
    // Simple parsing of tool args if possible, for now empty
    const step: MacroStep = {
      id: crypto.randomUUID(),
      toolName: selectedTool,
      arguments: {},
      description: tool?.description || '',
    };

    setSteps([...steps, step]);
    setSelectedTool('');
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!name || steps.length === 0) return;
    addMacro({ name, description, steps });
    onSave();
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Create New Macro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Macro Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
              placeholder="e.g. Daily Summary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
              placeholder="What does this macro do?"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
        <Typography variant="subtitle" className="font-semibold px-1">
          Steps Sequence
        </Typography>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="body" className="font-medium text-sm truncate">
                {step.toolName}
              </Typography>
              <Typography variant="caption" className="text-xs text-slate-500 truncate">
                {step.description}
              </Typography>
            </div>
            <button onClick={() => handleRemoveStep(step.id)} className="text-red-500 hover:text-red-700 p-1">
              <Icon name="x" size="xs" />
            </button>
          </div>
        ))}
        {steps.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            No steps added yet. Add a tool below.
          </div>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
        <div className="flex gap-2 mb-4">
          <select
            value={selectedTool}
            onChange={e => setSelectedTool(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border rounded-md bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <option value="">Select a tool to add...</option>
            {tools.map(t => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={handleAddStep} disabled={!selectedTool}>
            <Icon name="play" size="xs" className="mr-1" /> Add
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name || steps.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Macro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MacroBuilder;
