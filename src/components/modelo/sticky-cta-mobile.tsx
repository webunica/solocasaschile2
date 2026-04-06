"use client";

import { MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CotizarModal } from "./cotizar-modal";
import { Button } from "../ui/button";

interface StickyCTAMobileProps {
  modeloId: string;
  modeloNombre: string;
  constructoraId: string;
  constructoraNombre: string;
}

export function StickyCTAMobile({ 
  modeloId, 
  modeloNombre, 
  constructoraId, 
  constructoraNombre 
}: StickyCTAMobileProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls past the gallery/hero (e.g. 500px)
      const scrolled = window.scrollY > 500;
      // We don't hide it at the end anymore, always accessible unless they reach the very bottom footer
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      
      setIsVisible(scrolled && !isAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-[90] lg:hidden"
        >
          <CotizarModal
            modeloId={modeloId}
            modeloNombre={modeloNombre}
            constructoraId={constructoraId}
            constructoraNombre={constructoraNombre}
            trigger={
                <div className="bg-brand-indigo/95 backdrop-blur-xl text-white rounded-[2rem] p-3 flex items-center justify-between shadow-2xl shadow-brand-indigo/40 ring-1 ring-white/20 active:scale-95 transition-transform cursor-pointer">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center text-brand-indigo">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none opacity-60">Tu casa ideal</span>
                            <span className="text-sm font-black tracking-tighter leading-none mt-1">Consultar Ahora</span>
                        </div>
                    </div>
                    <Button 
                        variant="secondary"
                        className="rounded-xl h-11 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-teal/20"
                    >
                        Cotizar <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                </div>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
