"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2, ShieldCheck, Globe, ArrowRight } from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SLIDER_IMAGES = [
  "/images/slider/m_001.jpg",
  "/images/slider/m_002.jpg",
  "/images/slider/m_003.jpg",
  "/images/slider/m_004.jpg",
  "/images/slider/m_005.jpg",
  "/images/slider/m_006.jpg",
  "/images/slider/m_007.jpg",
  "/images/slider/m_008.jpg",
  "/images/slider/m_009.jpg",
];

const CONSTRUCTION_TYPES = [
  "PREFABRICADAS",
  "PANEL SIP",
  "MODULARES",
  "CONTAINERS",
  "STEEL FRAMING",
  "MADERA",
  "HORMIGÓN",
];

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [typeIndex, setTypeIndex] = useState(0);

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4500);

    const typeTimer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % CONSTRUCTION_TYPES.length);
    }, 3000);

    return () => {
      clearInterval(sliderTimer);
      clearInterval(typeTimer);
    };
  }, []);

  return (
    <section className="relative flex items-center pt-[140px] md:pt-[180px] pb-10 md:pb-24 overflow-x-clip w-full hero-bg-custom min-h-auto md:min-h-[95vh]">

      {/* ── Background images ── */}
      <div 
        className="absolute inset-0 z-0 opacity-90"
        style={{
          backgroundImage: "radial-gradient( circle 476px at 54.8% 51.5%, rgba(168,229,253,1) 0%, rgba(244,244,254,1) 42.3%, rgba(244,244,254,1) 100.2% )",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* ── Content ── */}
      <div className="container relative z-10 max-w-7xl mx-auto px-5 md:px-12 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-8 items-center lg:items-start w-full">

          {/* Left column */}
          <div className="flex flex-col gap-6 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-5 md:space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Badge */}
              <Badge
                variant="outline"
                className="border-brand-indigo/30 text-brand-indigo uppercase tracking-[0.15em] px-4 py-1.5 rounded-full inline-flex text-[10px] md:text-sm bg-white/70 lg:bg-transparent backdrop-blur-sm font-extrabold"
              >
                Plataforma #1 de Casas en Chile
              </Badge>

              {/* Headline */}
              <h1 className="flex flex-col gap-2 md:gap-5 items-center lg:items-start w-full">
                <div className="flex flex-col gap-0 items-center lg:items-start w-full">
                  <span className="text-[clamp(2rem,8vw,3.75rem)] font-black tracking-[-0.05em] leading-none text-brand-indigo uppercase [text-shadow:0_1px_8px_rgba(255,255,255,0.9)]">
                    CASAS
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={typeIndex}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="text-brand-teal text-[clamp(2rem,8vw,64px)] font-black tracking-[-0.05em] leading-none uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_0_8px_rgba(0,0,0,0.4)]"
                    >
                      {CONSTRUCTION_TYPES[typeIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-xs md:max-w-sm lg:max-w-none mx-auto lg:mx-0">
                  <div className="bg-brand-teal text-brand-indigo px-4 py-2 rounded-none uppercase font-black text-[clamp(1.8rem,7vw,60px)] leading-none text-center lg:text-left w-full shadow-md shadow-brand-teal/10">
                    COMPARA
                  </div>
                  <div className="bg-brand-indigo text-brand-teal px-4 py-2 rounded-none uppercase font-black text-[clamp(1.8rem,7vw,60px)] leading-none text-center lg:text-left w-full shadow-md shadow-brand-indigo/10">
                    Y COTIZA
                  </div>
                </div>
              </h1>

              {/* Description */}
              <div className="flex flex-col gap-1 items-center lg:items-start text-center lg:text-left">
                <p className="text-xl md:text-3xl font-black text-brand-indigo tracking-tight leading-none uppercase italic underline decoration-brand-teal decoration-4 underline-offset-4">
                  Fichas técnicas claras
                </p>
                <p className="text-lg md:text-2xl font-black text-brand-teal uppercase tracking-tighter leading-none [text-shadow:0_1px_4px_rgba(0,0,0,0.2)]">
                  DATOS ÚTILES Y ORDENADOS
                </p>
              </div>

              {/* CTA button */}
              <div className="w-full max-w-xs sm:max-w-none mx-auto lg:mx-0">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-brand-teal text-brand-indigo font-black text-sm md:text-base rounded-2xl h-12 md:h-16 px-6 md:px-8 shadow-xl shadow-brand-teal/25 transition-transform active:scale-95 border-b-4 border-brand-indigo/20"
                      >
                        SOLICITAR ASESORÍA EXPERTA
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                    <div className="p-6 md:p-12 bg-background w-full space-y-6 border-t-8 border-brand-indigo">
                      <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
                          Asesoría <span className="text-brand-teal">Profesional</span>
                        </DialogTitle>
                        <p className="text-muted-foreground font-medium text-sm">
                          Cuéntanos sobre tu proyecto y recibe atención técnica personalizada.
                        </p>
                      </DialogHeader>
                      <HeroLeadForm />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 justify-items-center lg:justify-items-start border-t border-brand-indigo/10 pt-6 md:pt-10">
              {[
                { icon: <Building2 className="w-4 h-4 md:w-5 md:h-5" />, val: "Información", label: "Clara" },
                { icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />, val: "Auditoría", label: "Calidad" },
                { icon: <Globe className="w-4 h-4 md:w-5 md:h-5" />, val: "16 Regiones", label: "Cobertura" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex flex-col items-center lg:items-start gap-2 md:gap-3 group"
                >
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-brand-indigo/8 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-all duration-500">
                    {stat.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs md:text-xl font-black text-brand-indigo tracking-tight leading-none truncate">{stat.val}</div>
                    <div className="text-[8px] md:text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none opacity-60">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop slider hidden — bg image now covers full hero */}

        </div>
      </div>
    </section>
  );
}
