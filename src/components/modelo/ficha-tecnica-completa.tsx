"use client";

import { cn } from "@/lib/utils";
import { 
  Square, Bed, Bath, Clock, ShieldCheck, Zap, 
  Construction, Ruler, Home, Wind, Droplets, HardHat
} from "lucide-react";

interface FichaTecnicaCompletaProps {
  modelo: any;
  className?: string;
}

export function FichaTecnicaCompleta({ modelo, className }: FichaTecnicaCompletaProps) {
  // Nivel 1: Datos Rápidos
  const quickSpecs = [
    { icon: Square, label: "Área Total", value: `${modelo.superficie_m2 || 0} m²` },
    { icon: Bed, label: "Dormitorios", value: `${modelo.dormitorios || 0} Dorms` },
    { icon: Bath, label: "Baños", value: `${modelo.banos || 0} Baños` },
    { icon: Clock, label: "Entrega Est.", value: modelo.tiempo_entrega || 'Consultar' },
    { icon: ShieldCheck, label: "Garantía", value: `${modelo.garantia_anos || 1} Años` },
    { icon: Zap, label: "Postventa", value: modelo.postventa ? "Disponible" : "Consultar" },
  ];

  // Nivel 2: Datos Serios (Technical details)
  const technicalSpecs = [
    { label: "Espesor SIP", value: modelo.construccion?.sistema_constructivo, icon: Ruler },
    { label: "Techumbre", value: modelo.construccion?.techumbre, icon: Home },
    { label: "Estructura", value: modelo.construccion?.estructura, icon: Construction },
    { label: "Ventanas", value: modelo.terminaciones?.ventanas, icon: Wind },
    { label: "Eléctrica", value: modelo.instalaciones?.electrica, icon: Zap },
    { label: "Sanitaria", value: modelo.instalaciones?.sanitaria, icon: Droplets },
  ].filter(s => !!s.value);

  return (
    <div className={cn("space-y-12", className)}>
      {/* Nivel 1: Grid de Impacto */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {quickSpecs.map((spec, i) => (
          <div key={i} className="bg-muted/10 border border-border/40 p-6 rounded-[2rem] space-y-3 hover:bg-muted/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
              <spec.icon className="w-5 h-5 text-brand-indigo" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">
                {spec.label}
              </p>
              <p className="text-lg font-black tracking-tight">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nivel 2: Matriz de Especificaciones Serias */}
      {technicalSpecs.length > 0 && (
        <div className="bg-card/40 border border-border/40 rounded-[2.5rem] p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-black tracking-tight">Especificaciones Técnicas</h3>
            <p className="text-sm text-muted-foreground">Detalle constructivo de alto estándar para este modelo.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {technicalSpecs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0 group">
                <div className="flex items-center gap-3">
                  <spec.icon className="w-4 h-4 text-brand-indigo/40 group-hover:text-brand-indigo transition-colors" />
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">{spec.label}</span>
                </div>
                <span className="text-sm font-black text-right text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
