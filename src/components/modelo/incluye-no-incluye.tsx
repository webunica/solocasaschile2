"use client";

import { CheckCircle2, XCircle, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CotizarModal } from "./cotizar-modal";
import { Button } from "../ui/button";

interface IncluyeNoIncluyeProps {
  modelo: any;
  className?: string;
  isSidebar?: boolean;
}

export function IncluyeNoIncluye({ modelo, className, isSidebar }: IncluyeNoIncluyeProps) {
  const includes = modelo.logistica?.que_incluye;
  const excludes = modelo.logistica?.que_no_incluye;

  const defaultIncludes = [
    "Kit de paneles SIP + estructura (muros y techumbre)",
    "Ventanas termopanel PVC/Aluminio",
    "Puertas exteriores e interiores",
    "Revestimiento exterior (según diseño)",
    "Planos de montaje y guía técnica",
    "Transporte a obra (según zona)",
  ];

  const defaultExcludes = [
    "Obras de fundación (radier o pilotes)",
    "Conexiones a redes públicas",
    "Artefactos de baño y cocina",
    "Terminaciones de piso",
    "Permisos de edificación",
    "Montaje en terreno",
  ];

  const parseList = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim().length > 0);
  };

  const includesList = parseList(includes) || defaultIncludes;
  const excludesList = parseList(excludes) || defaultExcludes;

  if (isSidebar) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Incluye */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-heading font-black tracking-tight text-emerald-900">
              ¿Qué incluye?
            </h3>
          </div>
          <ul className="space-y-3">
            {includesList.slice(0, 6).map((item, i) => (
              <li key={i} className="flex gap-2 text-xs font-bold text-emerald-800/70 leading-tight">
                <span className="text-emerald-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* No incluye */}
        <div className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-heading font-black tracking-tight text-foreground">
              No incluye
            </h3>
          </div>
          <ul className="space-y-3">
            {excludesList.slice(0, 6).map((item, i) => (
              <li key={i} className="flex gap-2 text-xs font-bold text-muted-foreground/80 leading-tight">
                <span className="text-muted-foreground/30">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-12", className)}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Incluye */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-heading font-black tracking-tight text-emerald-900 border-b-2 border-emerald-500/20 pb-1">
              ¿Qué incluye?
            </h3>
          </div>
          <ul className="space-y-4">
            {includesList.map((item, i) => (
              <li key={i} className="flex gap-4 text-base font-bold text-emerald-800/80 leading-relaxed">
                <span className="text-emerald-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* No incluye */}
        <div className="bg-muted/10 border border-border/40 rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-heading font-black tracking-tight text-foreground border-b-2 border-border/40 pb-1">
              No incluye
            </h3>
          </div>
          <ul className="space-y-4">
            {excludesList.map((item, i) => (
              <li key={i} className="flex gap-4 text-base font-bold text-muted-foreground leading-relaxed">
                <span className="text-muted-foreground/30">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Terreno CTA */}
      <div className="bg-brand-indigo/5 border border-brand-indigo/10 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-brand-indigo/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            <MapPin className="w-10 h-10 text-brand-indigo" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-2xl font-black tracking-tight text-foreground">¿Ya tienes el terreno?</h4>
            <p className="text-lg text-muted-foreground font-medium">Te ayudamos a validar si este modelo es apto para tu ubicación.</p>
          </div>
        </div>
        <CotizarModal
            modeloId={modelo.id}
            modeloNombre={modelo.nombre}
            constructoraId={modelo.constructora_id}
            constructoraNombre={modelo.constructoras?.nombre}
            trigger={
                <Button size="lg" variant="secondary" className="px-12 h-16 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-teal/20">
                    Consultar Factibilidad <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            }
        />
      </div>

      <p className="text-[10px] text-center text-muted-foreground/50 font-bold uppercase tracking-[0.2em] pt-4">
        * Precios referenciales sujetos a confirmación técnica y zona geográfica. No incluyen IVA.
      </p>
    </div>
  );
}
