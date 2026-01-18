import React, { useState } from 'react'
import { ShieldAlert, FileWarning, Lock, LogOut } from 'lucide-react'
import LogoutModal from '../LogoutModal' // Ensure this path is correct

export default function LandingNavbar({ navigate, textEnter, textLeave, user, onLogout }) {
  // Local state for the modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const confirmLogout = () => {
      setShowLogoutConfirm(false)
      onLogout()
  }

  return (
    <>
      {/* 🟢 MODAL COMPONENT */}
      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={confirmLogout} 
      />

      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            className="flex items-center gap-2 cursor-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ShieldAlert className="text-red-600" size={28} />
            <span className="text-xl font-black tracking-tighter italic">FIREWATCH <span className="text-red-600">PRO</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              onClick={() => navigate('/registry')}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-none"
            >
              <FileWarning size={16} /> Report Hazard
            </button>

            {user ? (
                // 🟢 LOGGED IN: SHOW TERMINATE BUTTON THAT OPENS MODAL
                <button 
                  onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => setShowLogoutConfirm(true)} 
                  className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-all transform hover:scale-105 cursor-none flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                >
                  <LogOut size={14} /> Terminate
                </button>
            ) : (
                // 🔴 LOGGED OUT: SHOW COMMAND CENTER LOGIN BUTTON
                <button 
                  onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => navigate('/auth')}
                  className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 cursor-none flex items-center gap-2"
                >
                  <Lock size={14} /> Command Center
                </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}