import React from 'react';
import { useUserPreferences } from '@src/hooks';
import { Card, CardContent } from '@src/components/ui/card';
import { Typography } from '../ui';
import { AutomationService } from '@src/services/automation.service';
import { cn } from '@src/lib/utils';
import { createLogger } from '@extension/shared/lib/logger';

// Default delay values in seconds

const logger = createLogger('Settings');

const DEFAULT_DELAYS = {
  autoInsertDelay: 2,
  autoSubmitDelay: 2,
  autoExecuteDelay: 2,
} as const;

const Settings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

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

  return (
    <div className="p-4 space-y-4">
      <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800">
        <CardContent className="p-4">
          <Typography variant="h4" className="mb-4 text-slate-700 dark:text-slate-300">
            Automation Delay Settings
          </Typography>

          <div className="space-y-4">
            {/* Auto Insert Delay */}
            <div>
              <label
                htmlFor="auto-insert-delay"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Auto Insert Delay (seconds)
              </label>
              <input
                id="auto-insert-delay"
                type="number"
                min="0"
                value={preferences.autoInsertDelay || 0}
                onChange={e => handleDelayChange('autoInsert', e.target.value)}
                disabled={false}
                className={cn(
                  'w-full p-2 text-sm border rounded-md',
                  'bg-white dark:bg-slate-900',
                  'border-slate-300 dark:border-slate-600',
                  'text-slate-900 dark:text-slate-100',
                )}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <strong>Auto Insert:</strong> Automatically inserts the tool result into the chat input box after the
                tool finishes execution.
                <br />
                This delay (in seconds) allows you to review the result before it is inserted. Set to 0 for instant
                insertion.
              </p>
            </div>

            {/* Auto Submit Delay */}
            <div>
              <label
                htmlFor="auto-submit-delay"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Auto Submit Delay (seconds)
              </label>
              <input
                id="auto-submit-delay"
                type="number"
                min="0"
                value={preferences.autoSubmitDelay || 0}
                onChange={e => handleDelayChange('autoSubmit', e.target.value)}
                disabled={false}
                className={cn(
                  'w-full p-2 text-sm border rounded-md',
                  'bg-white dark:bg-slate-900',
                  'border-slate-300 dark:border-slate-600',
                  'text-slate-900 dark:text-slate-100',
                )}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <strong>Auto Submit:</strong> Automatically submits the chat message after the tool result has been
                inserted.
                <br />
                This feature requires 'Auto Insert' to work. The delay allows you to cancel the submission if needed.
              </p>
            </div>

            {/* Auto Execute Delay */}
            <div>
              <label
                htmlFor="auto-execute-delay"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Auto Execute Delay (seconds)
              </label>
              <input
                id="auto-execute-delay"
                type="number"
                min="0"
                value={preferences.autoExecuteDelay || 0}
                onChange={e => handleDelayChange('autoExecute', e.target.value)}
                disabled={false}
                className={cn(
                  'w-full p-2 text-sm border rounded-md',
                  'bg-white dark:bg-slate-900',
                  'border-slate-300 dark:border-slate-600',
                  'text-slate-900 dark:text-slate-100',
                )}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <strong>Auto Execute:</strong> Automatically runs the tool when a "Call Tool" card appears, without
                requiring you to click "Run".
                <br />
                Use with caution. This delay gives you time to cancel the execution.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Typography variant="body" className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> These automation features enhance productivity but should be used carefully.
                Check the <strong>Help</strong> tab for more details on how they work.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
