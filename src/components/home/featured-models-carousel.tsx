"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bath, Bed, Ruler, Star, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ModelWithConstructora } from "@/lib/supabase/services";

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  modular: "Modular",
  "steel-framing": "Steel Framing",
  madera: "Madera / SIP"
};

interface FeaturedModelsCarouselProps {
  models: ModelWithConstructora[];
}

export function FeaturedModelsCarousel({ models }: FeaturedModelsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive visible cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, models.length - visibleCount);

  // Next and Prev handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || models.length <= visibleCount) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, handleNext, models.length, visibleCount]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    // Resume autoplay after brief delay
    setTimeout(() => setIsPaused(false), 2000);
  };

  if (!models || models.length === 0) return null;

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Controls Bar (Header controls) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
            {currentIndex + 1} - {Math.min(currentIndex + visibleCount, models.length)} de {models.length} modelos
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Reanudar carrusel automático" : "Pausar carrusel automático"}
            className="p-1.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            title={isPaused ? "Reanudar autoplay" : "Pausar autoplay"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsPaused(true);
              handlePrev();
            }}
            aria-label="Modelo anterior"
            className="h-11 w-11 rounded-full border border-border/70 bg-white hover:bg-muted flex items-center justify-center text-foreground hover:text-brand-indigo transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPaused(true);
              handleNext();
            }}
            aria-label="Siguiente modelo"
            className="h-11 w-11 rounded-full border border-border/70 bg-white hover:bg-muted flex items-center justify-center text-foreground hover:text-brand-indigo transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overflow Container for Carousel Track */}
      <div className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
          }}
        >
          {models.map((modelo, index) => {
            const hasValidPrice =
              typeof modelo.precio_desde_uf === "number" && modelo.precio_desde_uf > 0;

            return (
              <div
                key={modelo.id}
                className="shrink-0 px-3 md:px-4"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article className="group overflow-hidden rounded-[2.5rem] border border-border/70 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Card Image */}
                  <Link
                    href={`/modelo/${modelo.slug}`}
                    className="relative block h-72 sm:h-80 overflow-hidden bg-muted"
                  >
                    <Image
                      src={modelo.imagenes_urls?.[0] || "/hero.png"}
                      alt={modelo.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
                      <Badge className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 font-extrabold uppercase tracking-[0.16em] text-white text-[11px] backdrop-blur-md">
                        {TIPO_LABELS[modelo.tipo] || modelo.tipo}
                      </Badge>

                      {modelo.constructora?.plan === "premium" && (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fde047] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-950 shadow-md">
                          <Star className="h-3 w-3 fill-current" />
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Bottom Price Pill */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                      <div className="inline-block rounded-2xl bg-[rgba(0,38,43,0.85)] px-4 py-2.5 backdrop-blur-sm border border-white/10 shadow-lg">
                        {hasValidPrice ? (
                          <>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Desde</p>
                            <p className="text-2xl font-bold tracking-tight">
                              {modelo.precio_desde_uf.toLocaleString("es-CL")}{" "}
                              <span className="text-sm font-semibold">UF</span>
                            </p>
                          </>
                        ) : (
                          <p className="text-xs sm:text-sm font-bold tracking-tight text-white">
                            Precio a consultar
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="space-y-6 p-6 sm:p-8 flex flex-col flex-1">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-indigo/70">
                        {modelo.constructora?.nombre || "Constructora Master"}
                      </p>

                      <Link href={`/modelo/${modelo.slug}`}>
                        <h3 className="text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground transition-colors group-hover:text-brand-indigo line-clamp-1">
                          {modelo.nombre}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-foreground/80 line-clamp-2">
                        {modelo.descripcion ||
                          "Modelo con especificaciones técnicas disponibles, fotos referenciales y cotización directa a la constructora."}
                      </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 border-y border-border/60 py-4 mt-auto">
                      <div>
                        <Ruler className="mb-1.5 h-4 w-4 text-brand-teal" />
                        <p className="text-lg font-bold tracking-tight text-brand-indigo">
                          {modelo.superficie_m2}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/60">
                          m²
                        </p>
                      </div>

                      <div>
                        <Bed className="mb-1.5 h-4 w-4 text-brand-teal" />
                        <p className="text-lg font-bold tracking-tight text-brand-indigo">
                          {modelo.dormitorios}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/60">
                          dorm.
                        </p>
                      </div>

                      <div>
                        <Bath className="mb-1.5 h-4 w-4 text-brand-teal" />
                        <p className="text-lg font-bold tracking-tight text-brand-indigo">
                          {modelo.banos}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-foreground/60">
                          baños
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      <Link
                        href={`/modelo/${modelo.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-brand-indigo group-hover:text-foreground transition-colors"
                      >
                        Revisar ficha técnica
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots (Bottom) */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIsPaused(true);
              setCurrentIndex(i);
            }}
            aria-label={`Ir al grupo de modelos ${i + 1}`}
            className={`h-2 transition-all duration-300 rounded-full ${
              currentIndex === i
                ? "w-8 bg-brand-indigo"
                : "w-2 bg-border/80 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
