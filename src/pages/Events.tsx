import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Nav } from '@/components/acm/Nav';
import { Footer } from '@/components/acm/Footer';
import { allEvents, ACMEvent } from '@/components/acm/eventsData';
import { Calendar, MapPin, X, Globe, Building, Users } from 'lucide-react';
import { LogoPreloader } from '@/components/acm/LogoPreloader';

type Tab = 'upcoming' | 'ongoing' | 'past';
type EventType = 'All' | 'hackathon' | 'seminar' | 'workshop' | 'talk' | 'other';

const TYPE_COLORS: Record<string, string> = {
  hackathon: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  seminar: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  workshop: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  talk: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  other: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

// ── Cursor Glow (same as homepage) ──
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return <div className="cursor-glow mix-blend-screen" style={{ left: pos.x, top: pos.y }} />;
};

// ── Professional Mesh Gradient Background ──
const MeshGradientBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* SVG Grain Texture Overlay for premium cinematic feel */}
      <svg className="fixed inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none z-[2]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Blurred mesh container — all orbs blend into fluid gradients */}
      <div className="absolute inset-0" style={{ filter: 'blur(100px)' }}>
        {/* Cyan orb — top-left drifting */}
        <motion.div
          animate={{
            x: ['-5%', '15%', '-10%', '-5%'],
            y: ['-10%', '10%', '5%', '-10%'],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[5%] left-[10%] w-[45vw] h-[45vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)' }}
        />
        {/* Purple orb — bottom-right drifting */}
        <motion.div
          animate={{
            x: ['5%', '-20%', '10%', '5%'],
            y: ['10%', '-5%', '15%', '10%'],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[5%] right-[5%] w-[55vw] h-[55vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
        />
        {/* Blue orb — center drifting */}
        <motion.div
          animate={{
            x: ['0%', '10%', '-15%', '0%'],
            y: ['0%', '-15%', '10%', '0%'],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
          className="absolute top-[35%] left-[30%] w-[35vw] h-[35vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        />
        {/* Teal orb — top-right accent */}
        <motion.div
          animate={{
            x: ['0%', '-12%', '8%', '0%'],
            y: ['0%', '15%', '-8%', '0%'],
            scale: [1.1, 0.9, 1.05, 1.1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 11 }}
          className="absolute top-[10%] right-[15%] w-[30vw] h-[30vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)' }}
        />
      </div>

      {/* Subtle grid lines — masked to center for depth */}
      <div
        className="absolute inset-0 opacity-[0.06] z-[1]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
      />

      {/* Floating data stream columns */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute top-0 w-[1px] h-full overflow-hidden opacity-[0.15] z-[1]" style={{ left: `${12 + i * 19}%` }}>
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 6 + i * 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
            className="text-cyan-500/40 font-mono text-[9px] leading-tight flex flex-col items-center select-none"
          >
            {Array.from({ length: 80 }, () => Math.random() > 0.5 ? '1' : '0').map((n, idx) => <span key={idx}>{n}</span>)}
          </motion.div>
        </div>
      ))}

      {/* Horizontal scanline sweep */}
      <motion.div
        animate={{ y: ['-10vh', '110vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 w-full h-[1px] z-[1]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.25) 50%, transparent 100%)' }}
      />

      {/* Floating micro-particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-[2px] h-[2px] bg-cyan-400 rounded-full z-[1]"
          animate={{
            y: ['100vh', '-10vh'],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 15,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 15,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 4px rgba(6,182,212,0.6)',
          }}
        />
      ))}
    </div>
  );
});

// ── 3D Hologram Event Card (Professional Tech Style) ──
const EventHologramCard = React.memo(React.forwardRef<HTMLDivElement, { event: ACMEvent; index: number; onClick: () => void }>(({ event, index, onClick }, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = localRef.current?.getBoundingClientRect();
    if (rect) {
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      key={event.title + event.startDate}
    >
      <motion.div
        ref={localRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative cursor-pointer group h-full"
      >
        {/* Sleek Modern Card Body */}
        <div 
          className="h-full rounded-[20px] overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
        >
          {/* Image Header */}
          <div className="relative h-52 w-full overflow-hidden shrink-0 bg-[#030712]">
            <img
              src={event.images?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'}
              alt={event.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out style-will-change-transform"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>

            {/* Type badge — top-left */}
            <div className="absolute top-4 left-4">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest uppercase backdrop-blur-md border ${TYPE_COLORS[event.type]}`}>
                {event.type}
              </span>
            </div>
            
            {/* Mode + Price — top-right */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className={`px-2 py-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 ${event.mode === 'online' ? 'text-blue-400' : 'text-orange-400'}`}>
                {event.mode === 'online' ? <Globe size={11} /> : <Building size={11} />}
                {event.mode}
              </span>
              <span className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-md text-[9px] font-mono text-white font-bold">
                {event.price}
              </span>
            </div>
          </div>

          {/* Content — lifted with translateZ for subtle 3D depth */}
          <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#030712]" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400 mb-3 uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-cyan-500" />
                <span>{event.date}, {event.year}</span>
              </div>
              {event.maxCapacity && (
                <>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1 text-purple-400">
                    <Users size={12} />
                    <span>{event.maxCapacity} Seats</span>
                  </div>
                </>
              )}
            </div>

            <h3 className="text-xl font-bold mb-4 text-white leading-tight line-clamp-2 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
              {event.title}
            </h3>

            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mt-auto pt-5 border-t border-white/5">
              <MapPin size={13} className="text-cyan-500 shrink-0" />
              <span className="truncate">{event.venue || 'TBD'}</span>
            </div>
          </div>
        </div>
        
        {/* Subtle hover glow behind the card */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-[20px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none transform translate-z-[-10px]"></div>
      </motion.div>
    </motion.div>
  );
}));

export default function Events() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [activeType, setActiveType] = useState<EventType>('All');
  const [selectedEvent, setSelectedEvent] = useState<ACMEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('introPlayed'));

  // Scroll to top on load and filter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, activeType]);

  // Derived counts
  const counts = useMemo(() => ({
    upcoming: allEvents.filter(e => e.status === 'upcoming').length,
    ongoing: allEvents.filter(e => e.status === 'ongoing').length,
    past: allEvents.filter(e => e.status === 'past').length,
  }), []);

  // Filtered events
  const displayedEvents = useMemo(() => {
    return allEvents
      .filter(e => e.status === activeTab)
      .filter(e => activeType === 'All' || e.type === activeType)
      .sort((a, b) => {
        const t1 = new Date(a.startDate).getTime();
        const t2 = new Date(b.startDate).getTime();
        return activeTab === 'past' ? t2 - t1 : t1 - t2;
      });
  }, [activeTab, activeType]);

  const handleEventClick = (event: ACMEvent) => {
    setSelectedEvent(event);
    setSelectedImage(event.images && event.images.length > 0 ? event.images[0] : null);
    document.body.style.overflow = 'hidden';
  };

  const closeEvent = () => {
    setSelectedEvent(null);
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LogoPreloader onComplete={() => { sessionStorage.setItem('introPlayed', 'true'); setLoading(false); }} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative flex flex-col"
        >
          <MeshGradientBackground />
          <Nav />
          <CursorGlow />

          <main className="flex-grow pt-32 pb-24 container mx-auto px-6 max-w-7xl relative z-10">

            {/* Header */}
            <div className="mb-16">
              <span className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">Discover</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">Explore Events</h1>

              {/* Tab Bar */}
              <div className="inline-flex p-1.5 bg-[#0a0a0c]/80 border border-white/10 rounded-full backdrop-blur-md mb-8 shadow-inner">
                {(['upcoming', 'ongoing', 'past'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setActiveType('All'); }}
                    className={`relative px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                    <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] transition-colors duration-300 ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                      {counts[tab]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-3">
                {(['All', 'hackathon', 'seminar', 'workshop', 'talk', 'other'] as EventType[]).map((type) => {
                  const isActive = activeType === type;
                  let colorText = 'text-cyan-400';
                  let colorBg = 'bg-cyan-400';
                  let borderClass = 'border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
                  
                  if (type === 'hackathon') { colorText = 'text-purple-400'; colorBg = 'bg-purple-400'; borderClass = 'border-purple-500/30 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'; }
                  if (type === 'seminar') { colorText = 'text-blue-400'; colorBg = 'bg-blue-400'; borderClass = 'border-blue-500/30 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'; }
                  if (type === 'workshop') { colorText = 'text-emerald-400'; colorBg = 'bg-emerald-400'; borderClass = 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'; }
                  if (type === 'talk') { colorText = 'text-amber-400'; colorBg = 'bg-amber-400'; borderClass = 'border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'; }

                  return (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest uppercase border transition-all duration-300 ${
                        isActive
                          ? `${borderClass} ${colorText}`
                          : 'bg-[#0a0a0c]/60 border-white/10 text-slate-400 hover:bg-white/5 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? colorBg + ' shadow-[0_0_8px_currentColor]' : 'bg-slate-600 group-hover:bg-slate-400'}`}></span>
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Events Grid */}
            {displayedEvents.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                style={{ perspective: '1200px' }}
              >
                <AnimatePresence mode="popLayout">
                  {displayedEvents.map((event, index) => (
                    <EventHologramCard
                      key={event.title + event.startDate}
                      event={event}
                      index={index}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/[0.02]"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  We couldn't find any {activeType !== 'All' ? activeType : ''} events in the {activeTab} category.
                </p>
                <button
                  onClick={() => { setActiveType('All'); setActiveTab('upcoming'); }}
                  className="mt-8 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  View Upcoming Events
                </button>
              </motion.div>
            )}

          </main>

          <Footer />

          {/* Event Detail Modal */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
              >
                <div className="absolute inset-0 cursor-pointer" onClick={closeEvent} />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-4xl bg-[#030712] border border-cyan-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.2)] flex flex-col max-h-[90vh] z-10"
                >
                  <button
                    onClick={closeEvent}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-500 hover:border-cyan-500 transition-all shadow-lg"
                  >
                    <X size={18} />
                  </button>

                  <div className="overflow-y-auto flex-1 flex flex-col md:flex-row">
                    {/* Left/Top: Imagery */}
                    <div className="w-full md:w-1/2 flex flex-col bg-[#050b14]">
                      <div className="relative h-64 md:h-80 w-full shrink-0">
                        <img
                          src={selectedImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'}
                          alt={selectedEvent.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] md:from-[#050b14] via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-6">
                          <span className={`px-2.5 py-1 rounded border text-[9px] font-mono font-bold tracking-widest uppercase backdrop-blur-md ${TYPE_COLORS[selectedEvent.type]}`}>
                            {selectedEvent.type}
                          </span>
                        </div>
                      </div>

                      {/* Image Gallery Thumbnails */}
                      {selectedEvent.images && selectedEvent.images.length > 1 && (
                        <div className="p-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {selectedEvent.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedImage(img)}
                              className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${selectedImage === img ? 'border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                            >
                              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right/Bottom: Details */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col border-l border-white/5">
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-4">
                          {selectedEvent.title}
                        </h2>
                        <div className="flex flex-col gap-2 text-sm text-slate-400 font-mono">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-cyan-400" />
                            <span>{selectedEvent.date}, {selectedEvent.year}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-cyan-400" />
                            <span>{selectedEvent.venue || 'TBD'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedEvent.mode === 'online' ? <Globe size={14} className="text-cyan-400" /> : <Building size={14} className="text-cyan-400" />}
                            <span className="capitalize">{selectedEvent.mode}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">Price:</span>
                            <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs">{selectedEvent.price}</span>
                          </div>
                          {selectedEvent.maxCapacity && (
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-cyan-400" />
                              <span className="text-cyan-400 font-bold">Capacity:</span>
                              <span className="text-white">{selectedEvent.maxCapacity} Participants</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <hr className="border-white/5 mb-6" />

                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3">About the Event</h4>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
                          {selectedEvent.desc}
                        </p>

                        {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedEvent.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-mono">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-auto">
                        {selectedEvent.status === 'upcoming' ? (
                          <button
                            onClick={() => alert(`Registration requested for: ${selectedEvent.title}`)}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Register Now
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-4 bg-white/5 text-slate-500 font-black uppercase tracking-widest text-xs rounded-xl border border-white/5 cursor-not-allowed"
                          >
                            Event Concluded
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </>
  );
}
