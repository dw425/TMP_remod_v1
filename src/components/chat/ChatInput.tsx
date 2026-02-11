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
    <div className="border-t border-gray-100 p-3">
      {quickActions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onSend(action.message)}
              disabled={disabled}
              className="text-xs px-2.5 py-1 border border-blue-200 text-blueprint-blue bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
              style={{ borderRadius: '999px' }}
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
          className="flex-1 border border-gray-200 px-3 py-1.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blueprint-blue focus:bg-white transition-colors"
          style={{ borderRadius: '8px' }}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="bg-blueprint-blue text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
          style={{ borderRadius: '8px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
