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
} from "lucide-react";
import {
  trackPlanCheckoutClick,
} from "@/lib/analytics";

type UpgradePlan = {
  id: string;
  nombre: string;
  subtitulo: string;
  precioMensual: string;
  precioAnualEquiv: string;
  precioAnualTotal: string;
  icon: React.ElementType;
  color: string;
  bgIcon: string;
  borderClass: string;
  gradientClass: string;
  badge: string;
  badgeClass: string;
  features: string[];
  cta: string;
  ctaHref: string;
  ctaClass: string;
  highlight: boolean;
};

export function StarterPlanesClient({ plans }: { plans: UpgradePlan[] }) {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePurchase = (planId: string) => {
    const billing = isYearly ? "yearly" : "monthly";
    const plan = plans.find((p) => p.id === planId);
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
        {plans.map((plan) => {
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
