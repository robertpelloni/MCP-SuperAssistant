import { create } from 'zustand';
import { createLogger } from '@extension/shared/lib/logger';

const logger = createLogger('AppStore');

export interface AppState {
  isInitialized: boolean;
  initializationError: string | null;
  globalSettings: {
    theme: 'light' | 'dark' | 'system';
    sidebarWidth: number;
  };

  // Actions
  initialize: () => void;
  setInitializationError: (error: string | null) => void;
  resetState: () => void;
  updateSettings: (settings: Partial<AppState['globalSettings']>) => void;
}

export const useAppStore = create<AppState>(set => ({
  isInitialized: false,
  initializationError: null,
  globalSettings: {
    theme: 'system',
    sidebarWidth: 320,
  },

  initialize: () => {
    set({ isInitialized: true, initializationError: null });
    logger.debug('AppStore initialized');
  },

  setInitializationError: error => {
    set({ initializationError: error });
    logger.error('AppStore initialization error:', error);
  },

  resetState: () => {
    set({ isInitialized: false, initializationError: null });
    logger.debug('AppStore state reset');
  },

  updateSettings: settings => {
    set(state => ({
      globalSettings: { ...state.globalSettings, ...settings },
    }));
  },
}));
