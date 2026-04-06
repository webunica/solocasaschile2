"use client";

import { Box, Map, CheckCircle2 } from "lucide-react";

interface ModeloPlanoProps {
  planoUrl?: string | null;
  recintos?: string[] | null;
  superficie: number;
}

export function ModeloPlano({ planoUrl, recintos, superficie }: ModeloPlanoProps) {
  if (!planoUrl && (!recintos || recintos.length === 0)) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight flex items-center gap-3">
          <Map className="w-8 h-8 text-brand-indigo opacity-50" />
          Distribución y Plano
        </h2>
        <p className="text-muted-foreground font-medium text-sm md:text-base">
          Conoce la distribución inteligente de sus {superficie} m² diseñados para aprovechar cada espacio.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Lista de recintos (Left side on desktop if we want, or Right. Let's do 2 col / 3 col) */}
        <div className="md:col-span-2 space-y-4 bg-muted/20 border border-border/40 p-6 rounded-[2rem]">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 flex items-center gap-2 mb-4">
            <Box className="w-4 h-4" /> Recintos Incluidos
          </h3>
          <ul className="space-y-3">
            {recintos && recintos.length > 0 ? (
              recintos.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-foreground/80 leading-tight">{r}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground italic">Distribución flexible o por definir.</li>
            )}
          </ul>
        </div>

        {/* Imagen del plano */}
        <div className="md:col-span-3 bg-card/40 border border-border/40 rounded-[2.5rem] p-4 flex items-center justify-center min-h-[300px]">
          {planoUrl ? (
            <img src={planoUrl} alt="Plano de distribución" className="w-full h-auto object-contain rounded-xl mix-blend-multiply dark:mix-blend-normal" />
          ) : (
            <div className="text-center space-y-3 opacity-40">
              <Map className="w-12 h-12 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-widest">Plano no disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
