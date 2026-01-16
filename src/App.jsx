import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './Supabase/supabase'
import { Loader2 } from 'lucide-react'

// Components
import LandingPage from './components/LandingPage'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Page - Redirects to dashboard if already logged in */}
        <Route 
          path="/auth" 
          element={!session ? <AuthScreen /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Protected Dashboard - Redirects to auth if not logged in */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute session={session}>
              <Dashboard session={session} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}