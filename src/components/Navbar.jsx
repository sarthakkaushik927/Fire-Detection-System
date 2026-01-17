import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Flame, LayoutDashboard, FileWarning, Plane, 
  Download, User, LogOut, Sun, Moon, Menu, X,
  Mail, ShieldAlert, Bell, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

// 🟢 Backend Config
const BACKEND_URL = "https://keryptonite-8k3u.vercel.app"

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)

  const isActive = (path) => location.pathname === path

  // 🟢 FETCH LIVE ALERTS (Using correct spelling: get_hight_regions_area)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/fires/get_hight_regions_area`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: "india", state: "up", day_range: 1 })
        })
        const result = await res.json()
        let data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        
        if (data && data.brightness) {
            // Filter for brightness > 340 (High Risk)
            const highRisk = Object.keys(data.brightness)
              .filter(key => data.brightness[key] > 340)
              .map(key => ({
                id: key,
                lat: data.latitude[key],
                lon: data.longitude[key],
                temp: data.brightness[key],
                message: `HIGH HEAT: Sector ${key.slice(-3)}`
              }))
            setNotifications(highRisk)
        }
      } catch (e) {
        console.log("Alert Sync Failed")
      }
    }
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) // Auto-refresh every minute
    return () => clearInterval(interval)
  }, [])

  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/complaints', icon: FileWarning },
    { name: 'Drone', path: '/drone-control', icon: Plane },
    { name: 'Inbox', path: '/inbox', icon: Mail },
    { name: 'Resources', path: '/downloads', icon: Download },
  ]

  return (
    <nav className="sticky top-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Flame size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase italic">
              FIRE<span className="text-orange-600">WATCH</span>
            </span>
          </Link>

          {/* 2. DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive(item.path)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={14} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* 3. ACTION ZONE */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* 🟢 THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 🟢 NOTIFICATIONS */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className={`p-2 rounded-full transition-colors relative ${showNotifs ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-[70]"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Threat Alerts</h4>
                      <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">{notifications.length}</span>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => { navigate('/drone-control', { state: { target: { lat: n.lat, lon: n.lon } } }); setShowNotifs(false); }}
                          className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-xl cursor-pointer hover:border-red-500 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase">{n.message}</p>
                              <p className="text-[9px] text-slate-500 font-mono mt-1">{n.lat.toFixed(2)}°N, {n.lon.toFixed(2)}°E</p>
                            </div>
                            <ChevronRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center">
                          <ShieldAlert size={24} className="mx-auto text-slate-300 mb-2" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No Active Threats</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🟢 PROFILE / LOGOUT */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
              <Link to="/account" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 hover:border-orange-500 transition-colors">
                <User size={14} />
              </Link>
              <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors">
                <LogOut size={16} />
              </button>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-600 dark:text-white">
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
            className="lg:hidden border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase transition-colors ${
                    isActive(item.path)
                      ? 'bg-orange-50 dark:bg-white/10 text-orange-600'
                      : 'text-slate-500'
                  }`}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}