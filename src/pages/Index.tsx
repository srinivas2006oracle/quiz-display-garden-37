
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisplayCard from '@/components/DisplayCard';
import { useSocket } from '@/hooks/useSocket';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { currentPairedData, isConnected, questionIndex, totalQuestions } = useSocket();
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const isMobile = useIsMobile();

  // Effect for handling orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-quiz-pattern bg-repeat bg-opacity-10">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-quiz-purple animate-spin" />
            <p className="text-lg font-bold">Connecting to quiz server...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-quiz-pattern bg-repeat bg-opacity-10">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
        {currentPairedData ? (
          <div className="w-full h-full max-w-screen-2xl">
            <DisplayCard 
              data={currentPairedData.primary} 
              isVisible={true} 
              isPortrait={isPortrait}
              duration={currentPairedData.duration}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400 font-bold">Waiting for quiz data...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
