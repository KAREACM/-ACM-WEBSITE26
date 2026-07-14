import { useEffect, useState } from "react";
import { X } from "lucide-react";

export const AwardModal = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed bottom-10 right-10 z-[100] flex items-center justify-center p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="relative max-w-sm w-full text-center bg-card border border-primary/20 rounded-lg p-6 shadow-2xl backdrop-blur-md">
        <button
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute -top-2 right-0 w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-card transition"
        >
          <X className="w-4 h-4" />
        </button>
        <img
          src="https://d3nq00vfgndsnf.cloudfront.net/acm-celeb.png"
          alt="ACM Outstanding School Service"
          className="mx-auto w-32 md:w-48"
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
        <h2 className="mt-6 text-xl md:text-2xl font-semibold tracking-wider">
          ACM INTERNATIONAL CHAPTER AWARD
          <br />
          FOR OUTSTANDING SCHOOL SERVICE
        </h2>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
          Happy to annouce that KARE ACM has been awarded the ACM International Chapter Award for Outstanding School Service!
        </p>
      </div>
    </div>
  );
};