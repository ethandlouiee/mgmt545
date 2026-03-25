/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Anchor, Send, Ship, Skull, Coins, Waves, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getPirateResponse } from './services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      const response = await getPirateResponse(input, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Arrgh, something went wrong with the compass!' }]);
    } catch (error) {
      console.error('Pirate error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Shiver me timbers! The kraken has disrupted our signal!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pirate-gradient overflow-hidden">
      {/* Header */}
      <header className="h-16 glass-card flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <Ship className="text-[var(--color-gold)] w-8 h-8" />
          <h1 className="font-serif text-2xl font-bold tracking-wider text-[var(--color-gold)] uppercase">The Salty Dog AI</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 glass-card flex-col p-6 gap-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Ship's Log</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm group">
                <Anchor className="w-4 h-4 text-[var(--color-gold)] group-hover:rotate-12 transition-transform" />
                <span>New Voyage</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm text-white/60">
                <Coins className="w-4 h-4" />
                <span>Saved Loot</span>
              </button>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center border border-[var(--color-gold)]/30">
                <Skull className="text-[var(--color-gold)] w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Captain Louiee</p>
                <p className="text-[10px] text-white/40 uppercase tracking-tighter">Master of the Seas</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-0 z-40 bg-[var(--color-deep-sea)] md:hidden p-6 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-[var(--color-gold)]">Ship's Log</h2>
                <button onClick={() => setIsSidebarOpen(false)}><X /></button>
              </div>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 text-lg">
                  <Anchor className="text-[var(--color-gold)]" />
                  <span>New Voyage</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Waves className="w-16 h-16 text-[var(--color-gold)]/40" />
                </motion.div>
                <h2 className="font-serif text-4xl font-light">Welcome Aboard, Matey</h2>
                <p className="text-white/60 leading-relaxed">
                  The seas are calm and the treasure is waiting. Ask the Captain anything, and he'll guide ye through the digital waters.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-gold)] text-[var(--color-deep-sea)] font-medium rounded-tr-none' 
                    : 'glass-card rounded-tl-none'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-card p-4 rounded-2xl rounded-tl-none flex gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-[var(--color-gold)] rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-[var(--color-gold)] rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-[var(--color-gold)] rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Send a message to the Captain..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-[var(--color-gold)]/50 transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[var(--color-gold)] text-[var(--color-deep-sea)] rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-widest">
              Powered by Gemini • Navigated by Captain Louiee
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
