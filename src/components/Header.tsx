
import React from 'react';
import { Trophy } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "BQV Quiz" }) => {
  // Get the current server URL to ensure we link to the correct admin path
  const serverUrl = window.location.origin;
  
  return (
    <header className="w-full p-2 flex items-center justify-between bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h1 className="text-xl md:text-2xl font-bold text-gradient">{title}</h1>
      </div>
      <div>
        <a 
          href={`${serverUrl}/admin`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Admin Dashboard
        </a>
      </div>
    </header>
  );
};

export default Header;
