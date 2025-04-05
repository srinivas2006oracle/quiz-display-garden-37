
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { DisplayData } from '@/lib/sampleData';

// Define a new type for paired displays
export type PairedDisplayData = {
  primary: DisplayData;
  secondary?: DisplayData;
  duration: number;
}

// The URL of the backend server
const SOCKET_SERVER_URL = 'http://localhost:5001';

// This implements a connection to the socket.io server
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPairedData, setCurrentPairedData] = useState<PairedDisplayData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to socket server
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Socket connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('connection_established', (data) => {
      console.log('Connection established:', data);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for display updates from the server
  useEffect(() => {
    if (!socket) return;

    socket.on('display_update', (data: PairedDisplayData) => {
      console.log('Received display update:', data);
      
      // Make sure we have properly structured data
      if (data && data.primary) {
        setCurrentPairedData(data);
      } else {
        console.error('Received malformed display data:', data);
      }
    });

    // Clean up listener on unmount
    return () => {
      socket.off('display_update');
    };
  }, [socket]);

  return {
    currentPairedData,
    isConnected,
  };
};
