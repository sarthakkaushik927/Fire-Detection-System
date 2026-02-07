import React, { useState } from 'react'
import { ShieldAlert, Lock, ChevronRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../Supabase/supabase'

export default function AdminGate({ children }) {
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('firewatch_admin_verified') === 'true'
  })

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('id')
        .eq('code', code.trim())
        .single()

      if (error || !data) {
        throw new Error("Invalid Access Code")
      }

      sessionStorage.setItem('firewatch_admin_verified', 'true')
      setIsVerified(true)
      toast.success("COMMAND ACCESS GRANTED")

    } catch (error) {
      console.error("Verification failed:", error)
      toast.error("ACCESS DENIED: INVALID CODE")
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  if (isVerified) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_150%)] z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-10 relative z-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/50 mb-6 relative">
            <ShieldAlert size={40} className="text-red-500 animate-pulse" />
            <div className="absolute inset-0 border border-red-500 rounded-full animate-ping opacity-20" />
          </div>
          
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">
            Restricted Area
          </h1>
          <p className="text-red-400 font-mono text-xs mt-2 tracking-[0.2em] uppercase">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="group relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-red-500" size={18} />
            <input 
              type="password" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER COMMAND CODE"
              className="w-full bg-black/50 border border-slate-700 rounded-xl px-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:bg-red-950/10 transition-all font-mono text-center tracking-[0.5em] text-lg"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
               <Loader2 className="animate-spin" />
            ) : (
               <>Unlock Terminal <ChevronRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 font-mono uppercase">
                Secure Connection Established
            </p>
        </div>
      </motion.div>
    </div>
  )
}
