import { useState } from 'react';

interface QuickAction {
  label: string;
  message: string;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  quickActions: QuickAction[];
  disabled?: boolean;
}

export function ChatInput({ onSend, quickActions, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="border-t border-gray-200 dark:border-slate-700 p-3">
      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onSend(action.message)}
              disabled={disabled}
              className="text-xs px-2 py-1 border border-blueprint-blue text-blueprint-blue hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          maxLength={500}
          aria-label="Chat message"
          className="flex-1 border border-gray-300 dark:border-slate-600 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800 focus:outline-none focus:border-blueprint-blue"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="bg-blueprint-blue text-white px-4 py-1.5 text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
