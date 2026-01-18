import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ShieldAlert, Lock, Target, Zap, Flame, Users, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

// Sub-components
import Hero from './Hero'
import Ticker from './Ticker' 
import Workflow from './Workflow'
import Features from './Features'
import RegistryCTA from './RegistryCTA'
import Stats from './Stats'
import Footer from './Footer'

// 🟢 Now accepts props from App.jsx
export default function LandingPage({ user, onLogout }) {
  const navigate = useNavigate()
  
  // --- GATEKEEPER LOGIC ---
  const handleRestrictedAccess = (path) => {
    if (user) {
        navigate(path)
    } else {
        toast.error("ENCRYPTION ERROR: Authorization Required")
        navigate('/auth')
    }
  }

  // ... (Cursor & Scroll logic remains the same)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", mouseMove)
    return () => window.removeEventListener("mousemove", mouseMove)
  }, [])
  
  const textEnter = () => setCursorVariant("text")
  const textLeave = () => setCursorVariant("default")

  const cursorVariants = {
    default: { x: mousePos.x - 16, y: mousePos.y - 16, height: 32, width: 32, backgroundColor: "transparent", border: "2px solid #ef4444" },
    text: { x: mousePos.x - 40, y: mousePos.y - 40, height: 80, width: 80, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "2px solid #ef4444", mixBlendMode: "screen" }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden cursor-none selection:bg-red-500/30">
      
      {/* Custom Cursor */}
      <motion.div className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:flex items-center justify-center" variants={cursorVariants} animate={cursorVariant} transition={{ type: "spring", stiffness: 500, damping: 28 }}>
        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      </motion.div>

      {/* 🟢 CUSTOM NAVBAR FOR LANDING PAGE */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div onMouseEnter={textEnter} onMouseLeave={textLeave} className="flex items-center gap-2 cursor-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ShieldAlert className="text-red-600" size={28} />
            <span className="text-xl font-black tracking-tighter italic">FIREWATCH <span className="text-red-600">PRO</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={() => handleRestrictedAccess('/registry')} className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-none">
              Report Hazard
            </button>

            {user ? (
                <button onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={onLogout} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-all transform hover:scale-105 cursor-none flex items-center gap-2">
                    <LogOut size={14} /> Logout
                </button>
            ) : (
                <button onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={() => navigate('/auth')} className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 cursor-none flex items-center gap-2">
                    <Lock size={14} /> Command Center
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* 🟢 PASS RESTRICTED ACCESS HANDLER TO HERO */}
      <Hero navigate={navigate} textEnter={textEnter} textLeave={textLeave} onRestrictedClick={handleRestrictedAccess} />
      
      <Ticker />
      <Workflow textEnter={textEnter} textLeave={textLeave} />
      
      {/* Gated Feature Clicks */}
      <div onClick={() => !user && handleRestrictedAccess(null)}> 
        <Features textEnter={textEnter} textLeave={textLeave} />
      </div>

      <RegistryCTA navigate={(path) => handleRestrictedAccess(path)} textEnter={textEnter} textLeave={textLeave} />
      <Stats />
      
      <Footer navigate={navigate} textEnter={textEnter} textLeave={textLeave} />
    </div>
  )
}