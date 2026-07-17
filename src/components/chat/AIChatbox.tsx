import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Mountain, MessageCircle, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAIChat } from '../../context/AIChatContext';
import { suggestedQuestions } from '../../data/aiFAQ';
import { JOIN_HIKE_BUTTON_MARKER } from '../../utils/aiMatcher';

/** Renders a "Join Upcoming Clean Hike" action button */
function JoinHikeButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/contact');
    setTimeout(() => {
      const el = document.getElementById('join-us-for-clean-hike');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all my-2"
    >
      <Mountain className="w-4 h-4" />
      Join Upcoming Clean Hike
    </button>
  );
}

/** Renders a message string with markdown-like links and the join hike button marker */
function RenderMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        // Handle JOIN_HIKE_BUTTON_MARKER
        if (line.trim() === JOIN_HIKE_BUTTON_MARKER) {
          return <JoinHikeButton key={lineIdx} />;
        }

        // Parse inline markdown links
        const parts: React.ReactNode[] = [];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
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

        if (lastIndex < line.length) {
          parts.push(
            <span key={`text-${lineIdx}-end`} dangerouslySetInnerHTML={{
              __html: line.slice(lastIndex)
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            }} />
          );
        }

        if (parts.length === 0) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              w-[340px] md:w-[380px]
              ${expanded ? 'h-[600px]' : 'h-[480px]'}
              rounded-3xl overflow-hidden
              bg-gray-900 dark:bg-gray-800
              border border-white/10
              shadow-2xl shadow-black/30
              flex flex-col
              transition-all duration-300
            `}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-emerald-600 to-green-700">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">CleanHike AI</p>
                <p className="text-xs text-emerald-200">Your trail assistant</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors text-xs"
                  title={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? '▾' : '▴'}
                </button>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors text-xs"
                    title="Clear chat"
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={toggleChat}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <Mountain className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
                  <p className="text-gray-400 text-sm mb-4">Hi! How can I help you today?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.slice(0, 4).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs hover:border-emerald-500/50 hover:text-emerald-300 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-white/5 text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <RenderMessage content={msg.content} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about hikes, events..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
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
