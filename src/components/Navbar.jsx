import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Flame, LayoutDashboard, FileWarning, Plane, 
  Download, User, LogOut, Menu, X 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false) // 🟢 State for Mobile Menu

  const isActive = (path) => location.pathname === path
  
  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/complaints', icon: FileWarning },
    { name: 'Drone', path: '/drone-control', icon: Plane },
    { name: 'Resources', path: '/downloads', icon: Download },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="bg-orange-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Flame size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
              FIRE<span className="text-orange-500">WATCH</span>
            </span>
          </Link>

          {/* 🖥️ DESKTOP NAV (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                  isActive(item.path)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <item.icon size={14} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* USER & TOGGLE */}
          <div className="flex items-center gap-4">
            {/* Desktop Account */}
            <Link to="/account" className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <User size={14} />
              </div>
              <span className="uppercase">{user?.name || 'Admin'}</span>
            </Link>

            {/* Desktop Logout */}
            <button onClick={onLogout} className="hidden md:flex bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition-colors">
              <LogOut size={16} />
            </button>

            {/* 🟢 MOBILE HAMBURGER BUTTON */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase transition-colors ${
                    isActive(item.path)
                      ? 'bg-orange-50 dark:bg-white/10 text-orange-600 dark:text-orange-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 dark:bg-white/10 my-2"></div>
              <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 uppercase hover:text-orange-500">
                <User size={18} /> Account ({user?.name || 'Admin'})
              </Link>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 uppercase hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-left">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}