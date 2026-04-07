'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Home, Building2, Ruler, BedDouble, Bath } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { ModelWithConstructora } from '@/lib/supabase/services'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeaturedSliderProps {
  models: ModelWithConstructora[]
}

export function FeaturedSlider({ models }: FeaturedSliderProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (models.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % models.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [models.length])

  if (!models.length) return null

  const current = models[index]

  const next = () => setIndex((prev) => (prev + 1) % models.length)
  const prev = () => setIndex((prev) => (prev - 1 + models.length) % models.length)

  return (
    <div className="relative group w-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-card/40 border border-border/40 mb-12 lg:mb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[480px] lg:min-h-[520px] flex items-center"
        >
          {/* Background Gradient & Image */}
          <div className="absolute inset-0 z-0">
             <Image 
               src={current.imagenes_urls[0] || '/placeholder.png'} 
               alt={current.nombre}
               fill
               className="object-cover transition-transform duration-[10s] hover:scale-110"
               priority={index === 0}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent hidden lg:block" />
          </div>

          {/* Content */}
          <div className="container relative z-10 px-8 lg:px-16 py-12 lg:py-16 max-w-4xl mr-auto ml-0">
             <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal/20 text-brand-teal font-black uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-md border border-brand-teal/20">
                   <Home className="w-4 h-4" />
                   <span>RECOMENDACIÓN DESTACADA</span>
                </div>

                <div className="space-y-2">
                   <h2 className="text-4xl lg:text-7xl font-heading font-black tracking-tighter italic text-foreground leading-[0.9]">
                      {current.nombre}
                   </h2>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                         <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xl font-bold text-muted-foreground opacity-80">
                         {current.constructora?.nombre}
                      </span>
                   </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-6 max-w-md bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
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

                <div className="flex flex-wrap items-center gap-6 pt-4">
                   <div className="space-y-1">
                      <div className="text-[#1b0088] text-4xl lg:text-5xl font-black tracking-tighter leading-none italic">
                         {current.precio_desde_uf.toLocaleString()} <span className="text-2xl not-italic">UF</span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Precio base desde</div>
                   </div>
                   
                   <Link href={`/modelo/${current.slug}`}>
                      <Button size="lg" className="h-16 px-10 rounded-2xl bg-brand-indigo text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
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
          <button 
            onClick={prev}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all group"
          >
             <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all group"
          >
             <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Pagination Dots */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-16 z-20 flex flex-col gap-2">
         {models.map((_, i) => (
            <button 
               key={i}
               onClick={() => setIndex(i)}
               className={cn(
                  "w-1.5 h-12 rounded-full transition-all duration-500",
                  i === index ? "bg-brand-teal h-20" : "bg-white/20 hover:bg-white/40"
               )}
            />
         ))}
      </div>
    </div>
  )
}
