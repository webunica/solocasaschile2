'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MapPin, Building2, Ruler, BedDouble, Bath, Pause, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { ModelWithConstructora } from '@/lib/supabase/services'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeaturedSliderProps {
  models: ModelWithConstructora[]
  regionLabel?: string // e.g. "Los Lagos"
}

export function FeaturedSlider({ models, regionLabel }: FeaturedSliderProps) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (models.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % models.length)
    }, 6000)
  }, [models.length])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (!isPaused) startTimer()
    return stopTimer
  }, [isPaused, startTimer, stopTimer])

  if (!models.length) return null

  const current = models[index]

  const handlePrev = () => {
    setIsPaused(true)
    setIndex((prev) => (prev - 1 + models.length) % models.length)
  }

  const handleNext = () => {
    setIsPaused(true)
    setIndex((prev) => (prev + 1) % models.length)
  }

  const handleDot = (i: number) => {
    setIsPaused(true)
    setIndex(i)
  }

  const badge = regionLabel
    ? `Destacados en ${regionLabel}`
    : 'Recomendación Destacada'

  return (
    <div
      className="relative group w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-card/40 border border-border/40 mb-12 lg:mb-16"
      role="region"
      aria-label={badge}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[340px] lg:min-h-[380px] flex items-center"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={current.imagenes_urls[0] || '/placeholder.png'}
              alt={`${current.nombre} — ${current.constructora?.nombre || ''}`}
              fill
              className="object-cover transition-transform duration-[10s] hover:scale-110"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent hidden lg:block" />
          </div>

          {/* Content */}
          <div className="container relative z-10 px-8 lg:px-16 py-8 lg:py-10 max-w-4xl mr-auto ml-0">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#134e4a] text-[#2dd4bf] font-black uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-md border border-[#2dd4bf]/20 shadow-xl">
                <MapPin className="w-4 h-4" />
                <span>{badge}</span>
                {models.length > 1 && (
                  <span className="opacity-60 font-medium normal-case ml-1">
                    {index + 1}/{models.length}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-6xl font-heading font-black tracking-tighter italic text-foreground leading-[0.9]">
                  {current.nombre}
                </h2>
                <div className="flex items-center gap-3">
                  {current.constructora?.logo_url ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 shrink-0">
                      <Image
                        src={current.constructora.logo_url}
                        alt={current.constructora.nombre}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <Link
                    href={`/constructora/${current.constructora?.slug || '#'}`}
                    className="text-xl font-bold text-muted-foreground opacity-80 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {current.constructora?.nombre}
                  </Link>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-6 max-w-sm bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm font-black tracking-tight">{current.superficie_m2}</span>
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">m² totales</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <BedDouble className="w-4 h-4" />
                    <span className="text-sm font-black tracking-tight">{current.dormitorios}</span>
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">habitaciones</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm font-black tracking-tight">{current.banos}</span>
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">baños</div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="space-y-1">
                  <div className="text-[#1b0088] text-3xl lg:text-4xl font-black tracking-tighter leading-none italic">
                    {current.precio_desde_uf.toLocaleString()} <span className="text-xl not-italic">UF</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Precio base desde</div>
                </div>

                <Link href={`/modelo/${current.slug}`}>
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-2xl bg-brand-indigo text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Ver ficha técnica
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav Controls */}
      {models.length > 1 && (
        <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-16 z-20 flex items-center gap-3">
          {/* Pause/Play */}
          <button
            onClick={() => setIsPaused(p => !p)}
            aria-label={isPaused ? 'Reanudar presentación' : 'Pausar presentación'}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all"
          >
            {isPaused
              ? <Play className="w-4 h-4" />
              : <Pause className="w-4 h-4" />}
          </button>
          {/* Prev */}
          <button
            onClick={handlePrev}
            aria-label="Modelo anterior"
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all group"
          >
            <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          {/* Next */}
          <button
            onClick={handleNext}
            aria-label="Modelo siguiente"
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all group"
          >
            <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Pagination Dots */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-16 z-20 flex flex-col gap-2" role="tablist" aria-label="Navegación de modelos">
        {models.map((m, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Ver ${m.nombre}`}
            onClick={() => handleDot(i)}
            className={cn(
              'w-1.5 rounded-full transition-all duration-500',
              i === index ? 'bg-brand-teal h-20' : 'bg-white/20 hover:bg-white/40 h-12'
            )}
          />
        ))}
      </div>
    </div>
  )
}
