import { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useDroneStream } from '../hooks/useDroneStream'
import { Map as MapIcon, Plane, Radio, RefreshCw, Power, ShieldAlert, Upload, X, BarChart3, Activity, Layers, Bell } from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

const BACKEND_URL = "http://127.0.0.1:8000"
const WS_URL = "ws://127.0.0.1:8000/ws/drone"

// 🎨 Mock Data for the graph (Since backend doesn't have it yet)
const DEMO_STATS = [
  { name: 'High', count: 12, color: '#ef4444' }, // Red
  { name: 'Med', count: 8, color: '#f97316' },  // Orange
  { name: 'Low', count: 24, color: '#eab308' }, // Yellow
]

export default function Dashboard({ session }) {
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  
  // Drone State
  const { frame: liveFrame, isConnected } = useDroneStream(WS_URL)
  const [simulatedFrame, setSimulatedFrame] = useState(null)
  const [simLoading, setSimLoading] = useState(false)

  // 1. Fetch Map Only (No Stats)
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
      // Note: We removed the stats updating logic here.
      // The graph will keep showing the DEMO_STATS.
    } catch (e) { alert("Backend Offline") }
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
    } catch (err) { alert("Simulation failed.") } 
    finally { setSimLoading(false) }
  }

  const displayFrame = simulatedFrame || liveFrame

  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      
      {/* 🟢 TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/20 px-6 py-4 mb-8">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-500/30">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter italic leading-none">FIREWATCH</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
               <span className="text-xs font-bold text-slate-400 uppercase">Operator</span>
               <span className="text-sm font-bold text-slate-800">{session.user.email}</span>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 relative">
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </motion.button>
            <motion.button 
              onClick={() => supabase.auth.signOut()}
              whileHover={{ scale: 1.05, backgroundColor: "#fee2e2", color: "#ef4444" }}
              className="p-2 rounded-full text-slate-400 transition-colors"
            >
              <Power size={20} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* 🟢 MAIN GRID LAYOUT */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1800px] mx-auto px-6 grid grid-cols-12 gap-6"
      >
        
        {/* 🗺️ CARD 1: SATELLITE MAP (Span 8) */}
        <motion.section variants={itemVariants} className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative group h-[700px]">
             {/* Header Overlay */}
             <div className="absolute top-6 left-6 z-10 glass-panel px-4 py-2 rounded-full flex items-center gap-3">
                <MapIcon className="text-blue-600" size={18} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">Live Satellite Feed</span>
             </div>
             
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchMap} 
                className="absolute top-6 right-6 z-10 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
             >
                <RefreshCw size={16} className={mapLoading ? 'animate-spin' : ''} />
                {mapLoading ? 'Syncing...' : 'Sync NASA Data'}
             </motion.button>

             <div className="w-full h-full bg-slate-100 relative">
               {mapHtml ? (
                 <iframe srcDoc={mapHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                      <Layers size={80} strokeWidth={1} />
                    </motion.div>
                    <p className="mt-4 font-black uppercase tracking-widest text-sm">Offline Mode</p>
                 </div>
               )}
             </div>
          </div>
        </motion.section>

        {/* 🎥 RIGHT COLUMN (Span 4) */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* 🛸 CARD 2: DRONE FEED (HUD Style) */}
          <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2rem] h-[400px] relative overflow-hidden shadow-2xl border-[6px] border-slate-800">
             
             {/* HUD Overlays */}
             <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Radio size={12} className={isConnected || simulatedFrame ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                      <span className="text-[10px] font-mono font-bold text-white uppercase">
                        {simulatedFrame ? 'SIM_MODE' : isConnected ? 'LIVE_LINK' : 'NO_LINK'}
                      </span>
                   </div>
                   {simulatedFrame && (
                      <button onClick={() => setSimulatedFrame(null)} className="pointer-events-auto bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition">
                        <X size={14} />
                      </button>
                   )}
                </div>

                <div className="flex justify-between items-end text-white/70 font-mono text-[10px]">
                    <div className="space-y-1">
                       <p>LAT: 28.7041° N</p>
                       <p>LON: 77.1025° E</p>
                    </div>
                    <div className="text-right space-y-1">
                       <p>ALT: 1450 FT</p>
                       <p>BAT: 84%</p>
                    </div>
                </div>
             </div>

             {/* Scan Line Animation */}
             {(simLoading || isConnected) && <div className="scan-line"></div>}

             {/* Content */}
             <div className="w-full h-full bg-black relative">
               {simLoading ? (
                  <div className="h-full flex flex-col items-center justify-center">
                     <RefreshCw className="text-orange-500 animate-spin mb-2" size={32} />
                     <p className="text-orange-500 font-mono text-xs uppercase blink">Processing YOLO...</p>
                  </div>
               ) : displayFrame ? (
                 <img src={displayFrame} className="w-full h-full object-contain" alt="Drone Feed" />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-700">
                    <Plane size={48} className="mb-4 opacity-50" />
                    <p className="font-mono text-xs uppercase tracking-widest">Awaiting Uplink</p>
                 </div>
               )}
             </div>
          </motion.div>

          {/* 📊 CARD 3: ANALYTICS (Using DEMO DATA) */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex-1 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BarChart3 size={18}/></div>
                   <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Threat Analysis</h3>
                </div>
                <Activity size={18} className="text-slate-300" />
             </div>

             <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={DEMO_STATS}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12, fontWeight:600, fill:'#94a3b8'}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                      <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40} animationDuration={1500}>
                        {DEMO_STATS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* 📤 CARD 4: UPLOAD */}
          <motion.div variants={itemVariants} className="bg-orange-50 p-1 rounded-[2rem] border border-orange-100">
             <label className="flex items-center justify-between w-full p-4 bg-white rounded-[1.7rem] cursor-pointer hover:bg-orange-50/50 transition-colors group">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                      <Upload size={18} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">Upload Drone Data</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Run Simulation</p>
                   </div>
                </div>
                <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
                <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
                   <span className="text-orange-500 font-bold text-lg">+</span>
                </div>
             </label>
          </motion.div>

        </section>
      </motion.main>
    </div>
  )
}