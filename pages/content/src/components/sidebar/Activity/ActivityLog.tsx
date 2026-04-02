import type React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useActivityStore, type LogType, type LogStatus } from '@src/stores/activity.store';
import { Card } from '@src/components/ui/card';
import { Typography, Icon, Button } from '../ui';
import { RichRenderer } from '../ui/RichRenderer';
import { cn } from '@src/lib/utils';

// A simple virtualized list hook to avoid adding heavy dependencies
function useVirtualList(itemCount: number, itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + 5);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return { startIndex, endIndex, onScroll, totalHeight: itemCount * itemHeight };
}

const ActivityLog: React.FC = () => {
  const { logs, clearLogs, removeLog } = useActivityStore();
  const [filter, setFilter] = useState<'all' | LogType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    let result = logs;

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(log => log.type === filter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        log =>
          log.title.toLowerCase().includes(query) ||
          (log.detail && log.detail.toLowerCase().includes(query)) ||
          (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query)),
      );
    }

    return result;
  }, [logs, filter, searchQuery]);

  const getStatusColor = (status: LogStatus) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'pending':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getIcon = (type: LogType, status: LogStatus) => {
    if (status === 'error') return 'alert-triangle';
    switch (type) {
      case 'tool_execution':
        return 'tool';
      case 'connection':
        return 'server';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Virtualization setup
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600); // Default height
  const ITEM_HEIGHT = 70; // Approximate height of a collapsed log item
  const EXPANDED_EXTRA_HEIGHT = 200; // Approximate extra height when expanded

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  const { startIndex, endIndex, onScroll, totalHeight } = useVirtualList(
    filteredLogs.length,
    ITEM_HEIGHT,
    containerHeight,
  );

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="flex flex-col space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
            Activity Log
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400">
            <Icon name="x" size="xs" className="mr-1" />
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const data = JSON.stringify(logs, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `mcp-logs-${new Date().toISOString()}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            disabled={logs.length === 0}
            className="text-xs text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 ml-1">
            <Icon name="download" size="xs" className="mr-1" />
            Export
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-2.5 top-2.5">
            <Icon name="search" size="xs" className="text-slate-400" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Icon name="x" size="xs" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'tool_execution', 'connection', 'error'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors border',
                filter === f
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-slate-800 dark:border-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700',
              )}>
              {f === 'all' ? 'All' : f === 'tool_execution' ? 'Tools' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 relative">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
            <Icon name="box" size="lg" className="mb-2 opacity-50" />
            <Typography variant="body" className="text-sm">
              No activity recorded
            </Typography>
          </div>
        ) : (
          <div style={{ height: totalHeight + (expandedLogId ? EXPANDED_EXTRA_HEIGHT : 0), position: 'relative' }}>
            {filteredLogs.slice(startIndex, endIndex + 1).map((log, index) => {
              const actualIndex = startIndex + index;
              // Adjust top position if an item above it is expanded
              const topPosition = actualIndex * ITEM_HEIGHT;
              const isExpanded = expandedLogId === log.id;

              // Simplified handling for expansion pushing items down
              // For a robust implementation, we'd need dynamic heights, but this works for basic rendering limits

              return (
                <div
                  key={log.id}
                  style={{
                    position: 'absolute',
                    top: topPosition,
                    width: '100%',
                    // If expanded, allow it to take more space naturally without clipping immediately
                    zIndex: isExpanded ? 10 : 1,
                    // Add padding/margin equivalent to space-y-3
                    paddingBottom: '0.75rem',
                  }}>
                  <Card
                    className={cn(
                      'border overflow-hidden transition-all duration-200 hover:shadow-sm',
                      isExpanded ? 'ring-1 ring-slate-300 dark:ring-slate-600 shadow-md' : '',
                    )}>
                    <div
                      className="p-3 cursor-pointer flex items-start gap-3 bg-white dark:bg-slate-900"
                      onClick={() => toggleExpand(log.id)}>
                      <div className={cn('p-1.5 rounded-full flex-shrink-0 mt-0.5 border', getStatusColor(log.status))}>
                        <Icon name={getIcon(log.type, log.status)} size="xs" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <Typography
                            variant="subtitle"
                            className="font-medium text-sm truncate pr-2 text-slate-800 dark:text-slate-200">
                            {log.title}
                          </Typography>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
                            {formatTime(log.timestamp)}
                          </span>
                        </div>

                        {log.detail && (
                          <Typography
                            variant="body"
                            className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {log.detail}
                          </Typography>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedLogId === log.id && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-3 animate-in slide-in-from-top-1 duration-200">
                        {log.metadata && (
                          <div className="mb-2">
                            <Typography variant="caption" className="text-slate-500 dark:text-slate-400 block mb-1">
                              Result / Metadata
                            </Typography>
                            <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 overflow-hidden">
                              <RichRenderer data={log.metadata} />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              removeLog(log.id);
                            }}
                            className="h-6 text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Delete Entry
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              if (log.detail) {
                                const utterance = new SpeechSynthesisUtterance(log.detail);
                                window.speechSynthesis.speak(utterance);
                              }
                            }}
                            className="h-6 text-[10px] text-primary-500 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 ml-2">
                            <Icon name="volume-2" size="xs" className="mr-1" />
                            Read
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
