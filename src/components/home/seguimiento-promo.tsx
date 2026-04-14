"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: "tracking",
    badge: "Transparencia total",
    title: "Construye con confianza y control total.",
    subtitle:
      "Usa el seguimiento de obra para ver avances reales, fotos de bitacora y cumplimiento de hitos.",
    image: "/images/promo-tracking.jpg",
    link: "/seguimiento-de-obras",
    cta: "Explorar seguimiento",
    features: ["Fotos reales", "Linea de tiempo", "Control de plazos"],
    accent: "text-brand-teal",
    badgeClass: "bg-brand-teal/10 text-brand-teal",
  },
  {
    id: "constru",
    badge: "Ecosistema B2B",
    title: "Conecta tu obra con mejores proveedores.",
    subtitle:
      "Digitaliza tu catalogo y gestiona cotizaciones directamente con constructoras y proveedores.",
    image: "/images/promo-constru.jpg",
    link: "/portal-proveedores",
    cta: "Explorar portal B2B",
    features: ["Catalogo digital", "Cotizaciones", "Analitica de mercado"],
    accent: "text-brand-indigo",
    badgeClass: "bg-brand-indigo/10 text-brand-indigo",
  },
] as const;

export function SeguimientoPromo() {
  const [current, setCurrent] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const slide = SLIDES[current];

  useEffect(() => {
    if (isZoomOpen) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [isZoomOpen]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-indigo/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          <div className="relative w-full lg:w-1/2">
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    className="group relative h-[360px] w-full cursor-zoom-in overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl sm:h-[500px] sm:rounded-[3rem]"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/70 via-transparent to-transparent opacity-70" />
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md">
                            <Search className="h-8 w-8" />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-8 left-8 z-30 flex gap-2">
                      {SLIDES.map((item, index) => (
                        <span
                          key={item.id}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            index === current ? "w-8 bg-brand-teal" : "w-2 bg-white/30",
                          )}
                        />
                      ))}
                    </div>
                  </button>
                }
              />
              <DialogContent className="h-[90vh] max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-7xl">
                <DialogHeader className="sr-only">
                  <DialogTitle>{slide.title}</DialogTitle>
                  <DialogDescription>Vista ampliada del sistema</DialogDescription>
                </DialogHeader>
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="95vw"
                    quality={100}
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <div className="absolute bottom-8 right-8 z-30 flex gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Ver promocion anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-brand-indigo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Ver siguiente promocion"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-brand-indigo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="w-full space-y-8 text-left lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <Badge
                    className={cn(
                      "h-auto rounded-full border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]",
                      slide.badgeClass,
                    )}
                  >
                    {slide.badge}
                  </Badge>
                  <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tighter text-brand-indigo">
                    {slide.title}
                  </h2>
                </div>

                <p className="max-w-xl text-xl font-medium leading-relaxed text-muted-foreground opacity-80">
                  {slide.subtitle}
                </p>

                <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {slide.features.map((text) => (
                    <li key={text} className="flex items-center gap-3 text-sm font-bold text-brand-indigo">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          slide.id === "tracking" ? "bg-brand-teal/20" : "bg-brand-indigo/10",
                        )}
                      >
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4",
                            slide.id === "tracking" ? "text-brand-teal" : slide.accent,
                          )}
                        />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link href={slide.link} className="inline-flex w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-2xl bg-brand-indigo px-8 font-black uppercase text-white shadow-xl shadow-brand-indigo/20 transition-transform hover:scale-105 sm:w-auto"
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
