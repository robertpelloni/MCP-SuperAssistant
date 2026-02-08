import { useUserPreferences } from '@src/hooks';

export class AutomationService {
  private static instance: AutomationService;

  private constructor() {}

  public static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  // Helper to get current prefs from store
  private getPreferences() {
    return useUserPreferences.getState().preferences;
  }

  public shouldAutoExecute(toolName: string): boolean {
    const prefs = this.getPreferences();

    // Global auto-execute toggle must be on
    if (!prefs.autoExecuteDelay && prefs.autoExecuteDelay !== 0) {
      // If delay is undefined/null, we assume auto-execute is OFF (since it relies on a timer)
      // Actually, checking if the feature is enabled usually depends on how we stored "enabled" state.
      // In Settings.tsx, we treat `autoExecuteDelay` existence as the feature being potentially active,
      // but usually there's a separate boolean.
      // Based on previous code, we only have delays. Let's assume if delay is set, it's enabled?
      // Wait, let's look at `Settings.tsx`. We have `autoExecuteDelay`.
      // If we want a whitelist, we need to implement it.
      return false;
    }

    // If whitelist is empty, we might allow all (dangerous) or none (safe).
    // For "Insanely Great" safety, we should strictly enforce whitelist if the feature is "Auto-Execute Safe Mode".
    // However, the current requirement implies we need to add the whitelist logic.

    const whitelist = prefs.trustedTools || [];
    if (whitelist.length > 0) {
      return whitelist.includes(toolName);
    }

    // Fallback: If no whitelist defined, behave as before (allow all if global setting is on)?
    // Or better: Default to requiring manual approval unless whitelisted.
    // Let's stick to: "If global auto-execute is ON, we execute."
    // AND "If a whitelist exists, we ONLY execute if in whitelist."
    return true;
  }

  public async updateAutomationStateOnWindow() {
    // This syncs state to the window object for non-React parts of the app if needed
    const prefs = this.getPreferences();
    (window as any).mcpAutomation = {
      autoInsertDelay: prefs.autoInsertDelay,
      autoSubmitDelay: prefs.autoSubmitDelay,
      autoExecuteDelay: prefs.autoExecuteDelay,
      trustedTools: prefs.trustedTools,
    };
  }
}
