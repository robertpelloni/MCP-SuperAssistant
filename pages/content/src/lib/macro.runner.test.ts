import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MacroRunner } from './macro.runner';
import type { Macro } from './macro.store';

describe('MacroRunner', () => {
  let sendMessageMock: any;
  let onLogMock: any;
  let runner: MacroRunner;

  beforeEach(() => {
    sendMessageMock = vi.fn();
    onLogMock = vi.fn();
    runner = new MacroRunner(sendMessageMock, onLogMock);
  });

  it('runs a simple tool step', async () => {
    const macro: Macro = {
      id: '1',
      name: 'Test',
      description: '',
      steps: [{ id: 's1', type: 'tool', toolName: 'test_tool', args: { foo: 'bar' } }],
      createdAt: 0,
      updatedAt: 0
    };

    sendMessageMock.mockResolvedValue({ status: 'ok' });

    await runner.run(macro);

    expect(sendMessageMock).toHaveBeenCalledWith('test_tool', { foo: 'bar' });
    expect(onLogMock).toHaveBeenCalledWith(expect.stringContaining('Test'), 'info');
  });

  it('substitutes variables in tool args', async () => {
    const macro: Macro = {
      id: '2',
      name: 'Var Test',
      description: '',
      steps: [
        { id: 's1', type: 'set_variable', variableName: 'myVar', variableValue: 'hello' },
        { id: 's2', type: 'tool', toolName: 'echo', args: { msg: '{{env.myVar}}' } }
      ],
      createdAt: 0,
      updatedAt: 0
    };

    sendMessageMock.mockResolvedValue({});

    await runner.run(macro);

    expect(sendMessageMock).toHaveBeenCalledWith('echo', { msg: 'hello' });
  });

  it('evaluates conditions correctly', async () => {
    const macro: Macro = {
      id: '3',
      name: 'Condition Test',
      description: '',
      steps: [
        { id: 's1', type: 'set_variable', variableName: 'x', variableValue: '10' },
        {
          id: 's2',
          type: 'condition',
          expression: 'env.x > 5',
          trueAction: 'continue',
          falseAction: 'stop'
        },
        { id: 's3', type: 'tool', toolName: 'success_tool', args: {} }
      ],
      createdAt: 0,
      updatedAt: 0
    };

    sendMessageMock.mockResolvedValue({});

    await runner.run(macro);

    expect(sendMessageMock).toHaveBeenCalledWith('success_tool', {});
  });
});
