"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, X, Zap, Crown, Building2, ArrowRight,
  Star, ChevronDown, Timer, Sparkles, Loader2, Info
} from "lucide-react";
import { PromotionCountdown } from "@/components/ui/promotion-countdown";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLANES = [
  {
    id: "premium",
    nombre: "Premium",
    precioMensual: "2.9",
    precioAnualEquiv: "1.45",
    precioAnualTotal: "17.4",
    precioOriginal: "2.9",
    descuento: "50% OFF ANUAL",
    icon: Crown,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/50 shadow-2xl shadow-amber-500/10 scale-105",
    gradientClass: "from-amber-500/10 via-brand-indigo/5 to-transparent",
    badge: "OFERTA LANZAMIENTO",
    badgeClass: "bg-red-500 text-white border-red-600 animate-pulse",
    features: [
      { texto: "Acceso a constru.solocasaschile.com", ok: true },
      { texto: "Sistema de Seguimiento de Obras", ok: true },
      { texto: "Modelos ilimitados (Escalabilidad total)", ok: true },
      { texto: "20 fotos por modelo + video tour", ok: true },
      { texto: "Perfil premium con video corporativo", ok: true },
      { texto: "CRM + analíticas completas de mercado", ok: true },
      { texto: "Testimonios ilimitados (Social Proof)", ok: true },
      { texto: "Certificaciones ilimitadas", ok: true },
      { texto: "Galería ilimitada de proyectos", ok: true },
      { texto: "Badge Premium 💎 posicionamiento VIP", ok: true },
    ],
    cta: "Dominar el Mercado",
    ctaHref: "/register?plan=premium",
    ctaClass: "bg-brand-indigo text-white hover:opacity-90 shadow-lg shadow-primary/20",
    ctaVariant: "default" as const,
  },
  {
    id: "pro",
    nombre: "Pro",
    precioMensual: "1.9",
    precioAnualEquiv: "0.95",
    precioAnualTotal: "11.4",
    precioOriginal: "1.9",
    descuento: "50% OFF ANUAL",
    icon: Zap,
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/40 shadow-2xl shadow-brand-teal/10",
    gradientClass: "from-brand-teal/5 to-transparent",
    badge: "SÚPER PROMO",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    features: [
      { texto: "15 modelos publicados", ok: true },
      { texto: "10 fotos por modelo", ok: true },
      { texto: "Perfil completo de constructora", ok: true },
      { texto: "CRM de leads avanzado", ok: true },
      { texto: "Hasta 5 testimonios verificados", ok: true },
      { texto: "5 certificaciones de calidad", ok: true },
      { texto: "10 proyectos en galería", ok: true },
      { texto: "Badge Constructora Verificada ✓", ok: true },
      { texto: "Sistema de Seguimiento de Obras", ok: false },
      { texto: "Soporte por email prioritario", ok: true },
    ],
    cta: "Empezar a Escalar",
    ctaHref: "/register?plan=pro",
    ctaClass: "bg-brand-teal hover:bg-brand-teal/90 text-white",
    ctaVariant: "default" as const,
  },
  {
    id: "gratis",
    nombre: "Gratis",
    precioMensual: "0",
    precioAnualEquiv: "0",
    periodo: "por 4 meses",
    icon: Building2,
    color: "text-muted-foreground",
    bgIcon: "bg-muted/60",
    borderClass: "border-border/60",
    gradientClass: "",
    features: [
      { texto: "3 modelos publicados", ok: true },
      { texto: "3 fotos por modelo", ok: true },
      { texto: "Perfil básico de constructora", ok: true },
      { texto: "Recepción de leads / cotizaciones", ok: true },
      { texto: "Testimonios y certificaciones", ok: false },
      { texto: "Galería de proyectos terminados", ok: false },
      { texto: "Badge Constructora Verificada ✓", ok: false },
      { texto: "Posición prioritaria en catálogo", ok: false },
      { texto: "Estadísticas y analíticas", ok: false },
      { texto: "Soporte dedicado", ok: false },
    ],
    cta: "Probar Plataforma",
    ctaHref: "/register",
    ctaClass: "border-border text-foreground hover:bg-muted font-medium opacity-80",
    ctaVariant: "outline" as const,
  },
];

