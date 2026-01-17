import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ChevronRight, Loader2, ArrowLeft } from 'lucide-react'

export default function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // SIMULATED AUTH DELAY
    setTimeout(() => {
      // 🔐 HARDCODED CREDENTIALS (admin / admin123)
      // This matches the logic in App.jsx to unlock the ProtectedRoute
      if (email === 'admin' && password === 'admin123') {
        onLogin({ name: 'Commander', role: 'admin' }) // Updates User State in App.jsx
        navigate('/dashboard') // Redirects to Dashboard
      } else {
        alert('ACCESS DENIED: Invalid Credentials')
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* 🟢 NEW: Back to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold uppercase text-xs tracking-widest z-50"
      >
        <ArrowLeft size={16} /> Return to Base
      </button>

      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Command Access</h1>
          <p className="text-slate-500 text-xs font-bold uppercase mt-2">Restricted Area • Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Operator ID</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Enter ID (admin)"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500 transition-colors"
              placeholder="•••••••• (admin123)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Initialize Uplink <ChevronRight size={16}/></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-400 font-mono">
            SECURE CONNECTION: <span className="text-green-500">ENCRYPTED</span>
          </p>
        </div>
      </div>
    </div>
  )
}