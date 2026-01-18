import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../Supabase/supabase' 
import toast, { Toaster } from 'react-hot-toast'

import { 
  Map as MapIcon, Plane, Radio, RefreshCw, Upload, 
  X, Layers, Download, Loader2, Cloud, Wind, Droplets, MapPin, 
  User, CheckCircle2, XCircle, BellRing, Save
} from 'lucide-react'

// 🟢 Backend Proxy for Python AI
const BACKEND_PROXY = "https://keryptonite-8k3u.vercel.app"

const REGIONS = {
  india: ["up", "mp", "maharashtra"]
}

// --- WEATHER WIDGET ---
function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kn")
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(e => console.error("Weather Error:", e))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse w-full mb-6"></div>

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-[2rem] flex justify-between items-center shadow-xl shadow-blue-500/20 mb-6 relative overflow-hidden">
      <div className="relative z-10 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm"><Cloud size={28} className="text-white"/></div>
        <div>
           <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Sector Conditions</p>
           <p className="text-3xl font-black tracking-tight">{weather?.temperature_2m || '--'}°C</p>
        </div>
      </div>
      <div className="relative z-10 flex gap-6 text-sm font-bold border-l border-white/20 pl-6">
        <div className="flex flex-col items-center gap-1"><Wind size={18} className="opacity-70"/><span>{weather?.wind_speed_10m || 0} KN</span></div>
        <div className="flex flex-col items-center gap-1"><Droplets size={18} className="opacity-70"/><span>{weather?.relative_humidity_2m || 0}%</span></div>
      </div>
    </div>
  )
}

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const navigate = useNavigate()
  
  // Region State
  const [selectedCountry, setSelectedCountry] = useState("india")
  const [selectedState, setSelectedState] = useState("up")

  // Data States
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  const [highRiskPoints, setHighRiskPoints] = useState([]) 
  const [riskLoading, setRiskLoading] = useState(false)

  // Simulation & Reports
  const [simulatedFrame, setSimulatedFrame] = useState(null)
  const [simLoading, setSimLoading] = useState(false)
  const [userReports, setUserReports] = useState([])

  // 1. FETCH MAP
  const fetchMap = async () => {
    setMapLoading(true)
    try {
      const res = await fetch(`${BACKEND_PROXY}/api/fires/get_locations`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState, day_range: 3 })
      })
      const data = await res.text()
      setMapHtml(data)
    } catch (e) { 
        console.error("Map Error:", e) 
        toast.error("Map Data Offline")
    }
    finally { setMapLoading(false) }
  }

  // 2. FETCH RISK POINTS
  const fetchHighRiskData = async () => {
    setRiskLoading(true)
    try {
      const res = await fetch(`${BACKEND_PROXY}/api/fires/get_hight_regions_area`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState, day_range: 3 })
      })
      const result = await res.json()
      
      let parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data
      if (parsedData && parsedData.latitude) {
          const rows = Object.keys(parsedData.latitude).map(key => ({
            lat: parsedData.latitude[key],
            lon: parsedData.longitude?.[key] || 0
          }))
          setHighRiskPoints(rows)
      }
    } catch (e) { 
        console.error("Risk Data Error", e)
    } finally { 
        setRiskLoading(false) 
    }
  }

  // 3. REALTIME REPORTS LISTENER
  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase.from('reports').select('*').eq('status', 'pending').order('created_at', { ascending: false })
      if(data) setUserReports(data)
    }
    fetchReports()

    const channel = supabase.channel('public:reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        if (payload.eventType === 'INSERT') {
            setUserReports(prev => [payload.new, ...prev])
            toast("New Civilian Report", { icon: '📡' })
        } else if (payload.eventType === 'UPDATE') {
            if (payload.new.status !== 'pending') {
                setUserReports(prev => prev.filter(r => r.id !== payload.new.id))
            }
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Auto-Refresh Map/Data on Region Change
  useEffect(() => {
    fetchHighRiskData()
    fetchMap()
  }, [selectedCountry, selectedState])

  // 🟢 4. SIMULATION UPLOAD -> PYTHON -> SUPABASE STORAGE -> DB
  const handleSimulationUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSimLoading(true)
    
    const toastId = toast.loading("Processing Intelligence...")

    const formData = new FormData()
    formData.append('image', file) 
    
    try {
      // A. Send to Python Backend
      const response = await fetch(`${BACKEND_PROXY}/api/fires/draw_boxes_fire`, { 
          method: 'POST', 
          body: formData 
      })
      const result = await response.json()
      
      if (result.image_base64) {
         // B. Convert Base64 back to Blob for Upload
         const base64Response = await fetch(`data:image/jpeg;base64,${result.image_base64}`)
         const blob = await base64Response.blob()
         const fileName = `simulation_${Date.now()}.jpg`

         // Set Local Preview
         setSimulatedFrame(URL.createObjectURL(blob))

         // C. Upload to Supabase Storage
         const { error: uploadError } = await supabase.storage
            .from('fire-reports') 
            .upload(fileName, blob)
         
         if (uploadError) throw new Error("Storage Upload Failed")

         // D. Get Public URL
         const { data: publicUrlData } = supabase.storage
            .from('fire-reports')
            .getPublicUrl(fileName)

         // E. Insert into Database (Resources Tab)
         const { error: dbError } = await supabase.from('downloads').insert([{
             image_url: publicUrlData.publicUrl,
             type: 'simulation'
         }])

         if (dbError) throw new Error("DB Record Failed")

         toast.success("Analysis Synced to Cloud", { id: toastId })
      } else {
         toast("No threats detected.", { id: toastId, icon: '✅' })
      }
    } catch (err) { 
        console.error(err)
        toast.error("Process Failed: " + err.message, { id: toastId }) 
    } 
    finally { setSimLoading(false) }
  }

  // Actions
  const deployDrone = (targetCoords) => {
    const target = targetCoords || highRiskPoints[0]
    if (!target && highRiskPoints.length === 0) return toast.error("No active targets")
    toast.success("Drone Deployment Initiated")
    navigate('/drone-control', { state: { target: target, allTargets: highRiskPoints } })
  }

  const handleVerify = async (report) => {
    await supabase.from('reports').update({ status: 'verified' }).eq('id', report.id)
    toast.success("Report Verified. Deploying.")
    deployDrone({ lat: report.latitude, lon: report.longitude })
  }

  const handleDismiss = async (id) => {
    await supabase.from('reports').update({ status: 'false_alarm' }).eq('id', id)
    toast("Report Dismissed", { icon: '🗑️' })
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 pt-6"
    >
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      {/* 🌍 CONTROL BAR */}
      <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 transition-colors">
        <div className="flex items-center gap-2 text-slate-500">
           <MapPin size={20} className="text-red-500" />
           <span className="font-bold uppercase text-sm tracking-widest">Target Region:</span>
        </div>
        
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none">
          {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none">
          {REGIONS[selectedCountry]?.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <div className="flex items-center gap-2 md:ml-4 w-full md:w-auto justify-center md:justify-start">
           <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-500/10 px-3 py-1 rounded-full animate-pulse">{highRiskPoints.length} Sat. Anomalies</span>
        </div>
      </div>

      {/* 🗺️ LEFT COLUMN: MAP */}
      <motion.section variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden relative group h-96 md:h-[600px] lg:h-[800px] transition-colors duration-300">
           <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10 bg-white/90 dark:bg-slate-950/80 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 md:gap-3 border border-slate-200 dark:border-white/10 shadow-sm">
              <MapIcon className="text-blue-600 dark:text-blue-500 w-3 h-3 md:w-[18px] md:h-[18px]" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Live Feed: {selectedState}, {selectedCountry}</span>
           </div>

           <motion.button 
             whileHover={{ scale: 1.05 }} 
             whileTap={{ scale: 0.95 }} 
             onClick={fetchMap} 
             className="absolute top-3 right-3 md:top-6 md:right-6 z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 md:px-5 md:py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
           >
              <RefreshCw size={16} className={mapLoading ? 'animate-spin' : ''} />
              <span className="hidden md:inline">{mapLoading ? 'Syncing...' : 'Refresh Map'}</span>
           </motion.button>

           <div className="w-full h-full bg-slate-100 dark:bg-slate-950 relative transition-colors duration-300">
             {mapHtml ? (
               <iframe srcDoc={mapHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600"><Layers size={80} strokeWidth={1} /><p className="mt-4 font-black uppercase tracking-widest text-sm">Awaiting Data Uplink</p></div>
             )}
           </div>
        </div>
      </motion.section>

      {/* 🎥 RIGHT COLUMN: DRONE & ANALYTICS */}
      <section className="lg:col-span-4 flex flex-col gap-6 h-full order-1 lg:order-2">
        <WeatherWidget />
        
        {/* DRONE FEED */}
        <motion.div variants={itemVariants} className="bg-black rounded-[2rem] h-[200px] md:h-[250px] relative overflow-hidden shadow-2xl border-[4px] border-slate-800 shrink-0">
           <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                 <Radio size={12} className={simulatedFrame ? 'text-green-500 animate-pulse' : 'text-slate-500'} />
                 <span className="text-[10px] font-mono font-bold text-white uppercase">{simulatedFrame ? 'SIM_MODE' : 'OFFLINE'}</span>
              </div>
              {simulatedFrame && (
                  <button onClick={() => setSimulatedFrame(null)} className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md transition shadow-lg"><X size={14} /></button>
              )}
           </div>
           
           {simLoading && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80"><Loader2 className="text-orange-500 animate-spin" size={32} /></div>}
           
           <div className="w-full h-full bg-black relative flex items-center justify-center">
             {simulatedFrame ? <img src={simulatedFrame} className="w-full h-full object-contain bg-black" alt="Feed" /> : <div className="text-center text-slate-800"><Plane size={48} className="mb-4 opacity-50 mx-auto" /><p className="font-mono text-xs uppercase tracking-widest">No Signal</p></div>}
           </div>
        </motion.div>

        {/* REPORTS FEED */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/10 flex-1 flex flex-col min-h-[400px] lg:min-h-0 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
            
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-xs md:text-sm uppercase tracking-wide flex items-center gap-2">
                    <User size={16} className="text-orange-500"/> Civilian Reports
                </h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${userReports.length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                    {userReports.length} LIVE
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[300px] lg:max-h-none">
                {userReports.length > 0 ? userReports.map((report) => (
                    <motion.div 
                        key={report.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-white/5 relative group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-mono text-slate-400">{new Date(report.created_at).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-white/5 px-2 py-1 rounded">
                                <MapPin size={10} /> {report.latitude.toFixed(3)}, {report.longitude.toFixed(3)}
                            </div>
                        </div>

                        {report.image_url && (
                            <div className="h-32 w-full rounded-lg overflow-hidden mb-3 bg-black relative">
                                <img src={report.image_url} className="w-full h-full object-cover" alt="Evidence" />
                            </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                            {report.description || "Suspicious smoke detected..."}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleVerify(report)} className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                                <CheckCircle2 size={12} /> Deploy
                            </button>
                            <button onClick={() => handleDismiss(report.id)} className="bg-slate-200 dark:bg-white/10 hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                                <XCircle size={12} /> Dismiss
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-12 opacity-50">
                        <BellRing size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-xs font-bold uppercase text-slate-400">All Sectors Clear</p>
                    </div>
                )}
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                <label className="flex items-center justify-center p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 hover:text-orange-500 transition text-slate-400 dark:text-slate-500 text-xs font-bold uppercase gap-2 group bg-slate-50 dark:bg-slate-900/50">
                    <Upload size={14} className="group-hover:scale-110 transition-transform"/> 
                    {simLoading ? "Analyzing..." : "Upload Satellite Data"}
                    <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
                </label>
            </div>
        </motion.div>
      </section>
    </motion.main>
  )
}