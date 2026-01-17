import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Crosshair, Zap, Target } from 'lucide-react'

export default function RobotSection({ variants }) {
  // 🟢 Typewriter Animation Logic
  const sentence = "AUTONOMOUS NEUTRALIZATION"
  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <section className="py-32 px-6 relative z-10 bg-[#0a29b0] overflow-hidden border-t border-white/5">
      {/* 🟦 THEME MATCHING GRID BACKGROUND */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      ></div>

      {/* 📡 Background Radar Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />

      <motion.div 
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative"
      >
        <motion.div 
          className="order-2 md:order-1 relative group"
          whileHover={{ rotateY: 5, rotateX: -2 }}
          style={{ perspective: 1000 }}
        >
          {/* 🎯 HUD OVERLAY */}
          <div className="absolute inset-0 z-20 pointer-events-none border-[20px] border-transparent p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-red-500" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-red-500" />
             </div>
             <Crosshair className="text-red-500 mx-auto opacity-50 animate-spin-slow" size={60} />
             <div className="flex justify-between">
                <div className="w-8 h-8 border-b-2 border-l-2 border-red-500" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-red-500" />
             </div>
          </div>

          <img 
            src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000&auto=format&fit=crop" 
            className="relative z-10 rounded-2xl border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl" 
            alt="Drone Unit"
          />
          
          <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-4 font-mono text-[10px] font-black z-30 uppercase tracking-widest hidden md:block shadow-xl">
            Unit: Drone_Interceptors <br/> Status: Lock_Confirmed
          </div>
        </motion.div>
        
        <div className="order-1 md:order-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-red-600" />
            <span className="text-red-500 font-mono text-xs font-bold uppercase tracking-[0.3em]">Tactical Asset_01</span>
          </div>

          {/* ⌨️ TYPEWRITER HEADER */}
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-white leading-none italic"
            initial="hidden"
            whileInView="visible"
          >
            {sentence.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants} transition={{ delay: index * 0.05 }}>
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <div className="space-y-6">
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Edge-computed flight paths allow for zero-latency response. Our UAVs deploy locally-trained YOLOv8 models to identify ignition points.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                 <Zap className="text-red-500 mb-2" size={20} />
                 <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Response Time</p>
                 <p className="text-white font-bold">&lt; 120s</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                 <Target className="text-red-500 mb-2" size={20} />
                 <p className="text-[10px] font-mono font-bold text-slate-500 uppercase">Precision</p>
                 <p className="text-white font-bold">99.4%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}