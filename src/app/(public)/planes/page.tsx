"use client";

import { useState, useEffect, useTransition, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, X, Zap, Crown, Building2, ArrowRight,
  ChevronDown, Timer, Sparkles, Loader2, ShieldCheck, Users, Lock
} from "lucide-react";
import { PromotionCountdown } from "@/components/ui/promotion-countdown";
import { motion } from "framer-motion";
import {
  trackPlanesView,
  trackPlanCheckoutClick,
  trackRegistroStart,
} from "@/lib/analytics";

const PLANES = [
  {
    id: "gratis",
    nombre: "Gratis",
    duracion: "4 meses de prueba",
    precioMensual: "0",
    precioAnualEquiv: "0",
    periodo: "por 4 meses",
    icon: Building2,
    color: "text-muted-foreground",
    bgIcon: "bg-muted/60",
    borderClass: "border-border/60",
    gradientClass: "",
    badge: "PRUEBA SIN COSTO",
    badgeClass: "bg-muted text-foreground border-border",
    resultado: "Prueba la plataforma y recibe cotizaciones de compradores sin costo.",
    features: [
      { texto: "Hasta 3 modelos en catálogo público", ok: true },
      { texto: "3 fotografías por modelo", ok: true },
      { texto: "Perfil básico de constructora", ok: true },
      { texto: "Recepción de cotizaciones directas al panel", ok: true },
      { texto: "Historial permanente de prospectos", ok: true },
      { texto: "Sin tarjeta de crédito requerida", ok: true },
      { texto: "Sello de Constructora Verificada ✓", ok: false },
      { texto: "Módulo de Seguimiento de Obras", ok: false },
      { texto: "Prioridad en catálogo", ok: false },
    ],
    cta: "Probar 4 meses gratis",
    ctaHref: "/register?plan=gratis",
    ctaClass: "border-border text-foreground hover:bg-muted font-medium",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro",
    nombre: "Pro",
    duracion: "Mensual o Anual",
    precioMensual: "0.6",
    precioAnualEquiv: "0.48",
    precioAnualTotal: "5.76",
    precioOriginal: "0.6",
    descuento: "20% OFF ANUAL",
    icon: Zap,
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/40 shadow-2xl shadow-brand-teal/10 ring-2 ring-brand-teal/20",
    gradientClass: "from-brand-teal/5 to-transparent",
    badge: "MÁS POPULAR",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    resultado: "Máxima presencia comercial, 15 modelos y sello de confianza para convertir más consultas.",
    features: [
      { texto: "Hasta 15 modelos publicados", ok: true },
      { texto: "10 fotos por modelo", ok: true },
      { texto: "Perfil completo de constructora", ok: true },
      { texto: "CRM de prospectos avanzado", ok: true },
      { texto: "Sello de Constructora Verificada ✓", ok: true },
      { texto: "Módulo de Seguimiento de Obras", ok: true },
      { texto: "Galería de proyectos terminados", ok: true },
      { texto: "Prioridad en catálogo", ok: true },
      { texto: "Soporte comercial prioritario vía WhatsApp", ok: true },
    ],
    cta: "Iniciar con Plan Pro",
    ctaHref: "/checkout?plan=pro",
    ctaClass: "bg-brand-teal hover:bg-brand-teal/90 text-white shadow-lg shadow-brand-teal/20",
    ctaVariant: "default" as const,
  },
  {
    id: "premium",
    nombre: "Premium",
    duracion: "Por invitación",
    precioMensual: "Por invitación",
    precioAnualEquiv: "Por invitación",
    precioAnualTotal: "Personalizado",
    precioOriginal: null,
    descuento: "SOPORTE VIP",
    icon: Crown,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/50 shadow-2xl shadow-amber-500/10",
    gradientClass: "from-amber-500/10 via-brand-indigo/5 to-transparent",
    badge: "SOLO POR INVITACIÓN",
    badgeClass: "bg-slate-900 text-white border-slate-800",
    resultado: "Solución institucional para marcas con alto volumen y catálogo amplio.",
    features: [
      { texto: "Modelos y fotos ilimitadas", ok: true },
      { texto: "Video tour y recorrido 3D integrado", ok: true },
      { texto: "Perfil premium con video corporativo", ok: true },
      { texto: "Acceso exclusivo a constru.solocasaschile.com", ok: true },
      { texto: "Módulo avanzado de Seguimiento de Obras", ok: true },
      { texto: "CRM + analíticas de mercado", ok: true },
      { texto: "Badge Premium 💎 posicionamiento VIP", ok: true },
      { texto: "Ejecutivo de cuenta dedicado", ok: true },
    ],
    cta: "Solicitar evaluación",
    ctaHref: "https://wa.me/56964130601?text=Hola%20SolocasasChile%2C%20quiero%20consultar%20por%20la%20habilitaci%C3%B3n%20del%20Plan%20Premium%20para%20mi%20constructora.",
    ctaClass: "bg-slate-900 text-white hover:opacity-90 shadow-lg shadow-primary/20",
    ctaVariant: "default" as const,
  },
];

