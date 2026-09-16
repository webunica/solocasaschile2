"use client";

import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Building2, MessageCircle, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackCatalogoClick, trackConstructorasAccessClick, trackRegistroStart } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-10 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.7rem] bg-brand-evergreen-dark px-6 py-14 text-white shadow-[0_45px_120px_-45px_rgba(16,28,24,0.85)] sm:px-10 md:px-14 md:py-18">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,191,113,0.22),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(214,124,70,0.24),transparent_30%)]" />
          <div className="absolute inset-0 architect-grid opacity-[0.08]" />

          <div className="relative z-10 space-y-4 text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300">
              Da el siguiente paso
            </p>
            <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[0.95] tracking-[-0.05em] text-balance text-white">
              Elige tu casa con información clara o da a conocer tu constructora.
            </h2>
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-2">
            {/* Card: Para compradores */}
            <div className="rounded-[2rem] border border-white/20 bg-white/[0.08] p-7 md:p-8 backdrop-blur-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-500/25 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-teal-200">
                <Users className="h-3.5 w-3.5 text-teal-300" />
                Para quienes buscan casa
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Compara modelos y cotiza gratis
              </h3>
              <ul className="space-y-3">
                {[
                  "Filtra modelos por metros cuadrados y sistema constructivo",
                  "Revisa precios referenciales en UF y fotos reales",
                  "Envía tu solicitud de cotización sin costo ni compromiso",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-white/95 leading-snug">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/catalogo"
                  onClick={() => trackCatalogoClick("final_cta")}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-13 rounded-2xl bg-white px-6 font-extrabold uppercase tracking-wider text-brand-evergreen-dark hover:bg-white/90 shadow-lg shadow-black/20"
                  )}
                >
                  Explorar modelos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#cotizar-hero"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-13 rounded-2xl border-2 border-white/40 bg-white/5 px-6 font-extrabold uppercase tracking-wider text-white hover:bg-white/15"
                  )}
                >
                  Solicitar cotización
                </Link>
              </div>
            </div>

            {/* Card: Para constructoras */}
            <div className="rounded-[2rem] border border-amber-400/30 bg-white/[0.08] p-7 md:p-8 backdrop-blur-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/20 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-300">
                <Building2 className="h-3.5 w-3.5 text-amber-300" />
                Para empresas constructoras
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Publica tus modelos y recibe cotizaciones
              </h3>
              <ul className="space-y-3">
                {[
                  "Prueba de 30 días sin costo con hasta 3 modelos publicados",
                  "Recibe cotizaciones directas con datos reales de contacto",
                  "Panel de control para gestionar prospectos y catálogo",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-white/95 leading-snug">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/para-constructoras"
                  onClick={() => trackConstructorasAccessClick("final_cta")}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-13 rounded-2xl bg-amber-400 px-6 font-extrabold uppercase tracking-wider text-slate-950 hover:bg-amber-300 shadow-lg shadow-black/20"
                  )}
                >
                  Conocer planes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/register?plan=gratis"
                  onClick={() => trackRegistroStart("gratis")}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-13 rounded-2xl border-2 border-white/40 bg-white/5 px-6 font-extrabold uppercase tracking-wider text-white hover:bg-white/15"
                  )}
                >
                  Publicar constructora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
