
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import DisplayCard from '@/components/DisplayCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { audioControls } from '@/lib/socket';
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {currentPairedData ? (
          <DisplayCard 
            data={currentPairedData.primary} 
            isVisible={true}
            isPortrait={isPortrait}
            duration={currentPairedData.duration}
            questionIndex={currentPairedData.questionIndex}
            totalQuestions={currentPairedData.totalQuestions}
          />
        ) : (
          <div className="text-center glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Connecting to quiz server...</h2>
            <p>{isConnected ? 'Connected! Waiting for game data...' : 'Establishing connection...'}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Play;
