import React from 'react'
import { motion } from 'framer-motion'

const StatItem = ({ label, value, color }) => (
  <div className="relative p-8 flex flex-col items-center">
    <div className={`absolute inset-0 bg-${color}-500/5 blur-3xl rounded-full`} />
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      className={`text-6xl font-black mb-2 tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
    >
      {value}
    </motion.div>
    <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.4em]">{label}</div>
  </div>
)

export default function Stats() {
  return (
    <section className="py-32 px-6 bg-[#020617] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Detected" value="14k" color="red" />
          <StatItem label="Protected" value="850" color="orange" />
          <StatItem label="Latency" value="4.2s" color="blue" />
          <StatItem label="Uptime" value="100%" color="green" />
        </div>
      </div>
    </section>
  )
}