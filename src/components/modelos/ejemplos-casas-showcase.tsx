"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  FileDown,
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  Home,
  Check,
  Building2,
  X,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ejemplosData from "@/data/ejemplos-modelos.json";

type ModeloEjemplo = {
  id: string;
  slug: string;
  nombre: string;
  subtitulo: string;
  superficie_m2: number;
  superficie_util: number;
  dormitorios: number;
  banos: number;
  dimensiones: string;
  estilo: string;
  precio_referencial_uf: number;
  sistema: string;
  render_url: string;
  plano_url: string;
  pdf_filename: string;
  source_folder: string;
  zip_url: string;
  descripcion: string;
  pdf_url: string;
};

export function EjemplosCasasShowcase() {
  const [modelos] = useState<ModeloEjemplo[]>(ejemplosData);
  const [activeTabByModel, setActiveTabByModel] = useState<Record<string, "render" | "plano">>({});
  const [filtroDormitorios, setFiltroDormitorios] = useState<number | "all">("all");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const getActiveTab = (id: string) => activeTabByModel[id] || "render";

  const setTab = (id: string, tab: "render" | "plano") => {
    setActiveTabByModel((prev) => ({ ...prev, [id]: tab }));
  };

  const modelosFiltrados = modelos.filter((m) => {
    if (filtroDormitorios === "all") return true;
    return m.dormitorios === filtroDormitorios;
  });

  return (
    <section className="mt-24 space-y-12">
      {/* Header del bloque */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-brand-indigo dark:text-brand-teal">
            <Sparkles className="h-3.5 w-3.5 text-brand-teal" />
            Galería de Diseños Arquitectónicos Reales
          </div>
          <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Ejemplos de Casas Prefabricadas con Renders y Planos
          </h2>
          <p className="text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            Explora 7 modelos arquitectónicos completos: cambia al instante entre la fachada exterior 3D y el plano
            de planta amoblado a escala. Incluye especificaciones técnicas y dossier PDF descargable.
          </p>
        </div>

        {/* Filtros de dormitorios */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
          <button
            onClick={() => setFiltroDormitorios("all")}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all",
              filtroDormitorios === "all"
                ? "bg-brand-indigo text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Todos ({modelos.length})
          </button>
          <button
            onClick={() => setFiltroDormitorios(2)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all",
              filtroDormitorios === 2
                ? "bg-brand-indigo text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            2 Dormitorios
          </button>
          <button
            onClick={() => setFiltroDormitorios(3)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all",
              filtroDormitorios === 3
                ? "bg-brand-indigo text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            3 Dormitorios
          </button>
        </div>
      </div>

      {/* Grid de Modelos */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {modelosFiltrados.map((m) => {
          const currentTab = getActiveTab(m.id);
          const currentImage = currentTab === "render" ? m.render_url : m.plano_url;

          return (
            <article
              key={m.id}
              className="group flex flex-col overflow-hidden rounded-[2.2rem] border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-xl"
            >
              {/* Contenedor Visual con Toggle Render / Plano */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <Image
                  src={currentImage}
                  alt={`${m.nombre} - ${currentTab === "render" ? "Fachada 3D en Entorno Real" : "Plano de Planta Amoblado"}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "transition-all duration-500 group-hover:scale-[1.03]",
                    currentTab === "render" ? "object-cover" : "object-contain p-3 bg-white dark:bg-slate-900"
                  )}
                  priority={m.id === "ejemplo-roble-115"}
                />

                {/* Badge de Sistema y Superficie */}
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                  <Badge className="bg-brand-indigo/90 text-white backdrop-blur-md font-bold text-xs shadow-sm">
                    {m.superficie_m2} m²
                  </Badge>
                  <Badge variant="outline" className="bg-white/90 dark:bg-slate-900/90 text-foreground font-semibold text-[10px] backdrop-blur-md shadow-sm">
                    {m.sistema}
                  </Badge>
                </div>

                {/* Botón para expandir imagen en Lightbox */}
                <button
                  type="button"
                  onClick={() =>
                    setLightboxImage({
                      url: currentImage,
                      title: m.nombre,
                      subtitle: currentTab === "render" ? "Render Arquitectónico 3D" : "Plano de Distribución Interior Amoblado",
                    })
                  }
                  aria-label="Ver imagen ampliada"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-foreground shadow-md backdrop-blur-md transition-transform hover:scale-110"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>

                {/* Switch Render / Plano en la parte inferior de la imagen */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/40 bg-white/95 p-1 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95">
                  <button
                    type="button"
                    onClick={() => setTab(m.id, "render")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all",
                      currentTab === "render"
                        ? "bg-brand-indigo text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Home className="h-3 w-3" />
                    Fachada 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab(m.id, "plano")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all",
                      currentTab === "plano"
                        ? "bg-brand-teal text-[#03313a] shadow-sm font-black"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Layers className="h-3 w-3" />
                    Plano Amoblado
                  </button>
                </div>
              </div>

              {/* Contenido y Ficha Técnica */}
              <div className="flex flex-1 flex-col justify-between p-6 space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal">
                    {m.estilo}
                  </p>
                  <h3 className="font-heading text-xl font-black tracking-tight text-foreground">
                    {m.nombre}
                  </h3>
                  <p className="line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground">
                    {m.subtitulo}
                  </p>
                </div>

                {/* Especificaciones clave */}
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/50 bg-muted/40 p-3 text-center">
                  <div className="space-y-0.5">
                    <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Bed className="h-3.5 w-3.5 text-brand-teal" />
                      Dorm.
                    </span>
                    <p className="font-heading text-sm font-black">{m.dormitorios}</p>
                  </div>
                  <div className="space-y-0.5 border-x border-border/50">
                    <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Bath className="h-3.5 w-3.5 text-brand-teal" />
                      Baños
                    </span>
                    <p className="font-heading text-sm font-black">{m.banos}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Compass className="h-3.5 w-3.5 text-brand-teal" />
                      Dimensiones
                    </span>
                    <p className="font-heading text-[11px] font-black leading-tight truncate px-1">
                      {m.dimensiones.replace(/\s*m\s*/g, "m ")}
                    </p>
                  </div>
                </div>

                {/* Referencia de precio estimado */}
                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                  <span className="font-bold text-muted-foreground">Precio ref. llave en mano</span>
                  <span className="font-heading text-base font-black text-brand-indigo dark:text-brand-teal">
                    Desde {m.precio_referencial_uf} UF
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={m.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    <FileDown className="h-3.5 w-3.5 text-brand-teal" />
                    Dossier PDF
                  </a>

                  <Link
                    href={`/catalogo?modelo=${m.slug}`}
                    className="cta-pill min-h-0 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-center flex items-center justify-center"
                  >
                    Cotizar
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Banner de llamada a cotización por plano personalizado */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-gradient-to-r from-brand-indigo/10 via-background to-brand-teal/10 p-8 md:p-10">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-heading text-2xl font-black tracking-tight text-foreground">
              ¿Tienes un terreno y quieres adaptar uno de estos modelos?
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              Nuestras constructoras verificadas pueden ajustar los planos a la pendiente de tu parcela, tipo de suelo y
              orientación solar en las 16 regiones de Chile.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/constructoras"
              className="cta-pill min-h-0 px-6 py-3 text-xs font-extrabold uppercase tracking-[0.14em]"
            >
              Contactar constructoras
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal de Alta Resolución */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[95vh] max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-card p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3 px-2">
              <div>
                <h4 className="font-heading text-xl font-black text-foreground">{lightboxImage.title}</h4>
                <p className="text-xs font-bold text-brand-teal">{lightboxImage.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Cerrar vista ampliada"
                className="rounded-full bg-muted p-2 text-foreground transition-transform hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-4 h-[70vh] w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden">
              <Image
                src={lightboxImage.url}
                alt={lightboxImage.title}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
