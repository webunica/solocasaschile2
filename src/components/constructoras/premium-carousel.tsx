"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function PremiumCarousel({ constructoras }: { constructoras: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || constructoras.length < 2) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        
        // Si llegamos casi al final, reiniciamos suavemente al principio
        if (scrollLeft + offsetWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000); // Se mueve cada 4 segundos

    return () => clearInterval(interval);
  }, [constructoras.length]);

  if (!constructoras.length) return null;

  return (
    <div className="relative w-full overflow-hidden py-10 -mx-4 px-4 md:-mx-8 md:px-8">
      {/* Carrusel contenedor (snap scroll) */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 max-w-[100vw] will-change-scroll"
      >
        {constructoras.map((c) => (
          <Link
            key={c.id}
            href={`/constructora/${c.slug}`}
            className="group flex-none w-[80vw] sm:w-[350px] snap-center bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 hover:border-primary/30 hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/5 flex flex-col gap-6"
          >
            {/* Logo + plan badge */}
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-2xl border-2 border-border/40 bg-background flex items-center justify-center p-3 overflow-hidden group-hover:border-primary/30 transition-colors">
                {c.logo_url ? (
                  <Image src={c.logo_url} alt={c.nombre} width={48} height={48} className="object-contain" />
                ) : (
                  <div className="text-2xl font-black text-brand-indigo">{c.nombre[0]}</div>
                )}
              </div>
              {c.plan === "premium" ? (
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-black text-[9px] uppercase tracking-widest">
                  <Star className="w-2.5 h-2.5 mr-1 fill-current" /> Premium
                </Badge>
              ) : c.plan === "pro" ? (
                <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest">Pro</Badge>
              ) : null}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xl tracking-tight group-hover:text-primary transition-colors line-clamp-1">{c.nombre}</h3>
                {c.verificada && <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />}
              </div>
              {c.descripcion && (
                <p className="text-muted-foreground font-medium text-sm line-clamp-2 leading-relaxed">{c.descripcion}</p>
              )}
            </div>

            {/* Score + CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Score Confianza</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-brand-indigo">{c.score_confianza ?? "–"}</span>
                  <span className="text-[10px] font-bold opacity-40">/100</span>
                </div>
              </div>
              <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white border-border transition-all")}>
                Perfil <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Decorativo Gradiente lados scrollbar-hide no nativo */}
      <div className="pointer-events-none absolute right-0 top-0 w-12 md:w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
      <div className="pointer-events-none absolute left-0 top-0 w-12 md:w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
    </div>
  );
}
