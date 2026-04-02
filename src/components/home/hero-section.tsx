"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Building2, ShieldCheck, Globe, Mail, Phone, Info, LayoutDashboard, Search, ArrowRight
} from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

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
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-[140px] md:pt-[180px] pb-24 overflow-hidden hero-bg-custom">
      {/* Impeccable Background Decoration */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.12] pointer-events-none" />
      
      {/* Sun Decoration (Line art) */}
      <div className="absolute top-24 left-[10%] opacity-[0.08] pointer-events-none z-0">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="text-primary animate-pulse-slow">
           <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" />
           {[...Array(12)].map((_, i) => (
             <line 
               key={i} 
               x1="100" y1="45" x2="100" y2="20" 
               stroke="currentColor" 
               strokeWidth="1" 
               transform={`rotate(${i * 30} 100 100)`}
             />
           ))}
        </svg>
      </div>

      {/* Andes Mountains Multi-layered Silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] md:h-[400px] opacity-[0.06] pointer-events-none select-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path fill="currentColor" className="text-brand-indigo/30" d="M0,160L40,144C80,128,160,96,240,106.7C320,117,400,171,480,181.3C560,192,640,160,720,138.7C800,117,880,107,960,112C1040,117,1120,139,1200,160C1280,181,1360,203,1400,213.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z" />
          <path fill="currentColor" className="text-primary/40" d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,149.3C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="currentColor" className="text-brand-teal/20" d="M0,288L60,256C120,224,240,160,360,160C480,160,600,224,720,224C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 lg:gap-8 items-center">
          
          {/* Left: Branding & Benefits (Primary on Mobile) */}
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center lg:text-left"
            >
              <div className="space-y-4">
                 <Badge variant="outline" className="border-brand-indigo/20 text-brand-indigo uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-2xl inline-flex">
                    Plataforma #1 de Casas en Chile
                 </Badge>
                 <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-[-0.05em] leading-[0.9] text-brand-indigo">
                    CASAS PREFABRICADAS <br />
                    <span className="gradient-text block translate-y-2 uppercase italic">Compara y Cotiza</span>
                 </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground/90 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                 Encuentra tu hogar ideal entre <span className="text-foreground font-bold">+5.000 modelos</span> de casas SIP, modulares y tradicionales de <span className="text-foreground border-b-4 border-brand-teal/40 pb-1 font-black">226 constructoras</span> certificadas en todo Chile.
              </p>

              {/* CTA (Form in Modal) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                   <DialogTrigger render={
                     <Button size="lg" className="w-full brand-gradient text-white font-black rounded-2xl h-16 text-sm tracking-[0.1em] shadow-2xl shadow-primary/20">
                       SOLICITAR ASESORÍA EXPERTA
                       <ArrowRight className="w-5 h-5 ml-2" />
                     </Button>
                   } />
                   <DialogContent className="sm:max-w-[550px] w-full p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
                     <div className="p-8 md:p-12 bg-background w-full space-y-8 border-t-8 border-brand-indigo">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none">
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

              {/* Desktop Benefits Summary */}
              <div className="hidden lg:grid grid-cols-2 gap-6 pt-6 text-left">
                 {[
                   { icon: <LayoutDashboard className="w-5 h-5" />, title: "Comparador Pro", desc: "Evalúa modelos lado a lado" },
                   { icon: <Info className="w-5 h-5" />, title: "Info Técnica", desc: "Planos y materiales det." }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-black tracking-tight text-sm uppercase">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-8 justify-items-center lg:justify-items-start border-t border-brand-indigo/10 pt-10">
               {[
                 { icon: <Building2 className="w-5 h-5" />, val: "+5.000", label: "Modelos" },
                 { icon: <ShieldCheck className="w-5 h-5" />, val: "Auditoría", label: "Calidad" },
                 { icon: <Globe className="w-5 h-5" />, val: "16 Regiones", label: "Cobertura" },
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.4 + (i * 0.1) }}
                   className="flex flex-col items-center lg:items-start gap-3 group"
                 >
                   <div className="w-12 h-12 bg-brand-indigo/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-indigo group-hover:brand-gradient group-hover:text-white transition-all duration-500">
                      {stat.icon}
                   </div>
                   <div className="space-y-1">
                      <div className="text-xl font-black text-brand-indigo tracking-tight">{stat.val}</div>
                      <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none opacity-60">{stat.label}</div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Right: Desktop Image Slider */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:flex relative w-full h-[650px]"
          >
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center p-4"
                >
                   <Image
                     src={SLIDER_IMAGES[currentImageIndex]}
                     alt={`Modelo destacado ${currentImageIndex + 1}`}
                     fill
                     className="object-contain"
                     priority={currentImageIndex === 0}
                   />
                </motion.div>
             </AnimatePresence>
          </motion.div> 

        </div>
      </div>
    </section>
  );
}
