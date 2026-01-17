import React from 'react'
import { ShieldAlert, FileWarning, Lock } from 'lucide-react'

export default function LandingNavbar({ navigate, textEnter, textLeave }) {
  return (
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

          <button 
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            onClick={() => navigate('/auth')}
            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 cursor-none flex items-center gap-2"
          >
            <Lock size={14} /> Command Center
          </button>
        </div>
      </div>
    </nav>
  )
}