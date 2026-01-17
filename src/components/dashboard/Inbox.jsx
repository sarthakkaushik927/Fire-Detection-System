import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Trash2, Clock, User, MessageSquare, CheckCircle, RefreshCcw, ShieldAlert } from 'lucide-react'
import { supabase } from '../../Supabase/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) toast.error("Failed to sync with Intel Database")
    else setMessages(data)
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id)
    
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m))
    }
  }

  const deleteMessage = async (id) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) toast.error("Declassification failed")
    else {
      toast.success("Transmission Purged")
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 transition-colors">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h2 className="text-xl font-black tracking-tighter flex items-center gap-2 dark:text-white">
            <Mail className="text-blue-500" size={20} /> TACTICAL INBOX
          </h2>
          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Inbound Communications Channel</p>
        </div>
        <button onClick={fetchMessages} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List View */}
        <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-white/10 overflow-y-auto">
          {messages.length === 0 && !loading ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-widest">No Active Transmissions</div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => { setSelectedMsg(msg); if(msg.status === 'unread') markAsRead(msg.id) }}
                className={`p-5 border-b border-slate-100 dark:border-white/5 cursor-pointer transition-all relative ${
                  selectedMsg?.id === msg.id ? 'bg-blue-50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {msg.status === 'unread' && <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-white">
                    <User size={14} />
                  </div>
                  <h3 className={`text-sm font-bold truncate dark:text-white ${msg.status === 'unread' ? 'pr-6' : ''}`}>{msg.name}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-mono">{msg.message}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase">
                  <Clock size={10} /> {new Date(msg.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Content View */}
        <div className="hidden md:flex flex-1 bg-slate-50/50 dark:bg-slate-900/50 flex-col relative">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div 
                key={selectedMsg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-10"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight dark:text-white uppercase">{selectedMsg.name}</h2>
                      <p className="text-blue-500 font-mono text-xs font-bold">{selectedMsg.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteMessage(selectedMsg.id)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <div className="flex items-center gap-2 text-slate-400 mb-6 font-mono text-[10px] uppercase tracking-widest">
                    <MessageSquare size={14} /> Transmission Payload
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                    "{selectedMsg.message}"
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-6 p-4 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl opacity-50">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="text-green-500" size={14} /> Verification: PASS
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="text-orange-500" size={14} /> Security: ENCRYPTED
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                <Mail size={80} strokeWidth={1} />
                <p className="font-mono text-xs mt-4 uppercase tracking-[0.4em]">Awaiting Selection</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}