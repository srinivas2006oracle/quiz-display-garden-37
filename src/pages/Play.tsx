
import React, { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import DisplayCard from '@/components/DisplayCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Play = () => {
  const { currentPairedData, isConnected } = useSocket();

  useEffect(() => {
    // This component will automatically connect to the socket
    // through the useSocket hook and receive display updates
    console.log('Play component mounted, socket connected:', isConnected);

    return () => {
      console.log('Play component unmounted');
    };
  }, [isConnected]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {currentPairedData ? (
          <DisplayCard primaryData={currentPairedData.primary} secondaryData={currentPairedData.secondary} />
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
