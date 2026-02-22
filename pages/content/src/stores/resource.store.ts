import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Resource } from '../types/stores';
import { createLogger } from '@extension/shared/lib/logger';
import { mcpClient } from '../core/mcp-client';

const logger = createLogger('useResourceStore');

export interface ResourceRead {
    uri: string;
    status: 'pending' | 'success' | 'error';
    result?: any;
    error?: string;
    timestamp: number;
}

export interface ResourceState {
  availableResources: Resource[];
  resourceReads: Record<string, ResourceRead>; // Keyed by URI or some ID? URI might be duplicate reads. Let's use ID.
  isReading: boolean;

  setAvailableResources: (resources: Resource[]) => void;
  readResource: (uri: string) => Promise<any>;
}

export const useResourceStore = create<ResourceState>()(
  devtools(
    (set, get) => ({
      availableResources: [],
      resourceReads: {},
      isReading: false,

      setAvailableResources: (resources: Resource[]) => {
        set({ availableResources: resources });
        logger.debug('[ResourceStore] Available resources updated:', resources);
      },

      readResource: async (uri: string) => {
        set({ isReading: true });
        logger.debug(`[ResourceStore] Reading resource: ${uri}`);

        try {
            const result = await mcpClient.readResource(uri);
            set({ isReading: false });
            logger.debug(`[ResourceStore] Read resource success: ${uri}`);
            return result;
        } catch (error) {
            set({ isReading: false });
            logger.error(`[ResourceStore] Read resource failed: ${uri}`, error);
            throw error;
        }
      },
    }),
    { name: 'ResourceStore' },
  ),
);
