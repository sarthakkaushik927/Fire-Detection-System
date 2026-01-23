import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crosshair, Plane, PhoneCall, ChevronLeft, MapPin, 
  Wind, Thermometer, Battery, CheckCircle2, Target, AlertTriangle, 
  Video, Maximize, Compass, LocateFixed, RefreshCw, Flame, Signal, 
  Square, Map as MapIcon, Navigation, Radio
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// 🟢 YOUTUBE VIDEO URL
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/Z8_YeArWzD4?autoplay=1&mute=1&controls=0&loop=1&playlist=Z8_YeArWzD4"

// 🟢 NEW KRYPTONITE BACKEND
const BACKEND_URL = "https://keryptonite-8k3u.vercel.app"

export default function DroneController() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Data States
  const [allTargets, setAllTargets] = useState(location.state?.allTargets || [])
  const [activeTarget, setActiveTarget] = useState(location.state?.target || { lat: 28.6139, lon: 77.2090 })
  const [loadingTargets, setLoadingTargets] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isSimulated, setIsSimulated] = useState(false)

  // Map State
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)

  // Manual Input State
  const [manualLat, setManualLat] = useState(activeTarget.lat)
  const [manualLon, setManualLon] = useState(activeTarget.lon)
  
  // Drone State
  const [status, setStatus] = useState('STANDBY') 
  const [progress, setProgress] = useState(0)

  // 1. INITIAL FETCH
  useEffect(() => {
    fetchTargets()
    fetchMapData()
    toast.success("Tactical Command Interface Loaded", { icon: '🚁' })
  }, [])

  // Sync Manual Inputs
  useEffect(() => {
    setManualLat(activeTarget.lat)
    setManualLon(activeTarget.lon)
  }, [activeTarget])

  // 🟢 FETCH TARGET LIST
  const fetchTargets = async () => {
    setLoadingTargets(true)
    const toastId = toast.loading("Syncing Satellite Data...")
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/fires/get_hight_regions_area`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: "india", state: "up", day_range: 3, source: "VIIRS_SNPP_NRT" })
      })

      const result = await res.json()
      
      let rows = []

      if (Array.isArray(result.data)) {
         rows = result.data.map(item => ({
            lat: Number(item.latitude),
            lon: Number(item.longitude),
            brightness: Number(item.brightness) || 300,
            confidence: item.confidence || 'h'
         }))
      } 
      else if (typeof result.data === 'string') {
          try { 
            const parsed = JSON.parse(result.data) 
            if (Array.isArray(parsed)) {
               rows = parsed.map(item => ({
                  lat: Number(item.latitude),
                  lon: Number(item.longitude),
                  brightness: Number(item.brightness) || 300,
                  confidence: item.confidence || 'h'
               }))
            }
          } catch(e) {}
      }

      rows.sort((a, b) => b.brightness - a.brightness)

      if (rows.length > 0) {
         setAllTargets(rows)
         setIsSimulated(false)
         if (!location.state?.target) setActiveTarget(rows[0])
         toast.success(`Targets Acquired: ${rows.length}`, { id: toastId })
      } else {
         throw new Error("No active fires found in data") 
      }

    } catch (e) {
      console.warn("Using Simulation Data:", e)
      setIsSimulated(true)
      
      const simData = [
        { lat: 26.8467, lon: 80.9462, brightness: 340, confidence: 'h' },
        { lat: 28.6139, lon: 77.2090, brightness: 310, confidence: 'h' },
        { lat: 25.3176, lon: 82.9739, brightness: 338, confidence: 'h' },
        { lat: 27.1767, lon: 78.0081, brightness: 305, confidence: 'h' }
      ]
      setAllTargets(simData)
      if (!location.state?.target) setActiveTarget(simData[0])
      
      toast("Simulation Data Loaded", { id: toastId, icon: '⚠️' })
    } finally {
      setLastUpdated(new Date())
      setLoadingTargets(false)
    }
  }

  // 🟢 FETCH MINI-MAP
  const fetchMapData = async () => {
    setMapLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/fires/get_locations`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: "india", state: "up", day_range: 3 })
      })
      const data = await res.text()
      setMapHtml(data)
    } catch (e) { 
        console.error("Map Fetch Error:", e) 
    }
    finally { setMapLoading(false) }
  }

  const handleDeploy = () => {
    setStatus('DEPLOYING')
    toast("Engaging Rotors...", { icon: '⚙️' })
    let p = 0
    const interval = setInterval(() => {
      p += 1
      setProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setStatus('ACTIVE')
        toast.success("Drone Airborne & En Route", { duration: 5000 })
      }
    }, 30)
  }

  const handleStop = () => {
    setStatus('STANDBY')
    setProgress(0)
    toast("Returning to Base", { icon: '🏠' })
  }

  const handleManualUpdate = () => {
    setActiveTarget({ lat: parseFloat(manualLat), lon: parseFloat(manualLon) })
    toast.success("Manual Coordinates Locked")
  }

  const handleEmergencyCall = () => {
      window.location.href = 'tel:+917060321453'
      toast.error("Emergency Services Contacted", { duration: 4000 })
  }

  return (
    // 🟢 FIX 1: Mobile = min-h-screen + auto overflow. Desktop = h-screen + hidden overflow.
    <div className="min-h-screen md:h-screen md:max-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-mono relative transition-colors duration-300 flex flex-col md:overflow-hidden overflow-y-auto">
      
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* TOP BAR */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-300 dark:border-white/10 gap-4 shrink-0">
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

      {/* MAIN CONTENT - SCROLLS ON MOBILE, FIXED ON DESKTOP */}
      <div className="relative z-10 max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 md:h-full md:overflow-hidden">
        
        {/* LEFT: REAL DATA FEED */}
        {/* 🟢 FIX 2: Fixed height on mobile (400px) so it doesn't smash content, full height on desktop */}
        <div className="lg:col-span-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur rounded-3xl border border-slate-200 dark:border-white/10 p-4 flex flex-col shadow-lg h-[400px] md:h-full md:max-h-[80vh]">
            
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-white/10 shrink-0">
              <Signal size={18} className={loadingTargets ? "text-yellow-500 animate-pulse" : "text-green-500"}/>
              <div>
                 <h3 className="font-bold text-sm uppercase">Live Satellite Feed</h3>
                 <p className="text-[9px] text-slate-400">LAST SCAN: {lastUpdated.toLocaleTimeString()}</p>
              </div>
              
              <button 
                onClick={fetchTargets} 
                className="ml-auto p-1.5 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                title="Refresh Satellite Data"
              >
                <RefreshCw size={14} className={loadingTargets ? "animate-spin" : ""} />
              </button>
            </div>

            {isSimulated && (
                <div className="mb-2 shrink-0 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold uppercase p-2 rounded flex items-center justify-center gap-2">
                    <Radio size={12} className="animate-pulse"/> Simulation Mode Active
                </div>
            )}

            {/* TARGET LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
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
                           <div className="flex items-center gap-2 mb-1">
                              <Flame size={12} className={activeTarget.lat === target.lat ? "text-white" : "text-orange-500"} />
                              <p className="text-xs font-black uppercase tracking-wider">
                                 Zone {idx + 1}: {target.brightness.toFixed(0)}K
                              </p>
                           </div>
                           <p className="text-[10px] font-mono opacity-80">{target.lat.toFixed(4)}, {target.lon.toFixed(4)}</p>
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
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 shrink-0">
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
        {/* 🟢 FIX 3: Fixed height on mobile (300px), full height on desktop */}
        <div className="lg:col-span-6 flex flex-col relative rounded-3xl bg-slate-100 dark:bg-black border-[4px] border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl h-[300px] md:h-full">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(${status === 'ACTIVE' ? '#22c55e' : '#ef4444'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
          
          {status === 'ACTIVE' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative bg-black">
                <iframe className="w-full h-full object-cover pointer-events-none" src={YOUTUBE_EMBED_URL} title="Drone Feed" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                <div className="absolute top-4 left-4 flex gap-2"><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse flex items-center gap-1"><Video size={12}/> REC</span></div>
                <div className="absolute top-4 right-4"><button onClick={handleStop} className="bg-slate-900/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs backdrop-blur border border-white/20 flex items-center gap-2 transition-all shadow-lg"><Square size={12} fill="currentColor" /> RETURN TO BASE</button></div>
              </motion.div>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className={`w-[250px] h-[250px] border border-current rounded-full flex items-center justify-center relative transition-colors duration-500 ${status === 'ACTIVE' ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
                    <div className="absolute inset-0 border-t-2 border-current rounded-full animate-spin-slow opacity-50"></div>
                    <div className="absolute inset-4 border-b-2 border-current rounded-full animate-spin-reverse opacity-30"></div>
                    <Crosshair size={32} className="opacity-80"/>
                </div>
                <motion.div className="absolute" initial={{ scale: 1 }} animate={status === 'DEPLOYING' ? { scale: [1, 0.8, 50], opacity: [1, 1, 0], rotate: [0, -10, 0] } : { y: [0, -10, 0] }} transition={{ duration: status === 'DEPLOYING' ? 3 : 2, ease: "easeInOut" }}>
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

        {/* RIGHT: MINI-MAP */}
        {/* 🟢 FIX 4: Fixed height on mobile (300px), full height on desktop */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[300px] md:h-full">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden relative shadow-lg">
              <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur p-3 flex justify-between items-center border-b border-white/10">
                 <div className="flex items-center gap-2"><MapIcon size={14} className="text-blue-400"/><span className="text-[10px] font-bold text-white uppercase tracking-wider">Target Vector</span></div>
                 <span className="text-[9px] font-mono text-green-400">SAT-LINK: ACTIVE</span>
              </div>
              <div className="w-full h-full bg-slate-800 relative">
                 {mapLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 gap-2"><RefreshCw className="animate-spin" size={20}/> Loading Map...</div>
                 ) : mapHtml ? (
                    <iframe srcDoc={mapHtml} className="w-full h-full border-none opacity-80 hover:opacity-100 transition-opacity" title="Mini Map" />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">Map Offline</div>
                 )}
                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-dashed border-red-500/30 rounded-full animate-pulse flex items-center justify-center">
                       <Navigation size={24} className="text-red-500 rotate-45 drop-shadow-lg" fill="currentColor"/>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 p-6 rounded-3xl text-center shadow-lg shrink-0">
              <AlertTriangle size={32} className="mx-auto text-red-600 dark:text-red-500 mb-2 animate-pulse" />
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-4">Command Override</h3>
              <button onClick={handleEmergencyCall} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/30 transition-all animate-bounce"><PhoneCall size={18} /> CALL FIRE DEPT</button>
            </div>
        </div>

      </div>
    </div>
  )
}