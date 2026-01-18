import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, User, MessageSquare, ShieldCheck, Activity, Terminal, Loader2 } from 'lucide-react'
import { supabase } from '../../Supabase/supabase' 
import toast, { Toaster } from 'react-hot-toast'

export default function ContactSection({ textEnter, textLeave }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading("Establishing Secure Uplink...")

    try {
      // 🟢 1. SAVE TO DATABASE (This makes it show up in Dashboard Inbox)
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([{ 
            name: formData.name, 
            email: formData.email, 
            message: formData.message,
            status: 'unread' // Mark as unread for the admin
        }])

      if (dbError) throw dbError

      // 🟢 2. UI SUCCESS STATE
      toast.success("Transmission Received & Logged", { id: toastId })
      setFormData({ name: '', email: '', message: '' })

    } catch (error) {
      console.error(error)
      toast.error("Transmission Interrupted.", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-32 px-6 bg-[#020617] relative overflow-hidden border-t border-red-600/20" id="contact">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#0f172a', color: '#fff' }}} />
      
      {/* 🟦 THEME MATCHING GRID */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* 🛑 SECTOR WATERMARK */}
      <div className="absolute top-20 right-10 text-[15vw] font-black text-red-600/[0.03] pointer-events-none select-none tracking-tighter italic uppercase">
        Inbound
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start relative z-10">
        
        {/* Left Side: Mission Briefing */}
        <motion.div 
          className="lg:col-span-5"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
             <div className="h-px w-12 bg-red-600" />
             <span className="text-red-500 font-mono text-xs font-bold uppercase tracking-[0.4em]">Signal_Chain_09</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 text-white leading-[0.85] uppercase italic">
            INITIATE <br /> <span className="text-red-600">COMMAND LINK</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
            Authorized personnel only. Use this channel for high-priority infrastructure integration and tactical protocol inquiries.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <ShieldCheck className="text-red-500 mb-3" size={24} />
                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Security</p>
                <p className="text-white text-sm font-bold">AES-256 Link</p>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <Activity className="text-red-500 mb-3" size={24} />
                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Priority</p>
                <p className="text-white text-sm font-bold">Level_Alpha</p>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Tactical Terminal */}
        <motion.div 
          className="lg:col-span-7 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {/* Decorative Corner Brackets */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-red-600/50" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-red-600/50" />

          <div className="bg-slate-900/40 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Inner Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px]" />

            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-white/5">
               <Terminal size={18} className="text-red-500" />
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em]">Manual_Override_Input</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Operator_ID</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={16} />
                    <input 
                      required type="text" placeholder="FULL NAME"
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-red-600 outline-none transition-all font-mono text-sm uppercase tracking-tighter placeholder:text-slate-700"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Comm_Frequency</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={16} />
                    <input 
                      required type="email" placeholder="EMAIL ADDRESS"
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-red-600 outline-none transition-all font-mono text-sm uppercase tracking-tighter placeholder:text-slate-700"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Payload_Description</label>
                <div className="relative">
                  <MessageSquare className="absolute left-0 top-4 text-slate-600 group-focus-within:text-red-500 transition-colors" size={16} />
                  <textarea 
                    required rows="4" placeholder="DESCRIBE THE INCIDENT OR REQUEST..."
                    className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-red-600 outline-none transition-all font-mono text-sm resize-none uppercase tracking-tighter placeholder:text-slate-700"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onMouseEnter={textEnter} onMouseLeave={textLeave}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 cursor-none shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} className="rotate-[-10deg]" /> EXECUTE UPLINK</>}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  )
}