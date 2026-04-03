'use client';

import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function PromotionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div className="bg-brand-indigo text-white py-3 px-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-50 animate-pulse pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto flex items-center justify-center gap-4 text-center relative z-10">
        <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
           Promo Lanzamiento
        </div>
        
        <p className="text-xs sm:text-sm font-black tracking-tight uppercase sm:normal-case">
          ¡Potencia tu Constructora! <span className="text-amber-300 underline underline-offset-4 decoration-amber-300/40">50% DE DESCUENTO</span> en planes Pro y Premium hasta el 30 de abril.
        </p>

        <Link 
          href="/planes" 
          className="flex items-center gap-2 bg-white text-brand-indigo px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-300 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
        >
          Ver Oferta <ArrowRight className="w-3 h-3" />
        </Link>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-0 sm:right-4 p-1 opacity-40 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
