import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/10">
      <div className="container mx-auto px-6 text-center">
        <div className="w-16 h-16 mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/ACM_LOGO.png" alt="ACM Logo" className="w-full h-full object-contain" />
        </div>
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.5em] uppercase">
          © 2026 Kalasalingam Academy ACM Student Chapter
        </p>
      </div>
    </footer>
  );
};
