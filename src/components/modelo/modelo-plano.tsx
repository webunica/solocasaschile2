"use client";

import { Box, Map, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ModeloPlanoProps {
  planoUrl?: string | null;
  recintos?: string[] | null;
  superficie: number;
}

export function ModeloPlano({ planoUrl, recintos, superficie }: ModeloPlanoProps) {
  if (!planoUrl && (!recintos || recintos.length === 0)) return null;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight flex items-center gap-4 text-foreground/90">
           <div className="p-3 bg-brand-indigo/5 rounded-2xl">
              <Map className="w-8 h-8 md:w-10 md:h-10 text-brand-indigo opacity-80" />
           </div>
           Distribución y Plano
        </h2>
        <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-3xl leading-relaxed">
          Conoce la distribución inteligente de sus <span className="text-foreground font-black">{superficie} m²</span> diseñados para aprovechar cada espacio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-12 items-start">
        {/* Lista de recintos */}
        <div className="bg-card border border-border/40 p-10 md:p-12 rounded-[3.5rem] shadow-sm space-y-8 h-full">
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                 <Box className="w-4 h-4" /> Recintos Incluidos
              </p>
           </div>
           
           <ul className="space-y-5">
             {(recintos && recintos.length > 0) ? (
               recintos.map((r, i) => (
                 <li key={i} className="flex items-center gap-4 group">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-lg font-black text-brand-indigo/90 tracking-tight leading-none">{r}</span>
                 </li>
               ))
             ) : (
                ['Living / Comedor', 'Cocina Integrada', 'Dormitorio Principal', 'Baño Master'].map((r, i) => (
                  <li key={i} className="flex items-center gap-4 opacity-50">
                     <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                     <span className="text-lg font-bold">{r}</span>
                  </li>
                ))
             )}
           </ul>
        </div>

        {/* Imagen del plano con contenedor estilizado */}
        <div className="bg-white/50 border border-border/20 rounded-[4rem] p-8 md:p-16 flex items-center justify-center min-h-[400px] md:min-h-[500px] shadow-inner relative group overflow-hidden">
           {/* Subtle background pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
           
           {planoUrl ? (
             <div className="relative w-full h-full aspect-square md:aspect-video">
                <Image 
                  src={planoUrl} 
                  alt="Plano de distribución técnica" 
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-1000" 
                />
             </div>
           ) : (
             <div className="text-center space-y-6 opacity-20">
                <Map className="w-20 h-20 mx-auto" />
                <p className="text-sm font-black uppercase tracking-[0.3em]">Plano Técnico Reservado</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
