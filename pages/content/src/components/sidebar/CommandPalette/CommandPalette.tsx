import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSidebarState, useUserPreferences } from '@src/hooks';
import { useProfileStore } from '@src/stores/profile.store';
import { useMemoryActions } from '@src/hooks/useMemoryActions';
import { useMemoryStore } from '@src/stores/memory.store';
import { Icon, Typography } from '../ui';
import { cn } from '@src/lib/utils';

// We'll build a custom lightweight palette to avoid external deps for now
// Ideally use 'cmdk' in a real scenario if allowed to add packages

interface CommandItem {
  id: string;
  title: string;
  icon: any;
  action: () => void;
  shortcut?: string;
  category: 'Navigation' | 'Tools' | 'Settings' | 'Profiles';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  togglePushMode: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, togglePushMode }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { profiles, setActiveProfile } = useProfileStore();
  const { searchMemory, isSearching } = useMemoryActions();
  const { searchResults } = useMemoryStore();

  const [memoryMode, setMemoryMode] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce for memory search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Trigger memory search
  useEffect(() => {
    if (memoryMode && debouncedQuery.length > 2) {
      // Omni-search uses the configured destinations in MemoryStore
      searchMemory('omni', debouncedQuery);
    }
  }, [debouncedQuery, memoryMode, searchMemory]);

  // Define commands
  const commands: CommandItem[] = [
    {
      id: 'search-memory',
      title: 'Search Memory...',
      icon: 'search',
      category: 'Navigation',
      action: () => {
        setMemoryMode(true);
        setQuery('');
      },
      shortcut: '?',
    },
    {
      id: 'nav-tools',
      title: 'Go to Available Tools',
      icon: 'tool',
      category: 'Navigation',
      action: () => onNavigate('availableTools'),
    },
    {
      id: 'nav-activity',
      title: 'Go to Activity Log',
      icon: 'activity',
      category: 'Navigation',
      action: () => onNavigate('activity'),
    },
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      icon: 'box',
      category: 'Navigation',
      action: () => onNavigate('dashboard'),
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      icon: 'settings',
      category: 'Navigation',
      action: () => onNavigate('settings'),
    },
    {
      id: 'nav-help',
      title: 'Go to Help',
      icon: 'help-circle',
      category: 'Navigation',
      action: () => onNavigate('help'),
    },

    {
      id: 'toggle-push',
      title: 'Toggle Push Content Mode',
      icon: 'menu',
      category: 'Settings',
      action: togglePushMode,
    },

    // Add profiles dynamically
    ...profiles.map(p => ({
      id: `profile-${p.id}`,
      title: `Switch to Profile: ${p.name}`,
      icon: 'server',
      category: 'Profiles' as const,
      action: () => setActiveProfile(p.id),
    })),
  ];

  const filteredCommands = commands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setMemoryMode(false);
    } else {
      setQuery('');
      setMemoryMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        if (memoryMode) {
          setMemoryMode(false);
          setQuery('');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm transition-all"
      onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Icon
            name={memoryMode ? 'database' : 'search'}
            size="sm"
            className={cn('mr-3', memoryMode ? 'text-purple-500' : 'text-slate-400')}
          />
          {memoryMode && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded mr-2 font-medium">
              Memory
            </span>
          )}
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            placeholder={
              memoryMode ? 'Search your notes and clips...' : 'Type a command or search... (type ? for memory)'
            }
            value={query}
            onChange={e => {
              const val = e.target.value;
              if (val === '?' && !memoryMode) {
                setMemoryMode(true);
                setQuery('');
              } else {
                setQuery(val);
              }
              setSelectedIndex(0);
            }}
          />
          {isSearching && <Icon name="loader" size="xs" className="animate-spin text-slate-400 mr-2" />}
          <div className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">
            ESC
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-2">
          {!memoryMode ? (
            filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">No commands found.</div>
            ) : (
              filteredCommands.map((cmd, index) => (
                <div
                  key={cmd.id}
                  className={cn(
                    'px-4 py-2 flex items-center cursor-pointer text-sm',
                    index === selectedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-2 border-primary-500'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-2 border-transparent',
                  )}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}>
                  <Icon
                    name={cmd.icon}
                    size="sm"
                    className={cn('mr-3', index === selectedIndex ? 'text-primary-500' : 'text-slate-400')}
                  />
                  <span className="flex-1">{cmd.title}</span>
                  {cmd.shortcut && <span className="text-xs text-slate-400 font-mono">{cmd.shortcut}</span>}
                </div>
              ))
            )
          ) : // Memory Search Results View
          query.length < 3 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              Type at least 3 characters to search memory.
            </div>
          ) : searchResults.length === 0 && !isSearching ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">No memories found.</div>
          ) : (
            <div className="px-2">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="mb-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
                  onClick={() => {
                    // In a real app, clicking might insert it or navigate to it.
                    // For now, we'll navigate to the memory tab.
                    onNavigate('memory');
                    onClose();
                  }}>
                  <div className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">
                    {res.metadata?.title || 'Untitled Memory'}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">{res.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
          <span>
            <strong className="font-medium text-slate-700 dark:text-slate-300">↑↓</strong> to navigate
          </span>
          <span>
            <strong className="font-medium text-slate-700 dark:text-slate-300">↵</strong> to select
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
