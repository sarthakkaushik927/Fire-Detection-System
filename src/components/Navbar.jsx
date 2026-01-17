import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, LayoutDashboard, Plane, FolderOpen, User, 
  LogOut, Bell, Menu, X, FileText // 🟢 FileText icon added
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Drone Uplink', path: '/drone-control', icon: <Plane size={18} /> },
    // 🟢 NEW LINK
    { name: 'Complaints', path: '/complaints', icon: <FileText size={18} /> },
    { name: 'Intel Gallery', path: '/downloads', icon: <FolderOpen size={18} /> },
    { name: 'Operative', path: '/account', icon: <User size={18} /> },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 py-4 transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group z-50 relative">
          <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300">
            <ShieldAlert size={24} />
          </div>
          <div className="block">
            <h1 className="text-xl font-black tracking-tighter italic leading-none text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">FIREWATCH</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Global Defense</p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-white/5 rounded-full p-1 border border-slate-200 dark:border-white/5 backdrop-blur-sm transition-colors duration-300">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`relative px-6 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all duration-300 ${isActive(link.path) ? 'text-white bg-slate-900 dark:bg-slate-800 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'}`}>
              {link.icon} <span>{link.name}</span>
              {isActive(link.path) && <motion.div layoutId="nav-glow" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4 z-50 relative">
          <div className="hidden md:block"><ThemeToggle /></div>
          
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition relative">
             <Bell size={20} />
          </button>

          <div className="hidden md:block h-8 w-[1px] bg-slate-300 dark:bg-white/10 mx-2"></div>
          
          <div className="hidden md:flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-500">Commander</p>
                <p className="text-xs font-bold">{user?.name || user?.email || 'Admin'}</p>
             </div>
             <button onClick={onLogout} className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wider">
                <LogOut size={16} />
             </button>
          </div>

          <button className="lg:hidden p-2 text-slate-900 dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 overflow-hidden absolute top-full left-0 w-full shadow-2xl">
              <div className="p-6 flex flex-col gap-4">
               {navLinks.map((link) => (<Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive(link.path) ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{link.icon} {link.name}</Link>))}
               <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-2"></div>
               <div className="flex justify-between items-center p-4"><span className="text-sm font-bold text-slate-500">Theme</span><ThemeToggle /></div>
               <button onClick={onLogout} className="flex items-center gap-4 p-4 rounded-xl font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><LogOut size={18} /> Logout System</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}