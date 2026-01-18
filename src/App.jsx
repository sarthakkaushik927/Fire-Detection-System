import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { supabase } from './Supabase/supabase'
import { Loader2 } from 'lucide-react' // Import Loader

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

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // 1. USER STATE (Initialize from LocalStorage to support Admin Simulator)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('firewatch_user')
    return saved ? JSON.parse(saved) : null
  })

  // 2. 🟢 LOADING STATE (The Fix for the Loop)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    // A. Check Active Session on Load (Handles Magic Link Token Parsing)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
      }
      setIsAuthChecking(false) // 🟢 STOP LOADING ONCE CHECKED
    })

    // B. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
        
        // 🟢 Force redirect to dashboard if stuck on auth page
        if (window.location.pathname === '/auth') {
          navigate('/dashboard')
        }
      } else {
        // Only clear user if we aren't using the Simulated Admin
        const saved = localStorage.getItem('firewatch_user')
        const parsed = saved ? JSON.parse(saved) : null
        if (parsed && parsed.isSimulated) {
          // Do nothing, keep admin logged in
        } else {
          setUser(null)
          localStorage.removeItem('firewatch_user')
        }
      }
      setIsAuthChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('firewatch_user', JSON.stringify(userData))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('firewatch_user')
    window.location.href = '/'
  }

  // 🟢 3. SHOW LOADER WHILE SUPABASE CHECKS THE MAGIC LINK
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-red-600 animate-spin mx-auto mb-4" />
          <h2 className="text-white font-mono font-bold uppercase tracking-widest animate-pulse">
            Establishing Uplink...
          </h2>
        </div>
      </div>
    )
  }

  const publicPages = ['/', '/report', '/auth', '/about', '/registry']
  const showAdminNavbar = user && !publicPages.includes(location.pathname)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
        <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'monospace' }}} />

        {showAdminNavbar && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
            
            {/* If user is logged in, Auth Screen redirects to dashboard */}
            <Route path="/auth" element={
               user ? <Navigate to="/dashboard" replace /> : <AuthScreen onLogin={handleLogin} />
            } />
            
            <Route path="/about" element={<AboutUs isStandalone={true} />} />
            <Route path="/registry" element={<ComplaintRegistry isStandalone={true} />} />
            <Route path="/report" element={<ReportFire />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute user={user}><Complaints /></ProtectedRoute>} />
            <Route path="/drone-control" element={<ProtectedRoute user={user}><DroneController /></ProtectedRoute>} />
            <Route path="/downloads" element={<ProtectedRoute user={user}><DownloadsPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute user={user}><AccountPage user={user} /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute user={user}><Inbox /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App