import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Flame, LayoutDashboard, FileWarning, Plane,
  Download, User, LogOut, Sun, Moon, Menu, X,
  // 🟢 Added MapPin to imports
  Mail, Bell, ChevronRight, Loader2, ShieldAlert, MapPin
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import LogoutModal from './LogoutModal'

// Backend Config
const BACKEND_URL = "https://keryptonite-8k3u.vercel.app"

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [loading, setLoading] = useState(false)

  // Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      
      let highRisk = []
      try {
        // 1. Fetch Data (Using correct params)
        const res = await fetch(`${BACKEND_URL}/api/fires/get_hight_regions_area`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: "india", state: "up", day_range: 3, source: "VIIRS_SNPP_NRT" })
        })
        const result = await res.json()

        // 2. ROBUST PARSING
        let parsedData = result.data;
        if (typeof result.data === 'string') {
            try { parsedData = JSON.parse(result.data); } catch (e) { console.error("Inner JSON Parse Error", e); }
        }

        // 3. MAPPING
        if (parsedData && parsedData.latitude) {
          highRisk = Object.keys(parsedData.latitude).map(key => ({
            id: key,
            lat: parsedData.latitude[key],
            lon: parsedData.longitude?.[key] || 0,
            temp: Number(parsedData.brightness?.[key]) || 300,
            message: `HIGH HEAT: Sector ${key}`
          }))
          // Sort by hottest first
          .sort((a, b) => b.temp - a.temp)
          .slice(0, 10);
        }
          
      } catch (e) {
        console.error("Navbar Alert Sync Failed:", e)
      } finally {
        setLoading(false)
      }

      setNotifications(highRisk)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 120000) // Refresh every 2 mins
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
    <>
      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false)
          onLogout()
        }}
      />

      <nav className="sticky top-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-orange-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Flame size={20} className="text-white" fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase italic">
                FIRE<span className="text-orange-600">WATCH</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isActive(item.path)
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon size={14} />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* 🔔 NOTIFICATIONS ICON */}
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)} className={`p-2 rounded-full transition-colors relative ${showNotifs ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  <Bell size={18} />
                  {!loading && notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />}
                  {loading && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />}
                </button>
                
                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-[-60px] md:right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-[70]"
                    >
                      <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Threat Alerts</h4>
                        {!loading && <span className={`text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold ${notifications.length > 0 ? 'bg-red-600' : 'bg-slate-400'}`}>{notifications.length}</span>}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar relative min-h-[100px]">
                        {loading ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                              <Loader2 className="animate-spin text-orange-500" size={24}/>
                              <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning Sector...</span>
                           </div>
                        ) : notifications.length > 0 ? (
                          notifications.map(n => (
                            <div key={n.id} onClick={() => { navigate('/drone-control', { state: { target: { lat: n.lat, lon: n.lon } } }); setShowNotifs(false); }} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-xl cursor-pointer hover:border-red-500 transition-colors group">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase">{n.message}</p>
                                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Temp: {n.temp.toFixed(0)}K</p>
                                  {/* 🟢 ADDED COORDINATES HERE */}
                                  <p className="text-[9px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                     <MapPin size={8} />
                                     {n.lat.toFixed(4)}, {n.lon.toFixed(4)}
                                  </p>
                                </div>
                                <ChevronRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-400 opacity-50 flex flex-col items-center justify-center gap-2">
                            <ShieldAlert size={32} />
                            <p className="text-xs font-bold uppercase tracking-widest">No Active Threats</p>
                            <p className="text-[9px]">Sector is clear based on current data.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                <Link to="/account" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 hover:border-orange-500 transition-colors">
                  <User size={14} />
                </Link>
                <button onClick={() => setShowLogoutConfirm(true)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors">
                  <LogOut size={16} />
                </button>
              </div>

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-600 dark:text-white">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900">
              <div className="p-4 space-y-2">
                {navLinks.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase transition-colors ${isActive(item.path) ? 'bg-orange-50 dark:bg-white/10 text-orange-600' : 'text-slate-500'}`}>
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}