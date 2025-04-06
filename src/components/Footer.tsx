
import React from 'react';

interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright = "© Dhara EdTech 2025. All rights reserved." }) => {
  return (
    <footer className="w-full p-3 bg-black/50 backdrop-blur-sm">
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 px-6 py-2 rounded-full shadow-lg">
          <p className="text-sm md:text-base text-white font-bold">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
