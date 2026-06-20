"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { REGIONES_CHILE } from "@/config/regions";
import { HeroLeadForm } from "@/components/home/hero-lead-form";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-[136px] sm:px-6 md:px-8 md:pb-20 md:pt-[152px]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Image
          src="/images/bg/bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        {/* Left: Value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-[2rem] bg-transparent px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <div className="absolute inset-0 architect-grid opacity-[0.12]" />
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-brand-teal via-brand-indigo to-transparent" />

          <div className="relative z-10 flex flex-col gap-8">
            {/* Dual audience badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/30 bg-brand-teal/8 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                <Users className="h-3 w-3" />
                Para compradores
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-indigo/30 bg-brand-indigo/8 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-indigo">
                <Building2 className="h-3 w-3" />
                Para constructoras
              </span>
            </div>

            <div className="max-w-[46rem] space-y-5">
              <h1 className="max-w-[14ch] text-balance text-[clamp(2.7rem,6.8vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                El marketplace de
                <span className="gradient-text"> casas prefabricadas</span> en Chile.
              </h1>
              <p className="max-w-[42rem] text-base font-medium leading-relaxed text-foreground/74 md:text-[1.1rem]">
                Compara modelos, sistemas constructivos y constructoras verificadas en un solo lugar. Si buscas tu casa, cotiza ahora. Si eres constructora, publica tus modelos y recibe clientes.
              </p>

              {/* Buyer CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/catalogo"
                  className="cta-pill px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em]"
                >
                  Explorar modelos
                </Link>
                <Link
                  href="/constructoras"
                  className="cta-pill-secondary px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em]"
                >
                  Ver constructoras
                </Link>
              </div>

              {/* Constructora micro-CTA */}
              <div className="pt-2">
                <Link
                  href="/planes"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-brand-indigo/70 transition-colors hover:text-brand-indigo"
                >
                  <Building2 className="h-4 w-4" />
                  ¿Eres constructora? Publica tus modelos gratis →
                </Link>
              </div>
            </div>

            {/* Social proof mini stats */}
            <div className="flex flex-wrap gap-6 border-t border-border/40 pt-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-brand-teal" />
                <span className="font-bold text-foreground/80">{REGIONES_CHILE.length} regiones</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-brand-indigo" />
                <span className="font-bold text-foreground/80">Constructoras verificadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-brand-teal" />
                <span className="font-bold text-foreground/80">Cotización gratuita</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Lead capture form */}
        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="flex flex-col gap-4 pt-8 lg:pt-[5rem]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/80 p-6 shadow-xl shadow-brand-indigo/5 backdrop-blur-md sm:p-8">
            <div className="absolute inset-0 architect-grid opacity-[0.05]" />
            <div className="relative z-10 mb-6 space-y-1.5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-teal">
                Cotización gratuita y sin compromiso
              </p>
              <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                ¿Cuál es tu proyecto?
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Un especialista te responde en menos de 24h con opciones reales.
              </p>
            </div>
            <div className="relative z-10">
              <HeroLeadForm />
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
