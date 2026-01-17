import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, User, MessageSquare, ShieldCheck, Zap } from 'lucide-react'
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
      // 1️⃣ SAVE TO SUPABASE DATABASE
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message,
            status: 'unread' 
          }
        ])

      if (dbError) throw new Error("Database Sync Failed")

      // 2️⃣ SEND EMAIL TO YOU (The Admin)
      const adminEmailResponse = await fetch('https://fxksnraszpzgqouxcuvl.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: 'YOUR_EMAIL@GMAIL.COM', // 🟢 CHANGE THIS TO YOUR ACTUAL EMAIL
          subject: `NEW INQUIRY: ${formData.name}`,
          description: `Commander, a new transmission has been received.\n\nSender: ${formData.name}\nEmail: ${formData.email}\n\nMessage Payload:\n"${formData.message}"`,
          type: 'alert',
          status: 'VERIFIED',
          id: 'ADMIN_INBOUND'
        })
      })

      // 3️⃣ SEND CONFIRMATION TO THE USER
      const userConfirmResponse = await fetch('https://fxksnraszpzgqouxcuvl.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          to: formData.email,
          subject: `FireWatch Uplink Confirmed`,
          description: `Commander ${formData.name},\n\nYour transmission has been logged at FireWatch HQ. Our tactical team is reviewing your message: \n\n"${formData.message}"\n\nStand by for further communication.`,
          type: 'update',
          status: 'FALSE_ALARM',
          id: 'USER_RECEIPT'
        })
      })

      if (!adminEmailResponse.ok || !userConfirmResponse.ok) {
         console.warn("Email service partially failed, but data was saved to DB.")
      }

      toast.success("Transmission Received & Logged", { id: toastId })
      setFormData({ name: '', email: '', message: '' })

    } catch (error) {
      console.error("Uplink Error:", error)
      toast.error("Transmission Interrupted. System Offline.", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-32 px-6 bg-slate-950 relative overflow-hidden border-t border-white/5">
      <Toaster position="bottom-right" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Zap size={12} fill="currentColor" /> Communication Channel 01
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-6 text-white leading-none">
            ESTABLISH <br /> <span className="text-blue-500 italic">SECURE UPLINK</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Have a question about the FireWatch protocol or want to integrate our satellite detection into your region? Send a high-priority transmission.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-400 font-mono text-sm">
              <ShieldCheck className="text-blue-500" size={18} /> 256-bit Encryption Active
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-sm">
              <Mail className="text-blue-500" size={18} /> response_time: &lt; 24hrs
            </div>
          </div>
        </motion.div>

        {/* Right Side: Tactical Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Identifier</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Comm Frequency</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Payload Description</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-6 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <textarea 
                  required
                  rows="4"
                  placeholder="How can we assist your department?"
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>

            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 cursor-none"
            >
              {loading ? "TRANSMITTING..." : <><Send size={18} /> SEND TRANSMISSION</>}
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  )
}