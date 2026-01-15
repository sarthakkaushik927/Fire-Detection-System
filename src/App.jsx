import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- Initialize Supabase ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [fires, setFires] = useState([]) // Store fire data here

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchFireData() // Fetch data if already logged in
    })

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchFireData()
    })

    return () => subscription.unsubscribe()
  }, [])

  // --- Backend: Fetch Fire Data ---
  const fetchFireData = async () => {
    // Fetch data from the table we created earlier
    const { data, error } = await supabase
      .from('forest_fires')
      .select('*')
      .order('id', { ascending: false })

    if (error) console.error('Error fetching fires:', error.message)
    else setFires(data || [])
  }

  // --- Auth Functions ---
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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) alert(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setFires([])
  }

  // --- VIEW: Dashboard (Logged In) ---
  if (session) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-red-600">🔥 Fire Watch Dashboard</h1>
            <p className="text-gray-600">Logged in as: {session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition">
            Sign Out
          </button>
        </div>

        {/* Data Display */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          
          {/* Column 1: Fire Alerts List */}
          <div className="bg-white p-6 rounded shadow border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Active Alerts
            </h2>
            
            {fires.length === 0 ? (
              <p className="text-gray-400 italic">No active fire data found in database.</p>
            ) : (
              <ul className="space-y-3">
                {fires.map((fire) => (
                  <li key={fire.id} className="border p-3 rounded bg-red-50 border-red-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-red-700">Alert #{fire.id}</p>
                      <p className="text-sm text-gray-600">Lat: {fire.latitude}, Lon: {fire.longitude}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">{fire.intensity}% Int.</span>
                  </li>
                ))}
              </ul>
            )}
            
            <button 
              onClick={fetchFireData} 
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Column 2: Placeholder for Map */}
          <div className="bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center h-64 md:h-auto">
            <p className="text-gray-500 font-semibold">📍 Map Integration Coming Next</p>
          </div>
        </div>
      </div>
    )
  }

  // --- VIEW: Login Screen (Logged Out) ---
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Fire Watch System</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-4">
          <input
            className="border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={loading} className="bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition">
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-50 transition font-semibold">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}