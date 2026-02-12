import React, { useState } from 'react';
import { useUserPreferences } from '@src/hooks';
import { useProfileStore } from '@src/stores/profile.store';
import { useActivityStore } from '@src/stores/activity.store';
import { useToastStore } from '@src/stores/toast.store';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Typography, Icon, Button, ToggleWithoutLabel } from '../ui';
import { ThemeSelector } from './ThemeSelector';
import { AutomationService } from '@src/services/automation.service';
import { cn } from '@src/lib/utils';
import { createLogger } from '@extension/shared/lib/logger';

const logger = createLogger('Settings');

const DEFAULT_DELAYS = {
  autoInsertDelay: 2,
  autoSubmitDelay: 2,
  autoExecuteDelay: 2,
} as const;

const Settings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  // Sync local state with preferences for smoother UI if needed
  const [trustedToolsInput, setTrustedToolsInput] = useState('');

  // Handle delay input changes
  const handleDelayChange = (type: 'autoInsert' | 'autoSubmit' | 'autoExecute', value: string) => {
    const delay = Math.max(0, parseInt(value) || 0); // Ensure non-negative integer
    logger.debug(`${type} delay changed to: ${delay}`);

    // Update user preferences store with the new delay
    updatePreferences({ [`${type}Delay`]: delay });

    // Store in localStorage
    try {
      const storedDelays = JSON.parse(localStorage.getItem('mcpDelaySettings') || '{}');
      localStorage.setItem(
        'mcpDelaySettings',
        JSON.stringify({
          ...storedDelays,
          [`${type}Delay`]: delay,
        }),
      );
    } catch (error) {
      logger.error('[Settings] Error storing delay settings:', error);
    }

    // Update automation state on window
    AutomationService.getInstance().updateAutomationStateOnWindow().catch(console.error);
  };

  // Load stored delays on component mount, set default to 2 seconds if not set
  React.useEffect(() => {
    try {
      const storedDelays = JSON.parse(localStorage.getItem('mcpDelaySettings') || '{}');
      // If no stored delays, use defaults
      if (Object.keys(storedDelays).length === 0) {
        updatePreferences(DEFAULT_DELAYS);
        localStorage.setItem('mcpDelaySettings', JSON.stringify(DEFAULT_DELAYS));
      } else {
        // Use stored delays
        updatePreferences(storedDelays);
      }
    } catch (error) {
      logger.error('[Settings] Error loading stored delay settings:', error);
      // Set defaults on error
      updatePreferences(DEFAULT_DELAYS);
      localStorage.setItem('mcpDelaySettings', JSON.stringify(DEFAULT_DELAYS));
    }
  }, [updatePreferences]);

  const handleResetDefaults = () => {
    updatePreferences(DEFAULT_DELAYS);
    localStorage.setItem('mcpDelaySettings', JSON.stringify(DEFAULT_DELAYS));
    logger.debug('[Settings] Reset to defaults');
  };

  const handleExportData = () => {
    const data = {
      preferences: preferences,
      profiles: useProfileStore.getState().profiles,
      activeProfileId: useProfileStore.getState().activeProfileId,
      logs: useActivityStore.getState().logs,
      favorites: JSON.parse(localStorage.getItem('mcpFavorites') || '[]'),
      version: '0.6.1',
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-superassistant-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    useToastStore.getState().addToast({
      title: 'Export Successful',
      message: 'Data exported to JSON file',
      type: 'success',
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.preferences) updatePreferences(data.preferences);
        if (data.profiles) useProfileStore.setState({ profiles: data.profiles, activeProfileId: data.activeProfileId });
        if (data.logs) useActivityStore.setState({ logs: data.logs });
        if (data.favorites) localStorage.setItem('mcpFavorites', JSON.stringify(data.favorites));

        useToastStore.getState().addToast({
          title: 'Import Successful',
          message: 'Settings and data restored',
          type: 'success',
        });

        // Refresh page to ensure all stores rehydrate correctly if needed
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        logger.error('Import failed', error);
        useToastStore.getState().addToast({
          title: 'Import Failed',
          message: 'Invalid backup file',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
          Settings
        </Typography>
        <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
          Configure automation behaviors and extension preferences.
        </Typography>
      </div>

      <div className="space-y-4">
        {/* Appearance Settings */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4">
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded text-fuchsia-600 dark:text-fuchsia-400">
                 <Icon name="sun" size="sm" />
               </div>
               <CardTitle className="text-base font-medium">Appearance</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="p-5">
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                <Icon name="lightning" size="sm" />
              </div>
              <CardTitle className="text-base font-medium">Automation Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {/* Auto Insert Delay */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="auto-insert-delay"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auto Insert Delay
                </label>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {preferences.autoInsertDelay}s
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="auto-insert-delay"
                  type="range"
                  min="0"
                  max="30"
                  value={preferences.autoInsertDelay || 0}
                  onChange={e => handleDelayChange('autoInsert', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
                />
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={preferences.autoInsertDelay || 0}
                  onChange={e => handleDelayChange('autoInsert', e.target.value)}
                  className="w-16 p-1 text-sm text-center border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically inserts the tool result into the chat input box after execution.
                <br />
                <span className="text-slate-400 dark:text-slate-500 italic">
                  Wait time allows you to review the result before insertion. 0 = Instant.
                </span>
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800"></div>

            {/* Auto Submit Delay */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="auto-submit-delay"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auto Submit Delay
                </label>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {preferences.autoSubmitDelay}s
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="auto-submit-delay"
                  type="range"
                  min="0"
                  max="30"
                  value={preferences.autoSubmitDelay || 0}
                  onChange={e => handleDelayChange('autoSubmit', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-green-600"
                />
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={preferences.autoSubmitDelay || 0}
                  onChange={e => handleDelayChange('autoSubmit', e.target.value)}
                  className="w-16 p-1 text-sm text-center border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically submits the chat message after result insertion.
                <br />
                <span className="text-slate-400 dark:text-slate-500 italic">
                  Requires 'Auto Insert'. Wait time allows you to cancel submission.
                </span>
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800"></div>

            {/* Auto Execute Delay */}
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="auto-execute-delay"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Auto Execute Delay
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded uppercase">
                    Advanced
                  </span>
                </label>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {preferences.autoExecuteDelay}s
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="auto-execute-delay"
                  type="range"
                  min="0"
                  max="30"
                  value={preferences.autoExecuteDelay || 0}
                  onChange={e => handleDelayChange('autoExecute', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-500"
                />
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={preferences.autoExecuteDelay || 0}
                  onChange={e => handleDelayChange('autoExecute', e.target.value)}
                  className="w-16 p-1 text-sm text-center border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically runs tools when detected, skipping the "Run" click.
                <br />
                <span className="text-slate-400 dark:text-slate-500 italic">
                  Use with caution. Wait time allows you to cancel execution.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Safety Settings (Trusted Tools) */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400">
                <Icon name="check" size="sm" />
              </div>
              <CardTitle className="text-base font-medium">Safety & Whitelist</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Tools listed here will auto-execute without confirmation (if enabled above).
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter tool name (e.g., filesystem.read_file)"
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                value={trustedToolsInput}
                onChange={e => setTrustedToolsInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = trustedToolsInput.trim();
                    if (val && !(preferences.autoExecuteWhitelist || []).includes(val)) {
                      const newTools = [...(preferences.autoExecuteWhitelist || []), val];
                      updatePreferences({ autoExecuteWhitelist: newTools });
                      setTrustedToolsInput('');
                    }
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                className="border-slate-300 dark:border-slate-600"
                onClick={() => {
                    const val = trustedToolsInput.trim();
                    if (val && !(preferences.autoExecuteWhitelist || []).includes(val)) {
                      const newTools = [...(preferences.autoExecuteWhitelist || []), val];
                      updatePreferences({ autoExecuteWhitelist: newTools });
                      setTrustedToolsInput('');
                    }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(preferences.autoExecuteWhitelist || []).map(tool => (
                <div
                  key={tool}
                  className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded border border-green-100 dark:border-green-800">
                  <span>{tool}</span>
                  <button
                    onClick={() => {
                      const newTools = (preferences.autoExecuteWhitelist || []).filter(t => t !== tool);
                      updatePreferences({ autoExecuteWhitelist: newTools });
                    }}
                    className="hover:text-green-900 dark:hover:text-green-100">
                    <Icon name="x" size="xs" />
                  </button>
                </div>
              ))}
              {(!preferences.autoExecuteWhitelist || preferences.autoExecuteWhitelist.length === 0) && (
                <span className="text-xs text-slate-400 italic">No trusted tools configured.</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                <Icon name="box" size="sm" />
              </div>
              <CardTitle className="text-base font-medium">Data Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-300 dark:border-slate-600"
                onClick={handleExportData}>
                <Icon name="arrow-up-right" size="sm" className="mr-2 rotate-45" />
                Export Data
              </Button>
              <div className="relative flex-1">
                <input
                  type="file"
                  accept=".json"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImportData}
                />
                <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600">
                  <Icon name="arrow-up-right" size="sm" className="mr-2 rotate-[-135deg]" />
                  Import Data
                </Button>
              </div>
            </div>
            <Typography variant="caption" className="text-slate-500 dark:text-slate-400 mt-2 block text-center">
              Backup your settings, profiles, logs, and favorites.
            </Typography>
          </CardContent>
        </Card>

        {/* Info / Reset */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Icon name="refresh" size="xs" className="mr-1.5" />
            Reset to Defaults
          </Button>

          <div className="text-xs text-slate-400 dark:text-slate-500 italic">Changes are saved automatically</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
