
import React from 'react';

interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright = "© Dhara EdTech 2025. All rights reserved." }) => {
  return (
    <footer className="w-full p-3 bg-black/50 backdrop-blur-sm">
      <div className="flex justify-center">
        <p className="text-sm text-gray-400">{copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
