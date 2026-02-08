import { useEffect, useState } from "react";
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

    return (
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
           
            <div className={`absolute top-4 left-4 z-50 px-4 py-2 rounded-lg font-bold shadow-lg ${status === "Live" ? "bg-green-600 text-white" : "bg-yellow-600 text-black"
                }`}>
                {status}
            </div>

            {detectionImage ? (
                <img
                    src={detectionImage}
                    alt="Live Stream"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                />
            ) : (
                <div className="text-white animate-pulse">Waiting for video feed...</div>
            )}
        </div>
    );
}