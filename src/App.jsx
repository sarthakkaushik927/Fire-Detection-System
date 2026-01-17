import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast' // 🟢 IMPORT GLOBAL TOASTER

// --- 1. CORE COMPONENTS (src/components/) ---
import Navbar from './components/Navbar'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import DroneController from './components/DroneController'
import DownloadsPage from './components/DownloadsPage'
import AccountPage from './components/AccountPage'
import ReportFire from './components/ReportFire'

// --- 2. LANDING COMPONENTS (src/components/Landing/) ---
import LandingPage from './components/Landing/LandingPage'
import AboutUs from './components/Landing/AboutUs'
import ComplaintRegistry from './components/Landing/ComplaintRegistry'

// --- 3. ADMIN DASHBOARD COMPONENTS (src/components/dashboard/) ---
import Complaints from './components/dashboard/Complaints'

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function App() {
  const location = useLocation()

  // 🔐 USER STATE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('firewatch_user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('firewatch_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('firewatch_user')
    window.location.href = '/'
  }

  // 🟢 LOGIC: Hide Admin Navbar on these Public Pages
  const publicPages = ['/', '/report', '/auth', '/about', '/registry']
  const showAdminNavbar = user && !publicPages.includes(location.pathname)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* 🟢 GLOBAL TOASTER CONFIGURATION (SCI-FI THEME) */}
        <Toaster 
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: '#0f172a', // Dark Slate
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              borderRadius: '12px',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
              fontFamily: 'monospace', // Sci-fi feel
              textTransform: 'uppercase'
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // Green-500
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // Red-500
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Admin Navbar (Only shows when logged in & not on a public page) */}
        {showAdminNavbar && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* 🌍 PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/report" element={<ReportFire />} />
            <Route path="/auth" element={<AuthScreen onLogin={handleLogin} />} />
            <Route path="/about" element={<AboutUs isStandalone={true} />} />
            <Route path="/registry" element={<ComplaintRegistry isStandalone={true} />} />

            {/* 🔒 ADMIN ROUTES (Protected) */}
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}><Dashboard /></ProtectedRoute>
            } />

            <Route path="/complaints" element={
              <ProtectedRoute user={user}><Complaints /></ProtectedRoute>
            } />

            <Route path="/drone-control" element={
              <ProtectedRoute user={user}><DroneController /></ProtectedRoute>
            } />

            <Route path="/downloads" element={
              <ProtectedRoute user={user}><DownloadsPage /></ProtectedRoute>
            } />

            <Route path="/account" element={
              <ProtectedRoute user={user}><AccountPage user={user} /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

export default App