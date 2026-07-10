import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Send, Bot, Mountain, MessageCircle } from 'lucide-react';
import { useAIChat } from '../../context/AIChatContext';
import { suggestedQuestions } from '../../data/aiFAQ';

export function AIChatbox() {
  const { messages, isOpen, isLoading, sendMessage, toggleChat, clearChat } = useAIChat();
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = async (question: string) => {
    await sendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`
              fixed md:absolute
              ${expanded || window.innerWidth < 768 ? 'inset-0 md:inset-auto' : ''}
              md:bottom-20 md:right-0
              w-full md:w-96
              h-full md:h-[500px]
              md:rounded-2xl
              overflow-hidden
              bg-gradient-to-br from-gray-900/95 to-emerald-950/95
              backdrop-blur-xl
              border border-white/10
              shadow-2xl shadow-emerald-500/20
              flex flex-col
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <Mountain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">CleanHike AI</h3>
                  <p className="text-xs text-emerald-400">Your eco-tourism assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Clear chat"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 text-gray-400 hover:text-white transition-colors md:block hidden"
                >
                  <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button onClick={toggleChat} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="text-white font-semibold mb-2">Welcome to CleanHike AI</h4>
                  <p className="text-gray-400 text-sm mb-6">
                    Ask me about hiking trails, eco-tourism, donations, or travel tips for Nepal!
                  </p>
                  <div className="space-y-2 w-full">
                    <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                    {suggestedQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSuggestion(q)}
                        className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 text-sm transition-all border border-white/5 hover:border-emerald-500/30"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[85%] p-4 rounded-2xl
                          ${msg.sender === 'user'
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-br-sm'
                            : 'bg-white/10 text-gray-200 rounded-bl-sm'
                          }
                        `}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about hiking..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className={`
          w-14 h-14 md:w-16 md:h-16
          rounded-full
          bg-gradient-to-br from-emerald-500 to-green-600
          text-white
          shadow-lg shadow-emerald-500/30
          flex items-center justify-center
          hover:shadow-xl hover:shadow-emerald-500/40
          transition-all duration-300
          ${isOpen ? 'rotate-0' : 'animate-bounce'}
        `}
        style={{ animationDuration: '2s' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Notification Badge */}
      {!isOpen && messages.length === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <span className="text-xs text-white font-bold">1</span>
        </motion.div>
      )}
    </div>
  );
}
