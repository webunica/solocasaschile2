"use client";

import Link from "next/link";
import Image from "next/image";
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

export function MegaMenu({ ads, onClose }: { ads?: any; onClose?: () => void }) {
  const featuredConstructora = ads?.constructora;
  const featuredModelo = ads?.modelo;

  // Fallbacks para datos vacíos o carga inicial
  const cName = featuredConstructora?.nombre || "Austral SIP";
  const cSlug = featuredConstructora?.slug || "austral-sip";
  const cImage = featuredConstructora?.image || featuredConstructora?.logo_url || "/images/modelos/austral/nocturna.jpg";
  const cDesc = featuredConstructora?.descripcion || "Expertos en eficiencia térmica";

  const mName = featuredModelo?.nombre || "Casa Nogal SIP 120";
  const mSlug = featuredModelo?.slug || "casa-nogal-sip-120";
  const mImage = (featuredModelo?.imagenes_urls && featuredModelo?.imagenes_urls[0]) || "/hero.png";
  const mPrice = featuredModelo?.precio_desde_uf || 1200;
  const mSize = featuredModelo?.superficie_m2 || 120;
  const mDorms = featuredModelo?.dormitorios || 3;
  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 w-full bg-white border border-border/40 shadow-2xl rounded-3xl mt-4 overflow-hidden z-50 p-6 md:p-10"
    >
      <div className="max-w-[1500px] mx-auto flex flex-col md:grid md:grid-cols-12 gap-10">
        
        {/* LADO IZQUIERDO: Constructora Destacada (Admin Controlled) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            Constructora Destacada
          </div>
          <Link href={`/constructoras/${cSlug}`} className="group block relative overflow-hidden rounded-2xl border border-border/60 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl">
            <div className="aspect-[4/3] relative">
               <Image 
                src={cImage} 
                alt={cName} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="bg-white/90 backdrop-blur-sm w-fit px-2 py-0.5 rounded text-[9px] font-black text-primary mb-2 uppercase tracking-tighter shadow-sm">Premium Partner</div>
                <h4 className="text-white font-black text-lg leading-tight uppercase tracking-tight">{cName}</h4>
                <p className="text-white/70 text-[10px] line-clamp-1 mt-1 font-medium italic">{cDesc}</p>
              </div>
            </div>
          </Link>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              "Fomentamos la construcción sustentable con tecnología SIP de última generación."
            </p>
          </div>
        </div>

        {/* CENTRO: Categorías y Navegación (3 Columnas de Links) */}
        <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-x border-border/10 px-8">
          {/* Regiones */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#1b0088] font-black text-[13px] uppercase tracking-widest border-b border-primary/10 pb-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Regiones
            </div>
            <ul className="space-y-3">
              {REGIONES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between text-[13px] font-bold transition-colors ${
                      item.isAll ? "text-primary pt-1 border-t border-border/40 mt-2" : "text-slate-600 hover:text-[#1b0088]"
                    }`}
                  >
                    {item.name}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Construcciones */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#1b0088] font-black text-[13px] uppercase tracking-widest border-b border-primary/10 pb-2">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Materiales
            </div>
            <ul className="space-y-3">
               {TIPOS_MATERIALES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between text-[13px] font-bold text-slate-600 hover:text-[#1b0088] transition-colors"
                  >
                    {item.name}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Estilos / Especiales */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#1b0088] font-black text-[13px] uppercase tracking-widest border-b border-primary/10 pb-2">
              <Star className="w-3.5 h-3.5 text-primary" />
              Especiales
            </div>
            <ul className="space-y-3">
               {CATEGORIAS_ESPECIALES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between text-[13px] font-bold text-slate-600 hover:text-[#1b0088] transition-colors"
                  >
                    {item.name}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LADO DERECHO: Modelo Destacado (Admin Controlled) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
            Modelo Destacado
          </div>
          <Link href={`/modelo/${mSlug}`} className="group block relative overflow-hidden rounded-2xl border border-border/60 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl">
            <div className="aspect-[4/3] relative">
               <Image 
                src={mImage} 
                alt={mName} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20 uppercase tracking-tighter animate-bounce">Destacado</div>
            </div>
            <div className="p-4 bg-white text-left">
              <h4 className="text-[#1b0088] font-black text-sm uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{mName}</h4>
              <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mSize}m²</span>
                <span className="flex items-center gap-1 font-black text-primary border-l border-border/40 pl-3">{mDorms} Dormitorios</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none mb-1">Desde</span>
                  <span className="text-primary font-black text-lg leading-none">{mPrice.toLocaleString()} UF</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
          <button className="w-full py-3 px-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1b0088] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            Ver Oferta de la Semana
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer del Mega Menu con métricas de confianza */}
      <div className="mt-10 pt-6 border-t border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1b0088] group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#1b0088] uppercase leading-none tracking-tight">Entrega Rápida</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Modelos en Stock</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer border-l border-border/10 pl-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1b0088] group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black text-[#1b0088] uppercase leading-none tracking-tight">Garantía Estructural</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Hasta 10 años</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-2xl border border-border/10">
          <div className="bg-white p-2 px-4 rounded-xl shadow-sm">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">¿Eres una constructora?</p>
            <p className="text-[9px] text-primary font-bold uppercase leading-none">Únete a la plataforma líder</p>
          </div>
          <Link href="/planes" className="px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1b0088] transition-all shadow-lg shadow-primary/20">Publica aquí</Link>
        </div>
      </div>
    </motion.div>
  );
}
