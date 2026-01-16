import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDroneStream } from '../hooks/useDroneStream'
import { saveImage } from '../utils/db'
import { 
  Map as MapIcon, Plane, Radio, RefreshCw, Upload, 
  X, Activity, Layers, Download, FolderOpen, 
  Loader2, Cloud, Wind, Droplets, AlertTriangle, MapPin
} from 'lucide-react'

// --- CONFIGURATION ---
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"
const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws/drone"

// Match this with your Backend REGION_BBOX
const REGIONS = {
  india: ["up", "mp", "maharashtra"]
}

// --- WEATHER WIDGET ---
function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kn")
        const data = await res.json()
        setWeather(data.current)
      } catch (e) { console.error(e) } 
      finally { setLoading(false) }
    }
    fetchWeather()
  }, [])

  if (loading) return <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse w-full mb-6"></div>

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-[2rem] flex justify-between items-center shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden">
      <div className="relative z-10 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm"><Cloud size={28} className="text-white"/></div>
        <div>
           <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Sector Conditions</p>
           <p className="text-3xl font-black tracking-tight">{weather?.temperature_2m}°C</p>
        </div>
      </div>
      <div className="relative z-10 flex gap-6 text-sm font-bold border-l border-white/20 pl-6">
        <div className="flex flex-col items-center gap-1"><Wind size={18} className="opacity-70"/><span>{weather?.wind_speed_10m} KN</span></div>
        <div className="flex flex-col items-center gap-1"><Droplets size={18} className="opacity-70"/><span>{weather?.relative_humidity_2m}%</span></div>
      </div>
    </div>
  )
}

