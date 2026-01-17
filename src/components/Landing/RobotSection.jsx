import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function RobotSection({ variants }) {
  return (
    <section className="py-32 px-6 relative z-10 bg-slate-900 overflow-hidden">
      <motion.div 
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center"
      >
        <motion.div 
          className="order-2 md:order-1 relative"
          whileHover={{ rotateY: 10, rotateX: -5 }} // 🟢 Adds 3D Tilt on Hover
          style={{ perspective: 1000 }}
        >
           <div className="absolute inset-0 bg-red-600/5 blur-[100px] rounded-full"></div>
           <img src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=1000&auto=format&fit=crop" className="relative z-10 rounded-[3rem] border border-white/10 shadow-2xl" />
        </motion.div>
        
        <div className="order-1 md:order-2">
          <Bot size={48} className="text-red-500 mb-8" />
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter text-white">Autonomous Neutralization</h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">Edge-computed flight paths allow for zero-latency response to fire clusters.</p>
        </div>
      </motion.div>
    </section>
  )
}