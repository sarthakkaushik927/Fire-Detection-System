import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Flame, LayoutDashboard, FileWarning, Plane, 
  Download, User, LogOut, Sun, Moon, Menu, X , Mail
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext' // 🟢 Import Theme Context

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme() // 🟢 Get Theme Logic
  const [isOpen, setIsOpen] = React.useState(false)

  const isActive = (path) => location.pathname === path
  
  const navLinks = [
  { name: 'Command', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', path: '/complaints', icon: FileWarning },
  { name: 'Drone', path: '/drone-control', icon: Plane },
  { name: 'Inbox', path: '/inbox', icon: Mail }, // 🟢 NEW LINK
  { name: 'Resources', path: '/downloads', icon: Download },
]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="bg-orange-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Flame size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
              FIRE<span className="text-orange-600">WATCH</span>
            </span>
          </Link>

          {/* 🖥️ DESKTOP NAV */}
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

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* 🟢 THEME TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Account Link */}
            <Link to="/account" className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-white border border-slate-200 dark:border-white/10">
                <User size={14} />
              </div>
            </Link>

            {/* Logout Button */}
            <button onClick={onLogout} className="hidden md:flex bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 p-2 rounded-full transition-colors border border-transparent dark:border-red-500/20">
              <LogOut size={16} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
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