import React from 'react'
import { MapPin } from 'lucide-react'
import { REGIONS } from '../../utils/config'
import { useTheme } from '../../context/ThemeContext'

export default function ControlBar({ selectedCountry, setSelectedCountry, selectedState, setSelectedState, riskCount }) {
 
  const { theme } = useTheme()

  return (
    <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
         <MapPin size={20} className="text-red-500" />
         <span className="font-bold uppercase text-sm tracking-widest">Target Region:</span>
      </div>
      
      <select 
        value={selectedCountry} 
        onChange={(e) => setSelectedCountry(e.target.value)} 
        className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
      >
        {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      <select 
        value={selectedState} 
        onChange={(e) => setSelectedState(e.target.value)} 
        className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold uppercase text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
      >
        {REGIONS[selectedCountry]?.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      
      <div className="flex items-center gap-2 md:ml-4 w-full md:w-auto justify-center md:justify-start">
         <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-500/10 px-3 py-1 rounded-full animate-pulse border border-red-200 dark:border-red-500/20">
            {riskCount} Sat. Anomalies
         </span>
      </div>
    </div>
  )
}