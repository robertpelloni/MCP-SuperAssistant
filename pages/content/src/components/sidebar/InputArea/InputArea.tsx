import type React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@src/lib/utils';
import { Icon, Button } from '../ui';
import { useToastStore } from '@src/stores/toast.store';

interface InputAreaProps {
  onSubmit: (text: string) => void;
  onToggleMinimize: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSubmit, onToggleMinimize }) => {
  const [inputText, setInputText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { addToast } = useToastStore.getState();

  // Speech Recognition (Type guard for TypeScript)
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const toggleVoiceInput = () => {
    if (!recognition) {
      addToast({ title: 'Not Supported', message: 'Voice input not supported in this browser', type: 'error' });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      addToast({ title: 'Listening...', message: 'Speak now', type: 'info', duration: 2000 });

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        addToast({ title: 'Voice Error', message: 'Could not recognize speech', type: 'error' });
      };

      recognition.onend = () => setIsListening(false);
    }
  };

  // Listen for external import events (e.g. from context menu)
  useEffect(() => {
    const handleImport = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.text) {
        setInputText(prev => {
          const prefix = prev ? prev + '\n\n' : '';
          return prefix + `Context: """\n${customEvent.detail.text}\n"""`;
        });
      }
    };

    window.addEventListener('mcp:import-text', handleImport);
    return () => window.removeEventListener('mcp:import-text', handleImport);
  }, []);

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
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onSubmit(inputText);
    setInputText('');
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

  return (
    <div className="p-3">
      {/* Context Action Bar */}
      {selectedText && (
        <div className="mb-2 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded border border-indigo-100 dark:border-indigo-800 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon name="file-text" size="xs" className="text-indigo-500 flex-shrink-0" />
            <span className="text-xs text-indigo-700 dark:text-indigo-300 truncate max-w-[200px]">
              "{selectedText.substring(0, 30)}..."
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-400"
            onClick={handleImportSelection}>
            Import
          </Button>
        </div>
      )}

      <div className="relative">
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI or use a tool..."
          className="w-full min-h-[80px] max-h-[200px] p-3 pr-10 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
        />
        <div className="absolute bottom-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              'h-8 w-8 p-0 rounded-full',
              isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-600',
            )}
            onClick={toggleVoiceInput}
            title="Voice Input">
            <Icon name={isListening ? 'x' : 'mic'} size="sm" />
          </Button>
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={handleSubmit}
            disabled={!inputText.trim()}>
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
