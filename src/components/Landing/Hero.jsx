import React from 'react'
import { motion, useTransform } from 'framer-motion'
import { Terminal, AlertTriangle, Lock, Crosshair, ArrowRight } from 'lucide-react'

export default function Hero({ scrollY, navigate, textEnter, textLeave }) {
  const y1 = useTransform(scrollY, [0, 500], [0, 200])

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 z-10">
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/50 rounded-full px-4 py-1 mb-8">
            <Terminal size={14} className="text-red-500" />
            <span className="text-red-400 font-bold text-xs uppercase tracking-[0.2em]">Active Defense Grid: Ready</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-12 tracking-tight uppercase leading-none">
            Detect. Predict. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">Eliminate.</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GatewayCard icon={<AlertTriangle className="text-orange-500" />} title="Report Fire" desc="Public terminal. Submit intel & receive rewards." btnText="Start Report" color="orange" onClick={() => navigate('/report')} onEnter={textEnter} onLeave={textLeave} />
            <GatewayCard icon={<Lock className="text-red-500" />} title="Command Console" desc="Restricted access. Drone & Sat telemetry." btnText="Verify ID" color="red" onClick={() => navigate('/dashboard')} onEnter={textEnter} onLeave={textLeave} />
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function GatewayCard({ icon, title, desc, btnText, color, onClick, onEnter, onLeave }) {
  const borderColor = color === 'orange' ? 'border-orange-500/30' : 'border-red-500/30'
  const glowColor = color === 'orange' ? 'group-hover:bg-orange-500' : 'group-hover:bg-red-600'
  return (
    <motion.div onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} whileHover={{ scale: 1.02, y: -5 }} className={`bg-slate-900/40 backdrop-blur-xl border ${borderColor} p-8 rounded-[2.5rem] text-left group cursor-none relative overflow-hidden transition-all duration-500`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 ${glowColor} transition-colors duration-500`}>{React.cloneElement(icon, { className: 'group-hover:text-white transition-colors duration-500' })}</div>
      <h3 className="text-2xl font-black uppercase mb-2 tracking-tighter text-white leading-none">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">{desc}</p>
      <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] ${color === 'orange' ? 'text-orange-500' : 'text-red-500'}`}>{btnText} <Crosshair size={12} className="group-hover:rotate-90 transition-transform duration-500" /></div>
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 scale-150 rotate-12 pointer-events-none">{React.cloneElement(icon, { size: 180 })}</div>
    </motion.div>
  )
}