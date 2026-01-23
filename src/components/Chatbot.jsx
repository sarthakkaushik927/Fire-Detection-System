import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

// 🟢 CONFIGURATION
const API_URL = "https://keryptonite-8k3u.vercel.app/chat";
const USER_ID = "ranger_alpha_1";

/**
 * Parses raw text into a formatted React component.
 * Handles: **Bold**, *Bullets*, # Headings, and \n newlines.
 */
const FormattedText = React.memo(({ text }) => {
  if (!text) return <span className="text-slate-400 italic">No content.</span>;

  // Handle escaped newlines often sent by Python/Node backends
  const safeText = text.replace(/\\n/g, '\n');

  return safeText.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={`br-${i}`} className="h-2" />;

    // Headings (lines starting with #)
    if (trimmed.startsWith('#')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      return (
        <h4 key={`head-${i}`} className="font-black text-orange-600 dark:text-orange-400 uppercase tracking-wide mt-3 mb-1 text-xs sm:text-sm">
          {headingText}
        </h4>
      );
    }

    // List Items
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    const isNumbered = /^\d+\.\s/.test(trimmed);
    
    let cleanLine = trimmed;
    if (isBullet) cleanLine = trimmed.substring(2);
    if (isNumbered) cleanLine = trimmed.replace(/^\d+\.\s/, '');

    // Parse Bold Syntax (**text**)
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${i}-${j}`} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <div key={`p-${i}`} className={`text-xs sm:text-sm leading-relaxed ${isBullet || isNumbered ? 'pl-2 flex gap-2 my-1' : 'mb-1'}`}>
        {isBullet && <span className="text-orange-500 mt-1.5 w-1.5 h-1.5 bg-current rounded-full shrink-0" />}
        {isNumbered && <span className="text-orange-500 font-bold text-[10px] mt-0.5 shrink-0">{trimmed.match(/^\d+\./)[0]}</span>}
        <p className={`${isBullet || isNumbered ? 'flex-1' : ''}`}>{parts}</p>
      </div>
    );
  });
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial Welcome Message
  const [messages, setMessages] = useState([
    { 
      id: 'init-1',
      sender: 'ai', 
      text: "Hello Commander. FireWatch Tactical Support is ready. How can I assist with your sector today?" 
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const tempId = Date.now().toString();

    // 1. Add User Message
    setMessages(prev => [...prev, { id: tempId, sender: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: USER_ID,
          message: userMsg
        })
      });

      // 2. Check for HTTP Errors
      if (!response.ok) {
        let errorMsg = `Server Error (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch (_) { /* ignore JSON parse error on failure */ }
        throw new Error(errorMsg);
      }

      // 3. Parse Data
      const data = await response.json();
      
      if (!data || !data.response) {
        throw new Error("Invalid response format from server");
      }

      // 4. Add AI Response
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'ai', 
        text: data.response 
      }]);

    } catch (error) {
      console.error("Chatbot Error:", error);
      
      let friendlyError = "Connection lost. Please check your network.";
      if (error.message.includes("Server Error")) friendlyError = "Command server is currently unreachable (500).";
      if (error.message.includes("Failed to fetch")) friendlyError = "Cannot reach server. Possible CORS or network issue.";

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'ai', 
        isError: true,
        text: `**ALERT:** ${friendlyError}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-end justify-end p-4 sm:p-6 overflow-hidden">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full sm:w-[400px] h-[60vh] sm:h-[600px] flex flex-col rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 mb-20 sm:mb-4 origin-bottom-right"
          >
            {/* --- HEADER --- */}
            <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-500/30">
                  <Bot size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    FIREWATCH AI <Sparkles size={10} className="text-yellow-500" />
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
                    {isLoading ? 'TRANSMITTING...' : 'ONLINE'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="pointer-events-auto p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* --- MESSAGES AREA --- */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.sender === 'user' 
                      ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' 
                      : msg.isError 
                        ? 'bg-red-100 dark:bg-red-900/20 border-red-200' 
                        : 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User size={12} className="text-slate-600 dark:text-slate-300" />
                    ) : msg.isError ? (
                      <AlertCircle size={14} className="text-red-500" />
                    ) : (
                      <Bot size={14} className="text-orange-600 dark:text-orange-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[85%] p-2.5 sm:p-4 rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-tr-none' 
                      : msg.isError
                        ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-200 border border-red-100 dark:border-red-900/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
                  }`}>
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-500/30">
                      <Loader2 size={14} className="animate-spin text-orange-500"/>
                   </div>
                   <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 text-xs text-slate-400 animate-pulse">
                      Processing tactical data...
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command..."
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-500/20"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOGGLE BUTTON --- */}
      <motion.button
        initial={{ scale: 0, rotate: 180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          y: [0, -5, 0],
          boxShadow: [
            "0 0 0px rgba(249,115,22,0.4)",
            "0 0 20px rgba(249,115,22,0.6)",
            "0 0 0px rgba(249,115,22,0.4)"
          ]
        }}
        transition={{
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto fixed bottom-6 right-4 sm:right-6 p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center group z-[100]"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
           <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce"></span>
        )}
      </motion.button>
    </div>
  );
}