import type { FeaturePlugin } from './plugin-types';
import { createLogger } from '@extension/shared/lib/logger';
import { pluginRegistry } from './plugin-registry';

const logger = createLogger('RemoteConfigPlugin');

export const RemoteConfigPlugin: FeaturePlugin = {
  name: 'RemoteConfig',
  version: '1.0.0',
  type: 'feature',

  async initialize() {
    logger.debug('Remote Config plugin initializing...');
    // Connect to background script for updates?
  },

  async cleanup() {
    logger.debug('Remote Config plugin cleanup');
  },
};

pluginRegistry.register(RemoteConfigPlugin);
