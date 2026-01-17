import React from 'react'
import { motion } from 'framer-motion'
import { Target, Zap, Flame } from 'lucide-react'

export default function Ticker() {
  const tickerData = (
    <>
      <span className="flex items-center gap-4"><Target size={20}/> SECTOR_SCAN: ACTIVE</span>
      <span className="flex items-center gap-4"><Zap size={20}/> UPLINK: STABLE</span>
      <span className="flex items-center gap-4 text-yellow-300"><Flame size={20}/> THREAT_LEVEL: NOMINAL</span>
      <span className="opacity-40 font-light mx-4">||</span>
    </>
  )

  return (
    <div className="relative z-40 block w-full bg-orange-600 border-y border-orange-400/50 shadow-[0_0_50px_rgba(234,88,12,0.4)] overflow-hidden">
      <div className="py-4 flex whitespace-nowrap">
        <motion.div 
          className="flex gap-24 pr-24 text-white font-mono font-black uppercase text-base tracking-[0.2em]"
          animate={{ x: [0, -1920] }} // Uses pixels for better smoothness
          transition={{ 
            repeat: Infinity, 
            duration: 50, // 🟢 Higher = Slower. 100 is very cinematic.
            ease: "linear" 
          }}
        >
          {/* We repeat the array twice to ensure a seamless infinite loop */}
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              {tickerData}
            </React.Fragment>
          ))}
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={`repeat-${i}`}>
              {tickerData}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}