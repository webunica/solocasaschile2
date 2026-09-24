"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Building2,
  Rocket,
  Zap,
  Crown,
} from "lucide-react";
import {
  trackPlanCheckoutClick,
} from "@/lib/analytics";

const UPGRADE_PLANS = [
  {
    id: "basic",
    nombre: "Plan Basic",
    subtitulo: "Presencia Ampliada",
    precioMensual: "1.0",
    precioAnualEquiv: "0.8",
    precioAnualTotal: "9.6",
    icon: Building2,
    color: "text-slate-700 dark:text-slate-300",
    bgIcon: "bg-slate-100 dark:bg-slate-800",
    borderClass: "border-border/60 hover:border-slate-400",
    gradientClass: "",
    badge: "3 MODELOS",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-300",
    features: [
      "Hasta 3 modelos en catálogo público",
      "5 fotografías por modelo",
      "Ficha oficial de constructora",
      "Presencia en búsquedas por región",
      "Botón de contacto para cotizar",
    ],
    cta: "Elegir Plan Basic",
    ctaHref: "/checkout?plan=basic",
    ctaClass:
      "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900",
    highlight: false,
  },
  {
    id: "crece",
    nombre: "Plan Crece",
    subtitulo: "10 Modelos + Leads",
    precioMensual: "2.0",
    precioAnualEquiv: "1.6",
    precioAnualTotal: "19.2",
    icon: Rocket,
    color: "text-blue-600",
    bgIcon: "bg-blue-50 dark:bg-blue-950/40",
    borderClass:
      "border-blue-200 dark:border-blue-800 shadow-md shadow-blue-500/5 hover:border-blue-400",
    gradientClass: "from-blue-500/5 to-transparent",
    badge: "10 MODELOS + LEADS",
    badgeClass: "bg-blue-600 text-white border-blue-500",
    features: [
      "Hasta 10 modelos en catálogo público",
      "10 fotos por modelo",
      "Recepción directa de leads (WhatsApp/Email)",
      "Panel CRM de cotizaciones y prospectos",
      "Galería de proyectos terminados",
    ],
    cta: "Elegir Plan Crece",
    ctaHref: "/checkout?plan=crece",
    ctaClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20",
    highlight: false,
  },
  {
    id: "pro",
    nombre: "Plan Pro",
    subtitulo: "Posicionamiento + Ilimitados",
    precioMensual: "3.0",
    precioAnualEquiv: "2.4",
    precioAnualTotal: "28.8",
    icon: Zap,
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass:
      "border-brand-teal/50 shadow-2xl shadow-brand-teal/15 ring-2 ring-brand-teal/30",
    gradientClass: "from-brand-teal/10 via-brand-teal/5 to-transparent",
    badge: "MÁS POPULAR",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    features: [
      "Modelos y fotos ilimitadas",
      "Posicionamiento destacado en catálogo",
      "Leads prioritarios sin límite",
      "Sello de Constructora Verificada ✓",
      "Módulo de Seguimiento de Obras",
    ],
    cta: "Elegir Plan Pro",
    ctaHref: "/checkout?plan=pro",
    ctaClass:
      "bg-brand-teal hover:bg-brand-teal/90 text-white shadow-lg shadow-brand-teal/25 font-black",
    highlight: true,
  },
  {
    id: "premium",
    nombre: "Plan Pro+",
    subtitulo: "Posición Preferente + Campañas",
    precioMensual: "4.0",
    precioAnualEquiv: "3.2",
    precioAnualTotal: "38.4",
    icon: Crown,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass:
      "border-amber-500/50 shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/20",
    gradientClass: "from-amber-500/10 via-brand-indigo/5 to-transparent",
    badge: "MÁXIMA PRIORIDAD",
    badgeClass: "bg-amber-500 text-slate-950 font-black border-amber-400",
    features: [
      "Todo lo incluido en el Plan Pro",
      "Posición preferente #1 en tu región",
      "Campañas activas en redes y blog",
      "Asesoría comercial personalizada",
      "Ejecutivo de cuenta dedicado vía WhatsApp",
    ],
    cta: "Elegir Plan Pro+",
    ctaHref: "/checkout?plan=premium",
    ctaClass:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black shadow-xl shadow-amber-500/25",
    highlight: false,
  },
];

export function StarterPlanesClient() {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePurchase = (planId: string) => {
    const billing = isYearly ? "yearly" : "monthly";
    const plan = UPGRADE_PLANS.find((p) => p.id === planId);
    const priceUf = isYearly
      ? Number(plan?.precioAnualTotal || 0)
      : Number(plan?.precioMensual || 0);

    trackPlanCheckoutClick({ plan: planId, billing, priceUf });

    startTransition(() => {
      router.push(`/checkout?plan=${planId}&billing=${billing}`);
    });
  };

  return (
    <div className="space-y-8">
      {/* Selector Mensual / Anual */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 bg-muted/40 p-1.5 rounded-[2rem] border border-border/40 backdrop-blur-md shadow-inner">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
              !isYearly
                ? "bg-card text-foreground shadow-lg border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mensual
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all relative",
              isYearly
                ? "bg-card text-foreground shadow-lg border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Anual
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-md">
              20% OFF
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-primary/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {isYearly
            ? "Ahorras hasta 9.6 UF al año con facturación anual"
            : "Facturación mensual sin compromiso de permanencia"}
        </div>
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {UPGRADE_PLANS.map((plan) => {
          const Icon = plan.icon;
          const currentPrice = isYearly
            ? plan.precioAnualEquiv
            : plan.precioMensual;
          const periodText = isYearly ? "UF / mes equiv." : "UF / mes";

          return (
            <div
              key={plan.id}
              className={cn(
                "relative bg-card/70 backdrop-blur-xl border rounded-[2.5rem] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
                plan.borderClass
              )}
            >
              {plan.gradientClass && (
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br pointer-events-none",
                    plan.gradientClass
                  )}
                />
              )}

              {plan.badge && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 z-20">
                  <Badge
                    className={cn(
                      "rounded-none rounded-b-xl font-black text-[10px] tracking-widest px-4 py-1 border-x border-b shadow-sm",
                      plan.badgeClass
                    )}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="p-7 pt-11 flex flex-col gap-6 relative z-10 flex-1">
                {/* Header */}
                <div className="space-y-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                      plan.bgIcon
                    )}
                  >
                    <Icon className={cn("w-6 h-6", plan.color)} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black tracking-tight text-foreground">
                      {plan.nombre}
                    </h2>
                    <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider mt-0.5">
                      {plan.subtitulo}
                    </p>

                    <div className="flex flex-col gap-1 mt-4">
                      <div className="flex items-baseline gap-2">
                        {isYearly && (
                          <span className="text-base font-bold text-muted-foreground/40 line-through tracking-tighter">
                            {plan.precioMensual}
                          </span>
                        )}
                        <span className="text-4xl font-black tracking-tighter text-foreground">
                          {currentPrice}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                            {periodText}
                          </span>
                          {isYearly && (
                            <span className="text-[9px] font-black text-brand-teal uppercase tracking-tighter">
                              Facturado {plan.precioAnualTotal} UF anual
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 pt-2">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-xs font-medium leading-tight"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-4 border-t border-border/40">
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={isPending}
                    className={cn(
                      "w-full rounded-2xl h-12 text-xs font-black uppercase tracking-widest gap-2 transition-all hover:scale-[1.02] active:scale-95",
                      plan.ctaClass
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
