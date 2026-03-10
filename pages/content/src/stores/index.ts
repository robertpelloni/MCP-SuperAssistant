import { createLogger } from '@extension/shared/lib/logger';
import { useRootStore } from './root.store';
import type { RootState } from './root.store';

const logger = createLogger('Stores');

export { useRootStore } from './root.store';
export type { RootState } from './root.store';

// Legacy Store Mappings (Backwards Compatibility)
// These intercept calls to legacy stores and map them to the unified Root Store slices.

export const useUIStore = Object.assign(
  <T>(selector?: (state: RootState['ui']) => T) => {
    return useRootStore(state => (selector ? selector(state.ui) : (state.ui as any)));
  },
  {
    getState: () => useRootStore.getState().ui,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          ui: {
            ...state.ui,
            ...(typeof partial === 'function' ? partial(state.ui) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['ui'], prevState: RootState['ui']) => void) => {
      let prevState = useRootStore.getState().ui;
      return useRootStore.subscribe((state) => {
        if (state.ui !== prevState) {
          const newUi = state.ui;
          listener(newUi, prevState);
          prevState = newUi;
        }
      });
    },
  }
) as any;

export const useAppStore = Object.assign(
  <T>(selector?: (state: RootState['ui']) => T) => {
    return useRootStore(state => (selector ? selector(state.ui) : (state.ui as any)));
  },
  {
    getState: () => useRootStore.getState().ui,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          ui: {
            ...state.ui,
            ...(typeof partial === 'function' ? partial(state.ui) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['ui'], prevState: RootState['ui']) => void) => {
      let prevState = useRootStore.getState().ui;
      return useRootStore.subscribe((state) => {
        if (state.ui !== prevState) {
          const newUi = state.ui;
          listener(newUi, prevState);
          prevState = newUi;
        }
      });
    },
  }
) as any;

export const useConfigStore = Object.assign(
  <T>(selector?: (state: RootState['config']) => T) => {
    return useRootStore(state => (selector ? selector(state.config) : (state.config as any)));
  },
  {
    getState: () => useRootStore.getState().config,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          config: {
            ...state.config,
            ...(typeof partial === 'function' ? partial(state.config) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['config'], prevState: RootState['config']) => void) => {
      let prevState = useRootStore.getState().config;
      return useRootStore.subscribe((state) => {
        if (state.config !== prevState) {
          const newConfig = state.config;
          listener(newConfig, prevState);
          prevState = newConfig;
        }
      });
    },
  }
) as any;

export const useToolStore = Object.assign(
  <T>(selector?: (state: RootState['tool']) => T) => {
    return useRootStore(state => (selector ? selector(state.tool) : (state.tool as any)));
  },
  {
    getState: () => useRootStore.getState().tool,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          tool: {
            ...state.tool,
            ...(typeof partial === 'function' ? partial(state.tool) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['tool'], prevState: RootState['tool']) => void) => {
      let prevState = useRootStore.getState().tool;
      return useRootStore.subscribe((state) => {
        if (state.tool !== prevState) {
          const newTool = state.tool;
          listener(newTool, prevState);
          prevState = newTool;
        }
      });
    },
  }
) as any;

export const useResourceStore = Object.assign(
  <T>(selector?: (state: RootState['resource']) => T) => {
    return useRootStore(state => (selector ? selector(state.resource) : (state.resource as any)));
  },
  {
    getState: () => useRootStore.getState().resource,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          resource: {
            ...state.resource,
            ...(typeof partial === 'function' ? partial(state.resource) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['resource'], prevState: RootState['resource']) => void) => {
      let prevState = useRootStore.getState().resource;
      return useRootStore.subscribe((state) => {
        if (state.resource !== prevState) {
          const newResource = state.resource;
          listener(newResource, prevState);
          prevState = newResource;
        }
      });
    },
  }
) as any;

export const useConnectionStore = Object.assign(
  <T>(selector?: (state: RootState['connection']) => T) => {
    return useRootStore(state => (selector ? selector(state.connection) : (state.connection as any)));
  },
  {
    getState: () => useRootStore.getState().connection,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          connection: {
            ...state.connection,
            ...(typeof partial === 'function' ? partial(state.connection) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['connection'], prevState: RootState['connection']) => void) => {
      let prevState = useRootStore.getState().connection;
      return useRootStore.subscribe((state) => {
        if (state.connection !== prevState) {
          const newConnection = state.connection;
          listener(newConnection, prevState);
          prevState = newConnection;
        }
      });
    },
  }
) as any;

export const useProfileStore = Object.assign(
  <T>(selector?: (state: RootState['connection']) => T) => {
    return useRootStore(state => (selector ? selector(state.connection) : (state.connection as any)));
  },
  {
    getState: () => useRootStore.getState().connection,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          connection: {
            ...state.connection,
            ...(typeof partial === 'function' ? partial(state.connection) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['connection'], prevState: RootState['connection']) => void) => {
      let prevState = useRootStore.getState().connection;
      return useRootStore.subscribe((state) => {
        if (state.connection !== prevState) {
          const newConnection = state.connection;
          listener(newConnection, prevState);
          prevState = newConnection;
        }
      });
    },
  }
) as any;

export const useAdapterStore = Object.assign(
  <T>(selector?: (state: RootState['adapter']) => T) => {
    return useRootStore(state => (selector ? selector(state.adapter) : (state.adapter as any)));
  },
  {
    getState: () => useRootStore.getState().adapter,
    setState: (partial: any, replace?: false) => {
      useRootStore.setState(
        (state: RootState) => ({
          adapter: {
            ...state.adapter,
            ...(typeof partial === 'function' ? partial(state.adapter) : partial),
          },
        }),
        replace
      );
    },
    subscribe: (listener: (state: RootState['adapter'], prevState: RootState['adapter']) => void) => {
      let prevState = useRootStore.getState().adapter;
      return useRootStore.subscribe((state) => {
        if (state.adapter !== prevState) {
          const newAdapter = state.adapter;
          listener(newAdapter, prevState);
          prevState = newAdapter;
        }
      });
    },
  }
) as any;

// Type exports for backwards compatibility
export type { FeatureFlag, UserProperties, NotificationConfig, RemoteNotification } from './slices/createConfigSlice';
export type { ConfigState } from './config.store';
export type { ConnectionState } from './connection.store';
export type { ToolState } from './tool.store';
export type { ResourceState, Resource, ResourceTemplate } from './resource.store';
export type { AdapterState } from './adapter.store';
export type { AppState } from './app.store';
export type { UIState } from './ui.store';

// Satellite stores (not yet sliced — small, domain-specific, standalone)
export { useDebuggerStore, type DebugPacket } from './debugger.store';
export { useMacroStore, type Macro } from './macro.store';
export { useContextStore, type ContextItem } from './context.store';
export { useToastStore, type Toast } from './toast.store';
export { useActivityStore, type LogType, type LogStatus } from './activity.store';
export { usePromptStore, type PromptTemplate } from './prompt.store';

export async function initializeAllStores(): Promise<void> {
  logger.debug('Initializing all stores...');

  useRootStore.getState();

  const rootState = useRootStore.getState();

  rootState.setUserProperties({
    extensionVersion: chrome?.runtime?.getManifest?.()?.version || '0.0.0',
    lastActiveDate: new Date().toISOString(),
    browserVersion: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  if (!rootState.ui.isInitialized) {
    await rootState.initializeAppInfo();
  }

  logger.debug('All stores accessed/initialized.');
}
