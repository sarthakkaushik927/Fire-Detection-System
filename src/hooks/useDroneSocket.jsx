import { useState, useEffect } from 'react';

export const useDroneStream = (url) => {
  const [frame, setFrame] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Assuming your drone sends base64 strings
      setFrame(`data:image/jpeg;base64,${data.image}`);
    };
    ws.onclose = () => setIsConnected(false);
    return () => ws.close();
  }, [url]);

  return { frame, isConnected };
};