"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: "tracking",
    badge: "Transparencia Total",
    title: "Construye con confianza y control total.",
    subtitle: "Usa nuestro nuevo sistema de Seguimiento de Obra para ver el avance real, fotos de bitácora y cumplimiento de hitos.",
    image: "/images/promo-tracking.jpg",
    link: "/seguimiento-de-obras",
    exampleLink: "/seguimiento/e356c78f-9374-4a71-ab07-52254530c6b3",
    features: ["Fotos reales 24/7", "Línea de tiempo interactiva", "Control de plazos críticos"],
    accent: "text-brand-teal",
    bgBadge: "bg-brand-teal/10 text-brand-teal"
  },
  {
    id: "constru",
    badge: "Solución B2B",
    title: "Conecta tu obra con los mejores proveedores.",
    subtitle: "Digitaliza tu catálogo y gestiona cotizaciones directamente con las constructoras más importantes del país.",
    image: "/images/promo-constru.jpg",
    link: "/portal-proveedores",
    features: ["Catálogo digital dinámico", "Gestión de cotizaciones", "Analítica de mercado"],
    accent: "text-brand-indigo",
    bgBadge: "bg-brand-indigo/10 text-brand-indigo"
  }
];

export function SeguimientoPromo() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Visual Presentation - Carousel Frame */}
          <div className="w-full lg:w-1/2 relative">
             <div className="relative h-[500px] w-full rounded-[3rem] border border-border/40 shadow-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/60 via-transparent to-transparent opacity-60" />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute bottom-8 right-8 flex gap-3 z-30">
                  <button 
                    onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-indigo transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-indigo transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 left-8 flex gap-2 z-30">
                   {SLIDES.map((_, i) => (
                     <div 
                      key={i} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i === current ? "w-8 bg-brand-teal" : "w-2 bg-white/30"
                      )}
                     />
                   ))}
                </div>
             </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <Badge className={cn("border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]", slide.bgBadge)}>
                    {slide.badge}
                  </Badge>
                  <h2 className={cn("text-[clamp(1.5rem,5vw,3.5rem)] font-heading font-black leading-[1.1] tracking-tighter text-brand-indigo")}>
                    {slide.title.split('.').map((part, i) => (
                      <span key={i} className={cn(i === 1 && slide.accent)}>
                        {part}{i === 0 && '.'}
                        <br />
                      </span>
                    ))}
                  </h2>
                </div>
                
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl opacity-80">
                  {slide.subtitle}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {slide.features.map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-brand-indigo">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", slide.id === 'tracking' ? "bg-brand-teal/20" : "bg-brand-indigo/10")}>
                        <CheckCircle2 className={cn("w-4 h-4", slide.id === 'tracking' ? "text-brand-teal" : "text-brand-indigo")} />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                  <Link href={slide.link} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full bg-brand-indigo text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-brand-indigo/20 hover:scale-105 transition-transform group">
                      EXPLORAR {slide.id === 'tracking' ? 'SEGUIMIENTO' : 'PORTAL B2B'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  {slide.exampleLink && (
                    <Link href={slide.exampleLink} className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-indigo hover:text-brand-teal transition-colors">
                      Ver un ejemplo real
                      <div className="w-8 h-8 rounded-full bg-brand-indigo/5 flex items-center justify-center group-hover:bg-brand-teal/10 transition-colors">
                         <Search className="w-4 h-4" />
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
