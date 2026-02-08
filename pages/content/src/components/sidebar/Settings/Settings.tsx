import React, { useState } from 'react';
import { useUserPreferences } from '@src/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Typography, Icon, Button, ToggleWithoutLabel } from '../ui';
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
  // Using local state for UI management if needed, though preferences come from store
  const [trustedTools, setTrustedTools] = useState<string[]>([]); // Mock for now, would be in preferences store

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

        {/* Safety Settings (Trusted Tools Placeholder) */}
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
              Configure which tools are allowed to auto-execute.
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 text-center">
              <Typography variant="body" className="text-slate-500 dark:text-slate-400 text-sm">
                Trusted Tools management coming soon in 0.6.0
              </Typography>
            </div>
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
