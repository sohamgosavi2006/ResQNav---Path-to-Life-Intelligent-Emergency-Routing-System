'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, User, AlertTriangle, Route, Plus } from 'lucide-react';
import Topbar from '@/components/layout/Topbar';
import { chatWithResQBot } from '@/lib/gemini';

type Message = {
  id: string;
  role: 'model' | 'user';
  text: string;
  timestamp: string;
};

const SUGGESTIONS = [
  "🚨 Report an accident at Silk Board",
  "🚑 How do I book an ambulance?",
  "🚦 Is there congestion on Inner Ring Road?",
  "🏆 How do I earn rewards?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm **ResQBot**, your AI traffic and emergency assistant. I can help you report incidents, book an ambulance, check live traffic vectors, or answer any questions about the platform. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    setInput('');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, text: m.text })),
          userMessage: text
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const responseText = data.text;
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      console.error(e);
      // Log to mobile console via alert for debugging if requested, 
      // but here we just show the error in chat for the user to report.
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Error connecting to ResQBot: ${e.message}. Please check your connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      <Topbar title="AI Assistant" subtitle="Multilingual natural language incident reporting" />
      
      <div className="flex-1 flex justify-center p-2 sm:p-6 overflow-hidden">
        <div className="w-full max-w-4xl glass flex flex-col h-full rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-gradient-dark p-4 flex items-center justify-between border-b border-white/10 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="pulse-ring relative w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                <Bot className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>ResQBot — Gemini AI</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online and ready
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="badge bg-white/10 text-white font-medium">Multilingual</span>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 relative"
          >
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center mt-1 ${
                  msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-gradient-blue text-white'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                </div>
                
                <div className={`space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm filter drop-shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}>
                    {/* Basic markdown bold parser for bot messages */}
                    {msg.role === 'model' ? (
                      <span dangerouslySetInnerHTML={{ 
                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                      }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className={`text-[10px] font-semibold text-slate-400 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center mt-1 text-white">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 z-10 pb-[env(safe-area-inset-bottom)] sm:pb-4">
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTIONS.map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs font-semibold text-slate-600 hover:text-blue-600 rounded-full transition-colors flex items-center gap-1"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                <Plus size={20} />
              </button>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Type your message..."
                  className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 rounded-xl py-3 pl-4 pr-12 outline-none transition text-[15px]"
                />
                <button 
                  type="button" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 transition"
                  title="Voice input"
                >
                  <Mic size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-blue text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={20} className="mr-0.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
