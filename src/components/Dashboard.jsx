import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'


import { BACKEND_PROXY } from '../utils/config'


import WeatherWidget from './dashboard/WeatherWidget'
import ControlBar from './dashboard/ControlBar'
import MapViewer from './dashboard/MapViewer'
import HighRiskRegions from './dashboard/HighRiskRegions' 


export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState("india")
  const [selectedState, setSelectedState] = useState("up")

  
  const [mapHtml, setMapHtml] = useState('')
  const [mapLoading, setMapLoading] = useState(false)
  const [highRiskPoints, setHighRiskPoints] = useState([]) 
  const [riskLoading, setRiskLoading] = useState(false)

  const getCacheKey = (type) => `fire_watch_${type}_${selectedCountry}_${selectedState}`

  const fetchMap = async (forceRefresh = false) => {
    const cacheKey = getCacheKey('map')
    
    if (!forceRefresh) {
        const cachedMap = localStorage.getItem(cacheKey)
        if (cachedMap) {
            setMapHtml(cachedMap)
            return 
        }
    }

    setMapLoading(true)
    try {
      const res = await fetch(`${BACKEND_PROXY}/api/fires/get_locations`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: selectedCountry, state: selectedState, day_range: 3 })
      })
      const data = await res.text()
      
      try {
          localStorage.setItem(cacheKey, data)
      } catch (err) {
          console.warn("Map Cache Full:", err)
      }

      setMapHtml(data)
      if (forceRefresh) toast.success("Map Updated Live")
    } catch (e) { 
        console.error("Map Error:", e) 
        toast.error("Map Sync Failed")
    }
    finally { setMapLoading(false) }
  }

 
  const fetchHighRiskData = async (forceRefresh = false) => {
    const cacheKey = getCacheKey('risk')

   
    if (!forceRefresh) {
        const cachedRisk = localStorage.getItem(cacheKey)
        if (cachedRisk) {
            setHighRiskPoints(JSON.parse(cachedRisk))
            return 
        }
    }

    setRiskLoading(true)
    try {
      const res = await fetch(`${BACKEND_PROXY}/api/fires/get_hight_regions_area`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            country: selectedCountry, 
            state: selectedState, 
            source: "VIIRS_SNPP_NRT", 
            day_range: 3 
        })
      })
      
      const result = await res.json()
      
      
      let parsedData = result.data;
      if (typeof result.data === 'string') {
          try {
              parsedData = JSON.parse(result.data);
          } catch (e) {
              console.error("JSON Parse Error", e);
          }
      }

      let rows = [];
      
      if (Array.isArray(parsedData)) {
          rows = parsedData.map(item => ({
              lat: Number(item.latitude),
              lon: Number(item.longitude)
          }));
      } 
      else if (parsedData && parsedData.latitude) {
          rows = Object.keys(parsedData.latitude).map(key => ({
              lat: Number(parsedData.latitude[key]),
              lon: Number(parsedData.longitude?.[key] || 0)
          }));
      }

      
      localStorage.setItem(cacheKey, JSON.stringify(rows))
      
      setHighRiskPoints(rows)
      if (forceRefresh) toast.success("Risk Data Updated")

    } catch (e) { 
        console.error("Risk Data Error", e)
        setHighRiskPoints([])
    } finally { 
        setRiskLoading(false) 
    }
  }


  const handleManualRefresh = () => {
      fetchMap(true)
      fetchHighRiskData(true)
  }

  useEffect(() => {
    fetchHighRiskData(false)
    fetchMap(false)
  }, [selectedCountry, selectedState])

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    
      className="max-w-[1800px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-3 pb-6 pt-0 lg:max-h-[120vh] min-h-screen overflow-y-auto lg:overflow-hidden"
    >
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <ControlBar 
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        riskCount={highRiskPoints.length}
      />


      <MapViewer 
        mapHtml={mapHtml}
        mapLoading={mapLoading}
        fetchMap={handleManualRefresh}
        selectedState={selectedState}
        selectedCountry={selectedCountry}
        variants={itemVariants}
        className="lg:col-span-8 order-1 h-[500px] lg:h-full" 
      />

    
      <section className="lg:col-span-4 flex flex-col gap-0 h-auto lg:h-full order-2 lg:overflow-hidden">
        <motion.div variants={itemVariants} className="shrink-0">
            
            <WeatherWidget />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 lg:overflow-hidden">
            <HighRiskRegions 
                highRiskPoints={highRiskPoints} 
                loading={riskLoading} 
            />
        </motion.div>
      </section>

    </motion.main>
  )
} 