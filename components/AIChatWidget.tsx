'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'gemini';
  text: string;
}

export default function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'gemini', text: "Hi! I'm Jay's assistant. Ask me anything about his engineering skills, industry history, or technical projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'gemini', text: data.reply || "Error pulling metadata response." }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'gemini', text: "Connection anomaly. Try querying again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 h-[380px] flex flex-col justify-between backdrop-blur-md shadow-2xl relative z-10">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-heading">Ask My AI Portfolio Agent</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] text-xs rounded-lg px-3 py-2 leading-relaxed whitespace-pre-line ${
                msg.sender === 'user' 
                  ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' 
                  : 'bg-slate-900/90 text-slate-300 border border-slate-700/50'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-teal-400 flex items-center gap-1 pl-1">
            <span className="animate-pulse">Parsing background context</span>
            <span className="flex gap-0.5">
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0 }} className="w-1 h-1 bg-teal-400 rounded-full" />
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }} className="w-1 h-1 bg-teal-400 rounded-full" />
              <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }} className="w-1 h-1 bg-teal-400 rounded-full" />
            </span>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex gap-2 border-t border-slate-700/40 pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about my projects, stack or timeline..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-400/50 transition-colors"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-400/10 hover:bg-teal-400/20 text-teal-300 border border-teal-500/30 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          Query
        </button>
      </div>
    </div>
  );
}