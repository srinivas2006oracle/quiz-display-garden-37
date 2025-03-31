
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

// Define a new type for paired displays
export type PairedDisplayData = {
  primary: DisplayData;
  secondary?: DisplayData;
  duration: number;
}

// This implements a sequenced display pattern for the quiz
export const useSocket = () => {
  const [currentPairedData, setCurrentPairedData] = useState<PairedDisplayData | null>(null);
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
  const createDisplaySequence = (): PairedDisplayData[] => {
    const questionData1 = getRandomQuestion();
    const questionData2 = getRandomQuestion();
    const responseData = getRandomResponse();
    const answerData = getRandomAnswer();
    const fastestAnswersData = getRandomFastestAnswers();
    
    return [
      { primary: getRandomImage(), duration: 10000 },                                     // 1. Image for 10 seconds
      { primary: getRandomVideo(), duration: 10000 },                                     // 2. Video for 10 seconds
      { primary: questionData1, secondary: responseData, duration: 30000 },               // 3. Question & Responses for 30 seconds (updated every 5s)
      { primary: answerData, secondary: fastestAnswersData, duration: 10000 },            // 4. Answer & Fastest Answers for 10 seconds
      { primary: getRandomLeaderboard(), duration: 10000 },                               // 5. Leaderboard for 10 seconds
      { primary: questionData2, secondary: responseData, duration: 30000 },               // 6. Another Question & Responses for 30 seconds
      { primary: getRandomAnswer(), secondary: getRandomFastestAnswers(), duration: 10000 }, // 7. Answer & Fastest Answers for 10 seconds
      { primary: getRandomLeaderboard(), duration: 10000 },                               // 8. Leaderboard for 10 seconds
      { primary: getRandomUpcomingSchedule(), duration: 20000 },                          // 9. Upcoming Schedule for 20 seconds
    ];
  };

  // Simulate receiving data in the specified sequence
  useEffect(() => {
    if (!isConnected) return;

    const sequence = createDisplaySequence();
    let timer: NodeJS.Timeout;
    let responseRefreshTimer: NodeJS.Timeout;
    
    const displayNextItem = () => {
      if (sequenceIndexRef.current >= sequence.length) {
        // Reset sequence when it completes
        sequenceIndexRef.current = 0;
        responseUpdateCounterRef.current = 0;
      }
      
      const currentItem = sequence[sequenceIndexRef.current];
      setCurrentPairedData(currentItem);
      
      // Special handling for question-response paired data
      if (currentItem.primary.type === 'question' && currentItem.secondary?.type === 'response') {
        // Clear any existing response refresh timer
        if (responseRefreshTimer) clearInterval(responseRefreshTimer);
        
        // Setup a refresh timer that updates responses every 5 seconds
        responseRefreshTimer = setInterval(() => {
          setCurrentPairedData(prev => {
            if (!prev || prev.primary.type !== 'question') return prev;
            return {
              ...prev,
              secondary: getRandomResponse() // Fresh response data every 5 seconds
            };
          });
        }, 5000);
        
        // Move to next sequence item after duration
        timer = setTimeout(() => {
          clearInterval(responseRefreshTimer);
          sequenceIndexRef.current++;
          displayNextItem();
        }, currentItem.duration);
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
      if (responseRefreshTimer) clearInterval(responseRefreshTimer);
    };
  }, [isConnected]);

  return {
    currentPairedData,
    isConnected,
  };
};
