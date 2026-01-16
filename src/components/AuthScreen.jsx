import { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { ShieldAlert, Mail, ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('✨ Magic Link Sent!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-tr from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30"
          >
            <ShieldAlert className="text-white" size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">FIREWATCH <span className="text-red-500">PRO</span></h1>
          <p className="text-slate-400 font-medium">Next-Gen Emergency Response</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full group bg-white text-slate-900 p-4 rounded-xl font-bold flex items-center justify-center gap-3 mb-6 hover:shadow-xl hover:shadow-white/10 transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-5 h-5"/>
          Continue with Google
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0"/>
        </motion.button>

        <div className="relative mb-6 text-center">
          <span className="bg-[#0f1523] px-3 text-xs font-bold text-slate-500 uppercase tracking-widest">or access via email</span>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-red-400 transition-colors" size={20} />
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" 
              type="email" 
              placeholder="operator@firewatch.pro" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-red-600/10 border border-red-500/50 text-red-400 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:text-white transition-all"
          >
            {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
            {loading ? 'Authenticating...' : 'Send Magic Link'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}