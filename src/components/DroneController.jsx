import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Crosshair, Plane, ShieldAlert, PhoneCall, ChevronLeft, 
  MapPin, Wind, Thermometer, Battery, CheckCircle2 
} from 'lucide-react'

export default function DroneController() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get coords from navigation state or use defaults (Delhi)
  const coords = location.state?.coords || { lat: 28.6139, lon: 77.2090 }
  
  const [status, setStatus] = useState('STANDBY') // STANDBY, DEPLOYING, ACTIVE, ARRIVED
  const [progress, setProgress] = useState(0)

  // Simulation Sequence
  const handleDeploy = () => {
    setStatus('DEPLOYING')
    let p = 0
    const interval = setInterval(() => {
      p += 1
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setStatus('ACTIVE')
      }
    }, 30) // 3 seconds to deploy
  }

  // Emergency Call
  const handleEmergencyCall = () => {
    window.location.href = 'tel:+919876543210'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-mono overflow-hidden relative transition-colors duration-300">
      
      {/* HUD Grid Overlay (Subtle in Light, Glowing in Dark) */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-300 dark:border-white/10 transition-colors duration-300">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-500 transition font-bold">
          <ChevronLeft /> ABORT / BACK
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-red-600 dark:text-red-500 tracking-[0.3em] animate-pulse">EMERGENCY PROTOCOL</h1>
          <p className="text-xs text-slate-500 font-bold">TARGET: {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status === 'STANDBY' ? 'bg-yellow-500' : 'bg-green-500 animate-ping'}`}></div>
          <span className="font-bold">{status}</span>
        </div>
      </div>

      {/* Main Control Area */}
      <div className="relative z-10 max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 px-6">
        
        {/* Left: Telemetry */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <TelemetryItem icon={<Wind/>} label="WIND SPD" value="12 KN" />
          <TelemetryItem icon={<Thermometer/>} label="TEMP" value="42°C" />
          <TelemetryItem icon={<Battery/>} label="BATTERY" value="98%" />
          <TelemetryItem icon={<MapPin/>} label="DIST" value="4.2 KM" />
        </div>

        {/* Center: Drone Visualizer */}
        <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center relative h-[500px] border-x-0 md:border-x border-slate-300 dark:border-white/10">
          
          {/* Target Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] border border-red-500/30 rounded-full flex items-center justify-center relative animate-spin-slow">
              <Crosshair size={300} className="text-red-500/20 absolute" />
              <div className="w-[200px] h-[200px] border-2 border-red-500/50 rounded-full"></div>
            </div>
          </div>

          {/* Drone Icon */}
          <motion.div 
            animate={status === 'ACTIVE' ? { y: [0, -20, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Plane 
                size={120} 
                className={`transition-colors duration-500 ${
                    status === 'ACTIVE' 
                    ? 'text-green-600 dark:text-green-500' 
                    : 'text-slate-400 dark:text-slate-600'
                }`} 
            />
          </motion.div>

          {/* Progress Bar */}
          {status === 'DEPLOYING' && (
             <div className="w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-75" style={{width: `${progress}%`}}></div>
             </div>
          )}

          {/* Main Action Button */}
          {status === 'STANDBY' ? (
            <button 
              onClick={handleDeploy}
              className="mt-12 bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-full font-black text-xl tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-transform"
            >
              INITIATE LAUNCH
            </button>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold tracking-widest flex items-center gap-2">
                <CheckCircle2/> SYSTEMS ENGAGED
              </span>
              <p className="text-xs text-slate-500">Live feed linking...</p>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="col-span-12 md:col-span-3 space-y-6">
           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl text-center transition-colors duration-300">
              <ShieldAlert size={48} className="mx-auto text-red-600 dark:text-red-500 mb-4 animate-pulse" />
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">THREAT DETECTED</h3>
              <p className="text-xs text-red-800/70 dark:text-red-300/70 mb-6">High confidence heat signature confirmed by satellite analysis.</p>
              
              <button 
                onClick={handleEmergencyCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 animate-bounce shadow-lg"
              >
                <PhoneCall size={20} /> CALL FIRE DEPT
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}

function TelemetryItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className="font-mono text-xl font-bold text-slate-900 dark:text-green-400">{value}</span>
    </div>
  )
}