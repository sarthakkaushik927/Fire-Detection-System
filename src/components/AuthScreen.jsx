import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Loader2, ArrowLeft, Mail, Chrome, CheckCircle2, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../Supabase/supabase'
import toast from 'react-hot-toast'

export default function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const navigate = useNavigate()

  const NATURE_BG = "https://img.freepik.com/free-photo/beautiful-watercolor-nature-landscape_23-2151864817.jpg?semt=ais_hybrid&w=740&q=80"

  // 🟢 1. GOOGLE OAUTH (Popup / Redirect)
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      })
      if (error) throw error
    } catch (error) {
      toast.error(error.message)
    }
  }

  // 🟢 2. SUBMIT HANDLER (Handles both Magic Link AND Admin Backdoor)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // A. ADMIN BACKDOOR CHECK
    if (email === 'admin') {
      // Simulate delay for realism
      setTimeout(() => {
        if (password === 'admin123') {
          // Fake Admin User Object
          const adminUser = { 
            id: 'admin-master', 
            email: 'admin@firewatch.pro', 
            user_metadata: { full_name: 'Commander', role: 'admin' }
          }
          onLogin(adminUser) 
          navigate('/dashboard') 
          toast.success("Command Access Granted")
        } else {
          toast.error("Invalid Command Code")
          setLoading(false)
        }
      }, 1000)
      return
    }

    // B. REAL USER MAGIC LINK FLOW
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) throw error
      
      setMagicLinkSent(true)
      toast.success("Magic Link Sent!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      if (email !== 'admin') setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* 🖼️ Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${NATURE_BG})` }} />
      <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[3px]" />

      <button onClick={() => navigate('/')} className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.3em] z-50 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        <ArrowLeft size={14} /> Return to Base
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-20 overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/40">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
            Command <span className="text-red-500">Access</span>
          </h1>
          <p className="text-slate-200/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Identity Verification</p>
        </div>

        {magicLinkSent ? (
           /* ✅ SUCCESS STATE: CHECK EMAIL */
           <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-white font-bold text-xl uppercase italic">Link Sent</h3>
              <p className="text-slate-300 text-sm mt-4 mb-6 leading-relaxed">
                We sent a secure magic link to <br/> 
                <span className="text-white font-mono font-bold border-b border-white/20 pb-1">{email}</span>
              </p>
              <button 
                onClick={() => setMagicLinkSent(false)} 
                className="text-xs text-red-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                Use different email
              </button>
           </div>
        ) : (
          <div className="space-y-6 relative z-10">
            
            {/* 🟢 OPTION 1: GOOGLE BUTTON */}
            <button 
                onClick={handleGoogleLogin} 
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-slate-200"
            >
                <Chrome size={20} className="text-red-600"/> 
                Continue with Google
            </button>

            <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-grow bg-white/10"></div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">OR USE EMAIL</span>
                <div className="h-[1px] flex-grow bg-white/10"></div>
            </div>

            {/* 🟢 OPTION 2: MAGIC LINK FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-mono text-sm" 
                        placeholder="user@firewatch.pro" 
                    />
                </div>

                {/* 🔒 STEALTH ADMIN PASSWORD FIELD (Only visible if email is 'admin') */}
                <AnimatePresence>
                  {email === 'admin' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                       <div className="group relative mt-4">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-red-900/20 border border-red-500/30 rounded-2xl px-12 py-4 text-white placeholder:text-red-300/50 focus:outline-none focus:border-red-500 transition-all font-mono text-sm" 
                            placeholder="Command Code" 
                          />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-red-950/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (email === 'admin' ? "Admin Login" : "Send Magic Link")}
                </button>
            </form>
          </div>
        )}
        
        {/* Footer info */}
        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
            Protocol: <span className="text-green-500">Magic_Link_Auth_v2</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}