import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface MacroStep {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  description?: string;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  steps: MacroStep[];
  createdAt: number;
}

interface MacroStore {
  macros: Macro[];
  addMacro: (macro: Omit<Macro, 'id' | 'createdAt'>) => void;
  removeMacro: (id: string) => void;
  updateMacro: (id: string, updates: Partial<Macro>) => void;
}

export const useMacroStore = create<MacroStore>()(
  persist(
    set => ({
      macros: [],
      addMacro: macro =>
        set(state => ({
          macros: [...state.macros, { ...macro, id: crypto.randomUUID(), createdAt: Date.now() }],
        })),
      removeMacro: id =>
        set(state => ({
          macros: state.macros.filter(m => m.id !== id),
        })),
      updateMacro: (id, updates) =>
        set(state => ({
          macros: state.macros.map(m => (m.id === id ? { ...m, ...updates } : m)),
        })),
    }),
    {
      name: 'mcp-macros',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
