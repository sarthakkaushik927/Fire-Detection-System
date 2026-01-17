import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Smartphone, Lock, Globe, Cpu, Activity } from 'lucide-react'

export default function Footer({ navigate, textEnter, textLeave, animationProps }) {
  return (
    <footer className="py-32 px-6 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden text-center border-t border-white/10">
      <motion.div {...animationProps} className="max-w-4xl mx-auto relative z-10">
        <ShieldAlert size={64} className="text-red-600 mx-auto mb-10" />
        <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none">Ready to <br/>take control?</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
          <button onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={() => navigate('/report')} className="bg-orange-600 text-white px-12 py-6 rounded-full font-black text-xl hover:bg-orange-700 transition-all hover:scale-105 shadow-[0_0_50px_rgba(234,88,12,0.3)] cursor-none flex items-center gap-3 tracking-widest uppercase"><Smartphone /> Report Fire</button>
          <button onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={() => navigate('/dashboard')} className="bg-white text-black px-12 py-6 rounded-full font-black text-xl hover:bg-red-600 hover:text-white transition-all hover:scale-110 shadow-2xl cursor-none flex items-center gap-3 tracking-widest uppercase"><Lock /> Admin Portal</button>
        </div>
      </motion.div>
      <div className="mt-24 text-slate-600 text-[10px] font-mono uppercase tracking-[0.4em] flex flex-col items-center gap-4">
         <div className="flex gap-8 opacity-40 mb-4"><Globe size={18}/> <Cpu size={18}/> <Activity size={18}/></div>
         © 2026 FIREWATCH GLOBAL DEFENSE GRID • ALL SYSTEMS OPERATIONAL
      </div>
    </footer>
  )
}