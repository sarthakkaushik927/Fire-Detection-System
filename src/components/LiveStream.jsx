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
      className="relative p-4 md:p-6 min-h-[calc(100vh-64px)] overflow-hidden"
    >
     
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: 'url(/livefeed.jpeg)',
          filter: 'brightness(1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

     
      <div className="relative z-10 opacity-80  ">
        <LiveStreamQR />
      </div>
    </motion.main>
  )
}

export default LiveStream