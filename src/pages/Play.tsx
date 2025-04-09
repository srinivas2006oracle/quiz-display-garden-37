
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import DisplayCard from '@/components/DisplayCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { audioControls } from '@/lib/socket';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash"; // or your own debounce logic
import CountdownTimer from "@/components/CountdownTimer";

const Play = () => {
  const { currentPairedData, isConnected } = useSocket();
  const [isPortrait, setIsPortrait] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This component will automatically connect to the socket
    // through the useSocket hook and receive display updates
    console.log('Play component mounted, socket connected:', isConnected);

    // Check for portrait mode
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Initial check
    checkOrientation();

    // Add listener for resize
    window.addEventListener('resize', checkOrientation);

    // Play the appropriate audio when the display changes
    if (currentPairedData?.primary?.type === 'question') {
      audioControls.playQuestionAudio();
      toast({
        title: "Question Timer Started",
        description: "Time to answer the question!",
        duration: 3000,
      });
    } else if (currentPairedData?.primary?.type === 'answer') {
      audioControls.playAnswerAudio();
      toast({
        title: "Answer Revealed",
        description: "Let's see if you got it right!",
        duration: 3000,
      });
    } else if (currentPairedData?.primary?.type === 'credits') {
      audioControls.playCreditsMusic();
      toast({
        title: "Quiz Complete",
        description: "Thanks for playing!",
        duration: 3000,
      });
    }

    return () => {
      console.log('Play component unmounted');
      window.removeEventListener('resize', checkOrientation);
      // Stop all audio when component unmounts
      audioControls.stopAllAudio();
    };
  }, [isConnected, currentPairedData, toast]);
  useEffect(() => {
    const handleResize = debounce(() => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {currentPairedData && (
        <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg z-50 animate-pulse">
          🔴 Live Game
        </div>
      )}
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {currentPairedData ? (
            <motion.div
              key={currentPairedData.questionIndex || currentPairedData.primary?.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {(currentPairedData.primary?.type === 'question' || currentPairedData.primary?.type === 'answer') && currentPairedData.duration && (
                <div className="glass-card p-4 backdrop-blur-md bg-white/10 border border-white/10 rounded-xl shadow-md">

                  <CountdownTimer
                    duration={currentPairedData.duration}
                    isQuestion={currentPairedData.primary?.type === 'question'}
                  /> </div>
              )}
              <DisplayCard
                data={currentPairedData.primary}
                isVisible={true}
                isPortrait={isPortrait}
                duration={currentPairedData.duration}
                questionIndex={currentPairedData.questionIndex}
                totalQuestions={currentPairedData.totalQuestions}
              />


            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-4">Connecting to quiz server...</h2>
              <p>{isConnected ? 'Connected! Waiting for game data...' : 'Establishing connection...'}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
};

export default Play;
