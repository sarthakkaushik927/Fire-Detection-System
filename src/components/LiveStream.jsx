import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, WifiOff, Activity, Disc, 
  Maximize, Minimize, Video, Battery, 
  Signal, Navigation, Server
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useDroneStream } from '../hooks/useDroneStream'


const WEBSOCKET_URL = "wss://fire.anurag11.me/api/streamFireImage/ws_fire_image" 

const LiveStream = () => {
  const { theme } = useTheme()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  

  const { frame, isConnected } = useDroneStream(WEBSOCKET_URL)


  const pageVariants = { 
    hidden: { opacity: 0, scale: 0.98 }, 
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } 
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        setIsFullscreen(true)
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }
  }

  return (
    <motion.main 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6 min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
        
        
        <div className="lg:col-span-9 flex flex-col gap-4">
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                        <Video className="text-red-600 animate-pulse" /> Live Surveillance
                    </h1>
                    <p className="text-xs font-mono font-bold text-slate-400">FEED ID: ALPHA-9 • ENCRYPTED: AES-256</p>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${isRecording ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-white/10'}`}
                     >
                        <Disc size={16} className={isRecording ? "animate-spin" : ""} /> {isRecording ? "REC 00:12" : "Record"}
                     </button>
                     <button 
                        onClick={toggleFullscreen}
                        className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
                     >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                     </button>
                </div>
            </div>

           
            <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-300 dark:border-white/10 group">
                
                
                {isConnected && frame ? (
                    <img src={frame} alt="Live Stream" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <WifiOff size={64} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-500">Signal Lost</h3>
                        <p className="text-xs font-mono mt-2 animate-pulse">Searching for Uplink...</p>
                    </div>
                )}

                
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                 
                    <div className="flex justify-between items-start">
                        <div className="bg-red-600/90 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest backdrop-blur">
                            LIVE
                        </div>
                        <div className="flex flex-col items-end text-green-500 font-mono text-xs text-shadow-sm">
                            <span>FPS: 30</span>
                            <span>ISO: AUTO</span>
                        </div>
                    </div>

                  
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-60 transition-opacity">
                         <div className="w-12 h-12 border-2 border-white/50 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                         </div>
                    </div>

                    
                    <div className="flex justify-between items-end">
                        <div className="text-white/70 font-mono text-[10px]">
                            LAT: 35.1691 N<br/>
                            LNG: 138.7189 E
                        </div>
                        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
                             <span className="text-[10px] font-bold text-white uppercase">{isConnected ? "Online" : "Offline"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       
        <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">Telemetry</h2>
            
           
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${isConnected ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                        <Server size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Server Uplink</h3>
                        <p className="text-[10px] font-mono text-slate-500">{isConnected ? "Connected (12ms)" : "Disconnected"}</p>
                    </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isConnected ? "100%" : "5%" }}
                        className={`h-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                    />
                </div>
            </div>

          
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Signal Strength</h3>
                    <Wifi size={16} className="text-blue-500" />
                 </div>
                 <div className="text-3xl font-black text-slate-800 dark:text-white">
                    92<span className="text-sm text-slate-400 font-medium">%</span>
                 </div>
                 <div className="flex gap-1 mt-3">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-sm ${i <= 4 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    ))}
                 </div>
            </div>

          
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-4 overflow-y-auto">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">System Logs</h3>
                <div className="space-y-3">
                    {[
                        { time: '10:42:05', msg: 'Video Stream Initialized', type: 'info' },
                        { time: '10:42:08', msg: 'Bitrate Stable: 4500kbps', type: 'success' },
                        { time: '10:42:15', msg: 'Object Detection: Enabled', type: 'info' },
                        { time: '10:43:00', msg: 'Packet Loss: 0.01%', type: 'warning' },
                        { time: '10:43:22', msg: 'Latency Check: 12ms', type: 'success' },
                    ].map((log, i) => (
                        <div key={i} className="flex gap-3 text-[10px] border-b border-slate-100 dark:border-white/5 pb-2 last:border-0">
                            <span className="font-mono text-slate-400">{log.time}</span>
                            <span className={`font-bold ${
                                log.type === 'success' ? 'text-green-500' : 
                                log.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                            }`}>{log.msg}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </motion.main>
  )
}

export default LiveStream