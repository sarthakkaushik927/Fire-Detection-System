import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Menu, X, Locate } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

// 🟢 IMPORTS
import { getDistance, calculateNewPos } from '../utils/geoUtils'
import DroneSidebar from './drone/DroneSidebar'
import VirtualJoysticks from './drone/VirtualJoysticks'

// Disable telemetry to stop console errors
mapboxgl.config.telemetry = false

const DroneController = () => {
  const location = useLocation()

  // --- STATE ---
  const [telemetry, setTelemetry] = useState({
    alt: 120, speed: 0, battery: 88, satellites: 14, signal: 92, distanceRemaining: 0
  })

  // Default Base Location
  const [baseLat, setBaseLat] = useState('35.1691')
  const [baseLng, setBaseLng] = useState('138.7189')
  
  // Target Location
  const [targetLat, setTargetLat] = useState('35.3397')
  const [targetLng, setTargetLng] = useState('138.7265')
  
  const [isLocked, setIsLocked] = useState(false)
  const [status, setStatus] = useState('IDLE')
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [cameraFollow, setCameraFollow] = useState(true)

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const animationFrameRef = useRef(null)
  const dronePosRef = useRef([138.7189, 35.1691])

  // 🟢 1. DEFINE LOCK LOGIC (This was missing in your code)
  const performLock = (tLat, tLng) => {
    if (!mapRef.current) return

    setIsLocked(true)
    setStatus('LOCKED')
    
    // Teleport Drone back to Base to start mission
    const start = [parseFloat(baseLng), parseFloat(baseLat)]
    dronePosRef.current = start
    updateDroneMarker(start)
    
    // Move Camera
    mapRef.current.flyTo({ center: start, zoom: 14, pitch: 70 })

    // Draw Route Line
    const end = [parseFloat(tLng), parseFloat(tLat)]
    const route = { type: 'Feature', geometry: { type: 'LineString', coordinates: [start, end] } }

    if (mapRef.current.getSource('mission-route')) {
        mapRef.current.getSource('mission-route').setData(route)
    } else {
        if (mapRef.current.getLayer('mission-route')) mapRef.current.removeLayer('mission-route')
        if (mapRef.current.getSource('mission-route')) mapRef.current.removeSource('mission-route')

        mapRef.current.addSource('mission-route', { type: 'geojson', data: route })
        mapRef.current.addLayer({
            id: 'mission-route', source: 'mission-route', type: 'line',
            paint: { 'line-color': '#3b82f6', 'line-width': 4, 'line-opacity': 0.8 }
        })
    }
    
    // Update Stats
    const dist = getDistance(start[1], start[0], end[1], end[0])
    setTelemetry(p => ({ ...p, distanceRemaining: Math.floor(dist) }))
  }

  // 🟢 2. AUTO-LOCK ON REDIRECT
  useEffect(() => {
    if (location.state?.lat && location.state?.lon) {
        const { lat, lon } = location.state
        
        setTargetLat(lat)
        setTargetLng(lon)
        
        // Wait for map to load before locking
        const checkMap = setInterval(() => {
            if (mapRef.current && mapRef.current.isStyleLoaded()) {
                performLock(lat, lon)
                toast.success(`Target Coordinates Received`)
                clearInterval(checkMap)
            }
        }, 500)
        
        // Cleanup timeout if component unmounts
        return () => clearInterval(checkMap)
    }
  }, [location])

  // --- MAP SETUP ---
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW51dXUxMTExMTExMSIsImEiOiJjbWxiend6dGUwcWlpM2ZzOTBseWZjenpqIn0.UmHLNCHiLOb8XLa0JvMmJQ'

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: [parseFloat(baseLng), parseFloat(baseLat)],
      zoom: 14,
      pitch: 70,
      bearing: -20,
      attributionControl: false,
      keyboard: true 
    })

    mapRef.current = map

    map.on('load', () => {
      const pointData = {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [parseFloat(baseLng), parseFloat(baseLat)] } }]
      }

      map.addSource('drone-point', { type: 'geojson', data: pointData })
      map.addLayer({
        id: 'drone-point',
        source: 'drone-point',
        type: 'circle',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-emissive-strength': 1
        }
      })

      const canvas = map.getCanvas()
      canvas.focus()
      canvas.addEventListener('keydown', handleKeyDown, true)
    })
    
    map.on('dragstart', () => setCameraFollow(false))
    map.on('touchstart', () => setCameraFollow(false))

    return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        if(mapRef.current) mapRef.current.remove()
    }
  }, [])

  // Helpers
  const updateDroneMarker = (coords) => {
    const map = mapRef.current
    if (map && map.getSource('drone-point')) {
        map.getSource('drone-point').setData({
            type: 'FeatureCollection',
            features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: coords } }]
        })
    }
  }

  const setFromMap = (type) => {
     if (!mapRef.current) return
     const { lng, lat } = mapRef.current.getCenter()
     if (type === 'TARGET') {
        setTargetLat(lat.toFixed(6)); setTargetLng(lng.toFixed(6))
        toast.success("Target Set")
     } else {
        setBaseLat(lat.toFixed(6)); setBaseLng(lng.toFixed(6))
        teleportDrone(lat, lng)
        toast.success("Base Moved & Drone Reset")
     }
  }

  const teleportDrone = (lat, lng) => {
    const newPos = [parseFloat(lng), parseFloat(lat)]
    dronePosRef.current = newPos
    updateDroneMarker(newPos)
    if (mapRef.current) {
        mapRef.current.flyTo({ center: newPos })
    }
  }

  const handlePaste = async (type) => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) return toast.error("Clipboard empty")
      const parts = text.split(/[\s,]+/)
      let lat, lng
      if (parts.length >= 2) {
        lat = parseFloat(parts[0]); lng = parseFloat(parts[1])
      } else {
         return toast.error("Format: 'lat, lng'")
      }
      if (!isNaN(lat) && !isNaN(lng)) {
        if (type === 'TARGET') {
          setTargetLat(lat); setTargetLng(lng)
        } else {
          setBaseLat(lat); setBaseLng(lng)
          teleportDrone(lat, lng)
        }
        toast.success("Coordinates Pasted")
      } else {
        toast.error("Invalid numbers")
      }
    } catch (err) {
      toast.error("Allow clipboard permissions")
    }
  }

  const handleKeyDown = (e) => {
    const map = mapRef.current
    if (!map) return
    const key = e.key.toLowerCase()

    if (['arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
        setCameraFollow(false); return 
    }
    if (key === 'r') map.zoomIn()
    if (key === 'f') map.zoomOut()
    if (key === 'q') map.easeTo({ bearing: map.getBearing() - 5 })
    if (key === 'e') map.easeTo({ bearing: map.getBearing() + 5 })

    if (status !== 'AUTOPILOT') {
        const bearing = map.getBearing()
        let angle = null
        if (key === 'w') angle = 0; if (key === 's') angle = 180 
        if (key === 'a') angle = 270; if (key === 'd') angle = 90  
        if (angle !== null) { e.preventDefault(); moveDroneByBearing(angle + bearing) }
    }
  }

  const moveDroneByBearing = (bearing) => {
      const [lng, lat] = dronePosRef.current
      const newPos = calculateNewPos(lat, lng, bearing, 30) 
      dronePosRef.current = newPos
      updateDroneMarker(newPos)
      if (cameraFollow && mapRef.current) {
          mapRef.current.easeTo({ center: newPos, duration: 100 })
      }
  }

  const manualMoveDrone = (angleOffset) => {
      if (status === 'AUTOPILOT' || !mapRef.current) return
      const bearing = mapRef.current.getBearing()
      moveDroneByBearing(bearing + angleOffset)
  }
  
  const manualZoom = (dir) => dir === 'in' ? mapRef.current?.zoomIn() : mapRef.current?.zoomOut()
  const manualRotate = (deg) => mapRef.current?.easeTo({ bearing: mapRef.current.getBearing() + deg })

  const handleLockTarget = () => {
    if (!targetLat || !targetLng) return toast.error("Invalid Target")
    performLock(targetLat, targetLng)
    toast.success("Target Locked.")
  }

  // 🟢 3. DEPLOY LOGIC (AUTOPILOT)
  const handleDeploy = () => {
    if (!isLocked) return toast.error("Lock Target First")
    
    // Ensure coordinates are numbers
    const start = dronePosRef.current
    const end = [parseFloat(targetLng), parseFloat(targetLat)]

    if (isNaN(end[0]) || isNaN(end[1])) return toast.error("Invalid Coordinates")

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

    setStatus('AUTOPILOT')
    setCameraFollow(true)
    toast.success("Taking Off...")
    
    const totalDist = getDistance(start[1], start[0], end[1], end[0])
    const startTime = Date.now()
    const duration = 20000 // 20 seconds flight time
    
    const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const t = Math.min(elapsed / duration, 1)

        // Interpolate position
        const lng = start[0] * (1 - t) + end[0] * t
        const lat = start[1] * (1 - t) + end[1] * t
        const currentPos = [lng, lat]
        
        dronePosRef.current = currentPos
        updateDroneMarker(currentPos)

        const currentDist = getDistance(lat, lng, end[1], end[0])
        let currentSpeed = 0
        if (t < 1) {
             const baseSpeed = (totalDist / (duration / 1000)) * 3.6
             currentSpeed = baseSpeed + (Math.random() * 5 - 2.5) 
        }
        
        setTelemetry({
            alt: 120 + Math.sin(t * 20) * 2,
            speed: Math.max(0, Math.floor(currentSpeed)),
            battery: Math.max(0, 88 - Math.floor(t * 10)),
            satellites: 14 + Math.floor(Math.random() * 2),
            signal: 90 - Math.floor(t * 5) + Math.floor(Math.random() * 4),
            distanceRemaining: Math.floor(currentDist)
        })

        if (cameraFollow && mapRef.current) {
            mapRef.current.easeTo({ center: currentPos, duration: 0 })
        }

        if (t < 1) {
            animationFrameRef.current = requestAnimationFrame(animate)
        } else {
            setStatus('ARRIVED')
            setTelemetry(prev => ({ ...prev, speed: 0 }))
            toast.success("Target Reached")
        }
    }
    animate()
  }

  const handleAbort = () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      setStatus('MANUAL')
      setTelemetry(prev => ({ ...prev, speed: 0 }))
      toast("Autopilot Aborted")
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-950 text-white overflow-hidden relative">
      <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden absolute top-4 left-4 z-50 bg-slate-900/90 border border-white/20 p-2 rounded text-white shadow-lg">
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      <DroneSidebar 
         isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}
         status={status} telemetry={telemetry} isLocked={isLocked}
         baseLat={baseLat} setBaseLat={setBaseLat} baseLng={baseLng} setBaseLng={setBaseLng}
         targetLat={targetLat} setTargetLat={setTargetLat} targetLng={targetLng} setTargetLng={setTargetLng}
         setFromMap={setFromMap} handlePaste={handlePaste} 
         handleLockTarget={handleLockTarget} 
         handleDeploy={handleDeploy} handleAbort={handleAbort}
      />

      <div className="flex-1 relative bg-black w-full h-full">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full outline-none" />

        <button 
           onClick={() => setCameraFollow(!cameraFollow)}
           className={`absolute top-4 right-4 z-10 px-3 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-2 border shadow-lg ${cameraFollow ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/80 text-slate-400 border-white/20'}`}
        >
            <Locate size={14} /> {cameraFollow ? 'Cam: Locked' : 'Cam: Free'}
        </button>

        {status === 'AUTOPILOT' && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur border border-blue-500/30 text-blue-400 px-4 py-1 rounded font-mono text-xs uppercase tracking-widest animate-pulse pointer-events-none z-10">
                 AUTOPILOT ENGAGED
             </div>
        )}

        <VirtualJoysticks 
            manualMoveDrone={manualMoveDrone} 
            manualRotate={manualRotate} 
            manualZoom={manualZoom} 
            status={status} 
        />
      </div>
    </div>
  )
}

export default DroneController