
import React from 'react';
import { Trophy } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "BQV Quiz" }) => {
  return (
    <header className="w-full p-2 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h1 className="text-xl md:text-2xl font-bold text-gradient">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
