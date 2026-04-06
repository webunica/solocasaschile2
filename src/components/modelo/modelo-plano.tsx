"use client";

import { Box, Map, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ModeloPlanoProps {
  planoUrl?: string | null;
  recintos?: string[] | null;
  superficie: number;
}

export function ModeloPlano({ planoUrl, recintos, superficie }: ModeloPlanoProps) {
  // If there's no plano and no recintos, we don't show the section.
  // But usually we want to show it if at least recintos exist.
  if (!planoUrl && (!recintos || recintos.length === 0)) return null;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-[2.75rem] font-heading font-black tracking-tighter flex items-center gap-5 text-[#302b70]">
           <div className="p-3 bg-[#f0effb] rounded-2xl border border-[#dadaf5]">
              <Map className="w-8 h-8 md:w-10 md:h-10 text-[#302b70]" />
           </div>
           Distribución y Plano
        </h2>
        <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-3xl leading-relaxed">
          Conoce la distribución inteligente de sus <span className="text-foreground font-black">{superficie} m²</span> diseñados para aprovechar cada espacio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-12 items-start">
        {/* Lista de recintos - Styled like Left box in image */}
        <div className="bg-white border border-[#e5e7eb] p-10 md:p-14 rounded-[3.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-12">
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a5a5c7] flex items-center gap-3">
                 <Box className="w-4 h-4" /> RECINTOS INCLUIDOS
              </p>
           </div>
           
           <ul className="space-y-6">
              {(recintos && recintos.length > 0) ? (
                recintos.map((r, i) => (
                  <li key={i} className="flex items-center gap-5 group">
                     <div className="w-7 h-7 rounded-full bg-[#e7f7f1] flex items-center justify-center shrink-0 border border-[#b2e5d4]">
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                     </div>
                     <span className="text-xl font-black text-[#302b70] tracking-tight leading-none group-hover:translate-x-1 transition-transform">{r}</span>
                  </li>
                ))
              ) : (
                ['Gran Living', 'Comedor', 'Cocina Abierta', 'Lavandería', 'Dormitorio Principal', 'Baño Master'].map((r, i) => (
                  <li key={i} className="flex items-center gap-5 group opacity-40">
                     <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                     </div>
                     <span className="text-xl font-black">{r}</span>
                  </li>
                ))
              )}
           </ul>
        </div>

        {/* Imagen del plano con contenedor estilizado - Styled like Right box in image */}
        <div className="bg-[#fbfafe] border border-[#e5e5f7] rounded-[4rem] p-8 md:p-20 flex items-center justify-center min-h-[400px] md:min-h-[600px] shadow-sm relative group overflow-hidden">
           {/* Grid pattern similar to image background dots */}
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#302b70_2px,transparent_1px)] [background-size:32px_32px]" />
           
           {planoUrl ? (
             <div className="relative w-full h-full aspect-square md:aspect-[4/3] max-w-[600px]">
                <Image 
                  src={planoUrl} 
                  alt="Plano de distribución técnica" 
                  fill
                  className="object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-[1.03] transition-transform duration-1000" 
                  sizes="(max-width: 768px) 100vw, 600px"
                />
             </div>
           ) : (
             <div className="text-center space-y-8 opacity-20 group-hover:opacity-30 transition-opacity">
                <Map className="w-24 h-24 mx-auto text-[#302b70]" />
                <div className="space-y-2">
                   <p className="text-sm font-black uppercase tracking-[0.4em] text-[#302b70]">Plano Técnico</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[#302b70]">Próximamente disponible</p>
                </div>
             </div>
           )}

           {/* Mobile zoom indicator */}
           <div className="absolute bottom-8 right-8 md:hidden bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-border/40">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Expandir Plano</span>
           </div>
        </div>
      </div>
    </div>
  );
}
