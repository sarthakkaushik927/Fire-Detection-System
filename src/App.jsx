import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { supabase } from './Supabase/supabase'
import { Loader2 } from 'lucide-react'

import Navbar from './components/Navbar'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import DroneController from './components/DroneController'
import DownloadsPage from './components/DownloadsPage'
import AccountPage from './components/AccountPage'
import ReportFire from './components/ReportFire'
import AdminGate from './components/AdminGate'

import LandingPage from './components/Landing/LandingPage'
import AboutUs from './components/Landing/AboutUs'
import ComplaintRegistry from './components/Landing/ComplaintRegistry'

import Complaints from './components/dashboard/Complaints'
import Inbox from './components/dashboard/Inbox'

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

const AdminLayout = () => {
  return (
    <AdminGate>
       <Outlet />
    </AdminGate>
  )
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('firewatch_user')
    return saved ? JSON.parse(saved) : null
  })

  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('firewatch_user')
        setUser(null)
      }
      setIsAuthChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        localStorage.removeItem('firewatch_user')
        sessionStorage.removeItem('firewatch_admin_verified')
        navigate('/', { replace: true })
      } 
      else if (session?.user) {
        const newUser = { ...session.user, role: 'operator' }
        setUser(newUser)
        localStorage.setItem('firewatch_user', JSON.stringify(newUser))
        
        if (location.pathname === '/auth') {
           navigate('/dashboard', { replace: true })
        }
      }
      setIsAuthChecking(false)
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('firewatch_user')
      sessionStorage.removeItem('firewatch_admin_verified')
      setUser(null)
      navigate('/')
    } catch (error) {
      console.error("Logout Error:", error)
      localStorage.removeItem('firewatch_user')
      sessionStorage.removeItem('firewatch_admin_verified')
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

        {showAdminNavbar && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
            
            <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthScreen />} />
            
            <Route path="/about" element={<AboutUs isStandalone={true} />} />
            <Route path="/registry" element={<ComplaintRegistry isStandalone={true} />} />
            <Route path="/report" element={<ReportFire />} />

            <Route element={
                <ProtectedRoute user={user}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/drone-control" element={<DroneController />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/account" element={<AccountPage user={user} />} />
                <Route path="/inbox" element={<Inbox />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App