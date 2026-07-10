import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, CheckCircle, Clock, Archive, Send, AlertCircle } from 'lucide-react';
import { getAllContactMessages, updateMessageStatus, replyToMessage } from '../../services/admin';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
  replied_at: string | null;
  reply_message: string | null;
}

const statusColors = {
  unread: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  replied: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const statusIcons = {
  unread: AlertCircle,
  read: Clock,
  replied: CheckCircle,
  archived: Archive,
};

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getAllContactMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: 'unread' | 'read' | 'replied' | 'archived') => {
    try {
      await updateMessageStatus(messageId, newStatus);
      setMessages(messages.map(m => m.id === messageId ? { ...m, status: newStatus } : m));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setSending(true);
      await replyToMessage(selectedMessage.id, replyText);
      const updatedMessages = messages.map(m =>
        m.id === selectedMessage.id
          ? { ...m, status: 'replied' as const, reply_message: replyText, replied_at: new Date().toISOString() }
          : m
      );
      setMessages(updatedMessages);
      setSelectedMessage({
        ...selectedMessage,
        status: 'replied',
        reply_message: replyText,
        replied_at: new Date().toISOString(),
      });
      setReplyText('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {messages.filter(m => m.status === 'unread').length} unread messages
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          {/* Search and Filter */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Messages List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => {
                const StatusIcon = statusIcons[message.status];
                return (
                  <motion.button
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'unread') {
                        handleStatusChange(message.id, 'read');
                      }
                    }}
                    className={`
                      w-full text-left p-4 rounded-xl transition-all
                      ${selectedMessage?.id === message.id
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                      border border-gray-200 dark:border-gray-700
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {message.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusColors[message.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{message.status}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedMessage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Select a message to view</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedMessage.subject}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        From: {selectedMessage.name} ({selectedMessage.email})
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(selectedMessage.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as typeof selectedMessage.status)}
                        className={`px-3 py-2 rounded-lg text-sm ${statusColors[selectedMessage.status]} border-0`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Existing Reply */}
                {selectedMessage.reply_message && (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          Sent on {selectedMessage.replied_at && formatDate(selectedMessage.replied_at)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                          {selectedMessage.reply_message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    {selectedMessage.reply_message ? 'Send Another Reply' : 'Reply to Message'}
                  </h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || sending}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
