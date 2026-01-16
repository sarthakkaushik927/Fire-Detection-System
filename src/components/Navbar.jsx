import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, LayoutDashboard, Plane, FolderOpen, User, 
  LogOut, Bell, Menu, X, MapPin 
} from 'lucide-react'
import { supabase } from '../Supabase/supabase'
import ThemeToggle from './ThemeToggle'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"

export default function Navbar({ session }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [alerts, setAlerts] = useState([])

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // 🔴 Fetch Real Alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/get_hight_regions_area`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: "india", state: "up", day_range: 3 })
        })
        const result = await res.json()
        if (result.data) {
          const parsedData = JSON.parse(result.data)
          const rows = Object.keys(parsedData.latitude).slice(0, 5).map(key => ({
            lat: parsedData.latitude[key],
            lon: parsedData.longitude[key],
          }))
          setAlerts(rows)
        }
      } catch (e) { console.error("Alert fetch failed", e) }
    }
    fetchAlerts()
  }, [])

  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Drone Uplink', path: '/drone-control', icon: <Plane size={18} /> },
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

        {/* 🖥️ DESKTOP NAV */}
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
          
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition relative">
              <Bell size={20} />
              {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-slate-900 dark:text-white">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                    <h4 className="font-bold text-sm">Real-time Alerts</h4>
                    <span className="text-[10px] bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">{alerts.length} Active</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {alerts.length > 0 ? alerts.map((alert, i) => (
                      <div key={i} className="flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition">
                        <ShieldAlert className="text-red-500 shrink-0" size={16} />
                        <div><p className="text-xs font-bold">High Conf. Fire</p><p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {alert.lat.toFixed(2)}, {alert.lon.toFixed(2)}</p></div>
                      </div>
                    )) : <p className="text-xs text-slate-400 text-center py-2">No critical alerts.</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-slate-300 dark:bg-white/10 mx-2"></div>
          <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors uppercase tracking-wider">Logout <LogOut size={16} /></button>
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
              <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-xl font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><LogOut size={18} /> Logout System</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}