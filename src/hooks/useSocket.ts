
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
      // Handle different data types properly for the showfor property
      const showTime = getShowForTime(data);
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

  // Helper function to get the showfor time based on data type
  const getShowForTime = (data: DisplayData): number => {
    // Default display time if not specified
    const DEFAULT_SHOW_TIME = 5000;
    
    if (!data || !data.data) return DEFAULT_SHOW_TIME;
    
    // Handle array types specifically (responses)
    if (data.type === 'response' && Array.isArray(data.data)) {
      // For response arrays, if first item has showfor, use that, otherwise default
      return data.data[0]?.showfor || DEFAULT_SHOW_TIME;
    }
    
    // For all other types, try to access showfor directly
    return (data.data as any).showfor || DEFAULT_SHOW_TIME;
  };

  return {
    currentData,
    isConnected,
  };
};
