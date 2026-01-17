import React from 'react'
import { motion } from 'framer-motion'
import { Megaphone, FileWarning, ShieldCheck, Activity } from 'lucide-react'

export default function RegistryCTA({ navigate, textEnter, textLeave }) {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Animated Intel UI */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-duration-700" />
            <div className="relative bg-slate-900/80 border border-orange-500/30 p-8 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <span className="text-orange-500 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" /> Live Ground Intel
                </span>
                <span className="text-slate-500 font-mono text-[10px]">VER_4.02</span>
              </div>
              
              <div className="space-y-4 opacity-60 group-hover:opacity-100 transition-opacity">
                {[
                  { user: "USER_882", loc: "Sector 7G", msg: "Reporting smoke sighting." },
                  { user: "USER_104", loc: "Zone 4", msg: "Unauthorized dry waste burn." },
                ].map((log, i) => (
                  <div key={i} className="bg-black/40 p-3 border-l-2 border-orange-500 font-mono text-[10px]">
                    <span className="text-orange-400">[{log.user}]</span> @ {log.loc}: {log.msg}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <ShieldCheck size={48} className="text-orange-500/20 group-hover:text-orange-500/50 transition-colors" />
              </div>
            </div>
          </div>

          {/* Right Side: Copy */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black tracking-tighter mb-6">CIVILIAN <br/> <span className="text-orange-500 italic">RECONNAISSANCE</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Satellites see the heat, but civilians see the cause. Our public registry allows ground teams to log unauthorized hazards directly into the FireWatch Neural Engine.
            </p>
            <button 
              onMouseEnter={textEnter} onMouseLeave={textLeave}
              onClick={() => navigate('/registry')}
              className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 cursor-none"
            >
              <FileWarning size={20} /> Open Intel Registry
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}