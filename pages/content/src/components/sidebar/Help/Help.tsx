import type React from 'react';
import { useState } from 'react';
import { Typography, Icon, Button } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { cn } from '@src/lib/utils';

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'setup' | 'features' | 'troubleshooting' | 'faq'>(
    'overview',
  );

  const renderNavButton = (section: typeof activeSection, label: string, iconName: any) => (
    <Button
      variant={activeSection === section ? 'secondary' : 'ghost'}
      size="sm"
      className={cn('w-full justify-start mb-1', activeSection === section ? 'bg-slate-200 dark:bg-slate-700' : '')}
      onClick={() => setActiveSection(section)}>
      <Icon name={iconName} size="sm" className="mr-2" />
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="flex flex-col space-y-2">
        <Typography variant="h4" className="font-semibold text-slate-800 dark:text-slate-100">
          Help & Documentation
        </Typography>
        <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
          Complete guide to using MCP SuperAssistant
        </Typography>
      </div>

      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Navigation Sidebar */}
        <div className="w-1/3 flex flex-col space-y-1 overflow-y-auto pr-2 border-r border-slate-200 dark:border-slate-700">
          {renderNavButton('overview', 'Overview', 'info')}
          {renderNavButton('setup', 'Setup', 'settings')}
          {renderNavButton('features', 'Features', 'lightning')}
          {renderNavButton('troubleshooting', 'Troubleshooting', 'alert-triangle')}
          {renderNavButton('faq', 'FAQ', 'help-circle')}
        </div>

        {/* Content Area */}
        <div className="w-2/3 overflow-y-auto pl-2 pb-10">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What is MCP SuperAssistant?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Typography variant="body" className="text-sm">
                    MCP SuperAssistant is a Chrome extension that bridges the Model Context Protocol (MCP) with
                    web-based AI platforms like ChatGPT, Claude, Perplexity, and others.
                  </Typography>
                  <Typography variant="body" className="text-sm">
                    It allows you to use your local tools and data directly within these AI interfaces, enhancing their
                    capabilities with file system access, command execution, and more.
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Connect local MCP servers to web AI</li>
                    <li>Securely execute tools locally</li>
                    <li>Seamlessly insert results into chat</li>
                    <li>Support for multiple AI providers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'setup' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connecting a Proxy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Typography variant="body" className="text-sm">
                    To connect to local MCP servers, you need to run the MCP SuperAssistant Proxy. This proxy bridges
                    the browser (extension) to your local MCP servers.
                  </Typography>
                  <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-md text-xs font-mono overflow-x-auto">
                    npx -y @srbhptl39/mcp-superassistant-proxy@latest --config ./config.json
                  </div>
                  <Typography variant="caption" className="block mt-2">
                    Create a <code>config.json</code> file defining your MCP servers (e.g., filesystem, postgres) and
                    point the proxy to it.
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <div>
                      <Typography variant="subtitle" className="font-semibold text-sm">
                        SSE (Server-Sent Events)
                      </Typography>
                      <Typography variant="body" className="text-xs">
                        Default connection type. Good for most use cases.
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle" className="font-semibold text-sm">
                        WebSocket
                      </Typography>
                      <Typography variant="body" className="text-xs">
                        Faster, full-duplex communication. Requires <code>ws://</code> URI.
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle" className="font-semibold text-sm">
                        Streamable HTTP
                      </Typography>
                      <Typography variant="body" className="text-xs">
                        Standard MCP transport over HTTP.
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Tool Detection
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      The extension automatically detects when the AI wants to call a tool. It presents a "Call Tool"
                      card in the chat.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Auto-Execute
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      If enabled in Settings, the extension will automatically run tools without requiring you to click
                      "Run".
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Auto-Submit
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      After a tool runs and the result is pasted into the input box, this feature automatically sends
                      the message to the AI.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Push Content Mode
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      Adjusts the page layout so the sidebar pushes content aside instead of overlaying it. Useful for
                      smaller screens.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'troubleshooting' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Connection Refused / 404
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      Ensure your proxy server is running. Check if the port (default 3006) matches the URI in Server
                      Status.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Tools Not Showing
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      Click the "Refresh" button in the Available Tools tab. Ensure your <code>config.json</code> is
                      correct and the MCP server is healthy.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Extension Context Invalidated
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      This happens if the extension is updated or reloaded. Refresh the web page to reconnect.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Is my data secure?
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      Yes. The extension communicates directly with your local proxy. Your data (files, etc.) stays
                      local unless you explicitly send it to the AI.
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle" className="font-semibold text-sm">
                      Which AI models work best?
                    </Typography>
                    <Typography variant="body" className="text-xs">
                      Models with strong function calling capabilities (like GPT-4, Claude 3.5 Sonnet) work best.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
