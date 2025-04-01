
import React from 'react';

interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright = "© Quiz Display Garden 2023. All rights reserved." }) => {
  return (
    <footer className="w-full p-3 bg-black/50 backdrop-blur-sm">
      <div className="flex justify-center">
        <p className="text-sm text-gray-400">{copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
