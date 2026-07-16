import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const LogoPreloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Fallback safety timer
    const timer = setTimeout(() => {
      onComplete();
    }, 12000); // 12 seconds max loading time
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Video Container - Fullscreen & Borderless */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
        <video 
          src="/intro-video.mp4" 
          autoPlay 
          muted 
          playsInline 
          onEnded={onComplete}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Skip Button at the bottom */}
      <motion.button
        onClick={onComplete}
        className="absolute bottom-12 px-6 py-2.5 rounded-full border border-white/10 hover:border-cyan-400/40 hover:text-cyan-400 bg-white/5 hover:bg-cyan-500/10 text-xs font-mono font-bold tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-slate-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Skip Intro <ChevronRight size={14} />
      </motion.button>
    </motion.div>
  );
};
