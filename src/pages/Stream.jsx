import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function Stream() {
    const { roomId } = useParams();
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const intervalRef = useRef(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState("");
    const [showCameraSelect, setShowCameraSelect] = useState(false);

    useEffect(() => {
        let ws = null;
        let isMounted = true;
        let hasConnected = false; // Track if connection succeeded

        // 🟢 Connect to Native WebSocket
        const connect = () => {
            ws = new WebSocket(`wss://fire.anurag11.me/api/streamFireImage/ws_fire_image/${roomId}`);
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
                // Get list of available cameras
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);

                // Determine which camera to use
                let deviceId = selectedCamera;

                if (!deviceId && videoDevices.length > 0) {
                    // Try to find back camera on mobile
                    const backCamera = videoDevices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear') ||
                        device.label.toLowerCase().includes('environment')
                    );

                    deviceId = backCamera ? backCamera.deviceId : videoDevices[0].deviceId;
                    setSelectedCamera(deviceId);
                }

                const constraints = {
                    video: {
                        deviceId: deviceId ? { exact: deviceId } : undefined,
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: deviceId ? undefined : { ideal: "environment" } // Fallback for mobile
                    },
                    audio: false,
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);

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
                }, 300);// 10 FPS (100ms interval)
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
    }, [roomId, selectedCamera]); // Re-run when camera changes

    const handleCameraChange = (deviceId) => {
        setSelectedCamera(deviceId);
        setShowCameraSelect(false);
    };

    return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative">
            <h1 className="text-white mb-4 animate-pulse">🔴 Live Streaming...</h1>

            {/* Camera Selection Button */}
            {cameras.length > 1 && (
                <div className="absolute top-4 right-4 z-50">
                    <button
                        onClick={() => setShowCameraSelect(!showCameraSelect)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                    >
                        📷 Switch Camera
                    </button>

                    {/* Camera Dropdown */}
                    {showCameraSelect && (
                        <div className="absolute right-0 mt-2 bg-gray-900 rounded-lg shadow-xl border border-white/20 overflow-hidden min-w-[200px]">
                            {cameras.map((camera) => (
                                <button
                                    key={camera.deviceId}
                                    onClick={() => handleCameraChange(camera.deviceId)}
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${selectedCamera === camera.deviceId ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                                        }`}
                                >
                                    <div className="text-sm font-medium">
                                        {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                                    </div>
                                    {selectedCamera === camera.deviceId && (
                                        <div className="text-xs text-orange-400 mt-1">✓ Active</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

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