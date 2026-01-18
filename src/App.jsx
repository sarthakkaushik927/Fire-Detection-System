import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { supabase } from './Supabase/supabase'
import { Loader2 } from 'lucide-react'

// Components
import Navbar from './components/Navbar'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import DroneController from './components/DroneController'
import DownloadsPage from './components/DownloadsPage'
import AccountPage from './components/AccountPage'
import ReportFire from './components/ReportFire'

// Landing Components
import LandingPage from './components/Landing/LandingPage'
import AboutUs from './components/Landing/AboutUs'
import ComplaintRegistry from './components/Landing/ComplaintRegistry'

// Dashboard Components
import Complaints from './components/dashboard/Complaints'
import Inbox from './components/dashboard/Inbox'

// 🔒 Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // 1. USER STATE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('firewatch_user')
    return saved ? JSON.parse(saved) : null
  })

  // 2. LOADING STATE
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    // A. Check Active Session on Load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
      } else {
        // If Supabase says no session, clear local storage immediately
        localStorage.removeItem('firewatch_user')
        setUser(null)
      }
      setIsAuthChecking(false)
    })

    // B. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      
      if (event === 'SIGNED_OUT') {
        // 🛑 CRITICAL FIX: Explicitly handle Sign Out event
        setUser(null)
        localStorage.removeItem('firewatch_user')
        sessionStorage.clear()
        navigate('/', { replace: true })
      } 
      else if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
        
        // 🟢 FIX: Only redirect to Dashboard if we are on the /auth page
        // This prevents the app from forcing you to dashboard if you are just visiting the home page
        if (location.pathname === '/auth') {
           navigate('/dashboard', { replace: true })
        }
      }
      
      setIsAuthChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  // 🟢 LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      // 1. Clear Supabase Session
      await supabase.auth.signOut()
      
      // 2. Clear Local State
      localStorage.removeItem('firewatch_user')
      sessionStorage.clear()
      setUser(null)

      // 3. Force Navigation to Home
      navigate('/')
      
    } catch (error) {
      console.error("Logout Error:", error)
      // Force cleanup even if API fails
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/'
    }
  }

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={48} className="text-red-600 animate-spin mx-auto mb-4" />
      </div>
    )
  }

  const publicPages = ['/', '/report', '/auth', '/about', '/registry']
  const showAdminNavbar = user && !publicPages.includes(location.pathname)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
        
        <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'monospace' }}} />

        {/* Dashboard/Admin Navbar */}
        {showAdminNavbar && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* Landing Page */}
            <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
            
            {/* Auth Screen */}
            <Route path="/auth" element={
               user ? <Navigate to="/dashboard" replace /> : <AuthScreen />
            } />
            
            {/* Public Pages */}
            <Route path="/about" element={<AboutUs isStandalone={true} />} />
            <Route path="/registry" element={<ComplaintRegistry isStandalone={true} />} />
            <Route path="/report" element={<ReportFire />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute user={user}><Complaints /></ProtectedRoute>} />
            <Route path="/drone-control" element={<ProtectedRoute user={user}><DroneController /></ProtectedRoute>} />
            <Route path="/downloads" element={<ProtectedRoute user={user}><DownloadsPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute user={user}><AccountPage user={user} /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute user={user}><Inbox /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App