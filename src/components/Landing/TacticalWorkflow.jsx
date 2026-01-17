import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Cpu, Plane } from 'lucide-react'

export default function TacticalWorkflow({ variants, itemVariants }) {
  const steps = [
    { id: "01", title: "Satellite Detection", desc: "NASA telemetry identifies thermal anomalies from orbit instantly.", icon: <Globe className="text-blue-400" size={32} /> },
    { id: "02", title: "AI Analysis", desc: "Our neural engine filters false positives and predicts fire spread vectors.", icon: <Cpu className="text-purple-400" size={32} /> },
    { id: "03", title: "Drone Deployment", desc: "Autonomous quadcopters dispatch to coordinates to verify and suppress.", icon: <Plane className="text-red-400" size={32} /> }
  ]

  return (
    <section className="py-32 px-6 relative z-10 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">Tactical Workflow</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From satellite detection to ground suppression in under 300 seconds.</p>
        </motion.div>

        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-900/50 to-transparent -z-10" />
          {steps.map((step) => (
            <motion.div key={step.id} variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative group hover:border-red-500/30 transition-all">
              <div className="bg-slate-950 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-red-500/10 transition-colors">{step.icon}</div>
              <div className="absolute top-10 right-10 text-6xl font-black text-white/5 select-none">{step.id}</div>
              <h3 className="text-2xl font-bold mb-4 uppercase text-white tracking-tight">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}