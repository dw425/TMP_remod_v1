import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  setTyping: (typing: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role, content, timestamp: Date.now() },
      ],
    })),
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setTyping: (isTyping) => set({ isTyping }),
  clear: () => set({ messages: [] }),
}));
