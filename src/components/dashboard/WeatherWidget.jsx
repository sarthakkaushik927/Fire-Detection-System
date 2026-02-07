import { useState, useEffect } from 'react'
import { Cloud, Wind, Droplets } from 'lucide-react'

export default function WeatherWidget() {
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