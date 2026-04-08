"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CONSTRUCTION_SYSTEMS } from "@/config/construction-systems";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { HeroLeadForm } from "./hero-lead-form";

export function TypesSection() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalItems = CONSTRUCTION_SYSTEMS.length;
  const desktopVisible = 4;
  const maxIndex = isMobile ? totalItems - 1 : totalItems - desktopVisible;
  
  const next = () => setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  // Auto-slide 
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [maxIndex, index]); 

  // Mobile Carousel Logic: Central Card with side peeking
  // On mobile we want card width to be ~80% and 10% on each side to peek.
  const cardWidth = isMobile ? 80 : 25; // % of container
  const gap = isMobile ? 4 : 0; // % gap
  const offset = isMobile ? 10 : 0; // % initial offset to center first card

  return (
    <section className="pt-32 pb-[100px] bg-background relative overflow-hidden">
      {/* Organic Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-indigo/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20 text-left">
          <div className="max-w-2xl space-y-6">
            <Badge variant="outline" className="border-primary/20 text-primary uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
              Sistemas Constructivos
            </Badge>
            <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-heading font-black leading-[0.9] tracking-tighter">
              Elige tu <span className="gradient-text">Ecosistema</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-6 items-start lg:items-end w-full lg:w-auto">
             <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed hidden lg:block opacity-70">
               Filtramos la industria para ofrecerte los modelos que combinan diseño vanguardista con eficiencia real.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        size="lg"
                        className="bg-brand-teal text-brand-indigo font-black text-xs md:text-sm rounded-2xl h-12 px-6 shadow-xl shadow-brand-teal/25 transition-transform active:scale-95 border-b-4 border-brand-indigo/20 flex"
                      >
                        SOLICITAR ASESORÍA EXPERTA
                        <ArrowRight className="w-4 h-4 ml-2 opacity-80" />
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] p-0 rounded-3xl border-none shadow-2xl max-h-[90dvh] overflow-y-auto">
                    <div className="p-5 md:p-12 bg-background w-full space-y-5 md:space-y-6 border-t-8 border-brand-indigo relative">
                      <DialogHeader className="pt-2">
                        <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
                          Asesoría <span className="text-brand-teal">Profesional</span>
                        </DialogTitle>
                        <p className="text-muted-foreground font-medium text-sm">
                          Cuéntanos sobre tu proyecto y recibe atención técnica personalizada.
                        </p>
                      </DialogHeader>
                      <HeroLeadForm />
                      <div className="w-full flex justify-center pt-2 pb-2">
                        <DialogClose className="text-xs font-bold text-muted-foreground underline underline-offset-4 p-2.5 rounded-lg active:scale-95 transition-all">
                          Cerrar ventana
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex gap-2">
                  <Button 
                    onClick={prev} 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/10 bg-white shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={next} 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/10 bg-white shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
             </div>
          </div>
        </div>

        <div className="relative overflow-visible md:px-0">
          <motion.div 
            className="flex cursor-grab active:cursor-grabbing"
            animate={{ 
              x: isMobile 
                ? `calc(${offset}% - ${index * (cardWidth + gap)}%)`
                : `-${index * cardWidth}%`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: -1000, right: 1000 }} // Will be refined by actual content
            onDragEnd={(_, info) => {
              if (isMobile) {
                const threshold = 50;
                if (info.offset.x < -threshold && index < maxIndex) next();
                else if (info.offset.x > threshold && index > 0) prev();
              }
            }}
          >
            {CONSTRUCTION_SYSTEMS.map((type: any, i: number) => (
              <motion.div 
                key={type.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ 
                  width: `${cardWidth}%`,
                  marginRight: isMobile ? `${gap}%` : "0"
                }}
                className={cn(
                  "flex-none p-2 md:p-4 group transition-all duration-500",
                  isMobile && index !== i ? "opacity-40 scale-90 grayscale blur-[2px]" : "opacity-100 scale-100"
                )}
              >
                <Link href={type.link} className="block h-full outline-none">
                  <div className={cn(
                    "h-full p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-border/40 bg-gradient-to-br transition-all duration-500",
                    "hover:shadow-[0_40px_80px_-20px_rgba(27,0,136,0.12)] hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between min-h-[420px] md:min-h-[480px]",
                    type.color
                  )}>
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="space-y-6 md:space-y-8 relative z-10">
                      <div className={cn(
                        "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:brightness-110",
                        type.accent,
                        type.accent === "bg-brand-indigo" ? "shadow-brand-indigo/30" : "shadow-brand-teal/30"
                      )}>
                        {type.icon}
                      </div>
                      
                      <div className="space-y-3 md:space-y-4">
                         <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tighter text-foreground group-hover:text-primary transition-colors">{type.title}</h3>
                         <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed opacity-80">
                           {type.description}
                         </p>
                      </div>
                    </div>

                    <div className="flex items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-8 md:mt-12 group-hover:gap-4 transition-all">
                      Explorar Modelos 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
