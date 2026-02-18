import { createLogger } from '@extension/shared/lib/logger';
import { pluginRegistry } from '../plugins/plugin-registry';
import { initializeAllServices, cleanupAllServices } from '../services';
import { mcpClient } from './mcp-client';
import { useAppStore } from '../stores/app.store';
import { useAdapterStore } from '../stores/adapter.store';
import { eventBus } from '../events/event-bus';

// Import plugins to ensure they register themselves
import '../plugins/sidebar.plugin';
import '../plugins/remote-config.plugin';
// Adapters will be imported by the plugin registry or dynamic loader

const logger = createLogger('MainInitializer');

export const initializationUtils = {
  // Utility to check if initialization is complete
  isInitialized: () => useAppStore.getState().isInitialized,

  // Utility to get current initialization error
  getInitializationError: () => useAppStore.getState().initializationError,

  // Utility to reset initialization state (for testing/recovery)
  resetInitialization: () => useAppStore.getState().resetState(),
};

/**
 * Main application initialization sequence
 * This orchestrates the startup of all subsystems in the correct order
 */
export async function applicationInit(): Promise<void> {
  const appStore = useAppStore.getState();

  if (appStore.isInitialized) {
    logger.info('Application already initialized, skipping');
    return;
  }

  logger.info('Starting application initialization...');

  try {
    // 1. Initialize core services (Automation, etc.)
    await initializeAllServices();
    logger.debug('Core services initialized');

    // 2. Initialize Plugin Registry
    // This allows plugins (Sidebar, RemoteConfig) to set up their listeners
    await pluginRegistry.initializeAll();
    logger.debug('Plugins initialized');

    // 3. Detect and activate the appropriate adapter
    // This replaces the legacy adapter detection logic
    const adapterStore = useAdapterStore.getState();
    const activeAdapter = await adapterStore.detectAndActivateAdapter();

    if (activeAdapter) {
      logger.info(`Active adapter detected: ${activeAdapter.name}`);
      eventBus.emit('adapter:activated', { adapter: activeAdapter });
    } else {
      logger.warn('No suitable adapter detected for this page');
    }

    // 4. Mark application as initialized
    appStore.initialize();
    logger.info('Application initialization complete');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Application initialization failed:', errorMessage);

    appStore.setInitializationError(errorMessage);

    // Attempt graceful degradation?
    // For now, we just log it. The UI should pick up the error state from the store.
  }
}

/**
 * Main application cleanup sequence
 */
export async function applicationCleanup(): Promise<void> {
  logger.info('Starting application cleanup...');

  try {
    // 1. Cleanup plugins
    await pluginRegistry.cleanupAll();

    // 2. Cleanup core services
    await cleanupAllServices();

    // 3. Reset Stores (Optional, maybe we want to keep state?)
    // useAppStore.getState().resetState();

    // 4. Disconnect MCP Client
    // mcpClient.disconnect(); // Typically handled by hook unmount, but good to be explicit if needed

    logger.info('Application cleanup complete');
  } catch (error) {
    logger.error('Application cleanup failed:', error);
  }
}
