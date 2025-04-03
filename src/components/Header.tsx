
import React from 'react';
import { Trophy } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "BQV Quiz" }) => {
  return (
    <header className="w-full p-4 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-white" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
