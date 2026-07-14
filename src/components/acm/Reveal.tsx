import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

export const Reveal = ({ children, className = "", style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); ob.disconnect(); } },
      { threshold: 0.12 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
};