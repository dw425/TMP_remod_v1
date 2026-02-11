import type { ChatMessage as ChatMessageType } from '@/features/chat/chatStore';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? 'chat-bubble-user bg-blueprint-blue text-white'
            : 'chat-bubble-assistant bg-gray-50 text-gray-800 border border-gray-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="chat-bubble-assistant bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm">
        <span className="inline-flex gap-1 items-center">
          <span className="chat-dot w-1.5 h-1.5 bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="chat-dot w-1.5 h-1.5 bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="chat-dot w-1.5 h-1.5 bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  );
}
