import { Nav } from "@/components/acm/Nav";
import { Reveal } from "@/components/acm/Reveal";
import { TeamDeck } from "@/components/acm/TeamDeck";
import { Magnetic } from "@/components/acm/Magnetic";
import { EventsTimeline } from "@/components/acm/EventsTimeline";
import { latestBlogs } from "@/components/acm/blogsData";
import { ArrowUpRight, Mail, Github, Linkedin, Twitter, ExternalLink, Code, Database, Smartphone, Shield, BookOpen, MapPin, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AwardModal } from "@/components/acm/AwardModal";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoPreloader } from "@/components/acm/LogoPreloader";
import { Footer } from "@/components/acm/Footer";
gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "2175+", label: "Active Members" },
  { value: "75+", label: "Expert Events" },
  { value: "12+", label: "Tech Domains" },
  { value: "900+", label: "Global Awards" },
];

const domains = [
  { name: "Web Dev", icon: <Code size={32} />, color: "#00FFFF", desc: "Next.js, Node, and Scalable Architectures" },
  { name: "AI / ML", icon: <Database size={32} />, color: "#8B5CF6", desc: "Deep Learning and Neural Research" },
  { name: "App Dev", icon: <Smartphone size={32} />, color: "#0080FF", desc: "Swift, Flutter, and Native Performance" },
  { name: "Cybersec", icon: <Shield size={32} />, color: "#10B981", desc: "Ethical Hacking and Security Audit" },
];

const TICKER = ["INNOVATE", "RESEARCH", "EXCEL", "COLLABORATE", "BUILD", "ACM KARE", "LEAD"];

// ── Cursor Glow ──
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return <div className="cursor-glow mix-blend-screen" style={{ left: pos.x, top: pos.y }} />;
};

// ── Global Background Particles with Floating ACM Letters ──
const GlobalParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 40 }).map((_, i) => {
        const letters = ["A", "C", "M", "•", "K", "A", "R", "E"];
        const char = letters[i % letters.length];
        const size = Math.random() * 8 + 8; // 8px to 16px
        const opacity = Math.random() * 0.12 + 0.04; // 4% to 16% opacity (very lite!)
        return (
          <motion.div
            key={i}
            className="absolute font-mono font-extrabold text-[#00BFFF] select-none pointer-events-none"
            initial={{
              y: "105vh",
              x: `${Math.random() * 100}vw`,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.75,
            }}
            animate={{
              y: "-10vh",
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{
              duration: Math.random() * 25 + 20, // 20s to 45s
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 30,
            }}
            style={{
              fontSize: `${size}px`,
              textShadow: "0 0 8px rgba(0, 191, 255, 0.4)",
            }}
          >
            {char}
          </motion.div>
        );
      })}
    </div>
  );
};

