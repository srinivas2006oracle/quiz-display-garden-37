
import React from 'react';

interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright = "© Dhara EdTech 2025. All rights reserved." }) => {
  return (
    <footer className="w-full p-2 bg-black/50 backdrop-blur-sm">
      <div className="flex justify-center">
        <div className="bg-white/10 px-3 py-1 rounded-full">
          <p className="text-xs text-white">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
