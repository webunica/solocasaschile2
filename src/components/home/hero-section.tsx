"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, ShieldCheck, Globe, Mail, Phone
} from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Background Decor with Latam Tones */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-indigo/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-teal/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30" />

      <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          
          {/* Left: Interactive Lead Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass p-10 md:p-14 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(27,0,136,0.1)] relative overflow-hidden group border-white/40 dark:border-white/5"
          >
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 brand-gradient shadow-lg" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                 <h3 className="text-3xl font-heading font-black tracking-tighter text-foreground uppercase leading-none">
                   Obtener <span className="text-brand-teal">Datos</span>
                 </h3>
                 <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
                   Acceso directo a información estratégica para constructoras y especialistas de la industria.
                 </p>
              </div>

              <HeroLeadForm />
            </div>
          </motion.div> 
 
          {/* Right: Branding High Performance */}
          <div className="flex flex-col gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <Badge variant="outline" className="brand-gradient text-white border-none px-5 py-2 rounded-full text-[10px] tracking-[0.25em] font-black uppercase shadow-xl shadow-primary/20">
                🚀 Fase 3: Integración Total
              </Badge>
              
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.82] text-foreground">
                PROXIMIDAD <br />
                <span className="gradient-text">ESTRATÉGICA</span>
              </h1>
              
              <p className="text-2xl text-muted-foreground font-medium leading-snug max-w-xl">
                 Optimizamos la visibilidad de tu catálogo con la red de <span className="text-foreground border-b-4 border-brand-teal/40 pb-1 font-black">226 constructoras</span> certificadas en Chile.
              </p>
            </motion.div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
               {[
                 { icon: <Building2 className="w-6 h-6" />, val: "+5.000", label: "SKUs Modelos" },
                 { icon: <ShieldCheck className="w-6 h-6" />, val: "Auditoría", label: "Calidad Técnica" },
                 { icon: <Globe className="w-6 h-6" />, val: "16 Regiones", label: "Cobertura Real" },
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="flex flex-col gap-4 group"
                 >
                   <div className="w-14 h-14 bg-brand-indigo/5 dark:bg-brand-indigo/10 rounded-2xl flex items-center justify-center text-brand-indigo group-hover:brand-gradient group-hover:text-white transition-all duration-500 shadow-sm">
                      {stat.icon}
                   </div>
                   <div className="space-y-1">
                      <div className="text-2xl font-black text-foreground tracking-tight">{stat.val}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 leading-none">{stat.label}</div>
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
