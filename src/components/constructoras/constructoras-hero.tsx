"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WaitlistRequestForm } from "@/app/(public)/planes/starter/waitlist-form";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  Home,
} from "lucide-react";

export function ConstructorasHero() {
  const [invitacionOpen, setInvitacionOpen] = useState(false);

  return (
    <section
      aria-labelledby="hero-constructoras-heading"
      className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/40 via-background to-background pt-4 sm:pt-6 lg:pt-8 pb-12 lg:pb-16"
    >
      {/* Fondo sutil con trama de puntos y degradado */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* ── COLUMNA IZQUIERDA: Contenido y Acciones ── */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-5 sm:space-y-6">
            
            {/* 1. Etiqueta */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 border border-brand-teal/30 px-3.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-brand-teal shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-teal shrink-0" aria-hidden="true" />
                <span>PARA CONSTRUCTORAS EN CHILE</span>
              </span>
            </div>

            {/* 2. H1 Grande (Ajustado a 3-4 líneas en mobile) */}
            <h1
              id="hero-constructoras-heading"
              className="font-heading font-black text-foreground tracking-tight leading-[1.08] lg:leading-[1.04] text-[clamp(2rem,7vw,3.6rem)] text-balance"
            >
              Muestra lo que construyes.{" "}
              <span className="text-brand-teal block sm:inline">
                Haz que te conozcan.
              </span>
            </h1>

            {/* 3. Descripción */}
            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-xl text-pretty">
              Crea el perfil de tu constructora y publica tu primer modelo para que compradores de tu región descubran tu trabajo.
            </p>

            {/* 4. Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              {/* Botón Principal (Elemento de mayor visibilidad y ancho completo en mobile) */}
              <button
                type="button"
                onClick={() => setInvitacionOpen(true)}
                className="group relative flex w-full sm:w-auto min-h-[54px] sm:min-h-[56px] items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/25 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] cursor-pointer"
              >
                <span>Solicitar invitación gratis</span>
                <ArrowRight className="ml-2.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>

              {/* Botón Secundario (Enlace de menor énfasis debajo en mobile) */}
              <Link
                href="/planes/starter"
                className="inline-flex w-full sm:w-auto min-h-[50px] sm:min-h-[56px] items-center justify-center rounded-2xl border border-border/80 bg-card hover:bg-muted/70 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
              >
                Conocer Plan Starter
              </Link>
            </div>

            {/* 5. Beneficios breves */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  Perfil público
                </span>
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  1 modelo con hasta 3 fotos
                </span>
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  Sin tarjeta
                </span>
              </div>
            </div>

            {/* 6. Aclaración discreta */}
            <p className="text-xs text-muted-foreground/80 font-medium">
              Gratis mientras mantengas tu cuenta activa. Acceso por invitación.
            </p>
          </div>

          {/* ── COLUMNA DERECHA (DESKTOP) / SECCIÓN INFERIOR (MOBILE): Fotografía y Tarjeta Visual ── */}
          <div className="lg:col-span-5 xl:col-span-6 w-full pt-4 lg:pt-0">
            <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/10">
              
              {/* Fotografía de casa prefabricada / modular terminada en el sur de Chile */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[5/4] w-full overflow-hidden">
                <Image
                  src="/images/modelos/ejemplos/puerto-octay-exterior.png"
                  alt="Casa prefabricada y modular en entorno natural del sur de Chile"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-[center_55%] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Tarjeta visual discreta: Representación del perfil de constructora y modelo publicado */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-xl">
                
                {/* Encabezado del Perfil */}
                <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-border/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0 text-brand-teal">
                      <Building2 className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-foreground truncate">
                          Constructora Austral SpA
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <MapPin className="w-3 h-3 text-brand-teal shrink-0" aria-hidden="true" />
                        <span className="truncate">Región de Los Lagos</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full border border-brand-teal/20">
                    Perfil activo
                  </span>
                </div>

                {/* Modelo publicado en el Plan Starter */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      <Home className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-xs truncate">
                        Modelo Puelche 120 m²
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        3 fotos en catálogo regional
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                    1 modelo publicado
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Formulario para Solicitar Invitación al Plan Starter */}
      <Dialog open={invitacionOpen} onOpenChange={setInvitacionOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[2rem] bg-card border border-border/60 shadow-2xl">
          <DialogHeader className="mb-4 space-y-1.5 text-left">
            <span className="inline-flex w-fit items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full border border-brand-teal/20">
              Plan Starter · Sin costo
            </span>
            <DialogTitle className="text-2xl font-black tracking-tight font-heading text-foreground">
              Solicitar invitación gratis
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-medium leading-relaxed">
              Completa los datos de tu empresa para crear el perfil público de tu constructora y publicar tu primer modelo sin costo.
            </DialogDescription>
          </DialogHeader>
          <WaitlistRequestForm />
        </DialogContent>
      </Dialog>
    </section>
  );
}
