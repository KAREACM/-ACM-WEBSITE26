import { Nav } from "@/components/acm/Nav";
import { Footer } from "@/components/acm/Footer";
import { LogoPreloader } from "@/components/acm/LogoPreloader";
import { allBlogs } from "@/components/acm/blogsData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useState, useEffect } from "react";

// ── Animated Background ──
const BlogBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* Soft Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500 rounded-full blur-[1px]"
          animate={{
            y: ["100vh", "-10vh"],
            x: [Math.random() * 20 - 10 + "vw", Math.random() * 20 - 10 + "vw"],
            opacity: [0, Math.random() * 0.5 + 0.1, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
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
      
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    </div>
  );
});

export default function Blogs() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('introPlayed'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LogoPreloader onComplete={() => { sessionStorage.setItem('introPlayed', 'true'); setLoading(false); }} />}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
          <BlogBackground />
          <Nav />
          
          <main className="relative z-10 container mx-auto px-6 pt-40 pb-32 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-24">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-cyan-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block"
              >
                Insights & Research
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6"
              >
                Latest Articles
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 max-w-2xl mx-auto text-lg"
              >
                Explore our thoughts on the latest technologies, innovations, and computing trends written by the ACM community.
              </motion.p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allBlogs.map((blog, i) => (
                <motion.a
                  key={blog._id}
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="group flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                >
                  <div className="h-56 overflow-hidden relative bg-black">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                      {blog.category}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow bg-[#030712]">
                    <span className="text-slate-500 text-xs font-mono mb-4 block">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • By {blog.author}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      {blog.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 mt-auto pt-4 border-t border-white/5">
                      Read Article <ArrowUpRight size={14} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </main>
          
          <Footer />
        </div>
      )}
    </>
  );
}
