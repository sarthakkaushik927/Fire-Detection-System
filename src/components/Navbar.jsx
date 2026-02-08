import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Flame, LayoutDashboard, FileWarning, Plane,
  Download, User, LogOut, Sun, Moon, Menu, X,
  Mail, Bell, ChevronRight, Loader2, ShieldAlert, MapPin, Radio, Cctv, PieChart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import LogoutModal from './LogoutModal'
import Chatbot from './Chatbot'

// Backend Config
const BACKEND_URL = "https://keryptonite-8k3u.vercel.app"

// Helper to create sector names
const generateSectorName = (lat, lon) => {
  const zones = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'ZULU', 'OMEGA', 'TITAN', 'NOVA'];
  const index = Math.floor((Math.abs(lat) + Math.abs(lon)) * 100) % zones.length;
  const subSector = Math.floor((Math.abs(lat - lon) * 1000) % 99) + 1;
  return `${zones[index]}-${subSector}`;
}

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSimulated, setIsSimulated] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      let highRisk = []
      
      try {
        const res = await fetch(`${BACKEND_URL}/api/fires/get_hight_regions_area`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: "india", state: "up", day_range: 3, source: "VIIRS_SNPP_NRT" })
        })
        const result = await res.json()

        let parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data
        
        let rows = []
        if (parsedData && parsedData.latitude) {
             rows = Object.keys(parsedData.latitude).map(key => ({
                latitude: parsedData.latitude[key],
                longitude: parsedData.longitude?.[key] || 0,
                brightness: parsedData.brightness?.[key] || 300
             }))
        } else if (Array.isArray(result.data)) {
             rows = result.data
        }

        highRisk = rows.map(item => ({
            id: `${item.latitude}-${item.longitude}`,
            lat: Number(item.latitude),
            lon: Number(item.longitude),
            temp: Number(item.brightness),
            message: `HIGH HEAT: SECTOR ${generateSectorName(Number(item.latitude), Number(item.longitude))}`
        }))

        highRisk.sort((a, b) => b.temp - a.temp)

        if (highRisk.length > 0) {
            setIsSimulated(false)
            setNotifications(highRisk.slice(0, 10))
        } else {
            setNotifications([])
        }

      } catch (e) {
        console.warn("Using Simulation Data:", e.message)
        setIsSimulated(true)
        setNotifications([
          { id: 'sim-1', lat: 28.6139, lon: 77.2090, temp: 350, message: 'CRITICAL: SECTOR ALPHA-1' },
          { id: 'sim-2', lat: 26.8467, lon: 80.9462, temp: 342, message: 'HIGH HEAT: ZONE BETA-7' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) 
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = (lat, lon) => {
      navigate('/drone-control', { state: { lat, lon } })
      setShowNotifs(false)
  }

  const navLinks = [
    { name: 'Command', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Drone', path: '/drone-control', icon: Plane },
    { name: 'Live Feed', path: '/live-feed', icon: Cctv },
    { name: 'Incidents', path: '/complaints', icon: FileWarning },
    { name: 'Inbox', path: '/inbox', icon: Mail },
    { name: 'Resources', path: '/downloads', icon: Download },
    { name: 'Analytics', path: '/analytics', icon: PieChart },  
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
      
      <Chatbot />

      {/* 🟢 UNIFIED LIQUID GLASS NAVBAR */}
      <nav className="sticky top-0 z-[60] w-full  pb-2">
        <div className="mx-auto max-w-screen">
            
            {/* The Single Continuous Glass Bar */}
            <div className="relative w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl transition-all duration-300 overflow-visible">
                
                {/* Glossy Sheen Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between h-16 px-4 md:px-6 relative z-10">
                    
                    {/* Left: Branding */}
                    <Link to="/" className="flex items-center gap-3 group mr-4">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
                            <Flame size={20} className="text-white fill-white" />
                        </div>
                        
                        {/* 🟢 FIX: Removed 'hidden sm:block' so it shows on mobile */}
                        <span className="font-black text-lg md:text-xl tracking-tighter text-slate-800 dark:text-white">
                            FIRE<span className="text-orange-600">WATCH</span>
                        </span>
                    </Link>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center justify-center gap-1 flex-1">
                        {navLinks.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                        active
                                        ? 'text-white shadow-md'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {/* Liquid Background for Active Item */}
                                    {active && (
                                        <motion.div 
                                            layoutId="liquid-nav-bg"
                                            className="absolute inset-0 bg-slate-900 dark:bg-blue-600 rounded-xl z-0"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <item.icon size={16} strokeWidth={2.5} />
                                        {item.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right: Controls & Profile */}
                    <div className="flex items-center gap-2 md:gap-3 ml-auto">
                        
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 md:p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifs(!showNotifs)} 
                                className={`p-2 md:p-2.5 rounded-xl transition-all ${
                                    showNotifs 
                                    ? 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                                }`}
                            >
                                <Bell size={20} />
                                {!loading && notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />}
                            </button>
                            
                            {/* Glass Dropdown */}
                            <AnimatePresence>
                                {showNotifs && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[70] ring-1 ring-black/5"
                                    >
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200/50 dark:border-white/5">
                                            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Alerts</h4>
                                            {!loading && notifications.length > 0 && <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">{notifications.length} NEW</span>}
                                        </div>
                                        
                                        {isSimulated && !loading && (
                                            <div className="m-2 flex items-center gap-2 justify-center bg-yellow-500/10 border border-yellow-500/20 py-1.5 rounded-lg text-[9px] font-bold text-yellow-600 dark:text-yellow-400">
                                                <Radio size={10} className="animate-pulse"/> SIMULATION ACTIVE
                                            </div>
                                        )}

                                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                            {loading ? (
                                                <div className="flex flex-col items-center justify-center py-8 gap-3">
                                                    <Loader2 className="animate-spin text-orange-500" size={20}/>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning...</span>
                                                </div>
                                            ) : notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <button 
                                                        key={n.id} 
                                                        onClick={() => handleNotificationClick(n.lat, n.lon)} 
                                                        className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group flex items-start justify-between border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                                    >
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-700 dark:text-white uppercase group-hover:text-red-600 transition-colors">{n.message}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded font-mono font-bold">
                                                                    {n.temp.toFixed(0)}K
                                                                </span>
                                                                <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                                                                    <MapPin size={8} /> {n.lat.toFixed(2)}, {n.lon.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-red-500 transition-colors" />
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-6">
                                                    <ShieldAlert size={24} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">All Clear</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

                        {/* Profile & Logout */}
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/account" className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white hover:ring-2 ring-orange-500/50 transition-all">
                                <User size={16} />
                            </Link>
                            <button onClick={() => setShowLogoutConfirm(true)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 text-slate-600 dark:text-white">
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* 🟢 MOBILE MENU GLASS DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
                initial={{ height: 0, opacity: 0, y: -10 }} 
                animate={{ height: 'auto', opacity: 1, y: 0 }} 
                exit={{ height: 0, opacity: 0, y: -10 }} 
                className="lg:hidden px-4 pb-4 absolute w-full top-20 z-50 left-0"
            >
                <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-2">
                    <div className="space-y-1">
                        {navLinks.map((item) => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setIsOpen(false)} 
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                                    isActive(item.path) 
                                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
                        <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5">
                            <User size={18} /> Account
                        </Link>
                        <button onClick={() => { setIsOpen(false); setShowLogoutConfirm(true); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}