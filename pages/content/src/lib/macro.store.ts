import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type StepType = 'tool' | 'condition' | 'delay';
export type ActionType = 'continue' | 'stop' | 'goto';

export interface MacroStep {
  id: string;
  type: StepType;

  // For 'tool' type
  toolName?: string;
  args?: Record<string, any>; // JSON string or object

  // For 'condition' type
  expression?: string; // JS expression: 'lastResult.status === "success"'
  trueAction?: ActionType;
  trueTargetStepId?: string;
  falseAction?: ActionType;
  falseTargetStepId?: string;

  // For 'delay' type
  delayMs?: number;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  steps: MacroStep[];
  createdAt: number;
  updatedAt: number;
}

interface MacroStore {
  macros: Macro[];
  addMacro: (macro: Omit<Macro, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMacro: (id: string, updates: Partial<Omit<Macro, 'id' | 'createdAt'>>) => void;
  deleteMacro: (id: string) => void;
  getMacro: (id: string) => Macro | undefined;
}

export const useMacroStore = create<MacroStore>()(
  persist(
    (set, get) => ({
      macros: [],

      addMacro: (macroData) => set((state) => ({
        macros: [
          ...state.macros,
          {
            ...macroData,
            id: uuidv4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      })),

      updateMacro: (id, updates) => set((state) => ({
        macros: state.macros.map((m) =>
          m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m
        ),
      })),

      deleteMacro: (id) => set((state) => ({
        macros: state.macros.filter((m) => m.id !== id),
      })),

      getMacro: (id) => get().macros.find((m) => m.id === id),
    }),
    {
      name: 'mcp-macros',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
