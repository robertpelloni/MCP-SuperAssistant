import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createLogger } from '@extension/shared/lib/logger';
import { mcpClient } from '../core/mcp-client';

const logger = createLogger('useSamplingStore');

export interface SamplingRequest {
  requestId: string;
  request: {
    messages: any[];
    maxTokens?: number;
    // ... other params
  };
}

export interface SamplingState {
  activeRequest: SamplingRequest | null;

  // Actions
  handleRequest: (requestId: string, request: any) => void;
  resolveRequest: (result: any) => void;
  rejectRequest: (error: any) => void;
}

export const useSamplingStore = create<SamplingState>()(
  devtools(
    (set, get) => ({
      activeRequest: null,

      handleRequest: (requestId: string, request: any) => {
        logger.debug('[SamplingStore] Received request:', requestId);
        set({ activeRequest: { requestId, request } });
      },

      resolveRequest: async (result: any) => {
        const { activeRequest } = get();
        if (!activeRequest) return;

        logger.debug('[SamplingStore] Resolving request:', activeRequest.requestId);
        try {
          await mcpClient.sendSamplingResponse(activeRequest.requestId, result);
        } catch (error) {
          logger.error('[SamplingStore] Error resolving request:', error);
        } finally {
          set({ activeRequest: null });
        }
      },

      rejectRequest: async (error: any) => {
        const { activeRequest } = get();
        if (!activeRequest) return;

        logger.debug('[SamplingStore] Rejecting request:', activeRequest.requestId);
        try {
          await mcpClient.sendSamplingResponse(activeRequest.requestId, undefined, error);
        } catch (err) {
          logger.error('[SamplingStore] Error rejecting request:', err);
        } finally {
          set({ activeRequest: null });
        }
      },
    }),
    { name: 'SamplingStore' },
  ),
);