// --- MAIN DASHBOARD ---
export default function Dashboard({ session }) {
  const navigate = useNavigate()
  
  // Region State
  const [selectedCountry, setSelectedCountry] = useState("india")
  const [selectedState, setSelectedState] = useState("up")

  // Data States
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  const [highRiskPoints, setHighRiskPoints] = useState([]) 
  const [riskLoading, setRiskLoading] = useState(false)

  // Drone State
  const { frame: liveFrame, isConnected } = useDroneStream(WS_URL)
  const [simulatedFrame, setSimulatedFrame] = useState(null)
  const [simLoading, setSimLoading] = useState(false)

  // 1. Fetch Map Data (Visual)
  const fetchMap = async () => {
    setMapLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/get_locations`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState, day_range: 3 })
      })
      const data = await res.json()
      setMapHtml(data.html)
    } catch (e) { console.error("Map fetch failed", e) }
    finally { setMapLoading(false) }
  }

  // 2. Fetch High Risk Points (Data for Drone/List)
  const fetchHighRiskData = async () => {
    setRiskLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/get_hight_regions_area`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState, day_range: 3 })
      })
      const result = await res.json()
      
      if (result.data) {
        const parsedData = JSON.parse(result.data)
        const rows = Object.keys(parsedData.latitude).map(key => ({
          lat: parsedData.latitude[key],
          lon: parsedData.longitude[key],
          brightness: parsedData.brightness[key],
          confidence: parsedData.confidence[key]
        }))
        setHighRiskPoints(rows)
      }
    } catch (e) { console.error("Risk Data Error", e) }
    finally { setRiskLoading(false) }
  }

  useEffect(() => {
    fetchHighRiskData()
    fetchMap()
  }, [selectedCountry, selectedState])

  // 3. Simulation Upload
  const handleSimulationUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSimLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch(`${BACKEND_URL}/draw_boxes_fire`, { method: 'POST', body: formData })
      const result = await response.json()
      if (result.data) setSimulatedFrame(`data:image/jpeg;base64,${result.data}`)
    } catch (err) { alert("Simulation failed.") } 
    finally { setSimLoading(false) }
  }

  const handleSaveCapture = async () => {
    const frameToSave = simulatedFrame || liveFrame
    if (frameToSave) {
      await saveImage(frameToSave, { type: 'simulation' })
      alert("Image Saved to Gallery!")
    }
  }

  // 🟢 Deploy Drone Logic
  const deployDrone = (targetCoords) => {
    if (!targetCoords && highRiskPoints.length === 0) {
      alert("No active fire targets detected.")
      return
    }
    navigate('/drone-control', { 
      state: { 
        target: targetCoords || highRiskPoints[0], 
        allTargets: highRiskPoints 
      } 
    })
  }

  const displayFrame = simulatedFrame || liveFrame
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto px-6 grid grid-cols-12 gap-6 pb-20"
    >
      
      {/* 🌍 CONTROL BAR */}
      <div className="col-span-12 flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 transition-colors">
        <div className="flex items-center gap-2 text-slate-500">
           <MapPin size={20} className="text-red-500" />
           <span className="font-bold uppercase text-sm tracking-widest">Target Region:</span>
        </div>
        
        <select 
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none"
        >
          {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none"
        >
          {REGIONS[selectedCountry]?.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
           <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
             {highRiskPoints.length} High Conf. Fires
           </span>
        </div>
      </div>

      {/* 🗺️ LEFT COLUMN: MAP */}
      <motion.section variants={itemVariants} className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden relative group h-[700px] transition-colors duration-300">
           <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-slate-950/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-3 border border-slate-200 dark:border-white/10 shadow-sm">
              <MapIcon className="text-blue-600 dark:text-blue-500" size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                Live Feed: {selectedState}, {selectedCountry}
              </span>
           </div>
           
           <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchMap} 
              className="absolute top-6 right-6 z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
           >
              <RefreshCw size={16} className={mapLoading ? 'animate-spin' : ''} />
              {mapLoading ? 'Syncing...' : 'Refresh Map'}
           </motion.button>

           <div className="w-full h-full bg-slate-100 dark:bg-slate-950 relative transition-colors duration-300">
             {mapHtml ? (
               <iframe srcDoc={mapHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
                  <Layers size={80} strokeWidth={1} />
                  <p className="mt-4 font-black uppercase tracking-widest text-sm">Awaiting Data Uplink</p>
               </div>
             )}
           </div>
        </div>
      </motion.section>

      {/* 🎥 RIGHT COLUMN: DRONE & ANALYTICS */}
      <section className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
        
        <WeatherWidget />
        
        {/* DRONE FEED */}
        <motion.div variants={itemVariants} className="bg-black rounded-[2rem] h-[300px] relative overflow-hidden shadow-2xl border-[4px] border-slate-800 shrink-0">
           <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    <Radio size={12} className={isConnected || simulatedFrame ? 'text-green-500 animate-pulse' : 'text-slate-500'} />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">
                      {simulatedFrame ? 'SIM_MODE' : isConnected ? 'LIVE_UPLINK' : 'OFFLINE'}
                    </span>
                 </div>
                 {simulatedFrame && (
                    <button onClick={() => setSimulatedFrame(null)} className="pointer-events-auto bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition">
                      <X size={14} />
                    </button>
                 )}
              </div>
           </div>

           {(simLoading || isConnected) && <div className="scan-line"></div>}

           {displayFrame && (
             <div className="absolute bottom-6 right-6 z-20 flex gap-2 pointer-events-auto">
               <button onClick={handleSaveCapture} className="p-2 bg-white/10 hover:bg-blue-600 text-white rounded-lg backdrop-blur-md transition border border-white/5" title="Save Capture">
                 <Download size={18} />
               </button>
               <button onClick={() => navigate('/downloads')} className="p-2 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg backdrop-blur-md transition border border-white/5" title="Open Gallery">
                 <FolderOpen size={18} />
               </button>
             </div>
           )}

           <div className="w-full h-full bg-black relative flex items-center justify-center">
             {simLoading ? (
                <div className="text-center"><Loader2 className="text-orange-500 animate-spin mb-2 mx-auto" size={32} /><p className="text-orange-500 font-mono text-xs uppercase">Processing...</p></div>
             ) : displayFrame ? (
               <img src={displayFrame} className="w-full h-full object-contain bg-black" alt="Feed" />
             ) : (
               <div className="text-center text-slate-800"><Plane size={48} className="mb-4 opacity-50 mx-auto" /><p className="font-mono text-xs uppercase tracking-widest">No Signal</p></div>
             )}
           </div>
        </motion.div>

        {/* ACTIVE THREATS LIST */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/10 flex-1 flex flex-col min-h-[300px] transition-colors">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500"/> Active Threats
              </h3>
              <span className="text-[10px] font-mono text-slate-500">SCANNED: {highRiskPoints.length}</span>
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar mb-4 h-[100px]">
             {riskLoading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400"/></div>
             ) : highRiskPoints.length > 0 ? (
               highRiskPoints.map((pt, idx) => (
                 <div key={idx} onClick={() => deployDrone(pt)} className="group flex justify-between items-center p-3 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 cursor-pointer transition border border-transparent hover:border-red-500/30">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Zone {idx + 1}</p>
                      <p className="text-[10px] font-mono text-slate-500">{pt.lat.toFixed(4)}, {pt.lon.toFixed(4)}</p>
                    </div>
                    <button className="bg-white dark:bg-black text-red-500 text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      TARGET
                    </button>
                 </div>
               ))
             ) : (
               <p className="text-center text-xs text-slate-400 mt-4">No high confidence fires detected.</p>
             )}
           </div>

           <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
              <button 
                onClick={() => deployDrone(highRiskPoints[0])}
                className="col-span-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md uppercase tracking-wider"
              >
                <Plane size={18} /> {highRiskPoints.length > 0 ? "Deploy to Primary" : "Deploy Scout"}
              </button>
              
              <label className="col-span-2 flex items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 hover:text-orange-500 transition text-slate-400 dark:text-slate-500 text-xs font-bold uppercase gap-2 group bg-slate-50 dark:bg-slate-900/50">
                  <Upload size={14} className="group-hover:scale-110 transition-transform"/> Upload Sim Data
                  <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
              </label>
           </div>
        </motion.div>

      </section>
    </motion.main>
  )
}