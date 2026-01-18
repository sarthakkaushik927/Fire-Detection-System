import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

// Navbar
import LandingNavbar from './LandingNavbar'

// Sections
import Hero from './Hero'
import Ticker from './Ticker' 
import Workflow from './Workflow'
import Features from './Features'
import RegistryCTA from './RegistryCTA'
import Stats from './Stats'
import Footer from './Footer'

// 🟢 NEW CONTACT SECTION IMPORT
import ContactSection from './ContactSection'

export default function LandingPage({ user, onLogout }) {
  const navigate = useNavigate()
  
  // --- GATEKEEPER LOGIC ---
  const handleRestrictedAccess = (path) => {
    if (path === '/registry' || path === '/report') {
         navigate(path)
         return
    }
    if (user) {
        if(path) navigate(path)
    } else {
        toast.error("ENCRYPTION ERROR: Authorization Required")
        navigate('/auth')
    }
  }

  // --- CUSTOM CURSOR ---
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
    default: { 
        x: mousePos.x - 16, 
        y: mousePos.y - 16, 
        height: 32, 
        width: 32, 
        backgroundColor: "transparent", 
        border: "2px solid #ef4444" 
    },
    text: { 
        x: mousePos.x - 40, 
        y: mousePos.y - 40, 
        height: 80, 
        width: 80, 
        backgroundColor: "rgba(239, 68, 68, 0.1)", 
        border: "2px solid #ef4444", 
        mixBlendMode: "screen" 
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden cursor-none selection:bg-red-500/30">
      
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:flex items-center justify-center" 
        variants={cursorVariants} 
        animate={cursorVariant} 
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      </motion.div>

      <LandingNavbar 
         navigate={navigate} 
         textEnter={textEnter} 
         textLeave={textLeave} 
         user={user} 
         onLogout={onLogout} 
      />

      <Hero 
         navigate={navigate} 
         textEnter={textEnter} 
         textLeave={textLeave} 
         onRestrictedClick={handleRestrictedAccess} 
      />
      
      <Ticker />
      <Workflow textEnter={textEnter} textLeave={textLeave} />
      
      <div onClick={() => !user && handleRestrictedAccess(null)}> 
        <Features textEnter={textEnter} textLeave={textLeave} />
      </div>

      <RegistryCTA 
        navigate={(path) => handleRestrictedAccess(path)} 
        textEnter={textEnter} 
        textLeave={textLeave} 
      />
      
      <Stats />
      
      {/* 🟢 2. ADD NEW CONTACT SECTION */}
      <ContactSection textEnter={textEnter} textLeave={textLeave} />
      
      <Footer 
        navigate={navigate} 
        textEnter={textEnter} 
        textLeave={textLeave} 
      />
    </div>
  )
}