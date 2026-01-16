import { useState, useEffect } from 'react'
import { supabase } from './Supabase/supabase'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import { Loader2 } from 'lucide-react'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    )
  }

  return session ? <Dashboard session={session} /> : <AuthScreen />
}