import { useState } from 'react'
import { supabase } from '../Supabase/supabase'
import { useDroneStream } from '../hooks/useDroneStream'
import { Map as MapIcon, Plane, Radio, RefreshCw, Power, ShieldAlert, Upload, X } from 'lucide-react'

const BACKEND_URL = "http://127.0.0.1:8000"
const WS_URL = "ws://127.0.0.1:8000/ws/drone"

export default function Dashboard({ session }) {
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  
  // Drone Simulation State
  const { frame: liveFrame, isConnected } = useDroneStream(WS_URL)
  const [simulatedFrame, setSimulatedFrame] = useState(null)
  const [simLoading, setSimLoading] = useState(false)

  // Fetch Map
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
    } catch (e) { alert("Backend Offline") }
    finally { setMapLoading(false) }
  }

  // Simulate Drone Image Upload
  const handleSimulationUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSimLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${BACKEND_URL}/draw_boxes_fire`, {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      if (result.data) {
        setSimulatedFrame(`data:image/jpeg;base64,${result.data}`)
      }
    } catch (err) {
      alert("Simulation failed. Check backend console.")
    } finally {
      setSimLoading(false)
    }
  }

  const displayFrame = simulatedFrame || liveFrame

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-600" />
          <h2 className="font-black text-xl tracking-tighter italic">FIREWATCH PRO</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {session.user.email}
          </span>
          <button onClick={() => supabase.auth.signOut()} className="text-slate-400 hover:text-red-600 transition">
            <Power size={20} />
          </button>
        </div>
      </header>

      <main className="p-8 grid grid-cols-12 gap-8 max-w-[1800px] mx-auto">
        
        {/* --- LEFT: SATELLITE MAP --- */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] shadow-xl border border-slate-100 h-[750px] flex flex-col overflow-hidden">
          <div className="p-8 flex justify-between items-center">
            <h3 className="font-black text-slate-800 flex items-center gap-3">
              <MapIcon className="text-blue-500" /> SATELLITE MONITORING
            </h3>
            <button onClick={fetchMap} className="bg-blue-600 text-white px-6 py-2 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition">
              <RefreshCw size={16} className={mapLoading ? 'animate-spin' : ''} /> Update Map
            </button>
          </div>
          <div className="flex-1 bg-slate-50">
            {mapHtml ? (
              <iframe srcDoc={mapHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <MapIcon size={80} strokeWidth={1} />
                <p className="font-bold mt-4 uppercase tracking-widest">Awaiting NASA Data</p>
              </div>
            )}
          </div>
        </section>

        {/* --- RIGHT: DRONE SIMULATION & FEED --- */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          
          <div className="bg-slate-950 rounded-[3rem] h-[500px] overflow-hidden relative border-8 border-slate-900 shadow-2xl group">
            
            <div className="absolute top-8 left-8 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Radio size={14} className={isConnected || simulatedFrame ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
              <span className="text-[10px] font-black text-white tracking-widest uppercase">
                {simulatedFrame ? 'SIMULATION MODE' : isConnected ? 'LIVE FEED' : 'OFFLINE'}
              </span>
            </div>

            {simulatedFrame && (
              <button 
                onClick={() => setSimulatedFrame(null)}
                className="absolute top-8 right-8 z-20 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                title="Exit Simulation Mode"
              >
                <X size={16} />
              </button>
            )}
            
            {/* The Image/Video Display */}
            {simLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                 <RefreshCw className="animate-spin mb-4 text-orange-500" size={48} />
                 <p className="text-xs font-black uppercase tracking-widest">Processing YOLO...</p>
               </div>
            ) : displayFrame ? (
              // 🔴 FIX APPLIED HERE: object-contain with black background
              <img 
                src={displayFrame} 
                className="w-full h-full object-contain bg-black" 
                alt="Drone View" 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-800">
                <Plane size={64} className="mb-4 animate-bounce" />
                <p className="text-xs font-black uppercase tracking-widest">No Signal</p>
              </div>
            )}

            {(displayFrame) && (
                <div className="absolute bottom-6 left-6 text-white/80 font-mono text-xs space-y-1">
                    <p>ALT: {simulatedFrame ? '120m (SIM)' : '120m'}</p>
                    <p>BAT: 78%</p>
                </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Upload size={18} className="text-orange-500"/> Simulation Control
            </h4>
            <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition group">
                <div className="flex items-center gap-3 text-slate-400 group-hover:text-orange-600">
                    <Plane size={20} />
                    <span className="font-bold text-sm">Upload Drone Image</span>
                </div>
                <input type="file" className="hidden" onChange={handleSimulationUpload} accept="image/*" />
            </label>
            <p className="text-[10px] text-slate-400 mt-3 text-center">
                This uploads an image to the YOLO model to simulate a live drone capture.
            </p>
          </div>

        </section>
      </main>
    </div>
  )
}