export * from './automation.service';

import { AutomationService } from './automation.service';
// Import other services here

export async function initializeAllServices() {
  // Initialize AutomationService
  AutomationService.getInstance();

  // Future services
}

export async function cleanupAllServices() {
  // Cleanup if needed
}
