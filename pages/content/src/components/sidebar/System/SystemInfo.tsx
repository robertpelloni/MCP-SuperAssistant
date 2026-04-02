import type React from 'react';
import { Typography, Icon, Button } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';

const SystemInfo: React.FC = () => {
  const buildDate = new Date().toLocaleString();
  const version = '1.9.0'; // Should match VERSION file

  const handleReload = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.reload) {
      chrome.runtime.reload();
    } else {
      window.location.reload();
    }
  };

  const dependencies = [
    { name: 'React', version: '19.1.0' },
    { name: 'Zustand', version: '5.0.5' },
    { name: 'Tailwind CSS', version: '3.4.17' },
    { name: 'Readability', version: '0.6.0' },
    { name: 'Turndown', version: '7.2.2' },
    { name: 'Lucide React', version: '0.477.0' },
  ];

  const submodules = [
    {
      name: 'byterover-cipher',
      path: 'packages/byterover-cipher',
      url: 'https://github.com/campfirein/cipher.git',
      status: 'Active',
    },
    // Hardcoded for now, ideally generated via build script
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
              System Status
            </Typography>
            <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
              Build information and project structure.
            </Typography>
          </div>
          <Button size="xs" variant="outline" onClick={handleReload} title="Reload Extension">
            <Icon name="refresh-cw" size="xs" className="mr-1" /> Reload
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Version Info</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Version</span>
            <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">{version}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Build Date</span>
            <span className="text-sm font-mono text-slate-900 dark:text-slate-100">{buildDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">Environment</span>
            <span className="text-sm font-mono text-slate-900 dark:text-slate-100">{import.meta.env.MODE}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dependencies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dependencies.map(dep => (
              <div key={dep.name} className="flex justify-between items-center p-3">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{dep.name}</span>
                <span className="text-xs font-mono text-slate-500">{dep.version}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Submodules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {submodules.map(sub => (
              <div key={sub.name} className="flex flex-col p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    {sub.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-1">{sub.path}</div>
                <a
                  href={sub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary-600 hover:underline flex items-center">
                  <Icon name="github" size="xs" className="mr-1" /> View Source
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Structure</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-xs font-mono bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 overflow-x-auto whitespace-pre leading-relaxed text-slate-700 dark:text-slate-300">
            {`mcp-superassistant/
├── chrome-extension/       (v${version})
│   ├── background/         (Service Worker)
│   └── mcpclient/          (Protocol Layer)
│
├── pages/
│   └── content/            (Sidebar UI - v${version})
│       └── src/
│           ├── components/ (React Components)
│           ├── stores/     (Zustand Stores)
│           ├── core/       (Initialization)
│           └── plugins/    (Modular Features)
│
├── packages/               (Shared Libraries)
│   ├── shared/             (Utils, Logger)
│   ├── storage/            (Chrome Storage)
│   └── byterover-cipher/   (Submodule)
│
└── docs/                   (Documentation)`}
          </div>
        </CardContent>
      </Card>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Icon name="info" size="sm" className="text-blue-500 mt-0.5" />
          <Typography variant="body" className="text-xs text-blue-700 dark:text-blue-300">
            This dashboard reflects the current build configuration. To update submodules, please use the project build
            scripts.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
