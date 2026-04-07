"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Building2, Star, Zap } from "lucide-react";

const REGIONES = [
  { name: "Región Metropolitana", href: "/catalogo?region=metropolitana" },
  { name: "Región de Valparaíso", href: "/catalogo?region=valparaiso" },
  { name: "Región del Biobío", href: "/catalogo?region=biobio" },
  { name: "Región de la Araucanía", href: "/catalogo?region=araucania" },
  { name: "Región de Coquimbo", href: "/catalogo?region=coquimbo" },
  { name: "Región de Los Lagos", href: "/catalogo?region=los-lagos" },
  { name: "Región de Antofagasta", href: "/catalogo?region=antofagasta" },
  { name: "Todas las Regiones", href: "/catalogo", isAll: true },
];

const TIPOS_MATERIALES = [
  { name: "Casas SIP", href: "/catalogo?tipo=sip" },
  { name: "Casas de Madera", href: "/catalogo?tipo=madera" },
  { name: "Casas de Hormigón", href: "/catalogo?tipo=hormigon" },
  { name: "Steel Framing", href: "/catalogo?tipo=steel-framing" },
  { name: "Casas Metalcom", href: "/catalogo?tipo=metalcom" },
];

const TIPOS_ESTILO = [
  { name: "Casas Modulares", href: "/catalogo?tipo=modular" },
  { name: "Casas Container", href: "/catalogo?tipo=container" },
  { name: "Casas Prefabricadas", href: "/catalogo?tipo=prefabricada" },
  { name: "Diseño Mediterráneo", href: "/catalogo?estilo=mediterraneo" },
  { name: "Cabañas", href: "/catalogo?estilo=cabana" },
];

const CATEGORIAS_ESPECIALES = [
  { name: "Llave en Mano", href: "/catalogo?categoria=llave-en-mano" },
  { name: "Viviendas Sociales", href: "/catalogo?tipo=sociales" },
  { name: "Modelos Económicos", href: "/catalogo?filtro=economicos" },
  { name: "Casas de Lujo", href: "/catalogo?filtro=lujo" },
  { name: "Entrega Inmediata", href: "/catalogo?filtro=entrega-inmediata" },
];

export function MegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-3xl mt-4 overflow-hidden z-50 p-8 pt-10"
    >
      <div className="container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Columna 1: Regiones */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#1b0088] font-bold text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            Regiones
          </div>
          <ul className="space-y-3">
            {REGIONES.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between text-[15px] transition-colors ${
                    item.isAll ? "text-primary font-bold pt-2 border-t border-border/40" : "text-muted-foreground hover:text-[#1b0088]"
                  }`}
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 2: Materiales */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#1b0088] font-bold text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            Por Material
          </div>
          <ul className="space-y-3">
             {TIPOS_MATERIALES.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between text-[15px] text-muted-foreground hover:text-[#1b0088] transition-colors"
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Estilo */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#1b0088] font-bold text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-5 h-5 text-primary" />
            </div>
            Por Estilo
          </div>
          <ul className="space-y-3">
             {TIPOS_ESTILO.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between text-[15px] text-muted-foreground hover:text-[#1b0088] transition-colors"
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 4: Especiales */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#1b0088] font-bold text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            Opciones Rápidas
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
             <ul className="space-y-3">
              {CATEGORIAS_ESPECIALES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                    <ChevronRight className="w-4 h-4 opacity-10 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link 
              href="/catalogo" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline pt-2"
            >
              Ver todo el catálogo <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer del Mega Menu opcional */}
      <div className="mt-12 pt-6 border-t border-border/40 flex items-center justify-between text-muted-foreground text-sm">
        <p>¿No encuentras lo que buscas? <Link href="/contacto" className="text-primary font-bold hover:underline">Contáctanos ahora</Link></p>
        <div className="flex gap-4">
          <span>+5,000 Modelos</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full my-auto" />
          <span>+200 Constructoras</span>
          <span className="w-1 h-1 bg-muted-foreground/30 rounded-full my-auto" />
          <span>Todo Chile</span>
        </div>
      </div>
    </motion.div>
  );
}