const FAQS = [
  {
    q: "¿Por qué el plan Gratis dura 4 meses?",
    a: "Queremos que pruebes el funcionamiento de la plataforma con tiempo suficiente. 4 meses permite publicar tus modelos, recibir consultas de compradores en tu región y evaluar el retorno comercial sin ningún riesgo ni costo.",
  },
  {
    q: "¿Qué ocurre con mis prospectos si no continúo tras los 4 meses?",
    a: "Tus prospectos son 100% de tu empresa. Siempre tendrás acceso al historial de cotizaciones recibidas en tu panel, incluso si decides no renovar o continuar en modalidad inactiva.",
  },
  {
    q: "¿Cómo funciona el descuento anual?",
    a: "Al elegir el pago anual en el Plan Pro, obtienes un 20% de descuento directo sobre el valor mensual (pagas 5.76 UF en lugar de 7.2 UF anuales). Se factura en un solo pago por adelantado.",
  },
  {
    q: "¿En qué moneda se cobra?",
    a: "Los planes se expresan en Unidades de Fomento (UF) y se facturan en pesos chilenos según el valor oficial diario de la UF al momento del pago a través de Flow (Webpay, tarjetas o transferencias).",
  },
  {
    q: "¿Hay contrato de permanencia forzosa?",
    a: "No en la modalidad mensual: puedes suspender el cobro en cualquier momento desde tu panel. El plan anual te garantiza el valor promocional durante los 12 meses de servicio.",
  },
];

const subscribeToUrlChanges = (onStoreChange: () => void) => {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
};

const getStatusPendingSnapshot = () =>
  new URLSearchParams(window.location.search).get("status") === "pending";

const getStatusPendingServerSnapshot = () => false;

