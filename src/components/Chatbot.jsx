import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'

// 🟢 API CONFIG
const CHAT_API_URL = "https://keryptonite-8k3u.vercel.app/chat"
const USER_ID = "ranger_alpha_1"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Systems Online. I am the FireWatch AI. How can I assist with tactical operations today?" }
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
      setMessages(prev => [...prev, { sender: 'ai', text: "⚠️ Connection Error: Unable to reach Command Mainframe." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // 🟢 FIX 1: Wrapper is pointer-events-none so it doesn't block clicks on the page
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-end justify-end p-4 md:p-6">
      
      {/* 🟢 LIQUID GLASS PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            // 🟢 FIX 2: Added pointer-events-auto to re-enable clicks inside the chat
            // 🟢 FIX 3: Adjusted mobile width/height constraints
            className="pointer-events-auto w-full md:w-[400px] h-[500px] md:h-[600px] max-h-[80vh] flex flex-col rounded-[2rem] overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 mb-4 origin-bottom-right"
          >
            {/* HEADER */}
            <div className="p-4 border-b border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-full border border-orange-200 dark:border-orange-500/30">
                  <Bot size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
                    Tactical AI <Sparkles size={10} className="text-yellow-500" />
                  </h3>
                  <p className="text-[10px] font-mono text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                  </p>
                </div>
              </div>
              {/* Close button for mobile accessibility */}
              <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' : 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30'}`}>
                    {msg.sender === 'user' ? <User size={14} className="text-slate-600 dark:text-slate-300" /> : <Bot size={14} className="text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
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

            {/* INPUT AREA */}
            <form onSubmit={handleSend} className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for situational analysis..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:text-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 FLOATING TOGGLE BUTTON */}
      {/* 🟢 FIX 4: pointer-events-auto ensures button is clickable */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border border-white/20 backdrop-blur-md flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </motion.button>
    </div>
  )
}