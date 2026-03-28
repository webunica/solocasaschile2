"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Box, Layers, Hammer, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = [
  {
    id: "prefabricada",
    title: "Prefabricada",
    description: "Construidas en fábrica y ensambladas en sitio. La eficiencia llevada al máximo estándar.",
    icon: <Box className="w-8 h-8" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    textColor: "text-brand-indigo",
    link: "/tipos/prefabricada",
    className: "lg:col-span-1"
  },
  {
    id: "sip",
    title: "Panel SIP",
    description: "Alto rendimiento térmico y acústico mediante paneles aislados estructurales.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-brand-teal/20 to-brand-teal/5",
    textColor: "text-brand-teal",
    link: "/tipos/sip",
    className: "lg:col-span-1"
  },
  {
    id: "container",
    title: "Container",
    description: "Diseño industrial y vanguardista a partir de arquitectura modular reciclada.",
    icon: <Hammer className="w-6 h-6" />,
    color: "from-brand-indigo/20 to-brand-indigo/5",
    textColor: "text-brand-indigo",
    link: "/tipos/container",
    className: "lg:col-span-1"
  },
  {
    id: "llave-en-mano",
    title: "Llave en Mano",
    description: "Gestión integral: desde el diseño y permisos hasta la entrega definitiva.",
    icon: <Key className="w-6 h-6" />,
    color: "from-brand-teal/20 to-brand-teal/10",
    textColor: "text-brand-teal",
    link: "/tipos/llave-en-mano",
    className: "lg:col-span-1"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export function TypesSection() {
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
          <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed hidden lg:block opacity-70">
            Filtramos la industria para ofrecerte los modelos que combinan diseño vanguardista con eficiencia real en el territorio chileno.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:grid-rows-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {TYPES.map((type) => (
            <motion.div 
              key={type.id} 
              variants={itemVariants}
              className={cn("group relative", type.className)}
            >
              <Link href={type.link} className="block h-full outline-none">
                <div className={cn(
                  "h-full p-10 rounded-[3rem] border border-border/40 bg-gradient-to-br transition-all duration-500",
                  "hover:shadow-[0_40px_80px_-20px_rgba(27,0,136,0.12)] hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between",
                  type.color
                )}>
                  {/* Internal Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="space-y-8 relative z-10">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 group-hover:brightness-110",
                      (type.id === "prefabricada" || type.id === "container") 
                        ? "bg-brand-indigo shadow-brand-indigo/30" 
                        : "bg-brand-teal shadow-brand-teal/30"
                    )}>
                      {type.icon}
                    </div>
                    
                    <div className="space-y-3">
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
        </motion.div>
      </div>
    </section>
  );
}
