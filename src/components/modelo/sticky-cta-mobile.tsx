"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function StickyCTAMobile({ targetId }: { targetId: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls past the gallery/hero (e.g. 600px)
      // and hide when they reach the actual form
      const target = document.getElementById(targetId);
      if (!target) return;
      
      const targetRect = target.getBoundingClientRect();
      const scrolled = window.scrollY > 600;
      const reachedTarget = targetRect.top < window.innerHeight;
      
      setIsVisible(scrolled && !reachedTarget);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetId]);

  const scrollToForm = () => {
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[60] lg:hidden"
        >
          <div className="bg-foreground text-background rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-black/40 ring-1 ring-white/10 group active:scale-95 transition-transform">
             <div className="flex items-center gap-4 ml-2">
                <div className="w-10 h-10 rounded-2xl brand-gradient flex items-center justify-center text-white">
                   <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase tracking-widest leading-none opacity-40">¿Te gusta?</span>
                   <span className="text-sm font-black tracking-tighter leading-none mt-1">Cotiza Ahora</span>
                </div>
             </div>
             <Button 
               onClick={scrollToForm}
               className="rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest bg-white text-black hover:bg-white/90"
             >
               Solicitar <ArrowRight className="w-3 h-3 ml-2" />
             </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
