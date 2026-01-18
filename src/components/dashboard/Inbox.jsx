import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Trash2, Clock, User, MessageSquare, 
  CheckCircle, RefreshCcw, ShieldAlert, Send, 
  Hash, Calendar
} from 'lucide-react'
import { supabase } from '../../Supabase/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    
    // 🟢 FETCH FROM DB
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error("Intel Link Failed")
    } else {
      setMessages(data || [])
    }
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
    if (error) toast.error("Purge failed")
    else {
      toast.success("Transmission Purged")
      setMessages(messages.filter(m => m.id !== id))
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 transition-colors">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div>
          <h2 className="text-xl font-black tracking-tighter flex items-center gap-2 dark:text-white uppercase italic">
            <Mail className="text-blue-500" size={20} /> Tactical Inbox
          </h2>
          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-[0.3em]">Comm-Channel-01</p>
        </div>
        <button onClick={fetchMessages} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white">
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: MESSAGE LIST */}
        <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-white/10 overflow-y-auto bg-slate-50/20 dark:bg-transparent">
          {messages.length === 0 && !loading ? (
            <div className="p-20 text-center opacity-40">
              <ShieldAlert className="mx-auto mb-4" size={40} />
              <p className="text-[10px] font-mono uppercase tracking-widest">No Inbound Traffic</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => { setSelectedMsg(msg); if(msg.status === 'unread') markAsRead(msg.id) }}
                className={`p-5 border-b border-slate-100 dark:border-white/5 cursor-pointer transition-all relative ${
                  selectedMsg?.id === msg.id ? 'bg-blue-50 dark:bg-blue-600/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {msg.status === 'unread' && <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-white font-black text-[10px] border border-slate-300 dark:border-white/10">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className={`text-sm font-black truncate dark:text-white uppercase ${msg.status === 'unread' ? 'pr-6' : ''}`}>{msg.name}</h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-mono tracking-tight">"{msg.message}"</p>
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono uppercase">
                      <Clock size={10} /> {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDEBAR: MESSAGE VIEW */}
        <div className="hidden md:flex flex-1 bg-slate-50/50 dark:bg-slate-900/50 flex-col relative overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div 
                key={selectedMsg.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-10 max-w-5xl mx-auto w-full"
              >
                {/* Message Header */}
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30 border-2 border-white/20">
                      <User size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase italic leading-none">{selectedMsg.name}</h2>
                      <p className="text-blue-500 font-mono text-[10px] font-black tracking-[0.3em] mt-2 bg-blue-500/5 py-1 px-3 rounded-full border border-blue-500/20">{selectedMsg.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* 🟢 REPLY BUTTON: OPENS GMAIL/OUTLOOK */}
                    <a 
                      href={`mailto:${selectedMsg.email}?subject=FireWatch Response: Re: Inquiry&body=Hello ${selectedMsg.name},%0D%0A%0D%0AWe received your message: "${selectedMsg.message}"%0D%0A%0D%0AStatus: ACKNOWLEDGED.%0D%0A%0D%0ARegards,%0D%0AFireWatch Command`}
                      className="px-6 py-3 bg-white dark:bg-blue-600 text-slate-900 dark:text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all active:scale-95"
                    >
                      <Send size={16} /> SEND REPLY
                    </a>
                    <button 
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <ShieldAlert size={140} />
                    </div>
                    <div className="flex items-center gap-3 text-blue-500 mb-8 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                      <MessageSquare size={14} /> Transmission_Payload
                    </div>
                    <p className="text-slate-800 dark:text-slate-100 text-xl leading-[1.6] font-mono whitespace-pre-wrap relative z-10 tracking-tight">
                      "{selectedMsg.message}"
                    </p>
                </div>

                {/* Footer Meta Grid */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                    <Hash size={16} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transmission ID</p>
                    <p className="text-xs font-mono dark:text-white font-bold">{selectedMsg.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                    <Calendar size={16} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logged On</p>
                    <p className="text-xs font-mono dark:text-white font-bold">{new Date(selectedMsg.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="p-6 bg-slate-100/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                    <ShieldAlert size={16} className="text-blue-500 mb-2" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Auth Status</p>
                    <p className="text-xs font-mono text-green-500 font-bold">VERIFIED</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-200 dark:text-slate-800">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Mail size={120} strokeWidth={0.5} />
                </motion.div>
                <p className="font-mono text-[10px] mt-8 uppercase tracking-[1em] font-black opacity-30">Awaiting Signal</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}