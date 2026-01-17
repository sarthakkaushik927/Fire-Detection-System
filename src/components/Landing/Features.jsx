import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3">
     <div className="bg-green-500/20 p-1 rounded-full"><CheckCircle2 size={16} className="text-green-500" /></div>
     <span className="font-bold text-slate-300">{text}</span>
  </div>
)

export default function Features({ textEnter, textLeave }) {
  return (
    <section className="py-24 px-6 bg-slate-900 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
           <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
           <img src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000&auto=format&fit=crop" alt="Drone Tech" className="relative z-10 rounded-3xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition duration-500"/>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
           <h2 className="text-4xl font-black mb-6">YOLOv8 Computer Vision</h2>
           <p className="text-slate-400 text-lg mb-8 leading-relaxed">
             We don't just see smoke; we understand it. Our proprietary computer vision models run on-edge devices, detecting fire signatures with 99.8% accuracy even in thick haze.
           </p>
           <div className="space-y-4">
             <FeatureItem text="Sub-second inference time" />
             <FeatureItem text="Thermal & RGB fusion analysis" />
             <FeatureItem text="Autonomous flight pathing" />
           </div>
           <button onMouseEnter={textEnter} onMouseLeave={textLeave} className="mt-10 text-red-500 font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-none">
              Read the Whitepaper <ArrowRight size={18}/>
           </button>
        </motion.div>
      </div>
    </section>
  )
}