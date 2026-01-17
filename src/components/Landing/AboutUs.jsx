import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Info, CheckCircle2, ArrowLeft, Users, ShieldCheck, Target } from 'lucide-react'

export default function AboutUs({ variants, isStandalone }) {
  const navigate = useNavigate()

  // High-fidelity entrance animation for Standalone mode
  const standaloneEntry = {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(20px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: "circOut" } }
  }

  return (
    <section className={`py-24 px-6 relative z-10 bg-slate-950 overflow-hidden ${isStandalone ? 'min-h-screen flex flex-col justify-center' : ''}`}>
      
      {/* 🟢 NAVIGATION: BACK TO BASE */}
      {isStandalone && (
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')} 
          className="fixed top-10 left-10 z-[100] flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-red-500 font-bold uppercase text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl"
        >
          <ArrowLeft size={16}/> Return to Base
        </motion.button>
      )}

      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          variants={isStandalone ? standaloneEntry : variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Mission Content */}
          <div className="space-y-8">
            <div className="bg-blue-600/10 w-20 h-20 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
               <ShieldCheck size={40} className="text-blue-500" />
            </div>
            
            <div className="space-y-4">
              <span className="text-blue-500 font-mono font-bold uppercase tracking-[0.4em] text-xs">Project_Metadata_v.4</span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
                About the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Mission</span>
              </h1>
            </div>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
              FireWatch Pro is an elite technological initiative dedicated to environmental defense. By fusing <b>NASA satellite telemetry</b> with autonomous drone swarms, we’ve created the world’s first zero-latency wildfire defense grid.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-md"><CheckCircle2 className="text-blue-400" size={16}/></div>
                <p className="text-sm font-bold text-slate-300">YOLOv8 Real-time Inference</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500/20 p-1 rounded-md"><CheckCircle2 className="text-blue-400" size={16}/></div>
                <p className="text-sm font-bold text-slate-300">Edge-Computing Swarm Tech</p>
              </div>
            </div>
          </div>

          {/* Core Team & Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
             <motion.div whileHover={{ scale: 1.02 }} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 text-center space-y-2">
                <Users className="mx-auto text-blue-500" size={32} />
                <p className="text-4xl font-black text-white leading-none">TEAM</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alpha Development</p>
             </motion.div>
             
             <motion.div whileHover={{ scale: 1.02 }} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 text-center space-y-2">
                <Target className="mx-auto text-red-500" size={32} />
                <p className="text-4xl font-black text-white leading-none">0.2s</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Latency</p>
             </motion.div>

             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="col-span-2 p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 flex flex-col items-center justify-center space-y-4"
             >
                <Globe className="text-blue-400 animate-spin-slow" size={40} />
                <div className="text-center">
                  <p className="text-2xl font-black text-white uppercase italic">FotoFix Architecture</p>
                  <p className="text-xs text-slate-400 font-medium">Global Environmental Analysis Protocol</p>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}