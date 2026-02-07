import React from 'react'
import { motion } from 'framer-motion'
import { Flame, AlertTriangle, Navigation, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Helper: Consistent Sector Naming
const generateSectorName = (lat, lon) => {
  const zones = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'ZULU', 'OMEGA', 'TITAN', 'NOVA'];
  const index = Math.floor((Math.abs(lat) + Math.abs(lon)) * 100) % zones.length;
  const subSector = Math.floor((Math.abs(lat - lon) * 1000) % 99) + 1;
  return `${zones[index]}-${subSector}`;
}

export default function HighRiskRegions({ highRiskPoints, loading }) {
  const navigate = useNavigate()

  const handleDeploy = (lat, lon) => {
    navigate('/drone-control', { state: { lat, lon } })
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-lg border border-slate-200 dark:border-white/10 flex-1 flex flex-col min-h-[400px] overflow-hidden relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="font-black text-slate-800 dark:text-white text-lg uppercase tracking-wide flex items-center gap-2">
                <Flame className="text-red-500 fill-red-500 animate-pulse" size={20}/> 
                High Risk Zones
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Thermal Anomalies Detected</p>
        </div>
        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-black ">
            {highRiskPoints.length} DETECTED
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold uppercase animate-pulse">Scanning Satellite Data...</span>
            </div>
        ) : highRiskPoints.length > 0 ? (
            highRiskPoints.map((point, index) => {
                const sectorName = generateSectorName(point.lat, point.lon)
                
                return (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-slate-50 dark:bg-slate-950/50 hover:bg-red-50 dark:hover:bg-red-900/10 border border-slate-200 dark:border-white/5 hover:border-red-500/30 p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => handleDeploy(point.lat, point.lon)}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 dark:bg-red-500/20 p-2.5 rounded-lg text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                                        SECTOR {sectorName}
                                    </h4>
                                    <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} /> {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-white/5 group-hover:border-blue-500/50 transition-colors">
                                <Navigation size={16} className="text-blue-500 group-hover:-rotate-45 transition-transform duration-300" />
                            </div>
                        </div>
                        
                        {/* Hover Effect Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-red-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </motion.div>
                )
            })
        ) : (
            <div className="text-center py-12 opacity-50 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <Flame size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold uppercase text-slate-500">No Thermal Anomalies</p>
                <p className="text-[10px] text-slate-400">Sector Clear</p>
            </div>
        )}
      </div>
    </div>
  )
}