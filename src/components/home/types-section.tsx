"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CONSTRUCTION_SYSTEMS } from "@/config/construction-systems";

export function TypesSection() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalItems = CONSTRUCTION_SYSTEMS.length;
  const desktopVisible = 4;
  const maxIndex = isMobile ? totalItems - 1 : totalItems - desktopVisible;

  const next = useCallback(() => {
    setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const cardWidth = isMobile ? 84 : 25;
  const gap = isMobile ? 4 : 0;
  const offset = isMobile ? 8 : 0;

  return (
    <section className="section-frame relative overflow-hidden px-4 py-28 sm:px-6 md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,124,70,0.08),transparent_25%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow">Sistemas constructivos</span>
            <h2 className="max-w-4xl text-[clamp(2.7rem,6vw,5rem)] font-black tracking-[-0.05em]">
              Cada sistema ahora se presenta como una familia clara de decisiones.
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground/90">
              El carrusel sigue vivo, pero con una puesta mas sobria, mas legible y mas cercana a una mesa de trabajo que a un bloque promocional.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              aria-label="Ver sistema constructivo anterior"
              onClick={prev}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-primary/15 bg-background/80 shadow-none"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              aria-label="Ver siguiente sistema constructivo"
              onClick={next}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-primary/15 bg-background/80 shadow-none"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="overflow-visible">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            animate={{
              x: isMobile
                ? `calc(${offset}% - ${index * (cardWidth + gap)}%)`
                : `-${index * cardWidth}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: -1000, right: 1000 }}
            onDragEnd={(_, info) => {
              if (!isMobile) return;
              const threshold = 50;
              if (info.offset.x < -threshold && index < maxIndex) next();
              else if (info.offset.x > threshold && index > 0) prev();
            }}
          >
            {CONSTRUCTION_SYSTEMS.map((type, itemIndex) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: itemIndex * 0.06 }}
                viewport={{ once: true }}
                style={{
                  width: `${cardWidth}%`,
                  marginRight: isMobile ? `${gap}%` : "0",
                }}
                className={cn(
                  "flex-none p-2 md:p-3",
                  isMobile && index !== itemIndex ? "opacity-80" : "opacity-100"
                )}
              >
                <Link href={type.link} className="group block h-full rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-4">
                  <div
                    className={cn(
                      "paper-panel relative flex min-h-[420px] h-full flex-col justify-between overflow-hidden rounded-[2rem] p-7 md:min-h-[460px] md:p-8",
                      "transition-transform duration-500 group-hover:-translate-y-1"
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", type.color)} />
                    <div className="relative z-10 space-y-6">
                      <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl", type.accent)}>
                        <span aria-hidden="true">{type.icon}</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/65">
                          Sistema
                        </p>
                        <h3 className="text-3xl font-black tracking-[-0.04em] text-foreground">{type.title}</h3>
                        <p className="text-sm font-medium leading-relaxed text-foreground/85">
                          {type.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-indigo">
                      Explorar modelos
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
