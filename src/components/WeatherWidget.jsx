import React, { useEffect, useState } from 'react'
import { Cloud, Wind, Droplets, Loader2 } from 'lucide-react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Native Fetch - No Axios needed
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kn"
        )
        const data = await res.json()
        setWeather(data.current)
      } catch (e) { 
        console.error("Weather Widget Error:", e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [])

  if (error) return null // Hide widget silently if it fails
  
  if (loading) return (
    <div className="bg-blue-600/20 h-24 rounded-2xl animate-pulse flex items-center justify-center">
       <Loader2 className="animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-[2rem] flex justify-between items-center shadow-xl shadow-blue-500/20 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <Cloud size={28} className="text-white"/>
        </div>
        <div>
           <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Sector Conditions</p>
           <p className="text-3xl font-black tracking-tight">{weather?.temperature_2m}°C</p>
        </div>
      </div>
      
      <div className="flex gap-6 text-sm font-bold border-l border-white/20 pl-6">
        <div className="flex flex-col items-center gap-1">
           <Wind size={18} className="opacity-70"/>
           <span>{weather?.wind_speed_10m} KN</span>
        </div>
        <div className="flex flex-col items-center gap-1">
           <Droplets size={18} className="opacity-70"/>
           <span>{weather?.relative_humidity_2m}%</span>
        </div>
      </div>
    </div>
  )
}