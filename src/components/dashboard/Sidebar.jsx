import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, FileWarning, Plane, Download, 
  LogOut, Sun, Moon, User, Flame, Settings 
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext' // 🟢 Import Theme Context

export default function Sidebar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme() // 🟢 Get Theme Logic

  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: 'Mission Control', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incident Reports', path: '/complaints', icon: FileWarning },
    { name: 'Drone Uplink', path: '/drone-control', icon: Plane },
    { name: 'Resources', path: '/downloads', icon: Download },
    { name: 'Account', path: '/account', icon: User },
  ]

  const handleLogout = () => {
    localStorage.removeItem('firewatch_user')
    window.location.href = '/'
  }

  return (
    <>
      {/* 🟢 DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transition-colors z-40">
        
        {/* LOGO AREA */}
        <div className="p-8 flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-xl text-white">
            <Flame size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">FIREWATCH</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Console</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative overflow-hidden ${
                isActive(item.path)
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} className={isActive(item.path) ? "text-orange-500 dark:text-orange-600" : "group-hover:scale-110 transition-transform"} />
              <span>{item.name}</span>
              
              {isActive(item.path) && (
                <motion.div layoutId="activeTab" className="absolute right-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* 🟢 FOOTER ACTIONS (TOGGLE & LOGOUT) */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-3">
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <span className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'dark' ? 'Night Mode' : 'Day Mode'}
            </span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} style={{ left: theme === 'dark' ? '18px' : '2px' }} />
            </div>
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-xs uppercase transition-colors"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </div>

      {/* 🟢 MOBILE BOTTOM BAR (For small screens) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 z-50 px-6 py-3 flex justify-between items-center safe-area-bottom">
        {navItems.slice(0, 4).map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`p-2 rounded-full ${isActive(item.path) ? 'text-orange-600 bg-orange-50 dark:bg-white/10' : 'text-slate-400'}`}
          >
            <item.icon size={24} />
          </Link>
        ))}
        <button onClick={toggleTheme} className="p-2 text-slate-400">
           {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>
    </>
  )
}