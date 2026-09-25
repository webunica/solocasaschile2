"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Home, ShieldCheck, CheckCircle2 } from "lucide-react";
import { trackCatalogoClick, trackCotizacionStart } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HeroLeadForm } from "@/components/home/hero-lead-form";

export function HeroSection() {
  const [cotizarOpen, setCotizarOpen] = useState(false);

  return (
    <section className="relative w-full bg-[#073E48] text-white">
      {/* ── CONTENEDOR HERO PRINCIPAL ── */}
      <div className="relative min-h-[540px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[680px] w-full overflow-hidden flex items-center">
        {/* Fotografía Arquitectónica Protagonista con <picture> */}
        <picture className="absolute inset-0 z-0 h-full w-full">
          <source
            media="(max-width: 767px)"
            srcSet="/images/hero-solocasaschile-mobile.webp"
            type="image/webp"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/images/hero-solocasaschile-desktop.webp"
            type="image/webp"
          />
          <img
            src="/images/hero-solocasaschile-desktop.webp"
            alt="Casa prefabricada contemporánea en entorno natural de Chile"
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Degradado localizado móvil (180deg vertical) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(3, 42, 52, 0.90) 0%, rgba(3, 42, 52, 0.58) 48%, rgba(3, 42, 52, 0.10) 72%, rgba(3, 42, 52, 0) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Degradado localizado desktop (90deg horizontal de izquierda a derecha) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(3, 42, 52, 0.96) 0%, rgba(3, 42, 52, 0.78) 32%, rgba(3, 42, 52, 0.18) 62%, rgba(3, 42, 52, 0) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Contenido Hero (Texto a la izquierda en desktop, dejando visible la vivienda) */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="max-w-2xl">
            {/* Etiqueta */}
            <div className="mb-4 sm:mb-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#073E48]/85 border border-[#27D8BE]/50 px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#27D8BE] shadow-sm backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#27D8BE] animate-pulse" />
                CATÁLOGO DE CASAS EN CHILE
              </span>
            </div>

            {/* Título H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-extrabold tracking-tight text-white leading-[1.02] text-balance mb-5 sm:mb-6">
              Encuentra la casa ideal para tu terreno.
            </h1>

            {/* Descripción */}
            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#FAFAF7]/95 max-w-xl text-pretty mb-8 sm:mb-10">
              Compara modelos, planos, precios y sistemas constructivos de empresas verificadas.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Botón Principal: EXPLORAR MODELOS */}
              <Link
                href="/catalogo"
                onClick={() => trackCatalogoClick("hero")}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border-2 border-[#27D8BE] bg-[#073E48] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#073E48]/40 transition-all duration-200 hover:bg-[#0a4d59] hover:border-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#073E48]"
              >
                <span>EXPLORAR MODELOS</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              {/* Botón Secundario: COTIZAR MI PROYECTO */}
              <button
                type="button"
                onClick={() => {
                  setCotizarOpen(true);
                  trackCotizacionStart({ source: "hero_button" });
                }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border-2 border-[#27D8BE] bg-[#FAFAF7] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#073E48] shadow-md transition-all duration-200 hover:bg-white hover:border-[#073E48] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2"
              >
                <span>COTIZAR MI PROYECTO</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FRANJA DE CONFIANZA SUPERPUESTA ── */}
      <div className="relative z-30 max-w-[1040px] mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 md:-mt-12 pb-4">
        <div className="rounded-2xl sm:rounded-[1.75rem] bg-white p-4 sm:p-6 shadow-[0_12px_36px_-12px_rgba(7,62,72,0.12)] border border-slate-100">
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-[#073E48]">
            {/* Indicador 1 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 text-center sm:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#073E48]">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-bold leading-tight">
                300+ modelos
              </span>
            </div>

            {/* Indicador 2 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 text-center sm:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#27D8BE]">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-bold leading-tight">
                Constructoras verificadas
              </span>
            </div>

            {/* Indicador 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 text-center sm:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#073E48]">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-bold leading-tight">
                Cotización gratuita
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anchor de compatibilidad con enlaces internos preexistentes */}
      <div id="cotizar-hero" className="sr-only" aria-hidden="true" />

      {/* Modal de Cotización de Proyecto */}
      <Dialog open={cotizarOpen} onOpenChange={setCotizarOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-8 rounded-[2rem] bg-white border border-border/60 shadow-2xl">
          <DialogHeader className="mb-4 space-y-1 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27D8BE]">
              Cotización gratuita y sin compromiso
            </span>
            <DialogTitle className="text-2xl font-black tracking-tight text-[#073E48]">
              ¿Cuál es tu proyecto?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Un especialista te responderá en menos de 24h con opciones reales de constructoras verificadas.
            </DialogDescription>
          </DialogHeader>
          <HeroLeadForm />
        </DialogContent>
      </Dialog>
    </section>
  );
}
