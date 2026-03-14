import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function View() {
    const { roomId } = useParams();
    const [detectionImage, setDetectionImage] = useState(null);
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        let ws = null;
        let isMounted = true;
        let hasConnected = false;

        const connect = () => {
          
            ws = new WebSocket(`wss://fire.anurag11.me/api/streamFireImage/ws_fire_image/${roomId}`);

            ws.onopen = () => {
                if (!isMounted) return;
                hasConnected = true; 
                console.log("View Socket Connected");
                setStatus("Waiting for stream...");
               
            };

            ws.onmessage = (event) => {
                if (!isMounted) return;

              
                const data = event.data;
                if (typeof data === "string") {
                   
                    if (!data.startsWith("{")) {
                        setDetectionImage(`data:image/jpeg;base64,${data}`);
                        setStatus("Live");
                    }
                 
                    else {
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.error) console.error("Server Error:", parsed.error);
                        } catch (e) {  }
                    }
                }
            };

            ws.onerror = (err) => {
                if (!isMounted) return;
                console.error("View Socket Error:", err);
                setStatus("Connection Error");
            };

            ws.onclose = (event) => {
                if (!isMounted) return;
                console.log(`View Socket Closed: ${event.code} - ${event.reason}`);
                setStatus("Disconnected");
            };
        };

        connect();

        return () => {
            isMounted = false;
            
            if (ws && hasConnected) {
                ws.close();
            }
        };
    }, [roomId]);

    const mapContainerRef = React.useRef(null);
    const mapRef = React.useRef(null);

    useEffect(() => {
        if (status !== "Live") return;

        import('mapbox-gl').then((mapboxglModule) => {
            const mapboxgl = mapboxglModule.default;
            mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

            if (mapRef.current) return;

            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/satellite-streets-v12',
                center: [77.4679, 28.7254], // Hardcoded coordinates [lng, lat]
                zoom: 15,
                pitch: 60,
                bearing: -20,
                interactive: false
            });

            mapRef.current.on('load', () => {
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
    }, [status]);

    return (
        <div className="relative w-full h-screen bg-slate-950 flex items-center justify-center p-6 gap-6 overflow-hidden">
           
            <div className={`absolute top-4 left-4 z-50 px-4 py-2 rounded-lg font-bold shadow-lg ${status === "Live" ? "bg-green-600 text-white animate-pulse" : "bg-yellow-600 text-black"
                }`}>
                {status}
            </div>

            {detectionImage ? (
                <>
                    {/* Video Feed */}
                    <div className="relative z-10 w-full max-w-5xl h-[80vh] rounded-2xl border border-white/10 shadow-2xl bg-black flex items-center justify-center overflow-hidden">
                        <img
                            src={detectionImage}
                            alt="Live Stream"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                           <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-widest rounded flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> LIVE
                           </div>
                        </div>
                    </div>

                    {/* Minimap */}
                    <div className="relative z-10 w-full max-w-sm h-[80vh] rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl bg-slate-900 flex-shrink-0">
                       <div className="absolute top-0 left-0 w-full p-3 bg-slate-900/90 backdrop-blur-md z-20 flex justify-between items-center text-white text-xs font-mono border-b border-white/10">
                          <div className="flex items-center gap-2 text-red-500 font-bold">
                             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                             TARGET ACQUIRED
                          </div>
                          <div className="text-slate-400">28.7254° N, 77.4679° E</div>
                       </div>
                       
                       <div className="mt-10 h-[calc(100%-2.5rem)] w-full relative">
                          <div ref={mapContainerRef} className="w-full h-full" />
                          
                          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur border border-white/10 p-3 rounded-xl flex justify-between items-center">
                             <div className="flex items-center gap-2 text-blue-400">
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
                <div className="text-slate-500 font-mono tracking-widest text-sm flex flex-col items-center gap-4">
                    <span className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-slate-300 animate-spin"></span>
                    Waiting for video feed...
                </div>
            )}
        </div>
    );
}