
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisplayCard from '@/components/DisplayCard';
import { useSocket } from '@/hooks/useSocket';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { currentPairedData, isConnected } = useSocket();
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-quiz-purple animate-spin" />
            <p className="text-lg">Connecting to quiz server...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        {currentPairedData ? (
          <div className={`w-full max-w-7xl flex ${isPortrait || isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center justify-center`}>
            <div className={`${isPortrait || isMobile ? 'w-full' : 'w-1/2'}`}>
              <DisplayCard 
                data={currentPairedData.primary} 
                isVisible={true} 
                isPortrait={isPortrait}
              />
            </div>
            
            {currentPairedData.secondary && (
              <div className={`${isPortrait || isMobile ? 'w-full' : 'w-1/2'}`}>
                <DisplayCard 
                  data={currentPairedData.secondary} 
                  isVisible={true} 
                  isPortrait={isPortrait}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400">Waiting for quiz data...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
