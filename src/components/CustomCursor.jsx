import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  // 1. Track Mouse Position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener("mousemove", mouseMove)

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  // 2. Animation Variants
  // We offset X and Y by half the width/height to center it on the mouse tip.
  const variants = {
    default: {
      x: mousePos.x - 16, // Center for 32px width
      y: mousePos.y - 16, // Center for 32px height
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid #ef4444", // Tailwind red-500
      opacity: 1,
    },
  }

  return (
    <>
        {/* The main ring cursor */}
        <motion.div
          // crucial classes: fixed position, ignore pointer events, high z-index
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center"
          variants={variants}
          animate="default"
          // Smooth spring animation
          transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
           {/* The tiny center dot */}
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
        </motion.div>
    </>
  )
}

export default CustomCursor