import { motion } from 'framer-motion'
import { Map as MapIcon, RefreshCw, Layers } from 'lucide-react'

export default function MapViewer({ mapHtml, mapLoading, fetchMap, selectedState, selectedCountry, variants }) {
  return (
    <motion.section variants={variants} className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
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
             <iframe srcDoc={mapHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="Fire Map" />
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600"><Layers size={80} strokeWidth={1} /><p className="mt-4 font-black uppercase tracking-widest text-sm">Awaiting Data Uplink</p></div>
           )}
         </div>
      </div>
    </motion.section>
  )
}