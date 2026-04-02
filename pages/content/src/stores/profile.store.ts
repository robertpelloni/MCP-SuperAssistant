import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ConnectionType } from '@src/types/stores';

export interface ConnectionProfile {
  id: string;
  name: string;
  uri: string;
  connectionType: ConnectionType;
}

interface ProfileStore {
  profiles: ConnectionProfile[];
  activeProfileId: string | null;
  addProfile: (profile: Omit<ConnectionProfile, 'id'>) => void;
  removeProfile: (id: string) => void;
  updateProfile: (id: string, updates: Partial<ConnectionProfile>) => void;
  setActiveProfile: (id: string | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    set => ({
      profiles: [
        {
          id: 'default-sse',
          name: 'Default (SSE)',
          uri: 'http://localhost:3006/sse',
          connectionType: 'sse',
        },
        {
          id: 'default-ws',
          name: 'Default (WebSocket)',
          uri: 'ws://localhost:3006/message',
          connectionType: 'websocket',
        },
      ],
      activeProfileId: 'default-sse',
      addProfile: profile =>
        set(state => ({
          profiles: [...state.profiles, { ...profile, id: crypto.randomUUID() }],
        })),
      removeProfile: id =>
        set(state => ({
          profiles: state.profiles.filter(p => p.id !== id),
          // If active profile is removed, reset to null
          activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
        })),
      updateProfile: (id, updates) =>
        set(state => ({
          profiles: state.profiles.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),
      setActiveProfile: id => set({ activeProfileId: id }),
    }),
    {
      name: 'mcp-connection-profiles',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
