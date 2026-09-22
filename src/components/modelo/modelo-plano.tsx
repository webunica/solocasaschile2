"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Map,
  Maximize2,
  FileDown,
  X,
  Ruler,
  Boxes,
  BedDouble,
  Bath,
  UtensilsCrossed,
  Armchair,
  TreePine,
  Layers,
  Compass,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface ModeloPlanoProps {
  planoUrl?: string | null;
  recintos?: string[] | null;
  superficie: number;
  dimensiones?: string | null;
  pdfUrl?: string | null;
  nombreModelo?: string | null;
}

interface RecintoMeta {
  categoria: string;
  icon: LucideIcon;
  badgeClass: string;
  iconClass: string;
}

function getRecintoMeta(recinto: string): RecintoMeta {
  const lower = recinto.toLowerCase();

  if (
    lower.includes("dormitorio") ||
    lower.includes("pieza") ||
    lower.includes("habitación") ||
    lower.includes("habitacion") ||
    lower.includes("suite")
  ) {
    return {
      categoria: "Área Privada",
      icon: BedDouble,
      badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
      iconClass: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
    };
  }

  if (lower.includes("baño") || lower.includes("bano") || lower.includes("toilette") || lower.includes("wc")) {
    return {
      categoria: "Zona Húmeda",
      icon: Bath,
      badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
      iconClass: "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
    };
  }

  if (
    lower.includes("cocina") ||
    lower.includes("comedor") ||
    lower.includes("desayunador") ||
    lower.includes("isla") ||
    lower.includes("quincho")
  ) {
    return {
      categoria: "Cocina & Comedor",
      icon: UtensilsCrossed,
      badgeClass: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
      iconClass: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    };
  }

  if (
    lower.includes("living") ||
    lower.includes("estar") ||
    lower.includes("sala") ||
    lower.includes("recibidor") ||
    lower.includes("hall")
  ) {
    return {
      categoria: "Área Social",
      icon: Armchair,
      badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
      iconClass: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
    };
  }

  if (
    lower.includes("terraza") ||
    lower.includes("porche") ||
    lower.includes("deck") ||
    lower.includes("patio") ||
    lower.includes("acceso cubierto") ||
    lower.includes("exterior")
  ) {
    return {
      categoria: "Exterior & Porche",
      icon: TreePine,
      badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
      iconClass: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    };
  }

  if (
    lower.includes("lavandería") ||
    lower.includes("lavanderia") ||
    lower.includes("logia") ||
    lower.includes("bodega") ||
    lower.includes("despensa") ||
    lower.includes("closet") ||
    lower.includes("home office") ||
    lower.includes("estudio")
  ) {
    return {
      categoria: "Servicios & Usos Múltiples",
      icon: Layers,
      badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      iconClass: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    };
  }

  return {
    categoria: "Ambiente Integrado",
    icon: Compass,
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    iconClass: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  };
}

