
import { useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import { DisplayData } from '@/lib/sampleData';

// Define a new type for paired displays
export type PairedDisplayData = {
  primary: DisplayData;
  secondary?: DisplayData;
  duration: number;
  questionIndex?: number;
  totalQuestions?: number;
}

// This hook manages the socket connection and display data
export const useSocket = () => {
  const [currentPairedData, setCurrentPairedData] = useState<PairedDisplayData | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [questionIndex, setQuestionIndex] = useState<number | undefined>(undefined);
  const [totalQuestions, setTotalQuestions] = useState<number | undefined>(undefined);

  // Listen for connection events
  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected in hook');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected in hook');
      setIsConnected(false);
    };

    const onConnectionEstablished = (data: any) => {
      console.log('Connection established:', data);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connection_established', onConnectionEstablished);

    // Clean up listeners on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connection_established', onConnectionEstablished);
    };
  }, []);

  // Listen for display updates from the server
  useEffect(() => {
    const onDisplayUpdate = (data: PairedDisplayData) => {
      console.log('Received display update:', data);
      
      // Make sure we have properly structured data with valid fields
      if (data && data.primary) {
        // Fix various data types to ensure they have proper structure
        if (data.primary.type === 'question' && (!data.primary.data || typeof data.primary.data !== 'object')) {
          data.primary.data = { text: '', choices: [] };
        }
        
        if (data.primary.type === 'answer' && (!data.primary.data || typeof data.primary.data !== 'object')) {
          data.primary.data = { text: '', description: '' };
        }
        
        // Update question index and total questions if available
        if (data.questionIndex !== undefined) {
          setQuestionIndex(data.questionIndex);
        }
        
        if (data.totalQuestions !== undefined) {
          setTotalQuestions(data.totalQuestions);
        }
        
        setCurrentPairedData(data);
      } else {
        console.error('Received malformed display data:', data);
      }
    };

    socket.on('display_update', onDisplayUpdate);

    // Clean up listener on unmount
    return () => {
      socket.off('display_update', onDisplayUpdate);
    };
  }, []);

  return {
    currentPairedData,
    isConnected,
    questionIndex,
    totalQuestions
  };
};
