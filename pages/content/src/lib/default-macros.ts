import type { Macro } from './macro.store';

export const DEFAULT_MACROS: Omit<Macro, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Summarize Selection',
    description: 'Summarizes the currently selected text using an AI tool.',
    steps: [
      {
        id: 'step-1',
        type: 'set_variable',
        variableName: 'input',
        variableValue: '{{selection}}'
      },
      {
        id: 'step-2',
        type: 'tool',
        toolName: 'summarizer', // Placeholder, assumes a summarizer tool exists
        args: {
          text: '{{env.input}}',
          length: 'short'
        }
      }
    ]
  },
  {
    name: 'Explain Code',
    description: 'Explains the selected code snippet.',
    steps: [
      {
        id: 'step-1',
        type: 'tool',
        toolName: 'code_explainer', // Placeholder
        args: {
          code: '{{selection}}'
        }
      }
    ]
  },
  {
    name: 'Fix Grammar',
    description: 'Corrects grammar in the selected text.',
    steps: [
      {
        id: 'step-1',
        type: 'tool',
        toolName: 'grammar_fixer', // Placeholder
        args: {
          text: '{{selection}}'
        }
      }
    ]
  }
];
