import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Map, Smartphone } from 'lucide-react'

export default function FeaturesSection({ variants, itemVariants }) {
  return (
    <section className="py-32 px-6 relative z-10">
      <motion.div 
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { icon: <Cpu />, title: "AI Analytics", desc: "Edge-computed YOLOv8 engines.", color: "blue" },
          { icon: <Map />, title: "Geospatial", desc: "NASA VIIRS thermal telemetry.", color: "green" },
          { icon: <Smartphone />, title: "Reward Grid", desc: "Citizen reports earn bounty.", color: "orange" }
        ].map((feat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
             {/* Box content... */}
             <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">{feat.icon}</div>
             <h3 className="text-xl font-bold uppercase">{feat.title}</h3>
             <p className="text-slate-400 text-sm mt-2">{feat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}