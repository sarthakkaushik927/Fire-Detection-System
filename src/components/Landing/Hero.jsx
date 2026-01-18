import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

export default function Hero({ navigate, textEnter, textLeave, onRestrictedClick }) {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  
  // --- PARALLAX & SCROLL EFFECTS ---
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // --- MOUSE MOVEMENT LOGIC ---
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseX = useSpring(x, { stiffness: 30, damping: 20 })
  const mouseY = useSpring(y, { stiffness: 30, damping: 20 })

  function handleMouseMove({ clientX, clientY }) {
    if (!containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    const xPct = (clientX / width) - 0.5
    const yPct = (clientY / height) - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  // Calculate Blob positions based on mouse
  const blobX = useTransform(mouseX, [-0.5, 0.5], [-50, 50])
  const blobY = useTransform(mouseY, [-0.5, 0.5], [-50, 50])
  const blobX2 = useTransform(mouseX, [-0.5, 0.5], [50, -50])
  const blobY2 = useTransform(mouseY, [-0.5, 0.5], [50, -50])

  // --- SAFE NAVIGATION HANDLER ---
  // If the parent LandingPage passed the gatekeeper function, use it.
  // Otherwise, default to standard navigation.
  const handleAction = (path) => {
    if (onRestrictedClick) {
      onRestrictedClick(path)
    } else {
      navigate(path)
    }
  }

  return (
    <header 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen flex items-center justify-center overflow-hidden pt-24 bg-slate-950"
    >
      {/* 🌑 LAYER 0: STATIC BACKGROUND (GPU Accelerated) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 will-change-transform">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2074&auto=format&fit=crop" 
          alt="Fire Background" 
          className="w-full h-full object-cover opacity-20 scale-105 grayscale"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
      </motion.div>

      {/* 🔥 LAYER 1: MOLTEN LAVA (Animated Blobs) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <motion.div 
          style={{ x: blobX, y: blobY }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-600 rounded-full blur-[80px] will-change-transform"
        />
        {/* Blob 2 */}
        <motion.div 
          style={{ x: blobX2, y: blobY2 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-800 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      {/* 🚀 LAYER 2: CONTENT */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/20 bg-red-950/20 backdrop-blur-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 font-mono text-[10px] font-bold uppercase tracking-widest">
              Orbital Status: Online
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black mb-6 leading-[0.85] tracking-tighter">
            <span className="block text-white">PREDICT.</span>
            <span className="block text-white">DETECT.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 pb-4">
              NEUTRALIZE.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            NASA Satellite Monitoring and Autonomous Drone Interception Protocol.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* 🟢 BUTTON 1: COMMAND CENTER (Gated) */}
            <button 
              onMouseEnter={textEnter} 
              onMouseLeave={textLeave}
              onClick={() => handleAction('/dashboard')}
              className="px-10 py-5 bg-red-600 text-white font-bold text-lg tracking-widest uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 rounded-none clip-path-slant"
            >
              Initialize Command
            </button>

            {/* 🟢 BUTTON 2: REGISTRY (Gated) */}
            <button 
              onMouseEnter={textEnter} 
              onMouseLeave={textLeave}
              onClick={() => handleAction('/registry')}
              className="px-10 py-5 border border-white/10 text-white font-bold text-lg tracking-widest uppercase hover:bg-white/5 transition-all rounded-none"
            >
              Report Incident
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* 📺 LAYER 3: SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] opacity-20"></div>
    </header>
  )
}