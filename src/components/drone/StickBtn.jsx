import React from 'react'

const StickBtn = ({ children, onClick }) => (
  <button 
    onClick={onClick} 
    className="w-full h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded active:scale-90 select-none font-bold text-lg"
  >
    {children}
  </button>
)

export default StickBtn