// ── Particles Background ──
const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500 rounded-full blur-[1px]"
          animate={{
            y: ["0vh", "-100vh"],
            x: [Math.random() * 10 - 5 + "vw", Math.random() * 10 - 5 + "vw"],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}vw`,
            bottom: "-10px",
          }}
        />
      ))}
    </div>
  );
};

// ── Interactive 3D Floating Logo ──
const FloatingLogo = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-10 drop-shadow-[0_0_35px_rgba(0,191,255,0.45)] cursor-pointer group"
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-cyan-500/15 rounded-full blur-[65px] group-hover:bg-cyan-500/25 transition-colors duration-500"></div>
      <img 
        src="/ACM_LOGO.png" 
        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,191,255,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(0,191,255,0.9)] transition-all duration-500" 
        style={{ transform: "translateZ(40px)" }} 
        alt="ACM KARE Logo"
      />
    </motion.div>
  );
};

// ── Stagger Text Animation ──
const StaggerText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap justify-center gap-x-4 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
          viewport={{ once: true }}
          className="inline-block origin-bottom"
        >
          {word === "ACM" ? (
            <span className="relative inline-block text-white font-black acm-diamond-glow">
              <span className="absolute inset-0 text-transparent acm-diamond-outline pointer-events-none">
                ACM
              </span>
              <span className="relative z-10 text-white">
                ACM
              </span>
            </span>
          ) : word}
        </motion.span>
      ))}
    </div>
  );
};


// ── Typewriter ──
const Typewriter = ({ texts }: { texts: string[] }) => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = texts[idx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length+1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0,-1)), 40);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx+1) % texts.length);
    }
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="text-cyan-400 border-r-2 border-cyan-400 pr-1 animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
      {displayed}
    </span>
  );
};

export default function Index() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('introPlayed'));
  const { scrollYProgress } = useScroll({ target: containerRef });
  const logoRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    // Reveal sections on scroll
    gsap.utils.toArray('.scroll-reveal').forEach((section: any) => {
      gsap.from(section, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        }
      });
    });
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LogoPreloader onComplete={() => { sessionStorage.setItem('introPlayed', 'true'); setLoading(false); }} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          ref={containerRef}
          id="top"
          className="min-h-screen bg-[#030712] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Scanline effect */}
          <style>{`
            @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
          `}</style>
          <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden mix-blend-overlay">
            <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" style={{ animation: "scanline 8s linear infinite" }} />
          </div>

          {/* Grid overlay */}
          <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <Nav />
          <CursorGlow />
          <GlobalParticles />

          {/* ── HERO ───────────────────────────── */}
          <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
            <Particles />
            
            {/* Dark Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none"></div>
            
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTU5IDBoMXY2MGgtMXpNMCA1OWg2MHYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50 pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>

            {/* Orbital rings */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] pointer-events-none z-0" style={{ transform: "translate(-50%, -50%)" }}>
              {[1, 1.4, 1.8].map((scale, i) => (
                <motion.div key={i} 
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 12+i*6, repeat: Infinity, ease: "linear" }}
                  className={`absolute inset-0 border rounded-full ${i===0?'border-cyan-500/30':i===1?'border-cyan-500/20':'border-cyan-500/10'}`}
                  style={{ scale }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f5ff]" />
                </motion.div>
              ))}
            </div>

            {/* Data stream columns */}
            {[...Array(6)].map((_,i) => (
              <div key={i} className="absolute top-0 w-[1px] h-[200vh] overflow-hidden opacity-30 pointer-events-none z-0" style={{ left: `${10+i*16}%` }}>
                <motion.div 
                  animate={{ y: ["-100%", "100vh"] }}
                  transition={{ duration: 4+i*0.7, repeat: Infinity, ease: "linear", delay: i*0.5 }}
                  className="text-cyan-500/50 font-mono text-[10px] leading-tight flex flex-col items-center"
                >
                  {Array.from({length:60},()=>Math.random()>0.5?"1":"0").map((n, idx) => <span key={idx}>{n}</span>)}
                </motion.div>
              </div>
            ))}

            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
              
              <Reveal>
                <FloatingLogo />
              </Reveal>
              
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8 hover:bg-cyan-500/20 transition-colors duration-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Est. 2012 • Kalasalingam University</span>
                </div>
              </Reveal>

              <StaggerText text="ACM KARE" className="text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
              
              <span className="block text-sm md:text-lg tracking-[0.3em] text-cyan-400/80 uppercase font-mono mb-8">
                Student Chapter
              </span>

              <Reveal>
                <div className="text-xl md:text-2xl font-medium mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  We are <Typewriter texts={["Computing Innovators.", "Problem Solvers.", "Open Source Contributors.", "Future Tech Leaders.", "Community Builders."]} /> <br className="hidden md:block"/>
                  <span className="text-lg">Advancing computing as a science and profession.</span>
                </div>
              </Reveal>

              <div className="flex flex-col sm:flex-row gap-6 mb-24 z-20">
                <Magnetic>
                  <button onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
                    className="relative group px-12 py-5 font-black text-xs uppercase tracking-widest bg-cyan-500 text-black overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">Join ACM <ArrowUpRight size={16} /></span>
                  </button>
                </Magnetic>
                <Magnetic>
                  <button onClick={() => navigate("/events")}
                    style={{ clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
                    className="px-12 py-5 font-black text-xs uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 backdrop-blur-md transition-all text-white hover:scale-105 active:scale-95">
                    Explore Events
                  </button>
                </Magnetic>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mt-12 bg-cyan-500/10 border border-cyan-500/20 p-px w-full max-w-5xl mx-auto backdrop-blur-sm z-20 relative">
                {stats.map((s, i) => (
                  <motion.div 
                    key={i} 
                    whileInView={{ y: 0, opacity: 1 }} 
                    initial={{ y: 20, opacity: 0 }} 
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="text-center group bg-[#050505]/40 backdrop-blur-md p-6 hover:bg-cyan-900/20 transition-colors"
                  >
                    <h3 className="text-3xl md:text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">{s.value}</h3>
                    <p className="font-bold text-slate-500 mt-2 text-[10px] uppercase tracking-widest font-mono">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ── TICKER ─────────────────────────────────────── */}
          <div className="bg-cyan-500 py-4 overflow-hidden -rotate-1 scale-105 relative z-20">
            <div className="flex gap-16 animate-ticker whitespace-nowrap">
              {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="text-[12px] font-black tracking-[0.4em] uppercase text-black flex items-center gap-8 drop-shadow-md">
                  {t} <span className="text-black/30">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── ABOUT SECTION ────────────────── */}
          <section id="about" className="relative py-40 bg-transparent overflow-hidden border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 w-[50vw] h-[50vh] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-7xl">
              
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="scroll-reveal space-y-12">
                  <div>
                    <span className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">Chapter 01</span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                      About <span className="relative inline-block text-white font-black acm-diamond-glow ml-2"><span className="absolute inset-0 text-transparent acm-diamond-outline pointer-events-none">ACM KARE</span><span className="relative z-10 text-white">ACM KARE</span></span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                      At ACM KARE, we're more than just a student chapter—we're a community of innovators, problem solvers, and tech enthusiasts united by a passion for learning and collaboration.
                    </p>
                  </div>

                  <div className="pl-6 border-l-2 border-cyan-500/30">
                    <h3 className="text-2xl font-bold text-white mb-4">Why We Are</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      We are here to bridge the gap between classroom theory and real-world tech. We believe every student deserves a space to explore, build, and lead. We are driven by the idea that collaboration sparks transformation—and we're building that spark every day.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px]"></div>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><BookOpen size={16} /></div>
                      Our Goals
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 relative z-10">
                      At ACM KARE, our goals are rooted in a deep commitment to empowering students through technology, creativity, and collaboration. We strive to build a thriving ecosystem where learners become leaders, and ideas evolve into impactful solutions.
                    </p>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed relative z-10">
                      Our primary goal is to bridge the gap between academic learning and industry expectations. Through hands-on workshops, technical events, and mentorship programs, we aim to equip students with practical skills that go beyond the classroom—preparing them for real-world challenges in software development, hardware design, UI/UX, quantum computing, and more.
                    </p>
                  </div>
                </div>

                {/* 4-Image Collage */}
                <div className="relative h-full min-h-[600px] w-full grid grid-cols-2 grid-rows-3 gap-4 scroll-reveal pt-8 lg:pt-0">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="row-span-2 rounded-[2rem] overflow-hidden border border-white/10 relative group">
                    <img src="https://images.unsplash.com/photo-1592424001801-9d1078385002?auto=format&fit=crop&q=80" alt="VR Workshop" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400">VR Workshop</div>
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="rounded-[2rem] overflow-hidden border border-white/10 relative group">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" alt="Tech Presentation" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400">Tech Presentation</div>
                  </motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="rounded-[2rem] overflow-hidden border border-white/10 relative group">
                    <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80" alt="Collaboration" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-purple-400">Collaboration</div>
                  </motion.div>
                  <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="col-span-2 rounded-[2rem] overflow-hidden border border-white/10 relative group">
                    <img src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80" alt="Innovation" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity object-center" />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-blue-400">Innovation</div>
                  </motion.div>
                </div>
              </div>

            </div>
          </section>

          {/* ── DOMAINS (GRID ANIMATED) ────────────────────── */}
          <section id="domains" className="py-32 bg-transparent border-t border-white/5 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="text-center mb-24">
                <h2 className="text-6xl font-black tracking-tighter text-white">Core Domains</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {domains.map((d, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="group p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 relative overflow-hidden backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-20 group-hover:opacity-60 transition-all duration-700 blur-[40px] group-hover:scale-150" style={{ backgroundColor: d.color }}></div>
                    <motion.div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 border border-white/10 bg-black/50 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-xl" 
                      style={{ color: d.color }}
                    >
                      {d.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">{d.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{d.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TEAM DECK ────────────────────────── */}
          <section id="team" className="py-32 bg-transparent border-t border-white/5">
            <TeamDeck />
          </section>

          {/* ── EVENTS TIMELINE ─────────── */}
          <EventsTimeline />

          {/* ── GALLERY ───────────────────────────────────── */}
          <section id="gallery" className="py-32 bg-transparent border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="text-center mb-24">
                <span className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">Memories</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Event Gallery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
                   "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80",
                   "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80",
                   "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80",
                   "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
                   "https://images.unsplash.com/photo-1475721025505-1175af140c8f?auto=format&fit=crop&q=80"
                 ].map((src, i) => (
                   <div key={i} className={`scroll-reveal group overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 ${i === 0 || i === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                     <div className="relative w-full h-full aspect-[4/3] md:aspect-auto md:h-full min-h-[250px]">
                       <img src={src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                         <p className="text-white font-bold">Tech Symposium 2026</p>
                         <p className="text-cyan-400 text-xs font-mono">View Gallery</p>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </section>

          {/* ── BLOGS ───────────────────────────────────── */}
          <section id="blogs" className="py-32 bg-transparent border-t border-white/5 relative">
             <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
             <div className="container mx-auto px-6 max-w-7xl relative z-10">
               <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
                 <div>
                   <span className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">Insights</span>
                   <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Latest Articles</h2>
                 </div>
                 <button onClick={() => navigate("/blogs")} className="px-6 py-3 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">
                   View All Blogs
                 </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {latestBlogs.map((blog, i) => (
                   <a key={blog._id} href={blog.link} target="_blank" rel="noopener noreferrer" className="scroll-reveal group flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-colors duration-500">
                     <div className="h-48 overflow-hidden relative">
                       <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" loading="lazy" decoding="async" />
                       <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                         {blog.category}
                       </div>
                     </div>
                     <div className="p-8 flex flex-col flex-grow">
                       <span className="text-slate-500 text-xs font-mono mb-4 block">
                         {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • By {blog.author}
                       </span>
                       <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{blog.title}</h3>
                       <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{blog.description}</p>
                       <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300">
                         Read Article <ArrowUpRight size={14} />
                       </div>
                     </div>
                   </a>
                 ))}
               </div>
             </div>
          </section>

          {/* ── CONTACT ────────────────────────────────────── */}
          <section id="contact" className="py-32 bg-transparent border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')]"></div>
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <span className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">Get in Touch</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">Let's Build the<br />Future.</h2>
                    <p className="text-slate-400 mb-12">Have a question or want to collaborate? We're always looking for innovative minds to join our community.</p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Mail size={18} /></div>
                        <span className="font-mono text-sm">acm@klu.ac.in</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><MapPin size={18} /></div>
                        <span className="font-mono text-sm">Kalasalingam Academy of Research and Education</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-12">
                      <Magnetic><a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all"><Linkedin size={18} /></a></Magnetic>
                      <Magnetic><a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all"><Github size={18} /></a></Magnetic>
                      <Magnetic><a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all"><Twitter size={18} /></a></Magnetic>
                    </div>
                  </div>
                  
                  <div className="space-y-6 bg-black/40 p-8 md:p-12 rounded-[2rem] border border-white/10 backdrop-blur-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Message</label>
                      <textarea placeholder="How can we help?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"></textarea>
                    </div>
                    <button className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-95 transition-all mt-4">
                      Send Transmission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </motion.div>
      )}
    </>
  );
}
