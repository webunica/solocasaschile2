"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, ShieldCheck, Globe, Mail, Phone
} from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-background">
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

      {/* Andes Mountains Multi-layered Silhouette (SVG Decor) */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] opacity-[0.06] pointer-events-none select-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          {/* Layer 0: Far Peaks */}
          <path 
            fill="currentColor" 
            className="text-brand-indigo/30"
            d="M0,160L40,144C80,128,160,96,240,106.7C320,117,400,171,480,181.3C560,192,640,160,720,138.7C800,117,880,107,960,112C1040,117,1120,139,1200,160C1280,181,1360,203,1400,213.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
          {/* Layer 1: Intermediate Peaks */}
          <path 
            fill="currentColor" 
            className="text-primary/40"
            d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,149.3C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          {/* Layer 2: Closer Peaks */}
          <path 
            fill="currentColor" 
            className="text-brand-teal/20"
            d="M0,288L60,256C120,224,240,160,360,160C480,160,600,224,720,224C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          {/* Layer 3: House Silhouettes (Technical Outlines) */}
          <g className="text-foreground/40" style={{ opacity: 0.5 }}>
             <path d="M100,320 L100,280 L130,260 L160,280 L160,320 Z" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M400,320 L400,290 L440,270 L480,290 L480,320 Z" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M900,320 L900,270 L950,240 L1000,270 L1000,320 Z" fill="none" stroke="currentColor" strokeWidth="1" />
             <path d="M1200,320 L1200,300 L1220,290 L1240,300 L1240,320 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Architectural Lines */}
      <div className="absolute top-0 right-1/3 w-px h-full bg-border/20 hidden lg:block" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-border/20 hidden lg:block" />
      
      <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-brand-indigo/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-teal/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30" />

      <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
          
          {/* Left: Interactive Lead Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass p-12 md:p-16 rounded-[4rem] shadow-[0_32px_128px_-32px_rgba(27,0,136,0.15)] relative overflow-hidden group border-white/40 dark:border-white/5"
          >
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-2 brand-gradient shadow-lg" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50" />
            
            <div className="space-y-12 relative z-10">
              <div className="space-y-5">
                 <h3 className="text-4xl font-heading font-black tracking-tighter text-foreground uppercase leading-none">
                   Obtener <span className="text-brand-teal">Datos</span>
                 </h3>
                 <p className="text-muted-foreground font-medium leading-relaxed max-w-sm opacity-80">
                   Acceso directo a información estratégica y presupuestos técnicos para constructoras.
                 </p>
              </div>

              <HeroLeadForm />
            </div>
          </motion.div> 
 
          {/* Right: Branding High Performance */}
          <div className="flex flex-col gap-8 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-[clamp(2rem,6vw,5.5rem)] font-black tracking-[-0.07em] leading-[0.85] text-foreground mix-blend-multiply dark:mix-blend-lighten text-left">
                PROYECTA TU <br />
                <span className="gradient-text block translate-y-2">FUTURO HOGAR</span>
              </h1>
              
              <p className="text-2xl text-muted-foreground font-medium leading-[1.5] max-w-xl mx-auto lg:mx-0 opacity-80">
                 Conecta con el catálogo <span className="text-foreground font-bold italic">más grande</span> de Chile y recibe presupuestos de <span className="text-foreground border-b-4 border-brand-teal/40 pb-1 font-black">226 constructoras</span> certificadas en todo el territorio nacional.
              </p>
            </motion.div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-8 justify-items-center lg:justify-items-start border-t border-border/40 pt-6">
               {[
                 { icon: <Building2 className="w-5 h-5" />, val: "+5.000", label: "Modelos" },
                 { icon: <ShieldCheck className="w-5 h-5" />, val: "Auditoría", label: "Calidad" },
                 { icon: <Globe className="w-5 h-5" />, val: "16 Regiones", label: "Cobertura" },
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="flex flex-col items-center lg:items-start gap-4 group"
                 >
                   <div className="w-12 h-12 bg-muted/40 rounded-2xl flex items-center justify-center text-primary group-hover:brand-gradient group-hover:text-white transition-all duration-500">
                      {stat.icon}
                   </div>
                   <div className="space-y-1">
                      <div className="text-xl font-black text-foreground tracking-tight">{stat.val}</div>
                      <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60 leading-none">{stat.label}</div>
                   </div>
                 </motion.div>
               ))}
            </div>

            {/* Direct Contact System */}
            <div className="flex flex-wrap items-center gap-10 text-[10px] text-muted-foreground font-black uppercase tracking-widest border-t border-border/60 pt-10">
               <div className="flex items-center gap-4 hover:text-brand-indigo transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-brand-indigo/10 transition-colors">
                    <Mail className="w-4 h-4 text-brand-indigo" />
                  </div>
                  ventas@solocasaschile.cl
               </div>
               <div className="flex items-center gap-4 hover:text-brand-teal transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-brand-teal/10 transition-colors">
                    <Phone className="w-4 h-4 text-brand-teal" />
                  </div>
                  +56 9 6619 8752
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
