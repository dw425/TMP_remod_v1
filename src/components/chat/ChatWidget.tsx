import { useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FEATURES } from '@/config/features';
import { useChatStore } from '@/features/chat/chatStore';
import { generateResponse, getQuickActions } from '@/features/chat/chatService';
import { useAuth } from '@/features/auth/useAuth';
import { useTrack } from '@/features/analytics/useTrack';
import { EVENTS } from '@/features/analytics/events';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatWidget() {
  const { isOpen, messages, isTyping, toggle, addMessage, setTyping } = useChatStore();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const track = useTrack();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (text: string) => {
      addMessage('user', text);
      track(EVENTS.CHAT_MESSAGE_SENT, { message: text, path: location.pathname });
      setTyping(true);

      try {
        const response = await generateResponse(text, {
          currentPath: location.pathname,
          currentPage: document.title,
          userAuthenticated: isAuthenticated,
          userName: user?.firstName,
        });
        addMessage('assistant', response);
      } catch {
        addMessage('assistant', 'Sorry, something went wrong. Please try again.');
      } finally {
        setTyping(false);
      }
    },
    [addMessage, setTyping, track, location.pathname, isAuthenticated, user],
  );

  const handleToggle = () => {
    if (!isOpen) {
      track(EVENTS.CHAT_OPENED, { path: location.pathname });
    }
    toggle();
  };

  if (!FEATURES.chat) return null;

  const quickActions = getQuickActions(location.pathname);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '480px', borderRadius: '12px' }}>
          {/* Header */}
          <div className="bg-blueprint-blue text-white px-4 py-3 flex items-center justify-between" style={{ borderRadius: '12px 12px 0 0' }}>
            <div>
              <p className="font-bold text-sm" id="chat-title">Blueprint Assistant</p>
              <p className="text-xs text-blue-200">Ask me anything about our products</p>
            </div>
            <button
              onClick={handleToggle}
              className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              style={{ borderRadius: '6px' }}
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            className="flex-1 overflow-y-auto p-3"
            style={{ minHeight: '200px', maxHeight: '300px' }}
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                <p className="mb-1 font-medium">Welcome!</p>
                <p>Ask a question or use the quick actions below.</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} quickActions={quickActions} disabled={isTyping} />
        </div>
      )}

      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        className="bg-blueprint-blue text-white p-3.5 shadow-lg hover:bg-blue-800 transition-all hover:scale-105"
        style={{ borderRadius: '9999px' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}
