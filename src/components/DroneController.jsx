import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crosshair, Plane, PhoneCall, ChevronLeft, MapPin, 
  Wind, Thermometer, Battery, CheckCircle2, Target, AlertTriangle, 
  Video, Maximize, Compass, LocateFixed, RefreshCw, Flame, Signal
} from 'lucide-react'

// 🟢 EMPTY VIDEO URL (Add your link here later)
const DRONE_VIDEO_URL = "" 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"

export default function DroneController() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Data States
  const [allTargets, setAllTargets] = useState(location.state?.allTargets || [])
  const [activeTarget, setActiveTarget] = useState(location.state?.target || { lat: 28.6139, lon: 77.2090 })
  const [loadingTargets, setLoadingTargets] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Manual Input State
  const [manualLat, setManualLat] = useState(activeTarget.lat)
  const [manualLon, setManualLon] = useState(activeTarget.lon)
  
  // Drone State
  const [status, setStatus] = useState('STANDBY') 
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)

  // 🟢 1. FETCH REAL SATELLITE DATA (Auto-Refresh every 10s)
  useEffect(() => {
    fetchTargets() // Initial Fetch
    const interval = setInterval(fetchTargets, 10000) // Poll API every 10s
    return () => clearInterval(interval)
  }, [])

  // Sync Manual Inputs
  useEffect(() => {
    setManualLat(activeTarget.lat)
    setManualLon(activeTarget.lon)
  }, [activeTarget])

  const fetchTargets = async () => {
    setLoadingTargets(true)
    try {
      const res = await fetch(`${BACKEND_URL}/get_hight_regions_area`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: "india", state: "up", day_range: 3 })
      })
      const result = await res.json()
      
      if (result.data) {
        const parsedData = JSON.parse(result.data)
        
        // Convert Column-based data to Row-based objects
        const rows = Object.keys(parsedData.latitude).map(key => ({
          lat: parsedData.latitude[key],
          lon: parsedData.longitude[key],
          brightness: parsedData.brightness?.[key] || 300, // Default if missing
          confidence: 'h' // Since API returns high conf
        }))
        
        // Sort by Intensity (Brightness)
        rows.sort((a, b) => b.brightness - a.brightness)

        setAllTargets(rows)
        
        // If we have no active target, select the most critical one
        if (rows.length > 0 && !location.state?.target) {
          setActiveTarget(rows[0])
        }
        setLastUpdated(new Date())
      }
    } catch (e) {
      console.error("Satellite Uplink Failed", e)
    } finally {
      setLoadingTargets(false)
    }
  }

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
    }, 30)
  }

  // Auto-play video logic
  useEffect(() => {
    if (status === 'ACTIVE' && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video empty or failed:", e))
    }
  }, [status])

  const handleManualUpdate = () => setActiveTarget({ lat: parseFloat(manualLat), lon: parseFloat(manualLon) })
  const handleEmergencyCall = () => window.location.href = 'tel:+917060321453'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-mono overflow-hidden relative transition-colors duration-300 flex flex-col">
      
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* TOP BAR */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-300 dark:border-white/10 gap-4">
        <div className="w-full md:w-auto flex justify-between md:justify-start items-center">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-500 transition font-bold text-sm md:text-base">
              <ChevronLeft size={18} /> ABORT MISSION
            </button>
        </div>

        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-black text-red-600 dark:text-red-500 tracking-[0.2em] animate-pulse">TACTICAL COMMAND</h1>
          <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase mt-1">
             Destination Locked: <span className="text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-white/10 shadow-sm">{activeTarget.lat.toFixed(4)}° N, {activeTarget.lon.toFixed(4)}° E</span>
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status === 'STANDBY' ? 'bg-yellow-500' : 'bg-green-500 animate-ping'}`}></div>
          <span className="font-bold">{status}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full overflow-hidden">
        
        {/* 📋 LEFT: REAL DATA FEED */}
        <div className="lg:col-span-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur rounded-3xl border border-slate-200 dark:border-white/10 p-4 flex flex-col h-full overflow-hidden shadow-lg">
           
           {/* Header with Live Status */}
           <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-white/10">
              <Signal size={18} className={loadingTargets ? "text-yellow-500 animate-pulse" : "text-green-500"}/>
              <div>
                 <h3 className="font-bold text-sm uppercase">Live Satellite Feed</h3>
                 <p className="text-[9px] text-slate-400">UPDATED: {lastUpdated.toLocaleTimeString()}</p>
              </div>
              <span className="bg-red-500 text-white text-[10px] px-2 rounded-full ml-auto font-bold">{allTargets.length}</span>
           </div>

           {/* 🟢 ACTUAL RED ZONES LIST */}
           <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-[150px]">
              {allTargets.length > 0 ? allTargets.map((target, idx) => (
                 <button
                   key={idx}
                   onClick={() => status === 'STANDBY' && setActiveTarget(target)}
                   disabled={status !== 'STANDBY'}
                   className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                      activeTarget.lat === target.lat 
                      ? 'bg-red-600 text-white border-red-600 shadow-lg' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-red-400'
                   }`}
                 >
                    <div className="flex justify-between items-center relative z-10">
                       <div>
                          {/* REAL DATA DISPLAY */}
                          <div className="flex items-center gap-2 mb-1">
                             <Flame size={12} className={activeTarget.lat === target.lat ? "text-white" : "text-orange-500"} />
                             <p className="text-xs font-black uppercase tracking-wider">
                                Intensity: {target.brightness.toFixed(0)}K
                             </p>
                          </div>
                          <p className="text-[10px] font-mono opacity-80">
                             {target.lat.toFixed(4)}, {target.lon.toFixed(4)}
                          </p>
                       </div>
                       {activeTarget.lat === target.lat && <CheckCircle2 size={16} className="animate-bounce"/>}
                    </div>
                 </button>
              )) : (
                 <div className="text-center p-4 text-slate-400 text-xs border border-dashed border-slate-700 rounded-xl bg-slate-950/30">
                    <RefreshCw size={24} className="mx-auto mb-2 animate-spin opacity-50"/>
                    Acquiring Target Data...
                 </div>
              )}
           </div>

           {/* Manual Override */}
           <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-3 flex items-center gap-2"><LocateFixed size={12}/> Manual Coords</h4>
              <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Lat</label><input type="number" value={manualLat} onChange={(e) => setManualLat(e.target.value)} className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-xs font-mono focus:border-red-500 focus:outline-none"/></div>
                    <div><label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Lon</label><input type="number" value={manualLon} onChange={(e) => setManualLon(e.target.value)} className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-xs font-mono focus:border-red-500 focus:outline-none"/></div>
                 </div>
                 <button onClick={handleManualUpdate} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity" disabled={status !== 'STANDBY'}>Lock Coordinates</button>
              </div>
           </div>
        </div>

        {/* CENTER: VISUALIZER */}
        <div className="lg:col-span-6 flex flex-col relative rounded-3xl bg-slate-100 dark:bg-black border-[4px] border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(${status === 'ACTIVE' ? '#22c55e' : '#ef4444'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
          
          {status === 'ACTIVE' ? (
             /* 🎥 VIDEO MODE */
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative bg-black">
                
                {/* 🟢 EMPTY VIDEO TAG FOR YOU */}
                <video 
                    ref={videoRef}
                    className="w-full h-full object-cover" 
                    muted 
                    loop 
                    playsInline
                    controls
                    // src={DRONE_VIDEO_URL} // Add this when you have a link
                >
                    <source src={DRONE_VIDEO_URL} type="video/mp4" />
                </video>

                <div className="absolute top-4 left-4 flex gap-2"><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse flex items-center gap-1"><Video size={12}/> REC</span></div>
             </motion.div>
          ) : (
             /* HUD MODE */
             <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className={`w-[250px] h-[250px] border border-current rounded-full flex items-center justify-center relative transition-colors duration-500 ${status === 'ACTIVE' ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
                   <div className="absolute inset-0 border-t-2 border-current rounded-full animate-spin-slow opacity-50"></div>
                   <div className="absolute inset-4 border-b-2 border-current rounded-full animate-spin-reverse opacity-30"></div>
                   <Crosshair size={32} className="opacity-80"/>
                </div>
                
                {/* 🟢 ANIMATED PLANE LOGO */}
                <motion.div 
                    className="absolute"
                    initial={{ scale: 1 }}
                    animate={
                        status === 'DEPLOYING' 
                        ? { scale: [1, 0.8, 50], opacity: [1, 1, 0], rotate: [0, -10, 0] } 
                        : { y: [0, -10, 0] }
                    }
                    transition={{ duration: status === 'DEPLOYING' ? 3 : 2, ease: "easeInOut" }}
                >
                   <Plane size={80} className={`transition-colors duration-500 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] ${status === 'ACTIVE' ? 'text-green-500' : 'text-slate-800 dark:text-white'}`} />
                </motion.div>
                
                <div className="absolute bottom-10 w-full px-10 text-center">
                   {status === 'STANDBY' ? (
                      <button onClick={handleDeploy} className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-xl tracking-[0.2em] shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-[1.02] transition-all">DEPLOY TO SECTOR</button>
                   ) : (
                      <div className="bg-black/80 backdrop-blur text-green-500 py-4 rounded-xl border border-green-500/30">
                         <p className="text-xs font-bold uppercase tracking-widest mb-2">Systems Engaging...</p>
                         <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-green-500"/></div>
                      </div>
                   )}
                </div>
             </div>
          )}
        </div>

        {/* RIGHT: TELEMETRY & ACTIONS */}
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-slate-400">Live Telemetry</h3>
              <TelemetryItem icon={<Wind/>} label="Wind Speed" value="12 KN" color="text-blue-500" />
              <TelemetryItem icon={<Thermometer/>} label="Temperature" value="42°C" color="text-orange-500" />
              <TelemetryItem icon={<Battery/>} label="Battery" value="98%" color="text-green-500" />
              <TelemetryItem icon={<MapPin/>} label="Distance" value="4.2 KM" color="text-purple-500" />
           </div>
           
           <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 p-6 rounded-3xl text-center shadow-lg">
              <AlertTriangle size={32} className="mx-auto text-red-600 dark:text-red-500 mb-2 animate-pulse" />
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-4">Command Override</h3>
              <button onClick={handleEmergencyCall} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30 transition-all animate-bounce"><PhoneCall size={18} /> CALL FIRE DEPT</button>
           </div>
        </div>

      </div>
    </div>
  )
}

function TelemetryItem({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-100 dark:border-white/5">
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">{icon}<span className="text-xs font-bold uppercase">{label}</span></div>
      <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
  )
}