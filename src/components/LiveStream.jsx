import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, WifiOff, Activity, Disc, 
  Maximize, Minimize, Video, Battery, 
  Signal, Navigation, Server
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useDroneStream } from '../hooks/useDroneStream'
import LiveStreamQR from './dashboard/LiveStreamQR'




const LiveStream = () => {
  const { theme } = useTheme()

  




  const pageVariants = { 
    hidden: { opacity: 0, scale: 0.98 }, 
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } 
  }



  return (
    <motion.main 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="bg-red-600/90 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest backdrop-blur items-center jus">
                            <LiveStreamQR/>
                        </div>
    </motion.main>
  )
}

export default LiveStream