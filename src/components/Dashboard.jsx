import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDroneStream } from '../hooks/useDroneStream'
import { saveImage } from '../utils/db'
import { 
  Map as MapIcon, Plane, Radio, RefreshCw, Upload, 
  X, BarChart3, Activity, Layers, Download, FolderOpen, Loader2 
} from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// 🔴 UPDATED: Using Environment Variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const WS_URL = import.meta.env.VITE_WS_URL

const DEMO_STATS = [
  { name: 'High', count: 12, color: '#ef4444' }, // Red
  { name: 'Med', count: 8, color: '#f97316' },  // Orange
  { name: 'Low', count: 24, color: '#eab308' }, // Yellow
]

export default function Dashboard({ session }) {
  const navigate = useNavigate()
  
  // UI States
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  
  // Drone State
  const { frame: liveFrame, isConnected } = useDroneStream(WS_URL)
  const [simulatedFrame, setSimulatedFrame] = useState(null)
  const [simLoading, setSimLoading] = useState(false)

  // 1. Fetch Map
  const fetchMap = async () => {
    setMapLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/get_locations`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: "india", state: "up", day_range: 3 })
      })
      const data = await res.json()
      setMapHtml(data.html)
    } catch (e) { 
      console.error(e)
      alert(`Backend Connection Failed. check .env`) 
    }
    finally { setMapLoading(false) }
  }

  // 2. Simulation Upload
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
    } catch (err) { 
      console.error(err)
      alert("Simulation failed. Check backend connection.") 
    } 
    finally { setSimLoading(false) }
  }

  // 3. Save Capture to Gallery
  const handleSaveCapture = async () => {
    const frameToSave = simulatedFrame || liveFrame
    if (frameToSave) {
      await saveImage(frameToSave, { type: 'simulation' })
      alert("Image Saved to Gallery!")
    } else {
      alert("No image to save!")
    }
  }

  const displayFrame = simulatedFrame || liveFrame

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto px-6 grid grid-cols-12 gap-6"
    >
      
      {/* 🗺️ LEFT COLUMN: MAP (Span 8) */}
      <motion.section variants={itemVariants} className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden relative group h-[700px] transition-colors duration-300">
           
           {/* Header Overlay */}
           <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-slate-950/80 backdrop-blur px-4 py-2 rounded-full flex items-center gap-3 border border-slate-200 dark:border-white/10 shadow-sm">
              <MapIcon className="text-blue-600 dark:text-blue-500" size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Live Satellite Feed</span>
           </div>
           
           <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchMap} 
              className="absolute top-6 right-6 z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
           >
              <RefreshCw size={16} className={mapLoading ? 'animate-spin' : ''} />
              {mapLoading ? 'Syncing...' : 'Sync NASA Data'}
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

      {/* 🎥 RIGHT COLUMN: DRONE & ANALYTICS (Span 4) */}
      <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* 🛸 CARD 2: DRONE FEED (HUD Style) */}
        <motion.div variants={itemVariants} className="bg-black rounded-[2rem] h-[400px] relative overflow-hidden shadow-2xl border-[4px] border-slate-800">
           
           {/* HUD Overlays */}
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

           {/* Save Controls (Visible only when image present) */}
           {displayFrame && (
             <div className="absolute bottom-6 right-6 z-20 flex gap-2 pointer-events-auto">
               <button 
                 onClick={handleSaveCapture} 
                 className="p-2 bg-white/10 hover:bg-blue-600 text-white rounded-lg backdrop-blur-md transition border border-white/5" 
                 title="Save Capture"
               >
                 <Download size={18} />
               </button>
               <button 
                 onClick={() => navigate('/downloads')} 
                 className="p-2 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg backdrop-blur-md transition border border-white/5" 
                 title="Open Gallery"
               >
                 <FolderOpen size={18} />
               </button>
             </div>
           )}

           <div className="w-full h-full bg-black relative flex items-center justify-center">
             {simLoading ? (
                <div className="text-center">
                   <Loader2 className="text-orange-500 animate-spin mb-2 mx-auto" size={32} />
                   <p className="text-orange-500 font-mono text-xs uppercase">Processing YOLO...</p>
                </div>
             ) : displayFrame ? (
               <img src={displayFrame} className="w-full h-full object-contain bg-black" alt="Feed" />
             ) : (
               <div className="text-center text-slate-800">
                  <Plane size={48} className="mb-4 opacity-50 mx-auto" />
                  <p className="font-mono text-xs uppercase tracking-widest">No Signal</p>
               </div>
             )}
           </div>
        </motion.div>

        {/* 📊 CARD 3: ANALYTICS & UPLOAD */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/10 flex-1 flex flex-col transition-colors duration-300">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
                    <BarChart3 size={18}/>
                 </div>
                 <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Threat Analysis</h3>
              </div>
              <Activity size={18} className="text-slate-300 dark:text-slate-600" />
           </div>

           <div className="flex-1 w-full min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={DEMO_STATS}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12, fontWeight:600, fill:'#94a3b8'}} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius:'12px', color: '#fff'}} 
                      itemStyle={{color:'#fff'}} 
                    />
                    <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40} animationDuration={1500}>
                      {DEMO_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
              {/* DEPLOY BUTTON */}
              <button 
                onClick={() => navigate('/drone-control', { state: { coords: { lat: 26.8467, lon: 80.9462 } } })}
                className="col-span-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
              >
                <Plane size={18} /> DEPLOY SQUAD
              </button>

              {/* UPLOAD BUTTON */}
              <label className="col-span-2 flex items-center justify-center p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 hover:text-orange-500 transition text-slate-400 dark:text-slate-500 text-xs font-bold uppercase gap-2 group">
                  <Upload size={14} className="group-hover:scale-110 transition-transform"/> Upload Simulation Data
                  <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
              </label>
           </div>

        </motion.div>

      </section>
    </motion.main>
  )
}