'use client';
import { useState, useRef, useEffect } from 'react';
import {
  sendMessageToAI,
  startNewConversation,
  saveChatMessage,
  fetchConversations,
  fetchMessages
} from '@/lib/api/ai-chat';

interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const groupConversationsByDate = (conversations: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      'Last 30 Days': [],
      Older: [],
    };

    const now = new Date();
    const today = now.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7 = new Date(today);
    last7.setDate(last7.getDate() - 7);
    const last30 = new Date(today);
    last30.setDate(last30.getDate() - 30);

    for (const conv of conversations) {
      const convDate = new Date(conv.updated_at).getTime();
      if (convDate >= today) groups.Today.push(conv);
      else if (convDate >= yesterday.getTime()) groups.Yesterday.push(conv);
      else if (convDate >= last7.getTime()) groups['Last 7 Days'].push(conv);
      else if (convDate >= last30.getTime()) groups['Last 30 Days'].push(conv);
      else groups.Older.push(conv);
    }

    return groups;
  };

  const loadConversations = async () => {
    try {
      const { conversations } = await fetchConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (convId: string) => {
    setIsLoading(true);
    try {
      const { messages } = await fetchMessages(convId);
      setMessages(messages);
      setConversationId(convId);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput('');
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    let convId = conversationId;

    if (!convId) {
      const { conversation_id } = await startNewConversation(input);
      convId = conversation_id;
      setConversationId(convId);
    }

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    try {
      await saveChatMessage(convId, 'user', userMsg.content);
      const reply = await sendMessageToAI(newMessages);
      const aiReplyContent = reply?.reply || 'No reply found.';
      const aiMsg = { role: 'assistant', content: aiReplyContent };
      setMessages([...newMessages, aiMsg]);
      await saveChatMessage(convId, 'assistant', aiReplyContent);
      await loadConversations();
    } catch (error) {
      console.error('Error in sendMessage:', error);
    }
  };

  return (
    <div className="flex h-[80vh] max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="w-80 border-r border-gray-200/50 bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <div className="p-6 border-b border-gray-200/50">
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium focus:ring-2 focus:ring-primary-200 focus:outline-none shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
          >
            Start New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {Object.entries(groupConversationsByDate(conversations)).map(
            ([label, group]) =>
              group.length > 0 && (
                <div key={label} className="animate-fade-in">
                  <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                  </div>
                  {group.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadMessages(conv.id)}
                      className={`px-6 py-4 cursor-pointer transition-all duration-300 hover:bg-gray-50/80 ${
                        conversationId === conv.id 
                          ? 'bg-gradient-to-r from-primary-50 to-transparent border-l-4 border-primary-500' 
                          : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900 truncate">{conv.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(conv.updated_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50/50 to-white custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
                <div className="w-12 h-12 border-4 border-primary-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-6 py-4 text-sm sm:text-base rounded-2xl shadow-sm whitespace-pre-wrap break-words animate-fade-in ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white self-end ml-auto shadow-lg shadow-primary-500/20'
                      : 'bg-white text-gray-900 border border-gray-200/50 self-start mr-auto shadow-lg shadow-gray-200/20'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>
        <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 text-gray-900 text-sm sm:text-base rounded-xl border border-gray-200/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
