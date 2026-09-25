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
      <div className="relative min-h-[calc(100svh-72px)] lg:min-h-[700px] lg:max-h-[780px] lg:h-[clamp(700px,calc(100vh-88px),780px)] w-full overflow-hidden flex flex-col justify-start lg:justify-center">
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
            className="h-full w-full object-cover object-[center_bottom] lg:object-[68%_center]"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Degradado localizado móvil (180deg vertical) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(3, 42, 52, 0.95) 0%, rgba(3, 42, 52, 0.82) 36%, rgba(3, 42, 52, 0.35) 58%, rgba(3, 42, 52, 0) 76%)",
          }}
          aria-hidden="true"
        />

        {/* Degradado localizado desktop (90deg horizontal de izquierda a derecha) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(3, 42, 52, 0.96) 0%, rgba(3, 42, 52, 0.84) 38%, rgba(3, 42, 52, 0.28) 60%, rgba(3, 42, 52, 0) 78%)",
          }}
          aria-hidden="true"
        />

        {/* Contenido Hero (Texto en parte superior en mobile, a la izquierda en desktop) */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-12 pt-12 sm:pt-14 pb-8 lg:py-0">
          <div className="w-full max-w-full lg:max-w-[620px]">
            {/* Etiqueta */}
            <div className="mb-4 sm:mb-5">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#073E48]/85 border border-[#27D8BE]/50 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#27D8BE] shadow-sm backdrop-blur-md">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#27D8BE] animate-pulse" />
                <span className="truncate">CATÁLOGO DE CASAS EN CHILE</span>
              </span>
            </div>

            {/* Título H1 */}
            <h1 className="font-extrabold text-white leading-[0.98] text-[clamp(2.5rem,10.8vw,3.75rem)] lg:text-[clamp(3.5rem,5vw,4.75rem)] tracking-[-0.035em] lg:tracking-[-0.04em] max-w-full lg:max-w-[620px] mb-4 sm:mb-5 lg:mb-6">
              Encuentra la casa ideal para tu&nbsp;terreno.
            </h1>

            {/* Descripción */}
            <p className="font-normal text-[#FAFAF7]/95 leading-[1.45] text-[clamp(1rem,4.4vw,1.25rem)] lg:text-[clamp(1.15rem,1.5vw,1.5rem)] max-w-[34rem] lg:max-w-[570px] mb-6 sm:mb-8 lg:mb-10 text-pretty">
              Compara modelos, planos, precios y sistemas constructivos de empresas verificadas.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-0">
              {/* Botón Principal: EXPLORAR MODELOS */}
              <Link
                href="/catalogo"
                onClick={() => trackCatalogoClick("hero")}
                className="group relative flex w-full sm:w-auto min-h-[56px] lg:min-h-[60px] lg:h-[60px] items-center justify-center rounded-full border-2 border-[#27D8BE] bg-[#073E48] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/30 transition-all duration-200 hover:bg-[#0a4d59] hover:border-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#073E48]"
              >
                <span className="text-center">EXPLORAR MODELOS</span>
                <ArrowRight className="absolute right-5 sm:relative sm:right-auto sm:ml-2.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              {/* Botón Secundario: COTIZAR MI PROYECTO */}
              <button
                type="button"
                onClick={() => {
                  setCotizarOpen(true);
                  trackCotizacionStart({ source: "hero_form" });
                }}
                className="group relative flex w-full sm:w-auto min-h-[56px] lg:min-h-[60px] lg:h-[60px] items-center justify-center rounded-full border-2 border-[#27D8BE] bg-[#FAFAF7] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#073E48] shadow-md transition-all duration-200 hover:bg-white hover:border-[#073E48] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2"
              >
                <span className="text-center">COTIZAR MI PROYECTO</span>
                <ArrowRight className="absolute right-5 sm:relative sm:right-auto sm:ml-2.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FRANJA DE CONFIANZA (Ocultada temporalmente) ── */}
      <div className="hidden relative z-30 w-full max-w-[1040px] mx-auto px-4 sm:px-6 mt-3 lg:-mt-14 pb-4">
        <div className="rounded-2xl lg:rounded-[1.75rem] bg-white p-3.5 sm:p-5 lg:px-8 lg:py-0 lg:h-[120px] shadow-[0_12px_36px_-12px_rgba(7,62,72,0.12)] border border-slate-100 flex items-center">
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-[#073E48] w-full">
            {/* Indicador 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-1.5 sm:gap-2.5 lg:gap-4 px-1 sm:px-3 lg:px-6 text-center lg:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#073E48]">
                <Home className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" aria-hidden="true" />
              </div>
              <span className="text-[12px] min-[380px]:text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold leading-tight lg:leading-snug">
                300+ modelos
              </span>
            </div>

            {/* Indicador 2 */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-1.5 sm:gap-2.5 lg:gap-4 px-1 sm:px-3 lg:px-6 text-center lg:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#27D8BE]">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" aria-hidden="true" />
              </div>
              <span className="text-[12px] min-[380px]:text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold leading-tight lg:leading-snug">
                Constructoras verificadas
              </span>
            </div>

            {/* Indicador 3 */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-1.5 sm:gap-2.5 lg:gap-4 px-1 sm:px-3 lg:px-6 text-center lg:text-left">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-[#073E48]/8 text-[#073E48]">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" aria-hidden="true" />
              </div>
              <span className="text-[12px] min-[380px]:text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold leading-tight lg:leading-snug">
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
