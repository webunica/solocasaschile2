"use client";

import { Square, Bed, Bath, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeloResumenHeroProps {
  modelo: any;
  className?: string;
}

export function ModeloResumenHero({ modelo, className }: ModeloResumenHeroProps) {
  const specs = [
    {
      label: `${modelo.superficie_m2 || 0} m²`,
      icon: Square,
      show: true,
    },
    {
      label: `${modelo.dormitorios || 0}D`,
      icon: Bed,
      show: true,
    },
    {
      label: `${modelo.banos || 0}B`,
      icon: Bath,
      show: true,
    },
    {
      label: modelo.tiempo_entrega,
      icon: Clock,
      show: !!modelo.tiempo_entrega,
    },
    {
      label: modelo.aislacion?.calificacion_energetica 
        ? `Clase ${modelo.aislacion.calificacion_energetica}` 
        : "Alta Eficiencia",
      icon: Zap,
      show: true,
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base font-bold text-brand-indigo/80", className)}>
      {specs.filter(s => s.show).map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted-foreground/30 font-light mr-2">|</span>}
          <spec.icon className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
          <span>{spec.label}</span>
        </div>
      ))}
    </div>
  );
}
