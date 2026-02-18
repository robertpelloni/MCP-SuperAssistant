export interface Plugin {
  name: string;
  version: string;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  onEvent?: (event: string, data: any) => void;
}

export interface AdapterPlugin extends Plugin {
  type: 'adapter';
  matchUrl: (url: string) => boolean;
  // Specific adapter methods...
}

export interface FeaturePlugin extends Plugin {
  type: 'feature';
  setupRecovery?: () => void;
}
