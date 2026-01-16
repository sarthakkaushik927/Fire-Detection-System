import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './Supabase/supabase'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './context/ThemeContext' // 👈 Import Provider

// Components
import LandingPage from './components/LandingPage'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import AccountPage from './components/AccountPage'
import DroneController from './components/DroneController'
import DownloadsPage from './components/DownloadsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
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
    <ThemeProvider> {/* 👈 Wrap everything here */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={!session ? <AuthScreen /> : <Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute session={session}><Layout session={session}><Dashboard session={session}/></Layout></ProtectedRoute>}/>
          <Route path="/account" element={<ProtectedRoute session={session}><Layout session={session}><AccountPage session={session}/></Layout></ProtectedRoute>}/>
          <Route path="/drone-control" element={<ProtectedRoute session={session}><Layout session={session}><DroneController /></Layout></ProtectedRoute>}/>
          <Route path="/downloads" element={<ProtectedRoute session={session}><Layout session={session}><DownloadsPage /></Layout></ProtectedRoute>}/>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}