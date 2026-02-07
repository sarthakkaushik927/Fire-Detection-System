import React from 'react'

const StatBox = ({ icon: Icon, label, val, color }) => (
  <div className="bg-black/10 border border-white/5 p-2 rounded flex flex-col items-center justify-center gap-1">
    <Icon size={14} className="text-slate-500" />
    <span className="text-[9px] text-slate-500 font-bold text-2xl">{label}</span>
    <span className={`text-2xl font-mono font-bold  ${color}`}>{val}</span>
  </div>
)

export default StatBox