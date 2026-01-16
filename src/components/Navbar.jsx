import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, LayoutDashboard, Plane, FolderOpen, User, 
  LogOut, Bell 
} from 'lucide-react'
import { supabase } from '../Supabase/supabase'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ session }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Drone Uplink', path: '/drone-control', icon: <Plane size={18} /> },
    { name: 'Intel Gallery', path: '/downloads', icon: <FolderOpen size={18} /> },
    { name: 'Operative', path: '/account', icon: <User size={18} /> },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 py-4 transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        
        {/* LOGO - Now Clickable */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300">
            <ShieldAlert size={24} />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-black tracking-tighter italic leading-none text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">FIREWATCH</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Global Defense</p>
          </div>
        </Link>

        {/* CENTER LINKS */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-full p-1 border border-slate-200 dark:border-white/5 backdrop-blur-sm transition-colors duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`relative px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
                isActive(link.path) 
                  ? 'text-white bg-slate-900 dark:bg-slate-800 shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
              }`}
            >
              {link.icon}
              <span className="hidden lg:block">{link.name}</span>
              {isActive(link.path) && (
                <motion.div 
                  layoutId="nav-glow" 
                  className="absolute inset-0 rounded-full bg-white/10" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 dark:text-white"
                >
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                    <h4 className="font-bold text-sm">Alerts</h4>
                    <span className="text-[10px] bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">2 Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition">
                      <ShieldAlert className="text-red-500 shrink-0" size={16} />
                      <div>
                        <p className="text-xs font-bold">Thermal Spike Detected</p>
                        <p className="text-[10px] text-slate-500">Sector 7 • 2m ago</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-slate-300 dark:bg-white/10 mx-2"></div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wider"
          >
            Logout <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}