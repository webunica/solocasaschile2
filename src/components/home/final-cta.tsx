import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Building2, MessageCircle, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-10 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.7rem] bg-brand-evergreen-dark px-6 py-14 text-white shadow-[0_45px_120px_-45px_rgba(16,28,24,0.85)] sm:px-10 md:px-14 md:py-18">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,191,113,0.22),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(214,124,70,0.24),transparent_30%)]" />
          <div className="absolute inset-0 architect-grid opacity-[0.08]" />

          <div className="relative z-10 space-y-4 text-center mb-12">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-brand-sunset">
              ¿Listo para el siguiente paso?
            </p>
            <h2 className="text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[0.92] tracking-[-0.05em] text-balance">
              El marketplace más completo de casas prefabricadas en Chile.
            </h2>
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-2">
            {/* Card: Para compradores */}
            <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 backdrop-blur-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-teal/20 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-teal">
                <Users className="h-3.5 w-3.5" />
                Para compradores
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Encuentra tu casa prefabricada ideal
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Compara modelos y precios referenciales",
                  "Constructoras verificadas en tu región",
                  "Cotización gratuita en menos de 24h",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-white/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/catalogo"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-13 rounded-2xl bg-brand-teal px-7 font-extrabold uppercase tracking-[0.15em] text-brand-indigo hover:bg-brand-teal/90"
                  )}
                >
                  Ver modelos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={`https://wa.me/56964130601?text=${encodeURIComponent("Hola SolocasasChile, me gustaría cotizar una casa prefabricada.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-13 rounded-2xl border-white/25 px-7 font-extrabold uppercase tracking-[0.15em] text-white hover:bg-white/10"
                  )}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Link>
              </div>
            </div>

            {/* Card: Para constructoras */}
            <div className="rounded-[2rem] border border-brand-indigo/30 bg-brand-indigo/20 p-8 backdrop-blur-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-indigo/30 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/90">
                <Building2 className="h-3.5 w-3.5" />
                Para constructoras
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Publica tus modelos y recibe clientes
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Comienza gratis con hasta 3 modelos",
                  "Leads de compradores en tu región",
                  "CRM para gestionar cotizaciones",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-white/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/planes"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-13 rounded-2xl bg-white px-7 font-extrabold uppercase tracking-[0.15em] text-brand-indigo hover:bg-white/90"
                  )}
                >
                  Ver planes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/register?plan=gratis"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-13 rounded-2xl border-white/25 px-7 font-extrabold uppercase tracking-[0.15em] text-white hover:bg-white/10"
                  )}
                >
                  Registrarse gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
