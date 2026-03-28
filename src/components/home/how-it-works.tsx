"use client";

import { motion } from "framer-motion";
import { Search, MousePointer2, Home, PhoneCall, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Search,
    title: "Busca tu Hogar",
    description: "Miles de familias comienzan buscando 'casas prefabricadas' o 'paneles SIP' en Google.",
    color: "bg-brand-indigo",
    delay: 0
  },
  {
    icon: MousePointer2,
    title: "Llega a SolocasasChile",
    description: "Accedes a la plataforma líder con la oferta más completa y transparente de todo Chile.",
    color: "bg-brand-teal",
    delay: 0.2
  },
  {
    icon: Home,
    title: "Elige tus Favoritos",
    description: "Explora catálogos, compara metros² y selecciona los modelos que mejor se adaptan a ti.",
    color: "bg-brand-indigo",
    delay: 0.4
  },
  {
    icon: PhoneCall,
    title: "Cotiza y Construye",
    description: "Contactas directamente a la constructora, recibes tu presupuesto y haces realidad tu sueño.",
    color: "bg-brand-teal",
    delay: 0.6
  }
];

export function HowItWorks() {
  return (
    <section className="pt-20 pb-32 bg-muted/20 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center space-y-4 mb-24 uppercase">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black tracking-[0.4em] text-primary"
          >
            Tu Viaje Hacia el Hogar Propio
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.3rem,6vw,4.5rem)] font-heading font-black tracking-tighter leading-none"
          >
            ¿Cómo funciona <span className="gradient-text">SolocasasChile?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          
          {/* Animated Connecting Path (Desktop) */}
          <div className="absolute top-[180px] left-[10%] right-[10%] h-[120px] hidden lg:block overflow-visible pointer-events-none">
             <svg className="w-full h-full" fill="none" viewBox="0 0 1000 120" preserveAspectRatio="none">
                {/* Static Dotted Path */}
                <path 
                   d="M 0 0 C 125 0, 125 100, 250 100 C 375 100, 375 0, 500 0 C 625 0, 625 100, 750 100 C 875 100, 875 0, 1000 0" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeDasharray="8 12" 
                   className="text-primary/20"
                />
                
                {/* Travelling Dot Animation */}
                <motion.circle
                  r="6"
                  fill="currentColor"
                  className="text-primary"
                  style={{ offsetPath: "path('M 0 0 C 125 0, 125 100, 250 100 C 375 100, 375 0, 500 0 C 625 0, 625 100, 750 100 C 875 100, 875 0, 1000 0')", offsetRotate: "auto" }}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <motion.circle
                  r="3"
                  fill="white"
                  style={{ offsetPath: "path('M 0 0 C 125 0, 125 100, 250 100 C 375 100, 375 0, 500 0 C 625 0, 625 100, 750 100 C 875 100, 875 0, 1000 0')", offsetRotate: "auto" }}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
             </svg>
          </div>
          
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center gap-12 group"
              >
                {/* 1. Content (Now Above) */}
                <div className="text-center space-y-4 px-2 min-h-[100px] flex flex-col justify-end">
                  <h3 className="text-2xl font-black font-heading tracking-tighter group-hover:text-primary transition-colors leading-none">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80 max-w-[240px] mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* 2. Icon Container (Now Below) */}
                <div className="relative flex justify-center z-10">
                   <div className={cn(
                     "w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white relative z-10",
                     "transition-all duration-500 group-hover:scale-110 shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
                     step.color,
                     i % 2 === 0 ? "shadow-brand-indigo/40" : "shadow-brand-teal/40"
                   )}>
                      <Icon className="w-10 h-10 drop-shadow-xl" />
                      
                      {/* Step Number Badge - High Contrast Fix */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 border-4 border-muted/20 flex items-center justify-center font-black text-[10px] text-white shadow-xl z-20">
                        0{i + 1}
                      </div>
                   </div>
                </div>

                {/* Mobile indicators */}
                {i < STEPS.length - 1 && (
                   <div className="flex justify-center lg:hidden pt-4 opacity-10">
                      <ArrowRight className="w-6 h-6 rotate-90" />
                   </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
