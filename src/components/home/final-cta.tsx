import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-brand-indigo py-32 shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=60&w=800')] bg-cover bg-center opacity-15 mix-blend-overlay" />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/4 -translate-x-1/4 rounded-full bg-[#00FFD1]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-5xl space-y-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00FFD1]/20 bg-black/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#00FFD1] backdrop-blur-md">
          <Sparkles className="h-4 w-4" /> Comienza hoy tu busqueda
        </div>

        <h2
          className="font-heading text-5xl font-black leading-none tracking-tighter text-white md:text-7xl"
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          Tu proxima casa
          <br /> empieza aqui
        </h2>

        <p
          className="mx-auto max-w-xl text-xl font-medium leading-relaxed text-white drop-shadow-lg"
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)" }}
        >
          Explora modelos claros, revisa constructoras y avanza con mejor contexto para tomar una buena decision.
        </p>

        <div className="mt-4 flex flex-col justify-center gap-6 sm:flex-row">
          <Link
            href="/catalogo"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "group h-16 rounded-3xl px-12 transition-all")}
          >
            Explorar Catalogo
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Link>

          <Link
            href="/constructoras"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-16 rounded-3xl border-white/40 px-10 text-white transition-all hover:bg-white/10 backdrop-blur-sm"
            )}
          >
            Ver Constructoras
          </Link>
        </div>
      </div>
    </section>
  );
}
