import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function Stream() {
    const { roomId } = useParams();
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        let ws = null;
        let isMounted = true;
        let hasConnected = false; // Track if connection succeeded

        // 🟢 Connect to Native WebSocket
        const connect = () => {
            ws = new WebSocket(`ws://13.51.249.146:8002/api/streamFireImage/ws_fire_image/${roomId}`);
            socketRef.current = ws;

            ws.onopen = () => {
                if (!isMounted) return;
                hasConnected = true; // Mark as successfully connected
                console.log("Stream Socket Connected");
                // Backend expects ONLY image strings, no JSON/Room logic
                startStream();
            };

            ws.onerror = (error) => {
                if (!isMounted) return;
                console.error("Stream Socket Error:", error);
            };

            ws.onclose = (event) => {
                if (!isMounted) return;
                console.log(`Stream Socket Closed: ${event.code} - ${event.reason}`);
            };
        };

        const startStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }, // Optimize resolution for streaming
                    audio: false, // We focused on video frame analysis
                });

                if (!isMounted) return;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Start frame capture loop
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                intervalRef.current = setInterval(() => {
                    if (
                        ws && ws.readyState === WebSocket.OPEN &&
                        videoRef.current &&
                        videoRef.current.videoWidth
                    ) {
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;

                        ctx.drawImage(videoRef.current, 0, 0);

                        // 🟢 Convert to Base64 String (backend expects text)
                        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
                        // Remove header "data:image/jpeg;base64,"
                        const base64Data = dataUrl.split(",")[1];

                        if (base64Data) {
                            ws.send(base64Data);
                        }
                    }
                },300);// 10 FPS (100ms interval)
            } catch (err) {
                console.error("Camera access error:", err);
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Only close if connection was actually established
            if (ws && hasConnected) ws.close();
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [roomId]);

    return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
            <h1 className="text-white mb-4 animate-pulse">🔴 Live Streaming...</h1>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-w-full max-h-full border-2 border-red-600 rounded-lg shadow-2xl"
            />
        </div>
    );
}