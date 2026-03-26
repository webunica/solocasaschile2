"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Box, Layers, Hammer, Key } from "lucide-react";

const TYPES = [
  {
    id: "prefabricada",
    title: "Prefabricada",
    description: "Construidas en fábrica y ensambladas en sitio. Rápidas y económicas.",
    icon: <Box className="w-6 h-6 text-brand-cyan" />,
    color: "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan",
    link: "/tipos/prefabricada"
  },
  {
    id: "sip",
    title: "Panel SIP",
    description: "Paneles aislados estructurales de alto rendimiento térmico y acústico.",
    icon: <Layers className="w-6 h-6 text-brand-purple" />,
    color: "bg-brand-purple/10 border-brand-purple/20 text-brand-purple",
    link: "/tipos/sip"
  },
  {
    id: "container",
    title: "Container",
    description: "Casas a partir de contenedores marítimos reciclados. Diseño industrial.",
    icon: <Hammer className="w-6 h-6 text-brand-cyan" />,
    color: "bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan",
    link: "/tipos/container"
  },
  {
    id: "llave-en-mano",
    title: "Llave en Mano",
    description: "Despreocupación total. Incluye diseño, permisos, construcción y terminaciones.",
    icon: <Key className="w-6 h-6 text-brand-purple" />,
    color: "bg-brand-purple/10 border-brand-purple/20 text-brand-purple",
    link: "/tipos/llave-en-mano"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function TypesSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase tracking-widest text-xs px-3 py-1">Ejes Fundamentales</Badge>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Elige tu sistema constructivo</h2>
          <p className="text-muted-foreground text-lg">
            Descubre las características de cada tipo de modelo y encuentra el que mejor se adapte a tu presupuesto, zona geográfica y preferencias de diseño.
          </p>
        </div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TYPES.map((type) => (
            <motion.div key={type.id} variants={itemVariants}>
              <Link href={type.link} className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[2rem]">
                <Card className="h-full bg-card/50 backdrop-blur-sm border-foreground/5 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 relative overflow-hidden rounded-[2rem]">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${type.color.split(' ')[0]} rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-30 transition-opacity`} />
                  
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform duration-300 group-hover:scale-110 ${type.color}`}>
                      {type.icon}
                    </div>
                    <h3 className="text-2xl font-black font-heading mb-3 text-foreground group-hover:text-primary transition-colors tracking-tight">{type.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-8 leading-relaxed font-medium">
                      {type.description}
                    </p>
                    <div className="flex items-center text-xs font-black uppercase tracking-widest text-primary mt-auto">
                      Explorar modelos 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
