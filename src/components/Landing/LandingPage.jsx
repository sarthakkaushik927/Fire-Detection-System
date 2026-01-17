import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Import all sections from the same folder
import LandingNavbar from './LandingNavbar'
import Hero from './Hero'
import Ticker from './Ticker'
import Workflow from './Workflow'
import Features from './Features'
import RegistryCTA from './RegistryCTA'
import Stats from './Stats'
import LandingFooter from './LandingFooter'
import ContactSection from './ContactSection'
import Footer from './Footer'

export default function LandingPage() {
  const navigate = useNavigate()

  // --- CUSTOM CURSOR LOGIC ---
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
      
      {/* 🖱️ CUSTOM CURSOR (Hidden on mobile) */}
      <motion.div 
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] hidden md:flex items-center justify-center"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      </motion.div>

      {/* 🧩 ASSEMBLED COMPONENTS */}
      <LandingNavbar navigate={navigate} textEnter={textEnter} textLeave={textLeave} />
      <Hero navigate={navigate} textEnter={textEnter} textLeave={textLeave} />
      <Ticker />
      <Workflow textEnter={textEnter} textLeave={textLeave} />
      <Features textEnter={textEnter} textLeave={textLeave} />
      <RegistryCTA navigate={navigate} textEnter={textEnter} textLeave={textLeave} />
      <Stats />
      <ContactSection textEnter={textEnter} textLeave={textLeave} />
      \
      <Footer navigate={navigate} textEnter={textEnter} textLeave={textLeave} animationProps={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: 0.2 } }} />
    </div>
  )
}