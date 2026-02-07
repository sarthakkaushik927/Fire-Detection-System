import React from 'react'
import { 
  Crosshair, Navigation, Signal, Battery, 
  Wifi, Wind, Lock, PlayCircle, StopCircle, Clipboard,
  MapPin, X
} from 'lucide-react'
import StatBox from './StatBox'

const DroneSidebar = ({ 
  isSidebarOpen, setSidebarOpen, status, 
  baseLat, setBaseLat, baseLng, setBaseLng,
  targetLat, setTargetLat, targetLng, setTargetLng,
  telemetry, isLocked, 
  setFromMap, handlePaste, handleLockTarget, handleDeploy, handleAbort
}) => {
  return (
    <div className={`
        absolute md:relative inset-y-0 left-0 w-full md:w-80 bg-slate-900 border-r border-white/10 flex flex-col z-40 transition-transform duration-300 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      
      <div className="p-4 border-b border-white/10 bg-slate-900 pt-16 md:pt-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Crosshair className="text-red-500" /> Command
          </h2>
          <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'AUTOPILOT' ? 'bg-blue-500 animate-pulse' : status === 'ARRIVED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs font-mono text-slate-400">{status}</span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500"><X size={20}/></button>
      </div>

      <div className="p-4 space-y-6 border-b border-white/10 overflow-y-auto">
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-[10px] uppercase font-bold text-slate-500">Base Station</label>
             <div className="flex gap-1">
               <button onClick={() => setFromMap('BASE')} className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-colors" title="Set from Map Center"><MapPin size={14}/></button>
               <button onClick={() => handlePaste('BASE')} className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-colors" title="Paste"><Clipboard size={14}/></button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input type="text" value={baseLat} onChange={e => setBaseLat(e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono" placeholder="Lat"/>
              <input type="text" value={baseLng} onChange={e => setBaseLng(e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono" placeholder="Lng"/>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-[10px] uppercase font-bold text-slate-500">Destination</label>
             <div className="flex gap-1">
               <button onClick={() => setFromMap('TARGET')} className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-colors" title="Set from Map Center"><Crosshair size={14}/></button>
               <button onClick={() => handlePaste('TARGET')} className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-colors" title="Paste"><Clipboard size={14}/></button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input type="text" value={targetLat} onChange={e => setTargetLat(e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono" placeholder="Lat"/>
              <input type="text" value={targetLng} onChange={e => setTargetLng(e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-2 text-xs font-mono" placeholder="Lng"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleLockTarget}
            className={`flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all
              ${isLocked ? 'bg-green-900/30 text-green-400 border border-green-500/50' : 'bg-slate-800 text-white border border-white/10'}`}
          >
            <Lock size={14} /> {isLocked ? 'Locked' : 'Lock'}
          </button>
          
          {status === 'AUTOPILOT' ? (
               <button onClick={handleAbort} className="flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-lg animate-pulse">
                 <StopCircle size={14} /> ABORT
               </button>
          ) : (
              <button onClick={handleDeploy} disabled={!isLocked} className={`flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all ${isLocked ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                <PlayCircle size={14} /> Deploy
              </button>
          )}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto flex-1 content-start">
         <StatBox icon={Navigation} label="ALT" val={`${telemetry.alt.toFixed(0)}m`} color="text-blue-400"/>
         <StatBox icon={Wind} label="SPD" val={`${telemetry.speed.toFixed(0)}km/h`} color="text-emerald-400"/>
         <StatBox icon={Battery} label="BAT" val={`${telemetry.battery}%`} color="text-green-400"/>
         <StatBox icon={Wifi} label="SIG" val={`${telemetry.signal}%`} color="text-white"/>
         <div className="col-span-2 bg-black/40 border border-white/5 p-3 rounded flex justify-between items-center mt-2">
            <span className="text-[10px] text-slate-500 font-bold">DIST TO TARGET</span>
            <span className="text-sm font-mono font-bold text-yellow-400">{telemetry.distanceRemaining}m</span>
         </div>
      </div>
    </div>
  )
}

export default DroneSidebar