import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');

// Set up context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'mcp-send-selection',
    title: 'Send to MCP SuperAssistant',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'mcp-send-selection' && tab?.id) {
    chrome.tabs
      .sendMessage(tab.id, {
        type: 'MCP_IMPORT_SELECTION',
        text: info.selectionText,
      })
      .catch(err => console.log('Could not send message to content script (tab might not be ready)', err));
  }
});
