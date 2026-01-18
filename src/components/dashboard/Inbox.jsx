import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Trash2, Clock, User, MessageSquare, 
  CheckCircle, RefreshCcw, ShieldAlert, Send, 
  Hash, Calendar, X, ChevronLeft, Terminal
} from 'lucide-react'
import { supabase } from '../../Supabase/supabase'
import toast, { Toaster } from 'react-hot-toast'

// 🟢 YOUR LIVE BACKEND URL
const EMAIL_FUNCTION_URL = "https://fxksnraszpzgqouxcuvl.supabase.co/functions/v1/send-email"

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  
  // Reply State
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error("Supabase Error:", error)
      toast.error("Intel Link Failed")
    } else {
      setMessages(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markAsRead = async (id) => {
    const { error } = await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id)
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

  // 🟢 HANDLE SENDING REPLY
  const handleSendReply = async () => {
    if (!replyText.trim()) return toast.error("Message Payload Empty")
    
    setSendingReply(true)
    const toastId = toast.loading("Encrypting & Transmitting...")

    try {
        const response = await fetch(EMAIL_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: selectedMsg.email,
                
                // 1. Cleaner Subject Line
                subject: `Re: FireWatch Inquiry - ${selectedMsg.name}`,
                
                description: replyText,
                
                // 🟢 2. UPDATED TYPE: Triggers the "Tactical Memo" template
                type: 'reply', 
                
                status: 'verified', 
                id: selectedMsg.id.slice(0, 8).toUpperCase()
            })
        })

        if (!response.ok) {
            const text = await response.text()
            throw new Error(`Server Error ${response.status}: ${text}`)
        }

        const result = await response.json()

        if (result.error) {
            throw new Error(result.error)
        }

        toast.success("Tactical Response Sent", { id: toastId })
        setIsReplying(false)
        setReplyText('')

    } catch (error) {
        console.error("Uplink Error:", error)
        toast.error(`Uplink Failed: ${error.message}`, { id: toastId })
    } finally {
        setSendingReply(false)
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
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-white/10 overflow-y-auto bg-slate-50/20 dark:bg-transparent custom-scrollbar">
          {messages.length === 0 && !loading ? (
            <div className="p-20 text-center opacity-40">
              <ShieldAlert className="mx-auto mb-4" size={40} />
              <p className="text-[10px] font-mono uppercase tracking-widest">No Inbound Traffic</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => { 
                    setSelectedMsg(msg); 
                    setIsReplying(false); 
                    if(msg.status === 'unread') markAsRead(msg.id) 
                }}
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
        <div className="hidden md:flex flex-1 bg-slate-50/50 dark:bg-slate-900/50 flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div 
                key={selectedMsg.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-10 max-w-5xl mx-auto w-full h-full flex flex-col"
              >
                {/* Header Info */}
                <div className="flex justify-between items-start mb-8 shrink-0">
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
                    <button 
                      onClick={() => deleteMessage(selectedMsg.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* DYNAMIC CONTENT */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isReplying ? (
                            <motion.div 
                                key="view"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldAlert size={140} /></div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center gap-3 text-blue-500 mb-8 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                                        <MessageSquare size={14} /> Transmission_Payload
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-100 text-xl leading-[1.6] font-mono whitespace-pre-wrap relative z-10 tracking-tight">
                                        "{selectedMsg.message}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
                                    <button 
                                        onClick={() => setIsReplying(true)}
                                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/30 uppercase tracking-widest"
                                    >
                                        <Terminal size={16} /> Initiate Response
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="reply"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-slate-900 border border-blue-500/30 p-8 rounded-[3rem] shadow-2xl h-full flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
                                
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-500/20">
                                    <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
                                        <Terminal size={16} /> Secure_Uplink_Active
                                    </div>
                                    <button onClick={() => setIsReplying(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                                </div>

                                <textarea 
                                    autoFocus
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Enter secure response to ${selectedMsg.name}...`}
                                    className="flex-1 bg-transparent border-none outline-none text-blue-100 font-mono text-lg resize-none placeholder:text-blue-500/30"
                                />

                                <div className="flex justify-between items-center mt-6 pt-6 border-t border-blue-500/20">
                                    <span className="text-[10px] text-slate-500 font-mono">ENCRYPTION: AES-256 // VERIFIED</span>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setIsReplying(false)}
                                            className="px-6 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSendReply}
                                            disabled={sendingReply}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
                                        >
                                            {sendingReply ? "Transmitting..." : <><Send size={16} /> Send Transmission</>}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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