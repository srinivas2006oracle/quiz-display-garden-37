
import { useState, useEffect, useRef } from 'react';
import { 
  DisplayData, 
  getRandomQuestion, 
  getRandomResponse, 
  getRandomImage, 
  getRandomVideo, 
  getRandomAnswer,
  getRandomFastestAnswers, 
  getRandomLeaderboard, 
  getRandomUpcomingSchedule
} from '@/lib/sampleData';

// This implements a sequenced display pattern for the quiz
export const useSocket = () => {
  const [currentData, setCurrentData] = useState<DisplayData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sequenceIndexRef = useRef(0);
  const responseUpdateCounterRef = useRef(0);

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

  // Create the display sequence based on requirements
  const createDisplaySequence = (): { data: DisplayData, duration: number }[] => {
    const questionData1 = getRandomQuestion();
    const questionData2 = getRandomQuestion();
    const responseData = getRandomResponse();
    
    return [
      { data: getRandomImage(), duration: 10000 },                // 1. Image for 10 seconds
      { data: getRandomVideo(), duration: 10000 },                // 2. Video for 10 seconds
      { data: questionData1, duration: 30000 },                   // 3. Question for 30 seconds
      { data: responseData, duration: 30000 },                    // 3. Responses for 30 seconds (updated every 10s)
      { data: getRandomAnswer(), duration: 10000 },               // 4. Answer for 10 seconds
      { data: getRandomFastestAnswers(), duration: 10000 },       // 5. Fastest Answers for 10 seconds
      { data: getRandomLeaderboard(), duration: 10000 },          // 6. Leaderboard for 10 seconds
      { data: questionData2, duration: 30000 },                   // 7. Another Question for 30 seconds
      { data: responseData, duration: 30000 },                    // 7. Responses for 30 seconds (updated every 10s)
      { data: getRandomAnswer(), duration: 10000 },               // 8. Answer for 10 seconds
      { data: getRandomFastestAnswers(), duration: 10000 },       // 9. Fastest Answers for 10 seconds
      { data: getRandomLeaderboard(), duration: 10000 },          // 10. Leaderboard for 10 seconds
      { data: getRandomUpcomingSchedule(), duration: 20000 },     // 11. Upcoming Schedule for 20 seconds
    ];
  };

  // Simulate receiving data in the specified sequence
  useEffect(() => {
    if (!isConnected) return;

    const sequence = createDisplaySequence();
    let timer: NodeJS.Timeout;
    
    const displayNextItem = () => {
      if (sequenceIndexRef.current >= sequence.length) {
        // Reset sequence when it completes
        sequenceIndexRef.current = 0;
        responseUpdateCounterRef.current = 0;
      }
      
      const currentItem = sequence[sequenceIndexRef.current];
      setCurrentData(currentItem.data);
      
      // Special handling for response data that needs to update every 10 seconds
      if (currentItem.data.type === 'response') {
        // Only increment sequence index after 3 updates (30 seconds total)
        responseUpdateCounterRef.current++;
        
        if (responseUpdateCounterRef.current >= 3) {
          sequenceIndexRef.current++;
          responseUpdateCounterRef.current = 0;
          timer = setTimeout(displayNextItem, 0); // Move to next item immediately
        } else {
          // Update response data every 10 seconds
          timer = setTimeout(() => {
            setCurrentData(getRandomResponse()); // Fresh response data
            timer = setTimeout(displayNextItem, 0);
          }, 10000);
        }
      } else {
        // For all other data types, display for the specified duration
        sequenceIndexRef.current++;
        timer = setTimeout(displayNextItem, currentItem.duration);
      }
    };

    // Start the sequence
    timer = setTimeout(displayNextItem, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isConnected]);

  return {
    currentData,
    isConnected,
  };
};
