import type React from 'react';
import { useMemo, useState } from 'react';
import { useActivityStore } from '@src/stores/activity.store';
import { useMacroStore, type Macro } from '@src/lib/macro.store';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Typography, Icon, Button } from '../ui';
import { cn } from '@src/lib/utils';
import { MacroRunner } from '@src/lib/macro.runner';
import { useToastStore } from '@src/stores/toast.store';

interface DashboardProps {
  onExecute: (toolName: string, args: any) => Promise<any>;
}

const Dashboard: React.FC<DashboardProps> = ({ onExecute }) => {
  const { logs } = useActivityStore();
  const { macros } = useMacroStore();
  const { addToast } = useToastStore();
  const [runningMacroId, setRunningMacroId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalExecutions = logs.filter(l => l.type === 'tool_execution').length;
    const errors = logs.filter(l => l.status === 'error').length;
    const successRate = totalExecutions > 0 ? Math.round(((totalExecutions - errors) / totalExecutions) * 100) : 100;

    // Most used tool
    const toolCounts: Record<string, number> = {};
    logs
      .filter(l => l.type === 'tool_execution')
      .forEach(l => {
        const name = l.title.replace('Executed: ', '');
        toolCounts[name] = (toolCounts[name] || 0) + 1;
      });

    const mostUsed = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];

    // Activity per day (Last 7 days)
    const dailyActivity = new Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString();
      const count = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === dateStr && l.type === 'tool_execution').length;
      return { date: dateStr, count, day: date.toLocaleDateString([], { weekday: 'short' }) };
    });

    const maxActivity = Math.max(...dailyActivity.map(d => d.count), 1); // Avoid division by zero

    return {
      totalExecutions,
      errors,
      successRate,
      mostUsedTool: mostUsed ? mostUsed[0] : 'None',
      mostUsedCount: mostUsed ? mostUsed[1] : 0,
      dailyActivity,
      maxActivity
    };
  }, [logs]);

  const handleRunMacro = async (macro: Macro) => {
    if (runningMacroId) return;

    setRunningMacroId(macro.id);
    addToast({
      title: 'Starting Macro',
      message: `Running "${macro.name}"...`,
      type: 'info',
      duration: 2000,
    });

    const runner = new MacroRunner(onExecute, (msg, type) => {
      console.log(`[Macro: ${macro.name}] [${type}] ${msg}`);
    });

    try {
      await runner.run(macro);
      addToast({
        title: 'Macro Completed',
        message: `"${macro.name}" finished successfully.`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        title: 'Macro Failed',
        message: error instanceof Error ? error.message : String(error),
        type: 'error',
        duration: 5000,
      });
    } finally {
      setRunningMacroId(null);
    }
  };

  // Get recently updated macros
  const recentMacros = useMemo(() => {
    return [...macros].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
  }, [macros]);

  return (
    <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto">
      <div className="flex flex-col space-y-2">
        <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
          Dashboard
        </Typography>
        <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
          Overview of your activity and tool usage.
        </Typography>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-2">
              <Icon name="play" size="md" className="text-blue-600 dark:text-blue-400" />
            </div>
            <Typography variant="h3" className="font-bold text-2xl text-slate-800 dark:text-slate-100">
              {stats.totalExecutions}
            </Typography>
            <Typography variant="caption" className="text-slate-500 dark:text-slate-400 mt-1">
              Total Runs
            </Typography>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div
              className={cn(
                'p-2 rounded-full mb-2',
                stats.successRate >= 90 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-orange-50 dark:bg-orange-900/30',
              )}>
              <Icon
                name="check"
                size="md"
                className={cn(
                  stats.successRate >= 90
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400',
                )}
              />
            </div>
            <Typography variant="h3" className="font-bold text-2xl text-slate-800 dark:text-slate-100">
              {stats.successRate}%
            </Typography>
            <Typography variant="caption" className="text-slate-500 dark:text-slate-400 mt-1">
              Success Rate
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-end justify-between h-32 gap-2">
            {stats.dailyActivity.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group relative">
                 {/* Tooltip */}
                 <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded transition-opacity whitespace-nowrap z-10">
                    {day.count} executions
                 </div>
                <div
                  className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors relative"
                  style={{ height: `${(day.count / stats.maxActivity) * 100}%` }}
                >
                   {/* Bar fill for actual count */}
                   <div
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-indigo-500 rounded-t opacity-80"
                      style={{ height: day.count > 0 ? '4px' : '0' }}
                   />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Macros */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Macros</CardTitle>
          <Button variant="ghost" size="xs" className="h-5 text-[10px]" onClick={() => {
              // Navigate to Macros tab - simplistic approach via custom event or global state if available
              // But since we don't have direct access to setTab here easily without context...
              // We rely on user clicking tab manually for full list.
          }}>
             View All
          </Button>
        </CardHeader>
        <CardContent className="p-2">
          {recentMacros.length === 0 ? (
             <div className="text-center py-4 text-xs text-slate-400">No macros available.</div>
          ) : (
            <div className="space-y-2">
              {recentMacros.map(macro => (
                <div key={macro.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                      <Icon name="zap" size="xs" />
                    </div>
                    <div className="min-w-0">
                      <Typography variant="subtitle" className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate">
                        {macro.name}
                      </Typography>
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant="ghost"
                    className={cn(
                        "h-6 w-6 p-0 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-400 hover:text-green-600 dark:hover:text-green-400",
                        runningMacroId === macro.id ? "animate-spin text-green-600" : ""
                    )}
                    onClick={() => handleRunMacro(macro)}
                    disabled={!!runningMacroId}
                  >
                    <Icon name={runningMacroId === macro.id ? "loader" : "play"} size="xs" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Most Used Tool</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded">
                <Icon name="tool" size="sm" className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <Typography variant="subtitle" className="font-medium text-slate-800 dark:text-slate-200">
                  {stats.mostUsedTool}
                </Typography>
                <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
                  {stats.mostUsedCount} executions
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <Icon name="info" size="sm" className="text-slate-400 mt-0.5" />
          <Typography variant="body" className="text-xs text-slate-600 dark:text-slate-400">
            Stats are calculated based on your local activity log history (last 50 events). Clearing logs will reset
            these metrics.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
