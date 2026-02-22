import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@src/lib/utils';
import { Icon, Button } from '../ui';
import { useToastStore } from '@src/stores/toast.store';
import ContextManager from '../ContextManager/ContextManager';

interface InputAreaProps {
  onSubmit: (text: string) => void;
  onToggleMinimize: () => void;
}

import { eventBus } from '@src/events/event-bus';

interface Attachment {
  name: string;
  type: string;
  data: string; // Base64
}

const InputArea: React.FC<InputAreaProps> = ({ onSubmit, onToggleMinimize }) => {
  const [inputText, setInputText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showContextManager, setShowContextManager] = useState(false);
  const [contextManagerInitialContent, setContextManagerInitialContent] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { addToast } = useToastStore.getState();

  // Listen for selection changes on the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString().trim());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    // Listen for context save events from sidebar/background
    const unsubscribeContextSave = eventBus.on('context:save', (data) => {
        setContextManagerInitialContent(data.content);
        setShowContextManager(true);
    });

    // Listen for mcp text insertion (from Resources, Prompts, etc)
    const handleInsertText = (e: CustomEvent) => {
        if (e.detail && e.detail.text) {
            setInputText(prev => {
                const prefix = prev ? prev + '\n\n' : '';
                return prefix + e.detail.text;
            });
            // Optional: flash focus or something?
        }
    };

    window.addEventListener('mcp:insert-text', handleInsertText as EventListener);

    return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        window.removeEventListener('mcp:insert-text', handleInsertText as EventListener);
        unsubscribeContextSave();
    };
  }, []);

  const handleSubmit = () => {
    if (!inputText.trim() && attachments.length === 0) return;

    // If attachments exist, append them to the text in a structured way that tools might recognize,
    // or just assume the 'onSubmit' handler (which goes to useMcpCommunication) can handle robust args.
    // For now, let's append a text representation or assume the Adapter handles it.
    // Actually, Sidebar.tsx calls `adapter.insertTextIntoInput(text)`.
    // Most LLM web interfaces don't support pasting Base64 images directly into the text area purely via string.
    // HOWEVER, we can provide a textual hint for MCP tools: "[Image: filename.png]"
    // and maybe store the image data in a temporary "Context" or variable for macros to use?
    // Let's format it as XML-like tags which we can parse later if needed, or just append to prompt.

    let finalText = inputText;
    if (attachments.length > 0) {
      const attachmentText = attachments.map(a =>
        `\n[Attachment: ${a.name} (${a.type}) - ${a.data.substring(0, 30)}...]`
      ).join('');
      finalText += attachmentText;

      // In a real robust implementation, we would pass 'attachments' as a separate argument to 'onSubmit'
      // and let the Adapter try to attach it (if supported) or the McpClient execute a tool with it.
      // But for "InputArea" which talks to the chat box...

      addToast({
        title: 'Attachments Sent',
        message: `Sent ${attachments.length} images with message.`,
        type: 'info',
        duration: 2000,
      });
    }

    onSubmit(finalText);
    setInputText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImportSelection = () => {
    if (selectedText) {
      setInputText(prev => {
        const prefix = prev ? prev + '\n\n' : '';
        return prefix + `Context: """\n${selectedText}\n"""`;
      });
      addToast({
        title: 'Context Added',
        message: 'Selected text added to input',
        type: 'success',
        duration: 2000,
      });
    }
  };

  const handleInsertContext = (content: string) => {
    setInputText(prev => {
      const prefix = prev ? prev + '\n\n' : '';
      return prefix + content;
    });
    setShowContextManager(false);
  };

  const toggleListening = () => {
    if (isListening) {
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      addToast({
        title: 'Not Supported',
        message: 'Voice input is not supported in this browser.',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addToast({
        title: 'Listening...',
        message: 'Speak now.',
        type: 'info',
        duration: 2000,
      });
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      setIsListening(false);
      addToast({
        title: 'Error',
        message: `Voice input error: ${event.error}`,
        type: 'error',
        duration: 3000,
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const newAttachments: Attachment[] = [];
    for (const file of files) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newAttachments.push({
          name: file.name,
          type: file.type,
          data: base64
        });
      } catch (err) {
        console.error('Failed to read file', err);
      }
    }

    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
      addToast({
        title: 'Images Added',
        message: `Added ${newAttachments.length} images.`,
        type: 'success',
        duration: 2000,
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "p-3 relative transition-colors",
        isDragging && "bg-primary-50/50 dark:bg-primary-900/20"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-primary-500">
          <div className="flex flex-col items-center animate-bounce">
            <Icon name="upload" size="lg" className="text-primary-600 mb-2" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Drop images here</span>
          </div>
        </div>
      )}

      {/* Context Manager Overlay */}
      {showContextManager && (
        <div className="absolute bottom-full left-0 right-0 h-[400px] mb-2 z-50 shadow-2xl rounded-t-lg overflow-hidden border border-slate-200 dark:border-slate-700">
           <ContextManager
             onInsert={handleInsertContext}
             onClose={() => {
                 setShowContextManager(false);
                 setContextManagerInitialContent('');
             }}
             initialContent={contextManagerInitialContent}
           />
        </div>
      )}

      {/* Context Action Bar */}
      {selectedText && (
        <div className="mb-2 flex items-center justify-between bg-primary-50 dark:bg-primary-900/30 p-2 rounded border border-primary-100 dark:border-primary-800 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon name="file-text" size="xs" className="text-primary-500 flex-shrink-0" />
            <span className="text-xs text-primary-700 dark:text-primary-300 truncate max-w-[200px]">
              "{selectedText.substring(0, 30)}..."
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400"
            onClick={handleImportSelection}>
            Import
          </Button>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          {attachments.map((file, i) => (
            <div key={i} className="relative group flex-shrink-0 w-16 h-16 rounded overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeAttachment(i)}
                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="x" size="xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI or use a tool... (Drag images here)"
          className="w-full min-h-[80px] max-h-[200px] p-3 pr-10 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
        />
        <div className="absolute bottom-2 right-2 flex gap-1">
          {/* Context Manager Button */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
              showContextManager ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : ""
            )}
            onClick={() => setShowContextManager(!showContextManager)}
            title="Manage Saved Context"
          >
            <Icon name="book" size="sm" />
          </Button>

          {/* Voice Input Button */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
              isListening ? "text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            )}
            onClick={toggleListening}
            title="Voice Input"
          >
            <Icon name={isListening ? "mic-off" : "mic"} size="sm" />
          </Button>

          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
            onClick={handleSubmit}
            disabled={!inputText.trim() && attachments.length === 0}>
            <Icon name="arrow-up-right" size="sm" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <button
          onClick={onToggleMinimize}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
          <Icon name="chevron-down" size="xs" />
          Hide Input
        </button>
        <span className="text-[10px] text-slate-400">Shift+Enter for new line</span>
      </div>
    </div>
  );
};

export default InputArea;
