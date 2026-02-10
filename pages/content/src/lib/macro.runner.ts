import { Macro, MacroStep } from './macro.store';
import { logMessage } from '@src/utils/helpers';

export class MacroRunner {
  private sendMessage: (toolName: string, args: any) => Promise<any>;
  private onLog: (message: string, type: 'info' | 'error' | 'success') => void;

  constructor(
    sendMessage: (toolName: string, args: any) => Promise<any>,
    onLog: (message: string, type: 'info' | 'error' | 'success') => void
  ) {
    this.sendMessage = sendMessage;
    this.onLog = onLog;
  }

  async run(macro: Macro) {
    this.onLog(`Starting macro: ${macro.name}`, 'info');

    let currentStepIndex = 0;
    const results: any[] = [];
    let lastResult: any = null;
    const env: Record<string, any> = {};
    const maxSteps = 1000; // Safety limit
    let stepCount = 0;

    while (currentStepIndex < macro.steps.length && currentStepIndex >= 0) {
      if (stepCount++ > maxSteps) {
        throw new Error('Macro execution exceeded maximum step limit (potential infinite loop)');
      }

      const step = macro.steps[currentStepIndex];
      this.onLog(`Executing step ${currentStepIndex + 1}: ${step.type}`, 'info');

      try {
        if (step.type === 'tool') {
          if (!step.toolName) throw new Error('Tool name missing');

          this.onLog(`Running tool: ${step.toolName}`, 'info');

          const processedArgs = this.processArgs(step.args, lastResult, results, env);

          lastResult = await this.sendMessage(step.toolName, processedArgs);
          results.push(lastResult);

          this.onLog(`Tool finished: ${step.toolName}`, 'success');
          currentStepIndex++;

        } else if (step.type === 'delay') {
          const delay = step.delayMs || 1000;
          this.onLog(`Waiting ${delay}ms...`, 'info');
          await new Promise(r => setTimeout(r, delay));
          currentStepIndex++;

        } else if (step.type === 'condition') {
          const condition = step.expression || 'false';
          let conditionResult = false;

          try {
            conditionResult = this.evaluateCondition(condition, { lastResult, allResults: results, env });
            this.onLog(`Condition evaluated to: ${conditionResult}`, 'info');
          } catch (e) {
            this.onLog(`Condition evaluation error: ${e}`, 'error');
            conditionResult = false;
          }

          const action = conditionResult ? step.trueAction : step.falseAction;
          const target = conditionResult ? step.trueTargetStepId : step.falseTargetStepId;

          if (action === 'stop') {
            this.onLog('Macro stopped by condition', 'info');
            break;
          } else if (action === 'goto' && target) {
            const nextIndex = macro.steps.findIndex(s => s.id === target);
            if (nextIndex === -1) {
              this.onLog(`Target step ${target} not found`, 'error');
              break;
            }
            currentStepIndex = nextIndex;
          } else {
            // 'continue' or default
            currentStepIndex++;
          }
        } else {
            currentStepIndex++;
        }
      } catch (error) {
        this.onLog(`Step failed: ${error}`, 'error');
        throw error;
      }
    }

    this.onLog(`Macro ${macro.name} completed`, 'success');
    return lastResult;
  }

  private processArgs(args: any, lastResult: any, allResults: any[], env: any): any {
    if (!args) return {};
    let processed = JSON.parse(JSON.stringify(args));

    const walk = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          if (obj[key] === '{{lastResult}}') {
              obj[key] = lastResult;
          } else if (obj[key].includes('{{')) {
              // Basic replacement if needed, though strictly we might want structured substitution
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          walk(obj[key]);
        }
      }
    };

    walk(processed);
    return processed;
  }

  private evaluateCondition(expression: string, context: any): boolean {
    const expr = expression.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;

    // Simple parser: path operator value
    // Matches: path operator value
    const match = expr.match(/^([\w\d\.\[\]]+)\s*(===|==|!==|!=|>|<|>=|<=)\s*(.+)$/);

    if (!match) {
      // Fallback: strict property existence check? No, default false.
      // Maybe log warning in caller if needed, but here just return false.
      return false;
    }

    const [_, path, op, rightStr] = match;

    // Resolve left side from context
    let leftVal = context;
    const parts = path.split('.');
    for (const part of parts) {
      if (leftVal === undefined || leftVal === null) break;
      leftVal = leftVal[part];
    }

    // Parse right side
    let rightVal: any = rightStr.trim();
    if ((rightVal.startsWith("'") && rightVal.endsWith("'")) || (rightVal.startsWith('"') && rightVal.endsWith('"'))) {
      rightVal = rightVal.slice(1, -1);
    } else if (rightVal === 'true') {
      rightVal = true;
    } else if (rightVal === 'false') {
      rightVal = false;
    } else if (!isNaN(Number(rightVal))) {
      rightVal = Number(rightVal);
    }

    switch (op) {
      case '==': return leftVal == rightVal;
      case '===': return leftVal === rightVal;
      case '!=': return leftVal != rightVal;
      case '!==': return leftVal !== rightVal;
      case '>': return leftVal > rightVal;
      case '<': return leftVal < rightVal;
      case '>=': return leftVal >= rightVal;
      case '<=': return leftVal <= rightVal;
    }

    return false;
  }
}
