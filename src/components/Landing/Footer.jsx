import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldAlert, Smartphone, Lock, Globe, Cpu, 
  Activity, Zap, ShieldCheck, Terminal, MapPin 
} from 'lucide-react'

export default function Footer({ navigate, textEnter, textLeave, animationProps }) {
  return (
    <footer className="relative pt-40 pb-12 px-6 bg-[#020617] overflow-hidden border-t-2 border-red-600/30">
      
      {/* 🟦 THEME GRID (Matching Robot Section) */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* 🛑 MASSIVE BACKGROUND DECOR */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 text-[30vw] font-black text-red-600/[0.03] pointer-events-none select-none tracking-tighter italic uppercase">
        Sector_01
      </div>

      <motion.div {...animationProps} className="max-w-7xl mx-auto relative z-10">
        
        {/* --- 1. CALL TO ACTION ZONE --- */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-red-500/20 bg-red-950/20 text-red-500 text-[10px] font-mono font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <Activity size={14} className="animate-pulse" /> Operational Check: Verified
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-[0.85] text-white italic">
            READY TO <br/><span className="text-red-600">DECODE?</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave} 
              onClick={() => navigate('/report')} 
              className="group relative px-12 py-7 bg-white text-black font-black text-xl rounded-2xl transition-all hover:bg-orange-600 hover:text-white shadow-2xl active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-tighter">
                <Smartphone /> Report Hazard
              </span>
            </button>
            
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave} 
              onClick={() => navigate('/dashboard')} 
              className="group px-12 py-7 border-2 border-white/10 text-white font-black text-xl rounded-2xl hover:border-red-600 transition-all flex items-center gap-3 uppercase tracking-tighter active:scale-95"
            >
              <Lock className="group-hover:text-red-600 transition-colors" /> Admin Portal
            </button>
          </div>
        </div>

        {/* --- 2. TACTICAL SITE MAP --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-20 border-b border-white/5">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <Terminal size={14}/> Systems
            </div>
            <ul className="space-y-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition-colors">Satellite Uplink</li>
              <li className="hover:text-white cursor-pointer transition-colors">Neural Grid</li>
              <li className="hover:text-white cursor-pointer transition-colors">Drone Fleet</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <ShieldCheck size={14}/> Security
            </div>
            <ul className="space-y-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition-colors">Encryption</li>
              <li className="hover:text-white cursor-pointer transition-colors">Protocols</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Seal</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <MapPin size={14}/> Deployment
            </div>
            <ul className="space-y-4 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-pointer transition-colors">Global Node</li>
              <li className="hover:text-white cursor-pointer transition-colors">Local Response</li>
              <li className="hover:text-white cursor-pointer transition-colors">Archives</li>
            </ul>
          </div>

          <div className="flex flex-col items-end justify-end">
             <ShieldAlert size={40} className="text-white/10 mb-4" />
             <div className="text-right">
                <p className="text-white font-black text-sm italic uppercase tracking-tighter">FireWatch Global</p>
                <p className="text-slate-600 text-[9px] font-mono">STATION: GHZ_IND_01</p>
             </div>
          </div>
        </div>

        {/* --- 3. SYSTEM STATUS BAR (The "Real" Footer) --- */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 font-mono text-[9px] uppercase tracking-[0.4em] text-slate-500">
            <span>© 2026 Grid_Defense</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500/60">Encrypted_Link_Stable</span>
            </div>
          </div>

          <div className="flex gap-10 opacity-30">
            <Globe size={16} className="text-white hover:text-red-500 transition-colors cursor-pointer" />
            <Cpu size={16} className="text-white hover:text-red-500 transition-colors cursor-pointer" />
            <Zap size={16} className="text-white hover:text-red-500 transition-colors cursor-pointer" />
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            Latency: <span className="text-white">0.0034ms</span> // Build: <span className="text-white">v4.0.2</span>
          </div>
        </div>

      </motion.div>
    </footer>
  )
}