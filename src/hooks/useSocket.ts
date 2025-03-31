
import { useState, useEffect } from 'react';
import { DisplayData, getRandomData } from '@/lib/sampleData';

// This is a mock socket implementation for the demo
// In real application, you would use socket.io-client
export const useSocket = () => {
  const [currentData, setCurrentData] = useState<DisplayData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate socket connection
  useEffect(() => {
    const connectSocket = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    // Simulate connection delay
    const timer = setTimeout(connectSocket, 1000);

    return () => {
      clearTimeout(timer);
      setIsConnected(false);
    };
  }, []);

  // Simulate receiving data
  useEffect(() => {
    if (!isConnected) return;

    let dataTimer: NodeJS.Timeout;
    let clearTimer: NodeJS.Timeout;

    const simulateDataReceive = () => {
      const data = getRandomData();
      setCurrentData(data);

      // Clear data after showfor time
      const showTime = data.data.showfor || 5000;
      clearTimer = setTimeout(() => {
        setCurrentData(null);
        
        // Schedule next data after a brief pause
        const nextDataTimer = setTimeout(simulateDataReceive, 1500);
        return () => clearTimeout(nextDataTimer);
      }, showTime);
    };

    // Start the simulation after a delay
    dataTimer = setTimeout(simulateDataReceive, 2000);

    return () => {
      clearTimeout(dataTimer);
      clearTimeout(clearTimer);
    };
  }, [isConnected]);

  return {
    currentData,
    isConnected,
  };
};
