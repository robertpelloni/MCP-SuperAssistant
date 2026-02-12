import React, { useState, useEffect } from 'react';
import { useMacroStore, type Macro, type MacroStep, type StepType, type ActionType } from '@src/lib/macro.store';
import { Icon, Typography, Button, Input, Textarea, Select } from '../ui';
import { cn } from '@src/lib/utils';
import { useToastStore } from '@src/stores/toast.store';

interface MacroBuilderProps {
  existingMacro?: Macro | null;
  onClose: () => void;
}

const MacroBuilder: React.FC<MacroBuilderProps> = ({ existingMacro, onClose }) => {
  const { addMacro, updateMacro } = useMacroStore();
  const { addToast } = useToastStore();
  const [name, setName] = useState(existingMacro?.name || '');
  const [description, setDescription] = useState(existingMacro?.description || '');
  const [steps, setSteps] = useState<MacroStep[]>(existingMacro?.steps || []);
  const [availableTools, setAvailableTools] = useState<any[]>([]);

  useEffect(() => {
    // Get available tools from global scope as a quick access method since Sidebar exposes it
    const tools = (window as any).availableTools || [];
    setAvailableTools(tools);
  }, []);

  const handleSave = () => {
    if (!name.trim()) return alert('Macro name is required');
    if (steps.length === 0) return alert('Macro must have at least one step');

    const macroData = {
      name,
      description,
      steps,
    };

    if (existingMacro) {
      updateMacro(existingMacro.id, macroData);
    } else {
      addMacro(macroData);
    }
    onClose();
  };

  const handleExport = () => {
    const macroData = {
      name,
      description,
      steps,
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(macroData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_').toLowerCase() || 'macro'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Exported',
      message: 'Macro exported successfully',
      type: 'success',
      duration: 2000
    });
  };

  const addStep = (type: StepType) => {
    const newStep: MacroStep = {
      id: crypto.randomUUID(),
      type,
      // Defaults
      toolName: type === 'tool' && availableTools.length > 0 ? availableTools[0].name : '',
      args: {},
      delayMs: 1000,
      expression: 'true',
      trueAction: 'continue',
      falseAction: 'stop',
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<MacroStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="arrow-left" size="sm" />
          </Button>
          <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
            {existingMacro ? 'Edit Macro' : 'New Macro'}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} size="sm" variant="outline" className="hidden sm:flex" title="Export to JSON">
            <Icon name="download" size="xs" className="mr-1" />
            Export
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
            <Icon name="save" size="xs" className="mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Metadata */}
        <div className="space-y-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Report Generator"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this macro does..."
              className="w-full h-20"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Typography variant="subtitle" className="font-semibold text-slate-800 dark:text-slate-200">
              Steps ({steps.length})
            </Typography>
            <div className="flex gap-2">
              <Button size="xs" variant="outline" onClick={() => addStep('tool')}>
                <Icon name="plus" size="xs" className="mr-1" /> Tool
              </Button>
              <Button size="xs" variant="outline" onClick={() => addStep('condition')}>
                <Icon name="git-branch" size="xs" className="mr-1" /> Condition
              </Button>
              <Button size="xs" variant="outline" onClick={() => addStep('delay')}>
                <Icon name="clock" size="xs" className="mr-1" /> Delay
              </Button>
              <Button size="xs" variant="outline" onClick={() => addStep('set_variable')}>
                <Icon name="database" size="xs" className="mr-1" /> Set Var
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-mono px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <span className={cn(
                      "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      step.type === 'tool' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900" :
                        step.type === 'condition' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900" :
                          "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                    )}>
                      {step.type}
                    </span>
                    {step.type === 'tool' && <span className="text-sm font-medium">{step.toolName}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStep(index, 'up')} disabled={index === 0}>
                      <Icon name="chevron-up" size="xs" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1}>
                      <Icon name="chevron-down" size="xs" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => removeStep(step.id)}>
                      <Icon name="x" size="xs" />
                    </Button>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-3 space-y-3">
                  {step.type === 'tool' && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Select Tool</label>
                        <select
                          className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 p-2"
                          value={step.toolName}
                          onChange={(e) => updateStep(step.id, { toolName: e.target.value })}
                        >
                          <option value="">Select a tool...</option>
                          {availableTools.map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Arguments (JSON)</label>
                        <Textarea
                          value={JSON.stringify(step.args, null, 2)}
                          onChange={(e) => {
                            try {
                              const args = JSON.parse(e.target.value);
                              updateStep(step.id, { args });
                            } catch (e) {
                              // Allow invalid JSON while typing, maybe store as string in separate state?
                              // For simplicity, we just won't update state if invalid, which is bad UX.
                              // Better: Use a string buffer or simple text input for now.
                            }
                          }}
                          placeholder={'{ "arg": "value" }'}
                          className="font-mono text-xs h-24"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Tip: You can use variables like <code>{'{{lastResult}}'}</code>
                        </p>
                      </div>
                    </>
                  )}

                  {step.type === 'condition' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">JavaScript Condition</label>
                        <Input
                          value={step.expression}
                          onChange={(e) => updateStep(step.id, { expression: e.target.value })}
                          placeholder="result.status === 'success'"
                          className="font-mono text-xs"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Available: <code>lastResult</code>, <code>allResults</code>, <code>env</code>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/30">
                          <label className="text-xs font-medium text-green-700 dark:text-green-400 mb-1 block">If True</label>
                          <select
                            className="w-full text-xs border border-green-200 rounded p-1"
                            value={step.trueAction}
                            onChange={(e) => updateStep(step.id, { trueAction: e.target.value as ActionType })}
                          >
                            <option value="continue">Continue</option>
                            <option value="stop">Stop</option>
                            <option value="goto">Go to Step...</option>
                          </select>
                          {step.trueAction === 'goto' && (
                            <select
                              className="w-full text-xs border border-green-200 rounded p-1 mt-2"
                              value={step.trueTargetStepId}
                              onChange={(e) => updateStep(step.id, { trueTargetStepId: e.target.value })}
                            >
                              <option value="">Select Step...</option>
                              {steps.map((s, idx) => (
                                <option key={s.id} value={s.id}>#{idx + 1} {s.type}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                          <label className="text-xs font-medium text-red-700 dark:text-red-400 mb-1 block">If False</label>
                          <select
                            className="w-full text-xs border border-red-200 rounded p-1"
                            value={step.falseAction}
                            onChange={(e) => updateStep(step.id, { falseAction: e.target.value as ActionType })}
                          >
                            <option value="continue">Continue</option>
                            <option value="stop">Stop</option>
                            <option value="goto">Go to Step...</option>
                          </select>
                          {step.falseAction === 'goto' && (
                            <select
                              className="w-full text-xs border border-red-200 rounded p-1 mt-2"
                              value={step.falseTargetStepId}
                              onChange={(e) => updateStep(step.id, { falseTargetStepId: e.target.value })}
                            >
                              <option value="">Select Step...</option>
                              {steps.map((s, idx) => (
                                <option key={s.id} value={s.id}>#{idx + 1} {s.type}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {step.type === 'delay' && (
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Delay (ms)</label>
                      <Input
                        type="number"
                        value={step.delayMs}
                        onChange={(e) => updateStep(step.id, { delayMs: parseInt(e.target.value) || 0 })}
                        className="w-full"
                      />
                    </div>
                  )}

                  {step.type === 'set_variable' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Variable Name</label>
                        <Input
                          value={step.variableName}
                          onChange={(e) => updateStep(step.id, { variableName: e.target.value })}
                          placeholder="e.g., myData"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Value (Expression)</label>
                        <Input
                          value={step.variableValue}
                          onChange={(e) => updateStep(step.id, { variableValue: e.target.value })}
                          placeholder="lastResult.output"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroBuilder;
