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
        <div className="mb-3 w-80 bg-white border border-gray-300 shadow-xl flex flex-col" style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="bg-blueprint-blue text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Blueprint Assistant</p>
              <p className="text-xs text-blue-200">Ask me anything about our products</p>
            </div>
            <button onClick={handleToggle} className="text-white hover:text-blue-200 text-lg leading-none">
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3" style={{ minHeight: '200px', maxHeight: '300px' }}>
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
        className="bg-blueprint-blue text-white px-6 py-3 shadow-lg hover:bg-blue-800 transition-colors font-bold"
      >
        {isOpen ? 'Close Chat' : 'Chat with Us'}
      </button>
    </div>
  );
}