export default function PlanesPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    trackPlanesView("planes");
  }, []);

  const isStatusPending = useSyncExternalStore(
    subscribeToUrlChanges,
    getStatusPendingSnapshot,
    getStatusPendingServerSnapshot
  );

  const handlePurchase = async (planId: string, billing: "monthly" | "yearly") => {
    if (planId === "gratis") {
      trackRegistroStart("gratis");
      router.push(`/register?plan=${planId}`);
      return;
    }

    trackPlanCheckoutClick({
      plan: planId,
      billing,
      priceUf: billing === "yearly" ? 5.76 : 0.6,
    });

    startTransition(async () => {
      router.push(`/checkout?plan=${planId}&billing=${billing}`);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center flex-col gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest text-brand-indigo animate-pulse">Preparando checkout seguro...</p>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-44 pb-10 text-center overflow-hidden border-b border-border/40">
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
            Planes claros según el <span className="gradient-text">valor real</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Publica tus modelos en el catálogo y recibe cotizaciones directas de compradores en tu región.
          </p>

          <div className="pt-2 flex items-center justify-center">
            <Link
              href="/para-constructoras"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo hover:underline"
            >
              ¿Quieres ver cómo funciona el panel y qué se publica? Conoce el recorrido completo →
            </Link>
          </div>

          <div className="pt-4 flex flex-col items-center gap-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent max-w-2xl" />

            <div className="flex flex-col items-center gap-6">
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
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[8px] px-2 py-1 rounded-full font-black">
                    20% OFF
                  </span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3 bg-brand-indigo/5 text-brand-indigo px-8 py-3.5 rounded-3xl border border-brand-indigo/10 font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> 
                  {isYearly ? "Ahorras 1.44 UF con la suscripción anual (5.76 UF/año)" : "Paga mes a mes sin permanencia"}
                </div>
                {isYearly && (
                  <div className="flex items-center gap-2 border-l border-brand-indigo/20 pl-4 ml-1">
                    <Timer className="w-3.5 h-3.5 text-brand-indigo/60" />
                    <span className="text-[10px] text-muted-foreground">Promoción anual:</span>
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
            const isNumeric = plan.id !== "premium";
            const currentPrice = isNumeric
              ? (isYearly && plan.id !== "gratis" ? plan.precioAnualEquiv : plan.precioMensual)
              : "Por invitación";
            const originalPrice = plan.id === "pro" ? plan.precioMensual : null;
            const periodText = plan.id === "gratis" ? "por 4 meses" : (isYearly ? "UF / mes equiv." : "UF / mes");

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-card/60 backdrop-blur-xl border rounded-[3rem] overflow-hidden flex flex-col gap-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  plan.borderClass
                )}
              >
                {plan.gradientClass && (
                  <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", plan.gradientClass)} />
                )}

                {plan.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <Badge className={cn("rounded-none rounded-b-xl font-black text-xs uppercase tracking-widest px-5 py-1.5 border-x border-b", plan.badgeClass)}>
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
                        {isNumeric ? (
                          <div className="flex items-baseline gap-2">
                            {isYearly && plan.id === "pro" && originalPrice && (
                              <span className="text-lg font-bold text-muted-foreground/40 line-through tracking-tighter">
                                {originalPrice}
                              </span>
                            )}
                            <span className="text-4xl font-black tracking-tighter">{currentPrice}</span>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{periodText}</span>
                              {isYearly && plan.id === "pro" && (
                                <span className="text-[9px] font-black text-brand-indigo uppercase tracking-tighter">Facturado 5.76 UF anual</span>
                              )}
                            </div>
                            {isYearly && plan.id === "pro" && (
                              <Badge className="bg-red-500 text-white border-none ml-2 text-[8px] px-2 py-0.5">
                                20% OFF
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-2xl font-black tracking-tight text-foreground">{currentPrice}</span>
                            <p className="text-xs text-muted-foreground font-medium">Evaluación personalizada según volumen</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground mt-3 leading-relaxed">
                        {plan.resultado}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feat) => (
                      <li
                        key={feat.texto}
                        className={cn("flex items-center gap-3 text-sm font-medium", !feat.ok && "opacity-35 line-through")}
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
                  {plan.id === "gratis" || plan.id === "premium" ? (
                    <Link
                      href={plan.ctaHref}
                      onClick={() => {
                        if (plan.id === "gratis") trackRegistroStart("gratis");
                      }}
                      className={cn(
                        buttonVariants({ variant: plan.ctaVariant, size: "lg" }),
                        "w-full rounded-2xl h-14 font-extrabold uppercase tracking-widest gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200",
                        plan.ctaClass
                      )}
                    >
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(plan.id, isYearly ? "yearly" : "monthly")}
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
                          {plan.cta} <ArrowRight className="w-4 h-4" />
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
        <p className="text-center text-xs text-muted-foreground font-medium mt-12 opacity-80">
          Sin permanencia en planes mensuales · Precios en UF facturados en pesos según valor oficial del día · Prueba gratis de 4 meses sin tarjeta de crédito.
        </p>
      </section>

      {/* ── Operative Guarantees for Builders (Replaces Fake Reviews) ───── */}
      <section className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-5xl mx-auto px-4 md:px-8 text-center space-y-8">
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-border">
            Compromisos Comerciales
          </Badge>
          <h3 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Diseñado para trabajar con total transparencia
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Contacto 100% directo</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Sin comisiones por venta ni intermediación en los presupuestos que acuerdes con tus clientes.
              </p>
            </div>

            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Tus prospectos te pertenecen</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Cada cotización recibida es exclusiva de tu empresa. No se revenden datos a otras constructoras.
              </p>
            </div>

            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Sello de verificación objetivo</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Validamos antecedentes de la constructora para dar certeza y seguridad al comprador antes de cotizar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 md:px-8 py-24 space-y-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-4xl font-heading font-black tracking-tighter">Preguntas frecuentes</h2>
          <p className="text-muted-foreground font-medium">Condiciones comerciales claras para constructoras.</p>
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
          <div className="relative z-10 space-y-6">
            <Badge className="bg-white/20 text-white border-white/20 font-black uppercase tracking-widest text-sm px-4 py-1.5">
              Comienza hoy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Publica tu catálogo y recibe<br />cotizaciones directas
            </h2>
            <p className="text-white/80 font-medium text-base max-w-md mx-auto">
              Empieza con 4 meses de prueba sin costo o activa el Plan Pro para mayor volumen de modelos y presencia activa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                disabled={isPending}
                onClick={() => handlePurchase('pro', 'yearly')}
                className={cn(
                  "bg-white text-brand-indigo hover:bg-white/95 font-black uppercase tracking-widest rounded-2xl h-14 px-8 gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                )}
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Iniciar con Plan Pro Anual <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
              <Link
                href="/register?plan=gratis"
                onClick={() => trackRegistroStart("gratis")}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-widest rounded-2xl h-14 px-8"
                )}
              >
                Probar 4 meses gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
