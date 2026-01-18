import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldAlert, Globe, Cpu, Zap, 
  Terminal, ShieldCheck, MapPin, Activity 
} from 'lucide-react'

export default function Footer({ textEnter, textLeave }) {
  return (
    <footer className="relative pt-24 pb-12 px-6 bg-[#020617] overflow-hidden border-t border-red-600/20">
      
      {/* 🟦 THEME GRID */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* 🛑 SECTOR WATERMARK */}
      <div className="absolute bottom-0 left-0 text-[12vw] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter italic uppercase leading-none">
        Sector_01
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- MAIN NAVIGATION GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          
          {/* BRANDING COLUMN */}
          <div className="col-span-2 lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6 text-white cursor-none" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                <ShieldAlert className="text-red-600" size={32} />
                <span className="text-2xl font-black tracking-tighter italic">FIREWATCH <span className="text-red-600">PRO</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Advanced autonomous wildfire defense network using drone swarms and neural processing. Protecting infrastructure and lives through real-time intelligence.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-950/20 text-green-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                <Activity size={12} className="animate-pulse" /> All Systems Nominal
            </div>
          </div>

          {/* COLUMN 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <Terminal size={14}/> Systems
            </div>
            <ul className="space-y-3 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Satellite Uplink</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Neural Grid</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Drone Fleet</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>API Access</li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <ShieldCheck size={14}/> Security
            </div>
            <ul className="space-y-3 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Encryption</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Protocols</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Clearance Levels</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Audit Logs</li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest">
              <MapPin size={14}/> Deployment
            </div>
            <ul className="space-y-3 text-slate-500 font-mono text-[11px] font-bold uppercase tracking-widest">
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Global Node</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Local Response</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Archives</li>
              <li className="hover:text-white cursor-none transition-colors w-fit" onMouseEnter={textEnter} onMouseLeave={textLeave}>Status Page</li>
            </ul>
          </div>
        </div>

        {/* --- 3. SYSTEM STATUS BAR (The Bottom Bar) --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
            <span>© 2026 Grid_Defense Systems</span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hover:text-white cursor-none transition-colors" onMouseEnter={textEnter} onMouseLeave={textLeave}>Privacy Protocol</span>
          </div>

          <div className="flex gap-6 opacity-40">
            <Globe size={18} className="text-white hover:text-red-500 transition-colors cursor-none" onMouseEnter={textEnter} onMouseLeave={textLeave} />
            <Cpu size={18} className="text-white hover:text-red-500 transition-colors cursor-none" onMouseEnter={textEnter} onMouseLeave={textLeave} />
            <Zap size={18} className="text-white hover:text-red-500 transition-colors cursor-none" onMouseEnter={textEnter} onMouseLeave={textLeave} />
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            Latency: <span className="text-green-500">0.0034ms</span> // Build: <span className="text-white">v4.0.2</span>
          </div>
        </div>

      </div>
    </footer>
  )
}