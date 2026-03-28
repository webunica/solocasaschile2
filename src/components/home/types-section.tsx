"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Box, Layers, Hammer, Key, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const TYPES = [
  {
    id: "prefabricada",
    title: "Prefabricada",
    description: "Construidas en fábrica y ensambladas en sitio. La eficiencia llevada al máximo estándar.",
    icon: <Box className="w-8 h-8" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    accent: "bg-brand-indigo",
    link: "/tipos/prefabricada"
  },
  {
    id: "sip",
    title: "Panel SIP",
    description: "Alto rendimiento térmico y acústico mediante paneles aislados estructurales.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    accent: "bg-brand-teal",
    link: "/tipos/sip"
  },
  {
    id: "container",
    title: "Container",
    description: "Diseño industrial y vanguardista a partir de arquitectura modular reciclada.",
    icon: <Hammer className="w-6 h-6" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    accent: "bg-brand-indigo",
    link: "/tipos/container"
  },
  {
    id: "sociales",
    title: "Casas Sociales",
    description: "Viviendas con subsidio estatal (DS19/DS49) diseñadas para la integración familiar.",
    icon: <Users className="w-6 h-6" />,
    color: "from-brand-indigo/20 to-brand-indigo/10",
    accent: "bg-brand-indigo",
    link: "/tipos/sociales"
  },
  {
    id: "llave-en-mano",
    title: "Llave en Mano",
    description: "Gestión integral: desde el diseño y permisos hasta la entrega definitiva.",
    icon: <Key className="w-6 h-6" />,
    color: "from-brand-teal/20 to-brand-teal/10",
    accent: "bg-brand-teal",
    link: "/tipos/llave-en-mano"
  }
];

export function TypesSection() {
  const [index, setIndex] = useState(0);
  const maxIndex = TYPES.length - 4; // Show 4 items on large screens
  
  const next = () => setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  // Auto-slide to show it's animated
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="pt-32 pb-14 bg-background relative overflow-hidden">
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
          
          <div className="flex flex-col gap-6 items-start lg:items-end">
             <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed hidden lg:block opacity-70">
               Filtramos la industria para ofrecerte los modelos que combinan diseño vanguardista con eficiencia real.
             </p>
             <div className="flex gap-2">
                <Button 
                  onClick={prev} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={next} 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full w-12 h-12 border-primary/20 hover:bg-primary/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
             </div>
          </div>
        </div>

        <div className="relative overflow-visible">
          <div className="flex transition-all duration-700 ease-out" style={{ transform: `translateX(-${index * (100 / 4)}%)` }}>
            {TYPES.map((type, i) => (
              <motion.div 
                key={type.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex-none w-full md:w-1/2 lg:w-1/4 p-4 group"
              >
                <Link href={type.link} className="block h-full outline-none">
                  <div className={cn(
                    "h-full p-10 rounded-[3rem] border border-border/40 bg-gradient-to-br transition-all duration-500",
                    "hover:shadow-[0_40px_80px_-20px_rgba(27,0,136,0.12)] hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between min-h-[480px]",
                    type.color
                  )}>
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="space-y-8 relative z-10">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:brightness-110",
                        type.accent,
                        type.accent === "bg-brand-indigo" ? "shadow-brand-indigo/30" : "shadow-brand-teal/30"
                      )}>
                        {type.icon}
                      </div>
                      
                      <div className="space-y-4">
                         <h3 className="text-3xl font-black font-heading tracking-tighter text-foreground group-hover:text-primary transition-colors">{type.title}</h3>
                         <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">
                           {type.description}
                         </p>
                      </div>
                    </div>

                    <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-12 group-hover:gap-4 transition-all">
                      Explorar Modelos 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
