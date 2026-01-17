import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ChevronRight, Loader2, ArrowLeft, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const NATURE_BG = "https://img.freepik.com/free-photo/beautiful-watercolor-nature-landscape_23-2151864817.jpg?semt=ais_hybrid&w=740&q=80"

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // SIMULATED AUTH DELAY
    setTimeout(() => {
      if (email === 'admin' && password === 'admin123') {
        onLogin({ name: 'Commander', role: 'admin' }) 
        navigate('/dashboard') 
      } else {
        alert('ACCESS DENIED: Invalid Credentials')
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* 🖼️ THE WATERCOLOR BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${NATURE_BG})` }}
      />

      {/* 🌑 GLASS OVERLAY (Tinted for better legibility) */}
      <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[3px]" />

      {/* 🟢 Back to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.3em] z-50 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
      >
        <ArrowLeft size={14} /> Return to Base
      </button>

      {/* 🚀 LOGIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-20 overflow-hidden"
      >
        {/* Glow Decor */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-red-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
            Command <span className="text-red-500">Access</span>
          </h1>
          <p className="text-slate-200/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">
            Restricted Area • Authorized Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="group">
            <label className="block text-[10px] font-black uppercase text-slate-300 mb-2 ml-1 tracking-widest">Operator ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-mono text-sm"
                placeholder="admin"
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-[10px] font-black uppercase text-slate-300 mb-2 ml-1 tracking-widest">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-mono text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-red-950/40 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Initialize Uplink <ChevronRight size={18}/></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
            Connection: <span className="text-green-500">Encrypted AES-256</span>
          </p>
        </div>
      </motion.div>

      {/* Subtle Scanline UI Effect */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-20"></div>
    </div>
  )
}