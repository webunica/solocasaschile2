"use client";

import { CheckCircle2, XCircle, Home, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncluyeNoIncluyeProps {
  modelo: any;
  className?: string;
}

export function IncluyeNoIncluye({ modelo, className }: IncluyeNoIncluyeProps) {
  const includes = modelo.logistica?.que_incluye;
  const excludes = modelo.logistica?.que_no_incluye;

  // Default lists if no data in DB
  const defaultIncludes = [
    "Kit de paneles SIP + estructura (muros y techumbre)",
    "Ventanas termopanel PVC/Aluminio",
    "Puertas exteriores e interiores",
    "Revestimiento exterior (según diseño)",
    "Planos de montaje y guía técnica",
    "Transporte a obra (consultar radio de cobertura)",
  ];

  const defaultExcludes = [
    "Obras de fundación (radier o pilotes)",
    "Conexiones a redes públicas (agua, luz, alcantarillado)",
    "Artefactos de baño y cocina",
    "Terminaciones de piso (alfombra, piso flotante)",
    "Permisos de edificación y recepción municipal",
    "Montaje en terreno (opcional según constructora)",
  ];

  const parseList = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim().length > 0);
  };

  const includesList = parseList(includes) || defaultIncludes;
  const excludesList = parseList(excludes) || defaultExcludes;

  return (
    <div className={cn("space-y-12", className)}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Incluye */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-heading font-black tracking-tight text-emerald-900 border-b-2 border-emerald-500/20 pb-1">
              ¿Qué incluye?
            </h3>
          </div>
          <ul className="space-y-4">
            {includesList.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium text-emerald-800/80 leading-relaxed">
                <span className="text-emerald-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* No incluye */}
        <div className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-black tracking-tight text-foreground border-b-2 border-border/40 pb-1">
              No incluye
            </h3>
          </div>
          <ul className="space-y-4">
            {excludesList.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium text-muted-foreground leading-relaxed">
                <span className="text-muted-foreground/30 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Terreno CTA */}
      <div className="bg-brand-indigo/5 border border-brand-indigo/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-brand-indigo/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            <MapPin className="w-8 h-8 text-brand-indigo" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-black tracking-tight text-foreground">¿Ya tienes el terreno?</h4>
            <p className="text-sm text-muted-foreground font-medium">Te ayudamos a validar si este modelo es apto para tu ubicación.</p>
          </div>
        </div>
        <a 
          href="#form-cotizar"
          className="flex items-center gap-3 bg-brand-indigo text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-brand-indigo/20 hover:-translate-y-1 transition-all"
        >
          Consultar Factibilidad <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-[10px] text-center text-muted-foreground/50 font-bold uppercase tracking-[0.2em] pt-4">
        * Precios referenciales sujetos a confirmación técnica y zona geográfica. No incluyen IVA.
      </p>
    </div>
  );
}
