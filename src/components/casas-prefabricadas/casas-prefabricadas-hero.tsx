"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Box,
  MapPin,
  Home,
  Eye,
} from "lucide-react";

interface ModelSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  specs: string;
  badge: string;
}

const CAROUSEL_MODELS: ModelSlide[] = [
  {
    id: "modelo-alpina-bosque",
    image: "/images/modelos/carrusel/modelo-bosque-sur.jpg",
    alt: "Casa prefabricada cabaña alpina contemporánea en entorno de bosque nativo del sur - exterior e interior",
    title: "Modelo Cabaña Alpina 54 m²",
    subtitle: "Madera tratada & Zinc negro emballetado",
    specs: "2D · 1B · Altillo loft · Estufa a leña integrada",
    badge: "Montaje en 15 días",
  },
  {
    id: "modelo-ribera-panoramica",
    image: "/images/modelos/carrusel/modelo-lago-panoramico.jpg",
    alt: "Casa prefabricada modular ribereña sobre pilotes frente a lago y montañas - exterior e interior",
    title: "Modelo Ribera Panorámica 96 m²",
    subtitle: "Estructura sobre pilotes para terreno en pendiente",
    specs: "3D · 2B · Vista panorámica · Termopanel piso a cielo",
    badge: "Llave en mano",
  },
  {
    id: "modelo-l-house-contemporanea",
    image: "/images/modelos/carrusel/modelo-casa-l-contemporanea.jpg",
    alt: "Casa prefabricada en L contemporánea con terraza deck y vista cordillerana - exterior e interior",
    title: "Modelo L-House Contemporánea 120 m²",
    subtitle: "Diseño en L con patio interior y terraza protegida",
    specs: "3D · 2B · Cocina integrada · Terraza de 35 m²",
    badge: "Alta eficiencia",
  },
];

interface CasasPrefabricadasHeroProps {
  totalModelos?: number;
}

export function CasasPrefabricadasHero({
  totalModelos = 300,
}: CasasPrefabricadasHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_MODELS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + CAROUSEL_MODELS.length) % CAROUSEL_MODELS.length
    );
  }, []);

  // Autoplay suave cada 6 segundos, pausado al hacer hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const activeModel = CAROUSEL_MODELS[currentIndex];

  return (
    <section
      aria-labelledby="hero-prefabricadas-heading"
      className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/40 via-background to-background pt-4 sm:pt-6 lg:pt-8 pb-12 lg:pb-16"
    >
      {/* Fondo sutil con trama de puntos y resplandor decorativo */}
      <div
        className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* ── COLUMNA IZQUIERDA: Contenido y Acciones ── */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6">
            
            {/* 1. Etiqueta / Eyebrow */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 border border-brand-teal/30 px-3.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-brand-teal shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-teal shrink-0" aria-hidden="true" />
                <span>CASAS PREFABRICADAS EN CHILE</span>
              </span>
            </div>

            {/* 2. H1 Grande (Ajustado a 3-4 líneas en mobile) */}
            <h1
              id="hero-prefabricadas-heading"
              className="font-heading font-black text-foreground tracking-tight leading-[1.08] lg:leading-[1.04] text-[clamp(2rem,7vw,3.6rem)] text-balance"
            >
              Casas Prefabricadas en Chile.{" "}
              <span className="text-brand-teal block sm:inline">
                Compara modelos, planos y precios reales.
              </span>
            </h1>

            {/* 3. Descripción */}
            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-xl text-pretty">
              Compara modelos terminados, kits básicos y opciones llave en mano de constructoras verificadas en Chile. Revisa especificaciones técnicas, precios por metro cuadrado y tiempos de montaje para tu terreno.
            </p>

            {/* 4. Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              {/* Botón Principal (Ancho completo en mobile con área táctil cómoda) */}
              <Link
                href="/catalogo"
                className="group relative flex w-full sm:w-auto min-h-[54px] sm:min-h-[56px] items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/25 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] cursor-pointer"
              >
                <span>Explorar catálogo de casas</span>
                <ArrowRight className="ml-2.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              {/* Botón Secundario (Menor énfasis debajo en mobile) */}
              <Link
                href="/cotizar"
                className="inline-flex w-full sm:w-auto min-h-[50px] sm:min-h-[56px] items-center justify-center rounded-2xl border border-border/80 bg-card hover:bg-muted/70 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
              >
                Cotizar mi proyecto
              </Link>
            </div>

            {/* 5. Beneficios breves con chips */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  Desde 8 a 18 UF/m²
                </span>
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  Montaje rápido en 7 a 20 días
                </span>
                <span className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  Cobertura en 16 regiones
                </span>
              </div>
            </div>

            {/* 6. Aclaración discreta / Rango de precios */}
            <p className="text-xs text-muted-foreground/80 font-medium">
              Opciones desde kit autoconstrucción hasta llave en mano · Permisos DOM y recepción municipal en todo Chile.
            </p>
          </div>

          {/* ── COLUMNA DERECHA (DESKTOP) / INFERIOR (MOBILE): Carrusel de Modelos ── */}
          <div
            className="lg:col-span-6 xl:col-span-6 w-full pt-4 lg:pt-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/10">
              
              {/* Contenedor de Slide Activo con Transición */}
              <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/10] xl:aspect-[16/10] w-full overflow-hidden bg-slate-900">
                {CAROUSEL_MODELS.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  </div>
                ))}

                {/* Badge indicador de vistas: Exterior + Interior */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-brand-teal" />
                    Exterior & Interior
                  </span>
                </div>

                {/* Botones de navegación del Carrusel */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Modelo anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Modelo siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Indicadores de Puntos (Dots) */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                  {CAROUSEL_MODELS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Ir a modelo ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dotIdx === currentIndex
                          ? "w-6 bg-brand-teal"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tarjeta visual discreta del modelo activo */}
              <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border/50">
                {/* Encabezado del modelo */}
                <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-border/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0 text-brand-teal">
                      <Box className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-foreground truncate">
                        {activeModel.title}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <MapPin className="w-3 h-3 text-brand-teal shrink-0" aria-hidden="true" />
                        <span className="truncate">{activeModel.subtitle}</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full border border-brand-teal/20">
                    {activeModel.badge}
                  </span>
                </div>

                {/* Especificaciones clave */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      <Home className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-xs truncate">
                        {activeModel.specs}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        Disponible para cotización en tu región
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/catalogo"
                    className="text-[10px] font-bold text-brand-teal hover:underline shrink-0 flex items-center gap-1"
                  >
                    Ver detalles <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
