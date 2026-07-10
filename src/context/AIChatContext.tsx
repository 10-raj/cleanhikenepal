import { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { processUserQuery } from '../utils/aiMatcher';

interface AIChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  clearChat: () => void;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate typing delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Process query with enhanced matcher
    const aiContent = processUserQuery(content);

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: aiContent,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const toggleChat = () => setIsOpen(prev => !prev);
  const clearChat = () => setMessages([]);

  return (
    <AIChatContext.Provider value={{
      messages,
      isOpen,
      isLoading,
      sendMessage,
      toggleChat,
      clearChat,
    }}>
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}