export function ModeloPlano({
  planoUrl,
  recintos,
  superficie,
  dimensiones,
  pdfUrl,
  nombreModelo,
}: ModeloPlanoProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Cerrar lightbox con tecla Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
      }
    }
    if (isZoomOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomOpen]);

  if (!planoUrl && (!recintos || recintos.length === 0)) return null;

  const listaRecintos =
    recintos && recintos.length > 0
      ? recintos
      : [
          "Living-Comedor amplio y luminoso",
          "Cocina de concepto integrado",
          "Dormitorio Principal matrimonial",
          "Dormitorio Secundario familiar",
          "Baño completo sectorizado",
          "Porche exterior de acceso",
        ];

  return (
    <section className="space-y-10 scroll-mt-28" id="distribucion-plano">
      {/* Encabezado de la sección */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo border border-brand-indigo/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-indigo">
              Arquitectura & Diseño
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-foreground">
              Distribución y Plano Técnico
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm md:text-base font-medium max-w-3xl leading-relaxed">
          Diseño optimizado de <span className="font-bold text-foreground">{superficie} m²</span> concebido
          para maximizar la iluminación natural, la circulación fluida y la privacidad en cada espacio.
        </p>
      </div>

      {/* Contenedor principal: Showcase del Plano */}
      {planoUrl && (
        <div className="relative rounded-[2.5rem] border border-border/70 bg-gradient-to-b from-white to-slate-50/60 dark:from-slate-900/60 dark:to-slate-950/80 p-5 md:p-8 shadow-sm overflow-hidden group">
          {/* Grilla arquitectónica decorativa suave */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#302b70_2px,transparent_1px)] [background-size:24px_24px]" />

          {/* Barra de herramientas superior del plano */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/50">
            {/* Metadatos técnicos */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card border border-border/60 text-xs font-bold text-foreground/90 shadow-2xl">
                <Boxes className="w-3.5 h-3.5 text-brand-indigo" />
                {superficie} m² totales
              </span>
              {dimensiones && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card border border-border/60 text-xs font-bold text-foreground/90 shadow-2xl">
                  <Ruler className="w-3.5 h-3.5 text-brand-indigo" />
                  {dimensiones}
                </span>
              )}
            </div>

            {/* Acciones interactivas */}
            <div className="flex items-center gap-2">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-card border border-border/60 hover:border-brand-indigo/50 hover:bg-brand-indigo/5 text-xs font-bold text-foreground transition-all shadow-sm"
                  title="Descargar dossier PDF con especificaciones y plano"
                >
                  <FileDown className="w-3.5 h-3.5 text-brand-indigo" />
                  <span className="hidden sm:inline">Dossier PDF</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo/90 text-xs font-bold transition-all shadow-sm hover:shadow"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ampliar plano</span>
              </button>
            </div>
          </div>

          {/* Lienzo del plano arquitectónico */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] mt-6 flex items-center justify-center cursor-zoom-in rounded-2xl bg-white dark:bg-slate-900/50 p-4 transition-transform duration-300 hover:scale-[1.008]"
          >
            <div className="relative w-full h-full">
              <Image
                src={planoUrl}
                alt={nombreModelo ? `Plano arquitectónico de ${nombreModelo}` : "Plano de distribución técnica"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
                priority={false}
              />
            </div>

            {/* Hint flotante de interacción */}
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/60 shadow-md text-[11px] font-bold text-foreground/80 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3 h-3 text-brand-indigo" />
              <span>Click para ampliar</span>
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Recintos y Ambientes Arquitectónicos */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-heading font-black tracking-tight text-foreground flex items-center gap-2">
              <span>Ambientes y Recintos</span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                {listaRecintos.length}
              </span>
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Detalle de dependencias y zonas incluidas en el diseño.
            </p>
          </div>
        </div>

        {/* Grilla balanceada de 2 columnas con tarjetas estilizadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {listaRecintos.map((recinto, idx) => {
            const meta = getRecintoMeta(recinto);
            const Icon = meta.icon;

            return (
              <div
                key={idx}
                className="group relative flex items-start gap-3.5 p-4 rounded-2xl border border-border/60 bg-card hover:border-brand-indigo/40 hover:bg-muted/30 transition-all duration-200 shadow-sm"
              >
                {/* Icono temático por categoría de ambiente */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${meta.iconClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Textos del recinto: categoría + nombre refinado */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${meta.badgeClass}`}
                    >
                      {meta.categoria}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground leading-snug tracking-tight">
                    {recinto}
                  </p>
                </div>

                {/* Mini check sutil de confirmación */}
                <CheckCircle2 className="w-4 h-4 text-emerald-600/70 shrink-0 self-center opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Lightbox a pantalla completa para inspeccionar el plano */}
      {isZoomOpen && planoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-border/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Lightbox */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-slate-50/70 dark:bg-slate-950/70">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-indigo">
                  Plano de Distribución Arquitectónica
                </p>
                <h4 className="text-base sm:text-lg font-black text-foreground">
                  {nombreModelo || "Modelo Arquitectónico"}
                  <span className="text-muted-foreground font-semibold text-sm ml-2">
                    ({superficie} m²{dimensiones ? ` • ${dimensiones}` : ""})
                  </span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-card border border-border/60 hover:border-brand-indigo/50 text-xs font-bold text-foreground transition-all"
                  >
                    <FileDown className="w-4 h-4 text-brand-indigo" />
                    <span className="hidden sm:inline">PDF</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted text-foreground flex items-center justify-center transition-colors"
                  aria-label="Cerrar vista ampliada"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del plano a alta resolución */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[550px] p-6 flex items-center justify-center bg-white dark:bg-slate-900 overflow-auto">
              <div className="relative w-full h-[350px] sm:h-[550px]">
                <Image
                  src={planoUrl}
                  alt={nombreModelo ? `Plano ampliado de ${nombreModelo}` : "Plano ampliado"}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {/* Footer con ayuda */}
            <div className="px-6 py-3 border-t border-border/40 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Presiona Esc o haz click afuera para cerrar</span>
              <span className="font-semibold text-foreground">{listaRecintos.length} ambientes en plano</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
