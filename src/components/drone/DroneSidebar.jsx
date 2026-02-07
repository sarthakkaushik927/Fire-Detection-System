import React from 'react'
import { 
  Crosshair, Navigation, Signal, Battery, 
  Wifi, Wind, Lock, PlayCircle, StopCircle, Clipboard,
  MapPin, X
} from 'lucide-react'
import StatBox from './StatBox'
import { useTheme } from '../../context/ThemeContext'

const DroneSidebar = ({ 
  isSidebarOpen, setSidebarOpen, status, 
  baseLat, setBaseLat, baseLng, setBaseLng,
  targetLat, setTargetLat, targetLng, setTargetLng,
  telemetry, isLocked, 
  setFromMap, handlePaste, handleLockTarget, handleDeploy, handleAbort
}) => {
  const { theme } = useTheme()

  return (
    <div key={theme} className={`
        absolute md:relative inset-y-0 left-0 w-full md:w-80 
        bg-slate-50 dark:bg-slate-900 
        border-r border-slate-200 dark:border-white/10 
        flex flex-col z-40 transition-transform duration-300 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 pt-16 md:pt-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-slate-800 dark:text-white">
              <Crosshair className="text-rose-600 dark:text-rose-500" /> Command
          </h2>
          <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'AUTOPILOT' ? 'bg-blue-600 animate-pulse' : status === 'ARRIVED' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{status}</span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"><X size={20}/></button>
      </div>

      {/* Controls Section */}
      <div className="p-4 space-y-6 border-b border-slate-200 dark:border-white/10 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-transparent">
        
        {/* Base Station Inputs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-[10px] uppercase font-black tracking-wider text-slate-600 dark:text-slate-400">Base Station</label>
             <div className="flex gap-1">
               <button onClick={() => setFromMap('BASE')} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition-colors shadow-sm" title="Set from Map Center"><MapPin size={12}/></button>
               <button onClick={() => handlePaste('BASE')} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 transition-colors shadow-sm" title="Paste"><Clipboard size={12}/></button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                value={baseLat} 
                onChange={e => setBaseLat(e.target.value)} 
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                placeholder="Lat"
              />
              <input 
                type="text" 
                value={baseLng} 
                onChange={e => setBaseLng(e.target.value)} 
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                placeholder="Lng"
              />
          </div>
        </div>

        {/* Target Inputs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-[10px] uppercase font-black tracking-wider text-slate-600 dark:text-slate-400">Destination</label>
             <div className="flex gap-1">
               <button onClick={() => setFromMap('TARGET')} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-500 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-400 transition-colors shadow-sm" title="Set from Map Center"><Crosshair size={12}/></button>
               <button onClick={() => handlePaste('TARGET')} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-500 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-400 transition-colors shadow-sm" title="Paste"><Clipboard size={12}/></button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                value={targetLat} 
                onChange={e => setTargetLat(e.target.value)} 
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm" 
                placeholder="Lat"
              />
              <input 
                type="text" 
                value={targetLng} 
                onChange={e => setTargetLng(e.target.value)} 
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded px-3 py-2 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm" 
                placeholder="Lng"
              />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleLockTarget}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm
              ${isLocked 
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/50' 
                : 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-white/10 hover:bg-indigo-100 dark:hover:bg-slate-700'}`}
          >
            <Lock size={14} /> {isLocked ? 'Locked' : 'Lock'}
          </button>
          
          {status === 'AUTOPILOT' ? (
               <button onClick={handleAbort} className="flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 animate-pulse transition-colors">
                 <StopCircle size={14} /> ABORT
               </button>
          ) : (
              <button 
                onClick={handleDeploy} 
                disabled={!isLocked} 
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm
                  ${isLocked 
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02]' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-white/5'}`}
              >
                <PlayCircle size={14} /> Deploy
              </button>
          )}
        </div>
      </div>

      {/* Telemetry Stats Grid - 🟢 UPDATED COLORS FOR BETTER VISIBILITY */}
      <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto flex-1 content-start custom-scrollbar bg-slate-100 dark:bg-black/20">
         <StatBox icon={Navigation} label="ALT" val={`${telemetry.alt.toFixed(0)}m`} color="text-blue-800 dark:text-blue-400"/>
         <StatBox icon={Wind} label="SPD" val={`${telemetry.speed.toFixed(0)}km/h`} color="text-emerald-800 dark:text-emerald-400"/>
         <StatBox icon={Battery} label="BAT" val={`${telemetry.battery}%`} color="text-green-700 dark:text-green-400"/>
         <StatBox icon={Wifi} label="SIG" val={`${telemetry.signal}%`} color="text-indigo-800 dark:text-indigo-400"/>
         
         <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 rounded-xl flex justify-between items-center mt-2 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-black tracking-widest relative z-10">DIST TO TARGET</span>
            <span className="text-sm font-mono font-bold text-rose-600 dark:text-amber-400 relative z-10">{telemetry.distanceRemaining}m</span>
         </div>
      </div>
    </div>
  )
}

export default DroneSidebar