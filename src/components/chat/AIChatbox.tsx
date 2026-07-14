import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Send, Bot, Mountain, MessageCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAIChat } from '../../context/AIChatContext';
import { suggestedQuestions } from '../../data/aiFAQ';

/** Renders a string with markdown-like links as JSX.
 *  Supports: [label](url) — internal /paths become <Link>, external become <a> */
function RenderMessage({ content }: { content: string }) {
  // Split by lines first
  const lines = content.split('\n');

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        // Parse inline markdown links
        const parts: React.ReactNode[] = [];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
          // Text before the link
          if (match.index > lastIndex) {
            parts.push(
              <span key={`text-${lineIdx}-${lastIndex}`} dangerouslySetInnerHTML={{
                __html: line.slice(lastIndex, match.index)
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/➡️\s*/g, '➡️ ')
              }} />
            );
          }
          const linkLabel = match[1];
          const linkHref = match[2];
          const isExternal = linkHref.startsWith('http') || linkHref.startsWith('mailto:') || linkHref.startsWith('tel:');

          if (isExternal) {
            if (linkHref.startsWith('mailto:') || linkHref.startsWith('tel:')) {
              parts.push(
                <a key={`link-${lineIdx}-${match.index}`} href={linkHref}
                  className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 transition-colors">
                  {linkLabel}
                </a>
              );
            } else {
              parts.push(
                <a key={`link-${lineIdx}-${match.index}`} href={linkHref} target="_blank" rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 inline-flex items-center gap-0.5 transition-colors">
                  {linkLabel} <ExternalLink className="w-3 h-3" />
                </a>
              );
            }
          } else {
            parts.push(
              <Link key={`link-${lineIdx}-${match.index}`} to={linkHref}
                className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 font-medium transition-colors">
                {linkLabel}
              </Link>
            );
          }
          lastIndex = match.index + match[0].length;
        }

        // Remaining text after last link
        if (lastIndex < line.length) {
          parts.push(
            <span key={`text-${lineIdx}-end`} dangerouslySetInnerHTML={{
              __html: line.slice(lastIndex)
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            }} />
          );
        }

        if (parts.length === 0) {
          // Plain line with bold support
          return (
            <p key={lineIdx} dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            }} />
          );
        }

        return <p key={lineIdx}>{parts}</p>;
      })}
    </div>
  );
}

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
              h-full md:h-[520px]
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    Hello! I can help you navigate the site and answer questions about CleanHike Nepal.
                  </p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSuggestion(question)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-colors border border-white/5 hover:border-emerald-500/30"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-br from-emerald-400 to-green-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <span className="text-white text-xs font-bold">U</span>
                    ) : (
                      <Mountain className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-sm'
                      : 'bg-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    {message.sender === 'ai' ? (
                      <RenderMessage content={message.content} />
                    ) : (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    )}
                    <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-emerald-200' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
                    <Mountain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about CleanHike Nepal..."
                  className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-emerald-500 border border-white/10 focus:border-emerald-500/50"
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
