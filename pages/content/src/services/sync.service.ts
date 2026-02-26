import { createLogger } from '@extension/shared/lib/logger';
import { useSyncStore } from '../stores/sync.store';
import { useMacroStore } from '../lib/macro.store';
import { useContextStore } from '../lib/context.store';
import { useUserPreferences } from '../hooks/useStores';

const logger = createLogger('SyncService');

export class SyncService {
  private static instance: SyncService;
  private isSyncing = false;

  private constructor() {}

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  public async sync(): Promise<void> {
    const store = useSyncStore.getState();
    if (!store.isEnabled || this.isSyncing) return;

    this.isSyncing = true;
    store.setSyncStatus('syncing');
    logger.info('Starting Cloud Sync...');

    try {
      // 1. Gather Data
      const macros = useMacroStore.getState().macros;
      const contexts = useContextStore.getState().contexts;

      const payload = {
        macros,
        contexts,
        timestamp: Date.now(),
      };

      // 2. Serialize & Compress (Mock for now, chrome.storage.sync has limits)
      // Real implementation would chunk data or use a better backend if exceeding limits.
      // chrome.storage.sync limit is 100KB total, 8KB per item.
      // This is VERY small. We likely need to compress or only sync critical settings.
      // For macros, we might need `chrome.storage.local` if we assume "Cloud Sync" implies Google Drive or similar via generic sync?
      // Actually `chrome.storage.sync` syncs across Chrome browsers logged in.

      const serialized = JSON.stringify(payload);
      if (serialized.length > 8000) {
        throw new Error('Data too large for Chrome Sync (limit 8KB per item)');
      }

      // 3. Save to Chrome Sync
      await chrome.storage.sync.set({ mcp_cloud_data: payload });

      store.setLastSyncedAt(Date.now());
      store.setSyncStatus('success');
      logger.info('Cloud Sync completed successfully');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error('Cloud Sync failed:', msg);
      store.setError(msg);
      store.setSyncStatus('error');
    } finally {
      this.isSyncing = false;
    }
  }

  public async pull(): Promise<void> {
    const store = useSyncStore.getState();
    if (!store.isEnabled || this.isSyncing) return;

    this.isSyncing = true;
    store.setSyncStatus('syncing');

    try {
      const data = await chrome.storage.sync.get('mcp_cloud_data');
      if (data.mcp_cloud_data) {
        const { macros, contexts } = data.mcp_cloud_data;

        // Merge logic (Last Write Wins for now)
        if (macros) useMacroStore.setState({ macros });
        if (contexts) useContextStore.setState({ contexts });

        store.setLastSyncedAt(Date.now());
        store.setSyncStatus('success');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      store.setError(msg);
      store.setSyncStatus('error');
    } finally {
      this.isSyncing = false;
    }
  }
}
