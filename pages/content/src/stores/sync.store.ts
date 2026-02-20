import { create } from 'zustand';
import { createLogger } from '@extension/shared/lib/logger';

const logger = createLogger('SyncStore');

export interface SyncState {
  isEnabled: boolean;
  lastSyncedAt: number | null;
  status: 'idle' | 'syncing' | 'error' | 'success';
  error: string | null;
  conflicts: string[]; // IDs of conflicting items

  setSyncEnabled: (enabled: boolean) => void;
  setSyncStatus: (status: SyncState['status']) => void;
  setLastSyncedAt: (timestamp: number) => void;
  setError: (error: string | null) => void;
  setConflicts: (conflicts: string[]) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isEnabled: false,
  lastSyncedAt: null,
  status: 'idle',
  error: null,
  conflicts: [],

  setSyncEnabled: (enabled) => {
    set({ isEnabled: enabled });
    // Ideally persist this to local storage too
    localStorage.setItem('mcp_sync_enabled', String(enabled));
  },

  setSyncStatus: (status) => set({ status }),
  setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp }),
  setError: (error) => set({ error }),
  setConflicts: (conflicts) => set({ conflicts }),
}));
