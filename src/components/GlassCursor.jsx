import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCursor({ mousePos, cursorVariant }) {
  
 
  const variants = {
    default: {
      x: mousePos.x - 16, 
      y: mousePos.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid #ef4444",
      mixBlendMode: "normal",
      opacity: 1
    },
    text: {
      x: mousePos.x - 40,
      y: mousePos.y - 40,
      height: 80,
      width: 80,
    
      backgroundColor: "rgba(239, 68, 68, 0.2)", 
      border: "1px solid #ef4444",
      mixBlendMode: "screen", 
    }
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center backdrop-blur-[1px]"
      variants={variants}
      animate={cursorVariant}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 28, 
        mass: 0.5 
      }}
    >
     
      <div className={`w-1 h-1 bg-red-500 rounded-full transition-opacity ${cursorVariant === 'text' ? 'opacity-50' : 'opacity-100'}`}></div>
    </motion.div>
  )
}