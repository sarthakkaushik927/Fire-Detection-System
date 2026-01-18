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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
      }
      setIsAuthChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
        
        // Auto-redirect to dashboard only on explicit sign-in or if sitting on auth page
        if (event === 'SIGNED_IN' || location.pathname === '/auth') {
           navigate('/dashboard', { replace: true })
        }
      } else {
        // Do not clear user here immediately to prevent flashing /auth on logout
      }
      setIsAuthChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  // 🟢 LOGOUT FUNCTION (The Fix)
  const handleLogout = async () => {
    // 1. Clear Supabase Session
    await supabase.auth.signOut()
    
    // 2. Clear Local State
    localStorage.removeItem('firewatch_user')
    sessionStorage.removeItem('admin_unlocked')
    setUser(null)

    // 3. FORCE REDIRECT TO LANDING PAGE
    // using window.location ensures we bypass ProtectedRoute logic completely
    window.location.href = '/' 
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

        {showAdminNavbar && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
            
            <Route path="/auth" element={
               user ? <Navigate to="/dashboard" replace /> : <AuthScreen />
            } />
            
            <Route path="/about" element={<AboutUs isStandalone={true} />} />
            <Route path="/registry" element={<ComplaintRegistry isStandalone={true} />} />
            <Route path="/report" element={<ReportFire />} />

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