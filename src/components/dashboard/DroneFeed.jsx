import { motion } from 'framer-motion'
import { Radio, X, Loader2, Plane } from 'lucide-react'

export default function DroneFeed({ simulatedFrame, simLoading, setSimulatedFrame, variants }) {
  return (
    <motion.div variants={variants} className="bg-black rounded-[2rem] h-[200px] md:h-[250px] relative overflow-hidden shadow-2xl border-[4px] border-slate-800 shrink-0">
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
  )
}