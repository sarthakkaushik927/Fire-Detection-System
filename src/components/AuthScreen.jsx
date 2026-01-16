import { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { ShieldAlert, Mail, LogIn } from 'lucide-react'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Only Google Auth remains
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
    else alert('Check your email for the login link!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-slate-100">
        
        {/* Logo Section */}
        <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="text-red-600" size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">FIREWATCH</h1>
        <p className="text-slate-400 mb-8 font-medium">Command Center Access</p>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 p-4 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-8"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6"/>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative mb-8 text-slate-300">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
          <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Or Secure Email Link</span>
        </div>

        {/* Email Magic Link Form */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-red-500 transition-all" 
              type="email" 
              placeholder="operator@firewatch.pro" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <button disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition shadow-lg shadow-slate-200">
            <LogIn size={18} /> {loading ? 'Sending Link...' : 'Request Access'}
          </button>
        </form>

      </div>
    </div>
  )
}