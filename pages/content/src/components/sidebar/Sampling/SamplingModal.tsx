import React, { useState } from 'react';
import { useSamplingStore } from '../../../stores/sampling.store';
import { Button, Typography, Icon } from '../ui';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';

const SamplingModal: React.FC = () => {
    const { activeRequest, resolveRequest, rejectRequest } = useSamplingStore();
    const [responseContent, setResponseContent] = useState('');

    if (!activeRequest) return null;

    const { request } = activeRequest;

    // Parse messages for display
    const messages = request.messages || [];

    const handleSend = () => {
        // Construct standard SamplingResult
        const result = {
            role: 'assistant',
            content: {
                type: 'text',
                text: responseContent
            },
            model: 'user-manual',
            stopReason: 'end_turn'
        };
        resolveRequest(result);
        setResponseContent('');
    };

    const handleReject = () => {
        rejectRequest(new Error('User rejected sampling request'));
        setResponseContent('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="message-square" className="text-blue-500" />
                        Sampling Request
                    </CardTitle>
                    <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
                        The MCP server is requesting a message generation.
                    </Typography>
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                    <div className="space-y-2">
                        <Typography variant="subtitle" className="font-medium text-slate-700 dark:text-slate-300">Context Messages:</Typography>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2 text-sm max-h-40 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700">
                            {messages.map((msg: any, i: number) => (
                                <div key={i} className="flex flex-col border-b border-slate-100 dark:border-slate-700/50 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">{msg.role}</span>
                                    <span className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono text-xs">
                                        {typeof msg.content === 'string'
                                            ? msg.content
                                            : (msg.content?.text || JSON.stringify(msg.content))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="subtitle" className="font-medium text-slate-700 dark:text-slate-300">Your Response:</Typography>
                        <textarea
                            className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Type your response here..."
                            value={responseContent}
                            onChange={(e) => setResponseContent(e.target.value)}
                            autoFocus
                        />
                        {request.maxTokens && (
                            <div className="text-xs text-slate-400 text-right">
                                Max Tokens: {request.maxTokens}
                            </div>
                        )}
                    </div>
                </CardContent>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-800/50">
                    <Button variant="outline" onClick={handleReject}>
                        Reject
                    </Button>
                    <Button onClick={handleSend} disabled={!responseContent.trim()}>
                        Send Response
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SamplingModal;
