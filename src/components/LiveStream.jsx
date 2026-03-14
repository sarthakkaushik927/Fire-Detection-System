import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wifi, WifiOff, Activity, Disc,
  Maximize, Minimize, Video, Battery,
  Signal, Navigation, Server
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useDroneStream } from '../hooks/useDroneStream'
import LiveStreamQR from './dashboard/LiveStreamQR'




const LiveStream = () => {
  const { theme } = useTheme()
  const { frame, isConnected } = useDroneStream(import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/drone")

  const mapContainerRef = React.useRef(null);
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    import('mapbox-gl').then((mapboxglModule) => {
      const mapboxgl = mapboxglModule.default;
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

      if (mapRef.current) return; // initialize map only once

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [77.4679, 28.7254], // Hardcoded coordinates [lng, lat]
        zoom: 15,
        pitch: 60,
        bearing: -20,
        interactive: false // Make it a static minimap for now
      });

      mapRef.current.on('load', () => {
        // Add a marker/dot for the drone
        mapRef.current.addSource('drone-mini', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [77.4679, 28.7254] }
            }]
          }
        });

        mapRef.current.addLayer({
          id: 'drone-mini',
          source: 'drone-mini',
          type: 'circle',
          paint: {
            'circle-radius': 8,
            'circle-color': '#ef4444',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative p-4 md:p-6 min-h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center gap-6 flex-wrap"
    >
     
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(/livefeed.jpeg)',
          filter: 'brightness(1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0" />

      {isConnected ? (
        <>
          {/* Main Video Feed (Placeholder for actual video component/feed) */}
          <div className="relative z-10 w-full max-w-4xl h-[60vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex flex-col items-center justify-center">
             {frame ? (
               <img src={frame} alt="Drone Feed" className="w-full h-full object-contain" />
             ) : (
               <div className="flex flex-col items-center justify-center text-slate-500">
                  <Activity size={48} className="mb-4 animate-pulse opacity-50" />
                  <p className="font-mono text-xs uppercase tracking-widest">Awaiting Video Frames...</p>
               </div>
             )}
             
             {/* Feed Overlay UI */}
             <div className="absolute top-4 left-4 flex gap-2">
                <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest rounded flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE
                </div>
                <div className="px-3 py-1 bg-black/50 text-white text-[10px] font-mono tracking-widest rounded border border-white/10 backdrop-blur">
                   1080P / 60FPS
                </div>
             </div>
          </div>

          {/* Minimap Section - Side of Drone Feed */}
          <div className="relative z-10 w-full max-w-sm h-[60vh] rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl bg-slate-900 flex-shrink-0">
             <div className="absolute top-0 left-0 w-full p-3 bg-slate-900/90 backdrop-blur-md z-20 flex justify-between items-center text-white text-xs font-mono border-b border-white/10">
                <div className="flex items-center gap-2 text-red-500 font-bold">
                   <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   TARGET ACQUIRED
                </div>
                <div className="text-slate-400">28.7254° N, 77.4679° E</div>
             </div>
             
             <div className="mt-10 h-[calc(100%-2.5rem)] w-full relative">
                <div ref={mapContainerRef} className="w-full h-full" />
                
                {/* Overlay details on minimap */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur border border-white/10 p-3 rounded-xl flex justify-between items-center">
                   <div className="flex items-center gap-2 text-blue-400">
                     <Signal size={14} />
                     <span className="text-[10px] font-mono">LINK STRONG</span>
                   </div>
                   <div className="text-[10px] font-mono text-slate-400">
                     ALT: 120M
                   </div>
                </div>
             </div>
          </div>
        </>
      ) : (
        /* Initialization Section */
        <div className="relative z-10 opacity-90 backdrop-blur-sm">
          <LiveStreamQR />
        </div>
      )}
    </motion.main>
  )
}

export default LiveStream