import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Cpu, Plane } from 'lucide-react'

const StepCard = ({ step, title, desc, icon, trigger, leave }) => (
  <motion.div 
    onMouseEnter={trigger} onMouseLeave={leave}
    whileHover={{ y: -10 }}
    className="bg-slate-900 p-8 rounded-3xl border border-white/10 relative z-10 hover:border-red-500/50 transition-colors group cursor-none"
  >
    <div className="bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/5 transition-colors">
      {icon}
    </div>
    <div className="absolute top-8 right-8 text-6xl font-black text-white/5 select-none">{step}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
)

export default function Workflow({ textEnter, textLeave }) {
  return (
    <section className="py-32 px-6 bg-slate-950 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Tactical Workflow</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From satellite detection to ground suppression in under 5 minutes.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-slate-800 via-red-900 to-slate-800 -z-10"></div>
          
          <StepCard step="01" title="Satellite Detection" desc="NASA VIIRS & MODIS satellites identify thermal anomalies from orbit instantly." icon={<Globe size={32} className="text-blue-400" />} trigger={textEnter} leave={textLeave} />
          <StepCard step="02" title="AI Analysis" desc="Our neural engine filters false positives and predicts fire spread vectors." icon={<Cpu size={32} className="text-purple-400" />} trigger={textEnter} leave={textLeave} />
          <StepCard step="03" title="Drone Deployment" desc="Autonomous quadcopters dispatch to coordinates to verify and suppress." icon={<Plane size={32} className="text-red-400" />} trigger={textEnter} leave={textLeave} />
        </div>
      </div>
    </section>
  )
}