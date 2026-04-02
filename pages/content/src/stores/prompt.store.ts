import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Prompt } from '../types/stores';
import { createLogger } from '@extension/shared/lib/logger';
import { mcpClient } from '../core/mcp-client';

const logger = createLogger('usePromptStore');

export interface PromptGet {
  name: string;
  args: any;
  status: 'pending' | 'success' | 'error';
  result?: any;
  error?: string;
  timestamp: number;
}

export interface PromptState {
  availablePrompts: Prompt[];
  promptGets: Record<string, PromptGet>;
  isGetting: boolean;

  setAvailablePrompts: (prompts: Prompt[]) => void;
  getPrompt: (name: string, args: Record<string, string>) => Promise<any>;
}

export const usePromptStore = create<PromptState>()(
  devtools(
    (set, get) => ({
      availablePrompts: [],
      promptGets: {},
      isGetting: false,

      setAvailablePrompts: (prompts: Prompt[]) => {
        set({ availablePrompts: prompts });
        logger.debug('[PromptStore] Available prompts updated:', prompts);
      },

      getPrompt: async (name: string, args: Record<string, string>) => {
        set({ isGetting: true });
        logger.debug(`[PromptStore] Getting prompt: ${name}`, args);

        try {
          const result = await mcpClient.getPrompt(name, args);
          set({ isGetting: false });
          logger.debug(`[PromptStore] Get prompt success: ${name}`);
          return result;
        } catch (error) {
          set({ isGetting: false });
          logger.error(`[PromptStore] Get prompt failed: ${name}`, error);
          throw error;
        }
      },
    }),
    { name: 'PromptStore' },
  ),
);
