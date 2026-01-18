import React, { useState } from 'react'
import { ShieldAlert, FileWarning, Lock, LogOut, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import LogoutModal from '../LogoutModal' 

export default function LandingNavbar({ navigate, textEnter, textLeave, user, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const confirmLogout = () => {
      setShowLogoutConfirm(false)
      onLogout()
  }

  // 🟢 REUSABLE LIQUID BUTTON FOR NAVBAR
  const NavButton = ({ children, onClick, variant = "glass" }) => {
    const isPrimary = variant === "primary"
    return (
      <motion.button
        onClick={onClick}
        onMouseEnter={textEnter} 
        onMouseLeave={textLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative group overflow-hidden px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2
          backdrop-blur-md transition-all duration-300 border
          ${isPrimary 
            ? "border-red-500/50 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
            : "border-white/10 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/5"}
        `}
        style={{
          background: isPrimary 
            ? "linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(234, 88, 12, 0.2))"
            : "transparent"
        }}
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
        </div>
        {children}
      </motion.button>
    )
  }

  return (
    <>
      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={confirmLogout} 
      />

      <nav className="fixed top-0 w-full z-50 transition-all duration-300">
        {/* 🟢 BLURRED BACKDROP WITH GRADIENT BORDER BOTTOM */}
        <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />

        <div className="relative max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* LOGO AREA */}
          <div 
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
                <ShieldAlert className="text-red-500 group-hover:text-orange-500 transition-colors" size={24} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter italic text-white leading-none">
                    FIREWATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">PRO</span>
                </span>
                <span className="text-[8px] font-mono text-slate-500 tracking-[0.3em] uppercase">System Online</span>
            </div>
          </div>
          
          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-4">
            
            {/* REPORT HAZARD (Only on desktop) */}
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              onClick={() => navigate('/registry')}
              className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase tracking-[0.2em] transition-colors"
            >
              <FileWarning size={14} /> Report Hazard
            </button>

            {/* SEPARATOR */}
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

            {user ? (
                // 🟢 LOGGED IN STATE
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-mono uppercase tracking-widest">
                        <Activity size={10} className="animate-pulse" /> ID: {user.email?.split('@')[0].toUpperCase()}
                     </div>
                     <NavButton onClick={() => setShowLogoutConfirm(true)} variant="glass">
                        <LogOut size={14} /> Terminate
                     </NavButton>
                </div>
            ) : (
                // 🔴 LOGGED OUT STATE
                <NavButton onClick={() => navigate('/auth')} variant="primary">
                   <Lock size={14} /> Command Center
                </NavButton>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}