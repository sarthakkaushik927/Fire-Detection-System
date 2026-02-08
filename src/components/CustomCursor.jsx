import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])


  const variants = {
    default: {
      x: mousePos.x - 16, 
      y: mousePos.y - 16, 
      height: 32,
      width: 32,
      backgroundColor: "transparent",
      border: "2px solid #ef4444", 
      opacity: 1,
    },
  }

  return (
    <>
        
        <motion.div
         
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center"
          variants={variants}
          animate="default"
         
          transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        >
         
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
        </motion.div>
    </>
  )
}

export default CustomCursor