import type { FeaturePlugin } from './plugin-types';
import { createLogger } from '@extension/shared/lib/logger';
import { pluginRegistry } from './plugin-registry';

const logger = createLogger('SidebarPlugin');

export const SidebarPlugin: FeaturePlugin = {
  name: 'Sidebar',
  version: '1.0.0',
  type: 'feature',

  async initialize() {
    logger.debug('Sidebar plugin initializing...');
    this.setupRecovery();
  },

  setupRecovery() {
    const recoveryInterval = setInterval(() => {
      try {
        const sidebarManager = (window as any).activeSidebarManager;
        if (!sidebarManager) return;

        const htmlElement = document.documentElement;
        if (htmlElement.classList.contains('push-mode-enabled')) {
          const shadowHost = sidebarManager.getShadowHost();
          if (shadowHost) {
            if (
              shadowHost.style.display !== 'block' ||
              window.getComputedStyle(shadowHost).display === 'none' ||
              shadowHost.style.opacity !== '1'
            ) {
              logger.debug('[SidebarPlugin] Detected invisible sidebar, forcing visibility');
              shadowHost.style.display = 'block';
              shadowHost.style.opacity = '1';
              shadowHost.classList.add('initialized');
            }
          }
        }
      } catch (error) {
        logger.error('[SidebarPlugin] Recovery error:', error);
      }
    }, 1000);

    window.addEventListener('unload', () => clearInterval(recoveryInterval));
  },

  async cleanup() {
    logger.debug('Sidebar plugin cleanup');
  }
};

pluginRegistry.register(SidebarPlugin);
