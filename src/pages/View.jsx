import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function View() {
    const { roomId } = useParams();
    const [detectionImage, setDetectionImage] = useState(null);
    const [status, setStatus] = useState("Connecting...");

    useEffect(() => {
        let ws = null;
        let isMounted = true;
        let hasConnected = false; // Track if connection succeeded

        const connect = () => {
            // 🟢 Native WebSocket Connection
            ws = new WebSocket(`http://13.51.249.146:8002/api/streamFireImage/ws_fire_image/${roomId}`);

            ws.onopen = () => {
                if (!isMounted) return;
                hasConnected = true; // Mark as successfully connected
                console.log("View Socket Connected");
                setStatus("Waiting for stream...");
                // Backend expects ONLY image strings, so we send nothing on connect
                // We just listen for incoming data
            };

            ws.onmessage = (event) => {
                if (!isMounted) return;

                // 🟢 Handle Base64 String Data (Frame)
                // Backend sends raw base64 string
                const data = event.data;
                if (typeof data === "string") {
                    // If it looks like base64 (not JSON error)
                    if (!data.startsWith("{")) {
                        setDetectionImage(`data:image/jpeg;base64,${data}`);
                        setStatus("Live");
                    }
                    // Handle JSON (error messages)
                    else {
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.error) console.error("Server Error:", parsed.error);
                        } catch (e) { /* ignore */ }
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
            // Only close if connection was actually established
            // This prevents StrictMode from closing the socket prematurely
            if (ws && hasConnected) {
                ws.close();
            }
        };
    }, [roomId]);

    return (
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
            {/* Status Overlay */}
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