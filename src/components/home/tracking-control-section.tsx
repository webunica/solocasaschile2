import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TrackingControlSection() {
  return (
    <section
      aria-labelledby="tracking-control-title"
      className="relative isolate overflow-clip bg-background"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-background to-transparent lg:block" />

      <div className="container relative mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-12 lg:min-h-[130vh] lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:py-0">
        <div className="relative z-20 flex items-start lg:py-32">
          <div className="max-w-xl space-y-8 lg:sticky lg:top-40 lg:pt-16">
            <p className="text-[11px] font-black uppercase tracking-[0.36em] text-brand-teal">
              solocasaschile
            </p>

            <div className="space-y-7">
              <h2
                id="tracking-control-title"
                className="font-heading text-[clamp(2.6rem,6.5vw,5.35rem)] font-black leading-[0.9] tracking-tighter text-brand-indigo"
              >
                Tu casa, bajo{" "}
                <span className="block text-brand-teal italic">Control</span>
                <span className="block">total y Real.</span>
              </h2>

              <p className="max-w-lg text-lg font-medium leading-relaxed text-slate-600 md:text-xl">
                Eliminamos la incertidumbre en la construcción. Nuestra plataforma permite monitorear cada hito, visualizar evidencias y certificar la calidad de tu proyecto desde la palma de tu mano.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link
                href="/seguimiento-de-obras"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-lg bg-brand-indigo px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-indigo/15 transition-transform hover:-translate-y-0.5 hover:text-white",
                )}
              >
                Ver seguimiento
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/constructoras"
                className="inline-flex h-14 items-center justify-center rounded-lg border border-brand-indigo/20 px-8 text-xs font-black uppercase tracking-widest text-brand-indigo transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                Constructoras validadas
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[440px] lg:min-h-0">
          <div className="lg:sticky lg:top-20 lg:-mr-[8vw] lg:h-screen lg:pt-10">
            <div className="relative z-0 h-[440px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-[0_60px_120px_-60px_rgba(27,0,136,0.36)] md:h-[620px] lg:h-[calc(100vh-5rem)] lg:rounded-none lg:border-y-0 lg:border-r-0">
              <Image
                src="/images/home/seguimiento-proyecto.jpg"
                alt="Panel de seguimiento de proyecto de construcción"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out motion-safe:hover:scale-[1.015]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-background/5 to-transparent lg:from-background/55" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/35 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
