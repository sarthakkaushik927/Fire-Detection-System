import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- 1. Initialize Supabase ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // --- Login with Magic Link ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) alert(error.message)
    else alert('Check your email for the login link!')
    setLoading(false)
  }

  // --- NEW: Login with Google ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Sends user back to localhost
      },
    })
    if (error) alert(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  // --- UI ---
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome!</h1>
        <p className="mb-4 text-lg">Logged in as: <strong>{session.user.email}</strong></p>
        <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Fire Watch Login</h1>
        
        {/* Email Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-4">
          <input
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-50 transition font-semibold"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}