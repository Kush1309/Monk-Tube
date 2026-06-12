import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-monk-dark py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-bold text-cream/90 tracking-wide">
          Monk<span className="text-monk-accent">Tube</span>
        </p>
        <p className="text-xs text-cream/55 mt-2">
          Built by{' '}
          <a
            href="https://github.com/Kush1309/Cursor-Kush"
            target="_blank"
            rel="noopener noreferrer"
            className="text-monk-accent hover:underline font-semibold"
          >
            Kushagra Saxena
          </a>{' '}
          · B.Tech Student · MERN Stack Developer
        </p>
        <p className="text-[10px] text-cream/35 mt-3">
          &copy; {new Date().getFullYear()} MonkTube. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
