import Link from "next/link";
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanUpgradeBannerProps {
  modelsCount?: number;
}

export function PlanUpgradeBanner({ modelsCount = 0 }: PlanUpgradeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-emerald-500/10 via-brand-indigo/10 to-primary/5 p-6 md:p-8 shadow-lg shadow-primary/5">
      <div className="absolute -right-8 -top-8 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Plan Starter Activo · 1 Modelo Incluido
          </div>

          <h3 className="text-xl md:text-2xl font-black font-heading tracking-tight text-foreground">
            ¿Listo para recibir más cotizaciones?
          </h3>

          <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
            Actualmente tienes publicado <strong>{modelsCount} de 1 modelo</strong> permitido en tu Plan Starter. Pasa al <strong>Plan Basic (3 modelos)</strong> o <strong>Plan Crece (10 modelos + recepción de leads directos)</strong> para acelerar tus ventas.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-foreground/80 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Más modelos en catálogo
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Contactos directos por WhatsApp
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Prioridad regional
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/planes"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-xl h-12 px-6 font-bold text-xs uppercase tracking-wider bg-card/80 backdrop-blur-sm border-border/60 hover:bg-card"
            )}
          >
            Comparar Planes
          </Link>

          <Link
            href="/checkout?plan=basic"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-xl h-12 px-7 font-black text-xs uppercase tracking-wider bg-brand-indigo hover:bg-brand-indigo/90 text-white shadow-xl shadow-brand-indigo/20 gap-2"
            )}
          >
            <Zap className="w-4 h-4 fill-white" />
            Mejorar Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
