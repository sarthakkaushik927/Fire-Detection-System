import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'

// 🟢 API CONFIG
const CHAT_API_URL = "https://keryptonite-8k3u.vercel.app/chat"
const USER_ID = "ranger_alpha_1"

// 🟢 NEW: Text Formatter Component
// This turns plain strings into formatted HTML (Bold, Lists, Newlines)
const FormattedText = ({ text }) => {
  if (!text) return null;

  return text.split('\n').map((line, i) => {
    // Check if line is a bullet point
    const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
    const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

    // Split by bold markers (**)
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-bold text-orange-600 dark:text-orange-400">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <div key={i} className={`${isBullet ? 'pl-4 relative flex items-start gap-2 my-1' : 'min-h-[1.2em] mb-1'}`}>
        {isBullet && <span className="text-orange-500 mt-1.5 w-1.5 h-1.5 bg-current rounded-full shrink-0"></span>}
        <p className={`leading-relaxed ${isBullet ? 'flex-1' : ''}`}>{parts}</p>
      </div>
    );
  });
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "**System Online.**\nI am the FireWatch AI. How can I assist with tactical operations today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          message: userMsg
        })
      })

      if (!res.ok) throw new Error("Comms Link Failed")
      
      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { sender: 'ai', text: "**Connection Error**\nUnable to reach Command Mainframe." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-end justify-end p-4 sm:p-6 overflow-hidden">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto w-full sm:w-[400px] h-[65vh] sm:h-[600px] flex flex-col rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 mb-20 sm:mb-4 origin-bottom-right"
          >
            {/* HEADER */}
            <div className="p-3 sm:p-4 border-b border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-500/30">
                  <Bot size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    Tactical AI <Sparkles size={10} className="text-yellow-500" />
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="pointer-events-auto p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' : 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30'}`}>
                    {msg.sender === 'user' ? <User size={12} className="text-slate-600 dark:text-slate-300" /> : <Bot size={14} className="text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className={`max-w-[85%] p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
                  }`}>
                    {/* 🟢 USE FORMATTER COMPONENT */}
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center border border-orange-200 dark:border-orange-500/30">
                      <Loader2 size={14} className="animate-spin text-orange-500"/>
                   </div>
                   <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 text-xs text-slate-400 animate-pulse">
                      Analyzing...
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for situational analysis..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
  )
}