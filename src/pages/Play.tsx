
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import DisplayCard from '@/components/DisplayCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Play = () => {
  const { currentPairedData, isConnected } = useSocket();
  const [isPortrait, setIsPortrait] = useState(false);

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

    return () => {
      console.log('Play component unmounted');
      window.removeEventListener('resize', checkOrientation);
    };
  }, [isConnected]);

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
          <div className="text-center">
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
