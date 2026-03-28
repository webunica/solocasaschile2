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
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center space-y-4 mb-20 uppercase">
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
            className="text-4xl md:text-6xl font-heading font-black tracking-tighter"
          >
            ¿Cómo funciona <span className="gradient-text">SolocasasChile?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brand-indigo/20 via-brand-teal/20 to-brand-indigo/20 hidden lg:block -translate-y-12" />
          
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
                className="relative space-y-8 group"
              >
                {/* Icon Container */}
                <div className="relative flex justify-center">
                   <div className={cn(
                     "w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white relative z-10",
                     "transition-all duration-500 group-hover:scale-110 shadow-2xl",
                     step.color,
                     i % 2 === 0 ? "shadow-brand-indigo/30" : "shadow-brand-teal/30"
                   )}>
                      <Icon className="w-10 h-10" />
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-muted/5 flex items-center justify-center font-black text-xs text-primary shadow-lg">
                        {i + 1}
                      </div>
                   </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4 px-4">
                  <h3 className="text-2xl font-black font-heading tracking-tighter group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">
                    {step.description}
                  </p>
                </div>

                {/* Arrow indicator (Mobile) */}
                {i < STEPS.length - 1 && (
                   <div className="flex justify-center md:hidden pt-4 opacity-20">
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
