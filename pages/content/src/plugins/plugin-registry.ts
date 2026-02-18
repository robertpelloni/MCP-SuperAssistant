import { createLogger } from '@extension/shared/lib/logger';
import type { Plugin } from './plugin-types';

const logger = createLogger('PluginRegistry');

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      logger.warn(`Plugin ${plugin.name} already registered, overwriting.`);
    }
    this.plugins.set(plugin.name, plugin);
    logger.debug(`Registered plugin: ${plugin.name}`);
  }

  async initializeAll() {
    logger.info(`Initializing ${this.plugins.size} plugins...`);
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.initialize();
        logger.debug(`Initialized plugin: ${plugin.name}`);
      } catch (error) {
        logger.error(`Failed to initialize plugin ${plugin.name}:`, error);
      }
    }
  }

  async cleanupAll() {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.cleanup();
      } catch (error) {
        logger.error(`Failed to cleanup plugin ${plugin.name}:`, error);
      }
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistry();
