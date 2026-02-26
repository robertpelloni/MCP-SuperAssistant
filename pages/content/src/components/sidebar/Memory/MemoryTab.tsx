import type React from 'react';
import { useState } from 'react';
import { useMemoryStore } from '../../../stores/memory.store';
import { ContentParser } from '../../../services/memory/ContentParser';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import {
  DownloadIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ScissorsIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import { useToast } from '../../ui/use-toast';
import { VectorAdapter } from '../../../services/memory/adapters/VectorAdapter';
import { AnythingLLMAdapter } from '../../../services/memory/adapters/AnythingLLMAdapter';

export const MemoryTab: React.FC = () => {
  const {
    capturedContent,
    setCapturedContent,
    vectorSaveTool,
    vectorSearchTool,
    setVectorConfig,
    searchResults,
    setSearchResults,
    anythingLlmBaseUrl,
    anythingLlmApiKey,
    setAnythingLlmConfig,
  } = useMemoryStore();

  const [obsidianVault, setObsidianVault] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [memoryQuery, setMemoryQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // AnythingLLM Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const { toast } = useToast();

  const handleCapturePage = () => {
    const parser = new ContentParser();
    const result = parser.parse(document, window.location.href);
    if (result) {
      setCapturedContent(result);
      setNoteTitle(result.title);
      setNoteContent(result.content);
      toast({ title: 'Page Captured', description: 'Content ready to save.' });
    } else {
      toast({ title: 'Capture Failed', description: 'Could not parse page content.', variant: 'destructive' });
    }
  };

  const handleCaptureSelection = () => {
    const parser = new ContentParser();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const result = parser.parseSelection(selection, window.location.href);
      if (result) {
        setCapturedContent(result);
        setNoteTitle(result.title || 'Selection');
        setNoteContent(result.content);
        toast({ title: 'Selection Captured', description: 'Content ready to save.' });
      }
    } else {
      toast({ title: 'No Selection', description: 'Please select text on the page first.', variant: 'destructive' });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(noteContent).then(() => {
      toast({ title: 'Copied', description: 'Markdown copied to clipboard.' });
    });
  };

  const handleDownload = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${noteTitle || 'clipping'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: 'Markdown file saved.' });
  };

  const handleSaveToObsidian = () => {
    if (!obsidianVault) {
      toast({ title: 'Vault Required', description: 'Please enter your Obsidian vault name.', variant: 'destructive' });
      return;
    }
    const encodedVault = encodeURIComponent(obsidianVault);
    const encodedTitle = encodeURIComponent(noteTitle);
    const encodedContent = encodeURIComponent(noteContent);
    const uri = `obsidian://new?vault=${encodedVault}&name=${encodedTitle}&content=${encodedContent}`;
    window.open(uri, '_self'); // Use _self to trigger the protocol handler
  };

  const handleSaveToMemoryServer = async () => {
    try {
      const adapter = new VectorAdapter({
        saveToolName: vectorSaveTool,
        searchToolName: vectorSearchTool,
      });

      const success = await adapter.save(noteContent, {
        title: noteTitle,
        url: capturedContent?.url || window.location.href,
        siteName: capturedContent?.siteName || '',
        timestamp: new Date().toISOString(),
      });

      if (success) {
        toast({ title: 'Saved to Memory', description: 'Content successfully stored in Vector DB.' });
      }
    } catch (error) {
      toast({ title: 'Save Failed', description: String(error), variant: 'destructive' });
    }
  };

  const handleSaveToAnythingLLM = async () => {
    try {
      const adapter = new AnythingLLMAdapter({
        baseUrl: anythingLlmBaseUrl,
        apiKey: anythingLlmApiKey,
        workspaceSlug: 'default', // TODO: Add workspace selector
      });

      const success = await adapter.save(noteContent, {
        title: noteTitle,
        url: capturedContent?.url || window.location.href,
      });

      if (success) {
        toast({ title: 'Sent to AnythingLLM', description: 'Content uploaded successfully.' });
      }
    } catch (error) {
      toast({ title: 'AnythingLLM Upload Failed', description: String(error), variant: 'destructive' });
    }
  };

  const handleAnythingLLMChat = async () => {
      if (!chatInput.trim()) return;

      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
      setChatInput('');
      setIsChatting(true);

      try {
          const adapter = new AnythingLLMAdapter({
              baseUrl: anythingLlmBaseUrl,
              apiKey: anythingLlmApiKey,
              workspaceSlug: 'default'
          });

          const response = await adapter.chat(userMsg);
          setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      } catch (error) {
          toast({ title: 'Chat Failed', description: String(error), variant: 'destructive' });
          setChatHistory(prev => [...prev, { role: 'assistant', content: 'Error: Failed to get response.' }]);
      } finally {
          setIsChatting(false);
      }
  };

  const handleSearchMemory = async () => {
    if (!memoryQuery) return;
    setIsSearching(true);
    try {
      const adapter = new VectorAdapter({
        saveToolName: vectorSaveTool,
        searchToolName: vectorSearchTool,
      });
      const results = await adapter.search(memoryQuery);
      setSearchResults(results);
    } catch (error) {
      toast({ title: 'Search Failed', description: String(error), variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-4 space-y-4">
      {/* Search Section */}
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Search memories..."
              value={memoryQuery}
              onChange={e => setMemoryQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchMemory()}
            />
            <Button size="icon" onClick={handleSearchMemory} disabled={isSearching}>
              <SearchIcon className={isSearching ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <ScrollArea className="h-40 border rounded-md p-2">
              {searchResults.map((res, i) => (
                <div key={i} className="mb-2 p-2 bg-muted/50 rounded hover:bg-muted cursor-pointer text-xs">
                  <div className="font-semibold">{res.metadata?.title || 'Memory ' + (i + 1)}</div>
                  <div className="line-clamp-2 text-muted-foreground">{res.content}</div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Web Clipper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2">
            <Button onClick={handleCapturePage} className="flex-1">
              <FileTextIcon className="mr-2 h-4 w-4" /> Clip Page
            </Button>
            <Button onClick={handleCaptureSelection} className="flex-1" variant="outline">
              <ScissorsIcon className="mr-2 h-4 w-4" /> Clip Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      {capturedContent && (
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader>
            <CardTitle>Preview & Save</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
            </div>

            <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="raw">Raw</TabsTrigger>
                <TabsTrigger value="obsidian">Obsidian</TabsTrigger>
                <TabsTrigger value="server">Memory Server</TabsTrigger>
                <TabsTrigger value="anything">AnythingLLM</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 overflow-auto border rounded p-2 bg-muted/20">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {/* Simple rendering for now, or just show text */}
                  <pre className="whitespace-pre-wrap font-sans">{noteContent}</pre>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="flex-1">
                <Textarea
                  className="h-full resize-none font-mono text-xs"
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="obsidian" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vault">Obsidian Vault Name</Label>
                  <Input
                    id="vault"
                    placeholder="MyVault"
                    value={obsidianVault}
                    onChange={e => setObsidianVault(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Required for "Save to Obsidian" button.</p>
                </div>
                <Button onClick={handleSaveToObsidian} className="w-full">
                  <ExternalLinkIcon className="mr-2 h-4 w-4" /> Save to Obsidian
                </Button>
              </TabsContent>

              <TabsContent value="server" className="space-y-4">
                <div className="space-y-2 border-b pb-2">
                  <Label>Configuration (MCP)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="saveTool" className="text-xs">
                        Save Tool
                      </Label>
                      <Input
                        id="saveTool"
                        value={vectorSaveTool}
                        onChange={e => setVectorConfig(e.target.value, vectorSearchTool)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="searchTool" className="text-xs">
                        Search Tool
                      </Label>
                      <Input
                        id="searchTool"
                        value={vectorSearchTool}
                        onChange={e => setVectorConfig(vectorSaveTool, e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveToMemoryServer} className="w-full" variant="default">
                  <SaveIcon className="mr-2 h-4 w-4" /> Save to Memory Server
                </Button>
              </TabsContent>

              <TabsContent value="anything" className="space-y-4">
                <div className="space-y-2 border-b pb-2">
                  <Label>Configuration</Label>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="allmUrl" className="text-xs">
                        Base URL
                      </Label>
                      <Input
                        id="allmUrl"
                        value={anythingLlmBaseUrl}
                        onChange={e => setAnythingLlmConfig(e.target.value, anythingLlmApiKey)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="allmKey" className="text-xs">
                        API Key
                      </Label>
                      <Input
                        id="allmKey"
                        type="password"
                        value={anythingLlmApiKey}
                        onChange={e => setAnythingLlmConfig(anythingLlmBaseUrl, e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveToAnythingLLM} className="w-full" variant="default">
                  <ExternalLinkIcon className="mr-2 h-4 w-4" /> Send to AnythingLLM
                </Button>

                 <div className="border-t pt-4 mt-4">
                    <Label className="mb-2 block">Chat with Workspace</Label>
                    <div className="h-48 border rounded p-2 overflow-y-auto mb-2 bg-slate-50 dark:bg-slate-900 text-xs">
                        {chatHistory.length === 0 ? (
                            <div className="text-slate-400 text-center mt-10">Ask a question about your documents...</div>
                        ) : (
                            chatHistory.map((msg, i) => (
                                <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        {msg.content}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask AnythingLLM..."
                            className="h-8 text-xs"
                            onKeyDown={(e) => e.key === 'Enter' && handleAnythingLLMChat()}
                        />
                        <Button size="sm" onClick={handleAnythingLLMChat} disabled={isChatting}>
                            {isChatting ? <span className="animate-spin">...</span> : "Send"}
                        </Button>
                    </div>
                 </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-auto pt-2">
              <Button variant="secondary" onClick={handleCopyToClipboard} className="flex-1">
                <CopyIcon className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button variant="secondary" onClick={handleDownload} className="flex-1">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