const FAQS = [
  {
    q: "¿Por qué el plan Gratis dura 4 meses?",
    a: "Queremos que pruebes la potencia de la plataforma sin riesgos. 4 meses es tiempo suficiente para recibir tus primeros leads y cerrar ventas antes de decidir escalar a un plan Pro.",
  },
  {
    q: "¿Cómo funciona el descuento anual?",
    a: "Al elegir el pago anual, obtienes un 50% de descuento directo sobre el valor mensual. Es nuestra forma de premiar a las constructoras que se comprometen con su crecimiento a largo plazo.",
  },
  {
    q: "¿En qué moneda se cobra?",
    a: "Los planes Pro y Premium se cobran en UF (Unidad de Fomento chilena). El valor exacto en pesos se calcula al momento de la facturación según el valor diario de la UF.",
  },
  {
    q: "¿Qué pasa con mis leads si termina mi periodo gratis?",
    a: "Tus leads son tuyos. Siempre tendrás acceso al historial de prospectos, incluso si decides no renovar o bajar de plan.",
  },
  {
    q: "¿Hay contrato de permanencia?",
    a: "El plan mensual no tiene permanencia. El plan anual se paga por adelantado y te garantiza el precio promocional durante los 12 meses de servicio.",
  },
];

export default function PlanesPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [ufValue, setUfValue] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // En staging el window.location no siempre está disponible en SSR
  const [isStatusPending, setIsStatusPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'pending') {
      setIsStatusPending(true);
    }
  }, []);

  // Fetch current UF for price estimation
  useEffect(() => {
    fetch('/api/market/uf')
      .then(res => res.json())
      .then(data => setUfValue(data.uf))
      .catch(() => console.warn("No se pudo cargar el valor de la UF para el resumen."));
  }, []);

  const formatPriceCLP = (uf: string) => {
    if (!ufValue) return null;
    const clp = Math.round(parseFloat(uf) * ufValue);
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(clp);
  };

  const handlePurchase = async (planId: string, billing: 'monthly' | 'yearly') => {
    if (planId === 'gratis') {
      router.push(`/register?plan=${planId}`);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push(`/register?plan=${planId}&billing=${billing}`);
          return;
        }

        const response = await fetch('/api/payments/flow/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: planId, billing })
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error(data.error || "Error al iniciar el pago.");
        }
      } catch {
        toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center flex-col gap-4">
           <div className="w-16 h-16 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
           <p className="text-sm font-black uppercase tracking-widest text-brand-indigo animate-pulse">Iniciando pago seguro con Flow...</p>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-44 pb-10 text-center overflow-hidden border-b border-border/40">
        {/* Pending Status Alert */}
        {isStatusPending && (
          <div className="container max-w-4xl mx-auto px-4 mb-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-indigo/10 border border-brand-indigo/30 p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-brand-indigo/5"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-brand-indigo flex items-center justify-center shadow-lg shadow-brand-indigo/20">
                  <Zap className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter">¡Casi listo para publicar!</h3>
                  <p className="text-sm text-slate-500 font-medium leading-tight">Solo falta completar tu pago para activar tu plan y empezar a recibir leads.</p>
                </div>
              </div>
              <Button 
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 border-none shadow-xl shadow-slate-200"
              >
                Elegir y Pagar Ahora
              </Button>
            </motion.div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-teal/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 md:px-8 relative z-10 space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-sm px-4 py-1.5">
            Para Constructoras de Chile
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
            Elige el plan <span className="gradient-text">correcto</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Mejora el posicionamiento de tu constructora y recibe leads reales directamente en tu panel de control.
          </p>

          <div className="pt-4 flex flex-col items-center gap-12">
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent max-w-2xl" />

            {/* Toggle Billing and Discount Badge closer to the plans */}
            <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-[2rem] border border-border/40 backdrop-blur-md shadow-inner">
                <button 
                  onClick={() => setIsYearly(false)}
                  className={cn(
                    "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    !isYearly ? "bg-white text-brand-indigo shadow-xl" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mensual
                </button>
                <button 
                  onClick={() => setIsYearly(true)}
                  className={cn(
                    "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all relative",
                    isYearly ? "bg-white text-brand-indigo shadow-xl" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Anual
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-black animate-pulse shadow-lg shadow-red-500/20">
                    -50%
                  </span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3 bg-brand-indigo/5 text-brand-indigo px-8 py-4 rounded-3xl border border-brand-indigo/10 font-bold text-sm uppercase tracking-widest shadow-sm">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" /> 
                  {isYearly ? "Estás ahorrando un 50% con el pago anual" : "Ahorra un 50% cambiando al pago anual"}
                </div>
                {isYearly && (
                  <div className="flex items-center gap-2 border-l border-brand-indigo/20 pl-4 ml-1">
                    <Timer className="w-4 h-4 text-brand-indigo/60" />
                    <span className="text-[10px] text-muted-foreground">Termina en:</span>
                    <PromotionCountdown variant="compact" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing grid ──────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANES.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = isYearly && plan.id !== 'gratis' ? plan.precioAnualEquiv : plan.precioMensual;
            const originalPrice = plan.id !== 'gratis' ? plan.precioMensual : null;
            const periodText = plan.id === 'gratis' ? (plan.periodo || 'por 4 meses') : (isYearly ? "UF / mes equiv." : "UF / mes");

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-card/60 backdrop-blur-xl border rounded-[3rem] overflow-hidden flex flex-col gap-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
                  plan.borderClass
                )}
              >
                {/* Subtle gradient background */}
                {plan.gradientClass && (
                  <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", plan.gradientClass)} />
                )}

                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <Badge className={cn("rounded-none rounded-b-xl font-black text-sm uppercase tracking-widest px-5 py-1.5 border-x border-b", plan.badgeClass)}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="p-10 pt-12 flex flex-col gap-8 relative z-10 flex-1">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", plan.bgIcon)}>
                      <Icon className={cn("w-6 h-6", plan.color)} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-black tracking-tight">{plan.nombre}</h2>
                      <div className="flex flex-col gap-1 mt-2">
                         <div className="flex items-baseline gap-2">
                           {isYearly && originalPrice && (
                             <span className="text-lg font-bold text-muted-foreground/40 line-through tracking-tighter">
                               {originalPrice}
                             </span>
                           )}
                           <span className="text-4xl font-black tracking-tighter">{currentPrice}</span>
                           <div className="flex flex-col">
                              <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{periodText}</span>
                              {isYearly && plan.id !== 'gratis' && (
                                <span className="text-[9px] font-black text-brand-indigo uppercase tracking-tighter">Facturado anual</span>
                              )}
                           </div>
                           {isYearly && plan.id !== 'gratis' && (
                             <Badge className="bg-red-500 text-white border-none ml-2 text-[8px] px-2 py-0.5">
                               50% OFF
                             </Badge>
                           )}
                         </div>
                         
                         {/* Equivalent in CLP */}
                         {plan.id !== 'gratis' && ufValue && (
                           <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-700">
                             <TooltipProvider>
                               <Tooltip>
                                 <TooltipTrigger className="flex items-center gap-1">
                                   ~ {formatPriceCLP(currentPrice)} <Info className="w-3 h-3 opacity-50" />
                                 </TooltipTrigger>
                                 <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-3 text-[10px] font-bold">
                                   Precio estimado basado en UF actual: ${ufValue.toLocaleString('es-CL')}
                                 </TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feat) => (
                      <li
                        key={feat.texto}
                        className={cn("flex items-center gap-3 text-sm font-medium", !feat.ok && "opacity-35")}
                      >
                        {feat.ok
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          : <X className="w-4 h-4 text-muted-foreground shrink-0" />
                        }
                        {feat.texto}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.id === 'gratis' ? (
                    <Link
                      href={`${plan.ctaHref}`}
                      className={cn(
                        buttonVariants({ variant: plan.ctaVariant, size: "lg" }),
                        "w-full rounded-2xl h-14 font-bold uppercase tracking-widest gap-2 opacity-80",
                        plan.ctaClass
                      )}
                    >
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(plan.id, isYearly ? 'yearly' : 'monthly')}
                      disabled={isPending}
                      className={cn(
                        "w-full rounded-2xl h-14 font-extrabold uppercase tracking-widest gap-2 transition-all hover:scale-[1.02] active:scale-95",
                        plan.ctaClass
                      )}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {isYearly ? "Pagar con 50% DCTO" : "Pagar Plan Ahora"} <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground font-medium mt-12 opacity-60">
          Sin permanencia en planes mensuales · Los precios en UF se actualizan diariamente · Plan Gratis limitado a 4 meses por constructora.
        </p>
      </section>

      {/* ── Social proof ──────────────────────────────────── */}
      <section className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-5xl mx-auto px-4 md:px-8 text-center space-y-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Lo que dicen nuestras constructoras</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Contratamos el plan anual pro con el 50% y la inversión se pagó sola en las primeras semanas.", name: "Carlos Mena", company: "Casas Mena SPA", plan: "Pro Anual" },
              { quote: "Como super-admin, valoro que el badge verificado sea gratis si te comprometes con el año.", name: "Andrea Flores", company: "Constructora Biobío", plan: "Premium Anual" },
              { quote: "Los 4 meses gratis nos permitieron probar la herramienta y recibir leads reales sin costo.", name: "Felipe Torres", company: "SIP Chile", plan: "Periodo Prueba" },
            ].map((t) => (
              <div key={t.name} className="bg-card/60 border border-border/40 rounded-[2rem] p-8 text-left space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">&quot;{t.quote}&quot;</p>
                <div>
                  <p className="font-black text-sm text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{t.company} · {t.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 md:px-8 py-24 space-y-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-4xl font-heading font-black tracking-tighter">Preguntas frecuentes</h2>
          <p className="text-muted-foreground font-medium">Todo lo que necesitas saber sobre los nuevos planes.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-card/60 border border-border/40 rounded-2xl px-6 py-5 cursor-pointer open:border-primary/20 transition-all"
            >
              <summary className="flex items-center justify-between font-black text-sm list-none gap-4">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="pt-4 text-sm text-muted-foreground font-medium leading-relaxed border-t border-border/40 mt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground font-medium pt-8">
          ¿Más dudas? Escríbenos a{" "}
          <a href="mailto:contacto@solocasaschile.com" className="text-primary font-bold hover:underline underline-offset-4">
            contacto@solocasaschile.com
          </a>
        </p>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="container max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-brand-indigo rounded-[3rem] p-16 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=60&w=800')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="relative z-10 space-y-6">
            <Badge className="bg-white/20 text-white border-white/20 font-black uppercase tracking-widest text-sm px-4 py-1.5">
              Comienza hoy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Aprovecha el 50% DCTO<br />y domina tu zona
            </h2>
            <p className="text-white/80 font-medium text-lg max-w-md mx-auto">
              Únete a las constructoras que ya están recibiendo leads reales cada semana.
            </p>
            <Button
              disabled={isPending}
              onClick={() => handlePurchase('pro', 'yearly')}
              className={cn(
                "bg-white text-brand-indigo hover:bg-white/95 font-black uppercase tracking-widest rounded-2xl h-14 px-10 gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
              )}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Comenzar con 50% DCTO <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
