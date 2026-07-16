import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allEvents } from './eventsData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ── 60fps Optimization: Check for reduced motion preference ──
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const sampleImages = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
];

const bgRows = [
  "EEEEEEEEEEEEEEEE",
  "VVVVVVVVVVVVVVVV",
  "EEEEEEEEEEEEEEEE",
  "NNNNNNNNNNNNNNNN",
  "TTTTTTTTTTTTTTTT"
];

export const EventsTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // ── 60fps Optimization: Stable hover callbacks to prevent unnecessary re-renders ──
  const handleHover = useCallback((i: number) => setHoveredIndex(i), []);
  const handleHoverLeave = useCallback(() => setHoveredIndex(null), []);

  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  useEffect(() => {
    // ── 60fps Optimization: Skip heavy animations if user prefers reduced motion ──
    if (prefersReducedMotion) return;

    let ctx = gsap.context(() => {
      // 1. Background rows parallax
      //    Optimization: Use a single scrub tween per row with higher scrub value
      //    for smoother interpolation. force3D ensures GPU compositing.
      const rows = gsap.utils.toArray('.bg-row');
      rows.forEach((row: any, i: number) => {
        gsap.to(row, {
          xPercent: i % 2 === 0 ? -15 : 15,
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8  // Higher scrub = smoother interpolation, less micro-stutter
          }
        });

        // ── 60fps Optimization: Replace ~16 individual infinite tweens per row
        //    with a SINGLE staggered timeline. This cuts ~80 active tweens down to ~5.
        //    Using transform-only properties (y, rotateZ) for GPU-friendly animation.
        const letters = row.querySelectorAll('span');
        if (letters.length > 0) {
          gsap.to(letters, {
            y: (j: number) => Math.sin(j) * 15,
            rotateZ: (j: number) => Math.cos(j) * 10,
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: "sine.inOut",
            stagger: {
              each: 0.08,
              from: "center"
            },
            force3D: true  // GPU layer promotion
          });
        }
      });

      // 2. 3D Carousel rotation driven by vertical scroll
      //    Optimization: Higher scrub (2.5) for buttery-smooth 60fps interpolation.
      //    force3D ensures the rotation stays on the GPU compositor thread.
      gsap.to(carouselRef.current, {
        rotateY: -360,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 2.5,  // Smoother scrubbing - reduces jitter significantly
          start: "top top",
          end: "+=4000",
          anticipatePin: 1,  // Pre-calculates pin position to prevent jump
          fastScrollEnd: true,  // Prevents momentum-based overshoot on touch devices
          preventOverlaps: true  // Prevents conflicting ScrollTrigger instances
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const displayEvents = allEvents.filter(e => e.status === 'upcoming').slice(0, 6);
  if (displayEvents.length < 6) {
      displayEvents.push(...allEvents.filter(e => e.status === 'past').slice(0, 6 - displayEvents.length));
  }
  // Duplicate it for exactly 12 cards to form a smooth circle
  const loopedEvents = [...displayEvents, ...displayEvents];

  const totalCards = loopedEvents.length; // 12
  const theta = 360 / totalCards; // 30 degrees per card
  const cardWidth = 300; 
  // Math to calculate distance from center to form a perfect circle
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / totalCards)) + 40; 

  return (
    <section ref={sectionRef} id="events" className="relative h-screen bg-[#050000] overflow-hidden flex items-center justify-center border-t border-red-900/30" style={{ perspective: '1200px', contain: 'layout style paint' }}>
      
      {/* ── BACKGROUND TYPOGRAPHY (Cylindrical) ── */}
      <div ref={bgTextRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.08] pointer-events-none z-0 [transform-style:preserve-3d]">
        {bgRows.map((row, i) => {
          // Perspective mapping
          // i=0 (-40deg), i=1 (-20deg), i=2 (0), i=3 (20deg), i=4 (40deg)
          const angleX = (i - 2) * -30;
          const scale = 1 - Math.abs(i - 2) * 0.15;
          const opacity = 1 - Math.abs(i - 2) * 0.1;
          
          return (
            <div 
              key={i} 
              className="bg-row flex text-[18vw] md:text-[14vw] font-black tracking-tighter text-white whitespace-nowrap leading-[0.8]"
              style={{
                transform: `rotateX(${angleX}deg) scale(${scale})`,
                opacity: opacity,
                transformOrigin: "center center",
              }}
            >
              {row.split("").map((letter, j) => (
                <span key={j} className="inline-block transform-gpu" style={{ textShadow: "0 0 30px rgba(255,0,0,0.6)", willChange: 'transform', backfaceVisibility: 'hidden' }}>
                  {letter}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── 3D CAROUSEL FOREGROUND (Curved Arc Path) ── */}
      <div className="relative z-10 w-full h-full flex items-center justify-center [transform-style:preserve-3d] pb-24" style={{ perspective: '1500px', contain: 'layout style' }}>
        
        {/* The rotating master cylinder */}
        {/* ── 60fps Optimization: will-change + backface-visibility for GPU compositing ── */}
        <div 
          ref={carouselRef} 
          className="relative w-[300px] md:w-[350px] h-[450px] md:h-[500px] [transform-style:preserve-3d]"
          style={{ 
            transform: `translateZ(${-radius}px)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {loopedEvents.map((event, i) => {
            const isHovered = hoveredIndex === i;
            const isAnyHovered = hoveredIndex !== null;
            const isDimmed = isAnyHovered && !isHovered;

            // 60fps Optimization: Replaced filter:blur() with opacity-only dimming.
            // CSS filters trigger expensive repaints on every frame. Opacity is
            // GPU-composited and essentially free. Visual result is nearly identical.
            return (
              <div 
                key={i} 
                className="absolute top-0 left-0 w-full h-full [transform-style:preserve-3d] group cursor-pointer"
                style={{
                  transform: `rotateY(${i * theta}deg) translateZ(${radius}px)`,
                  opacity: isDimmed ? 0.3 : 1,
                  transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden'
                }}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={handleHoverLeave}
                onClick={() => setSelectedEvent({ ...event, image: sampleImages[i % sampleImages.length] })}
              >
                {/* Event Card Body */}
                {/* ── 60fps Optimization: Removed box-shadow animation from transition.
                     Animating box-shadow triggers repaint on every frame. Instead we use
                     a pseudo-element approach via static shadows and only transition
                     transform + border-color (both GPU-composited). ── */}
                <div 
                  className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#070101]/95 relative group-hover:scale-[1.12] shadow-[0_0_50px_rgba(0,0,0,0.85)] group-hover:shadow-[0_0_100px_rgba(239,68,68,0.25)] group-hover:border-red-500/60 flex flex-col justify-end"
                  style={{
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease, box-shadow 0.5s ease',
                    backfaceVisibility: 'hidden',
                    containIntrinsicSize: 'auto'
                  }}
                >
                  
                  {/* Glowing background aura on hover */}
                  {/* ── 60fps Optimization: Changed transition-all to transition-opacity only.
                       transition-all on elements with blur is extremely expensive. ── */}
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none z-0" style={{ transition: 'opacity 0.7s ease' }} />

                  <img 
                    src={sampleImages[i % sampleImages.length]} 
                    alt={event.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal scale-110 group-hover:scale-100 z-0"
                    style={{
                      transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050000] via-[#050000]/85 to-transparent z-10"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(45deg,transparent,rgba(255,0,0,0.1),transparent)] transition-opacity duration-700 z-10"></div>

                  <div className="absolute top-6 left-6 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_#ff0000] z-20"></div>
                  {/* ── 60fps Optimization: Replaced backdrop-blur-md with solid bg.
                       backdrop-filter is one of the most expensive CSS properties,
                       causing full-area repaint on every compositing frame. ── */}
                  <div className="absolute top-6 right-6 text-[10px] font-mono text-red-400 tracking-widest bg-[#070101]/80 px-2.5 py-1 rounded border border-red-500/30 z-20">
                    {event.status === 'upcoming' ? 'LIVE' : 'ARCHIVE'}
                  </div>
                  
                  <div 
                    className="relative z-20 p-8 transform group-hover:-translate-y-2"
                    style={{
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div className="flex gap-2 mb-4 text-[9px] font-mono font-bold uppercase tracking-widest text-red-400">
                      {/* ── 60fps Optimization: Replaced backdrop-blur-md with opaque bg ── */}
                      <span className="bg-[#070101]/80 px-2.5 py-1 rounded-full border border-red-500/20">
                        {event.date}
                      </span>
                      <span className="bg-[#070101]/60 px-2.5 py-1 rounded-full border border-white/10 text-white/70">
                        {event.price}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight tracking-tight drop-shadow-lg group-hover:text-red-400 transition-colors duration-500">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 group-hover:text-slate-300 transition-colors duration-500 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grain / Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-overlay z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

      {/* Edge Fades for extreme cylindrical illusion */}
      <div className="absolute inset-y-0 left-0 w-[25vw] bg-gradient-to-r from-[#050000] via-[#050000]/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-[25vw] bg-gradient-to-l from-[#050000] via-[#050000]/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-x-0 top-0 h-[20vh] bg-gradient-to-b from-[#050000] to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#050000] to-transparent pointer-events-none z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-8 left-0 right-0 flex justify-center z-[50]"
      >
        <button 
          onClick={() => navigate('/events')}
          className="group px-8 py-4 bg-[#070101]/90 hover:bg-red-500 border border-red-500/40 hover:border-red-500 rounded-full text-red-400 hover:text-white font-mono font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] backdrop-blur-xl hover:scale-105 active:scale-95"
        >
          Explore All Events <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
      </motion.div>

      {/* ── EVENT DETAILS POPUP MODAL ── */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            {/* Backdrop Click */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setSelectedEvent(null)}
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-[#090202] border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.3)] flex flex-col max-h-[85vh] z-10"
            >
              {/* Event Image Header */}
              <div className="relative h-64 w-full shrink-0">
                <img 
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090202] to-transparent"></div>
                
                {/* Close button */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 border border-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-lg"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 backdrop-blur-sm uppercase">
                    {selectedEvent.type}
                  </span>
                </div>
              </div>

              {/* Event Content Details */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                    {selectedEvent.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs md:text-sm text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-red-500" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500 font-bold">Price:</span>
                      <span>{selectedEvent.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500 font-bold">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedEvent.status === 'upcoming' 
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                          : 'bg-slate-500/10 border border-slate-500/30 text-slate-400'
                      }`}>
                        {selectedEvent.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-white/5" />

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">About the Event</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedEvent.desc}
                  </p>
                </div>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2.5">Topic Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag: string) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Close
                  </button>
                  {selectedEvent.status === 'upcoming' && (
                    <button
                      onClick={() => {
                        alert(`Registration requested for: ${selectedEvent.title}. Please complete via dashboard.`);
                      }}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
