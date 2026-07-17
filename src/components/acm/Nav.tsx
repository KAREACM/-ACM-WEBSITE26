import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { label: "HOME",    id: "top" },
  { label: "ABOUT",   id: "about" },
  { label: "TEAM",    id: "team" },
  { label: "EVENTS",  id: "events" },
  { label: "GALLERY", id: "gallery" },
  { label: "BLOGS",   id: "blogs" },
  { label: "CONTACT", id: "contact" },
];

export const Nav = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [active,   setActive]     = useState("HOME");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/events") {
      setActive("EVENTS");
    } else {
      // In a real app we might determine active based on scroll position, 
      // but keeping it simple for now based on what was last clicked.
      if (active === "EVENTS") {
        setActive("HOME");
      }
    }
  }, [location.pathname]);

  const handleNav = (id: string, label: string) => {
    setActive(label);
    setMobileOpen(false);

    if (id === "events") {
      navigate("/events");
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);
    if(el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = () => {
    setActive("HOME");
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="relative flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
          
          {/* Logo — left */}
          <div className="pointer-events-auto flex items-center gap-4 group cursor-pointer"
            onClick={handleLogoClick}>
            <Magnetic>
              <div className="w-12 h-12 transition-all group-hover:scale-110 bg-white/5 rounded-2xl p-2 border border-white/10 backdrop-blur-md">
                <img src="/assets/images/logo/acm_logo.png" alt="ACM KARE" className="w-full h-full object-contain" />
              </div>
            </Magnetic>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">KARE ACM</span>
              <span className="text-[8px] tracking-[0.2em] font-bold text-gray-400 uppercase">Student Chapter</span>
            </div>
          </div>

          {/* Center pill */}
          <nav className={`
            pointer-events-auto hidden lg:flex items-center gap-1
            bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2
            transition-all duration-700 shadow-2xl
            ${scrolled ? "shadow-cyan-500/10 bg-black/60" : ""}
          `}>
            {NAV.map(n => (
              <Magnetic key={n.label}>
                <button
                  className={`
                    px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300
                    ${active === n.label ? "bg-white text-black shadow-lg shadow-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"}
                  `}
                  onClick={() => handleNav(n.id, n.label)}
                >
                  {n.label}
                </button>
              </Magnetic>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="pointer-events-auto flex items-center gap-4">
            <Magnetic>
              <button 
                onClick={() => handleNav("contact", "CONTACT")}
                className="hidden md:inline-flex relative group bg-cyan-500 text-black px-8 py-3 rounded-full text-[11px] font-black tracking-widest uppercase overflow-hidden transition-all hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Join Us</span>
              </button>
            </Magnetic>
            <button 
              className="lg:hidden w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setMobileOpen(false)} />
        <nav className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 w-full px-12 text-center">
          {NAV.map((n, i) => (
            <button
              key={n.label}
              className={`text-2xl md:text-4xl font-black tracking-widest uppercase transition-all duration-500 ${active === n.label ? "text-cyan-400 scale-110" : "text-gray-600 hover:text-white"}`}
              style={{ transitionDelay: `${i * 50}ms`, transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileOpen ? 1 : 0 }}
              onClick={() => handleNav(n.id, n.label)}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
