"use client";

import { useState, useEffect, useTransition, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, X, Zap, Crown, Building2, ArrowRight,
  ChevronDown, Timer, Sparkles, Loader2, ShieldCheck, Users, Lock, Star, Rocket
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
    id: "basic",
    nombre: "Plan Basic",
    subtitulo: "Presencia en Catálogo",
    duracion: "Mensual o Anual",
    precioMensual: "1.0",
    precioAnualEquiv: "0.8",
    precioAnualTotal: "9.6",
    precioOriginal: "1.0",
    descuento: "20% OFF ANUAL",
    icon: Building2,
    color: "text-slate-700 dark:text-slate-300",
    bgIcon: "bg-slate-100 dark:bg-slate-800",
    borderClass: "border-border/60 hover:border-slate-400",
    gradientClass: "",
    badge: "3 MODELOS",
    badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700",
    resultado: "Publica tus primeros 3 modelos y posiciona tu marca en las búsquedas de tu región.",
    features: [
      { texto: "Hasta 3 modelos en catálogo público", ok: true },
      { texto: "5 fotografías por modelo", ok: true },
      { texto: "Ficha oficial de constructora", ok: true },
      { texto: "Presencia en búsquedas por región", ok: true },
      { texto: "Botón de contacto para cotizar", ok: true },
      { texto: "Recepción de leads directos", ok: false },
      { texto: "Posicionamiento destacado", ok: false },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Basic",
    ctaHref: "/checkout?plan=basic",
    ctaClass: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-md",
    ctaVariant: "default" as const,
  },
  {
    id: "crece",
    nombre: "Plan Crece",
    subtitulo: "10 Modelos + Leads",
    duracion: "Mensual o Anual",
    precioMensual: "2.0",
    precioAnualEquiv: "1.6",
    precioAnualTotal: "19.2",
    precioOriginal: "2.0",
    descuento: "20% OFF ANUAL",
    icon: Rocket,
    color: "text-blue-600",
    bgIcon: "bg-blue-50 dark:bg-blue-950/40",
    borderClass: "border-blue-200 dark:border-blue-800 hover:border-blue-400 shadow-md shadow-blue-500/5",
    gradientClass: "from-blue-500/5 to-transparent",
    badge: "10 MODELOS + LEADS",
    badgeClass: "bg-blue-600 text-white border-blue-500",
    resultado: "Hasta 10 modelos y recepción directa de clientes potenciales en tu correo y WhatsApp.",
    features: [
      { texto: "Hasta 10 modelos en catálogo público", ok: true },
      { texto: "10 fotos por modelo", ok: true },
      { texto: "Recepción directa de leads (WhatsApp/Email)", ok: true },
      { texto: "Panel CRM de cotizaciones y prospectos", ok: true },
      { texto: "Métricas de visitas y consultas", ok: true },
      { texto: "Galería de proyectos terminados", ok: true },
      { texto: "Posición preferente #1", ok: false },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Crece",
    ctaHref: "/checkout?plan=crece",
    ctaClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20",
    ctaVariant: "default" as const,
  },
  {
    id: "pro",
    nombre: "Plan Pro",
    subtitulo: "Posicionamiento + Modelos Ilimitados",
    duracion: "Mensual o Anual",
    precioMensual: "3.0",
    precioAnualEquiv: "2.4",
    precioAnualTotal: "28.8",
    precioOriginal: "3.0",
    descuento: "20% OFF ANUAL",
    icon: Zap,
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/50 shadow-2xl shadow-brand-teal/15 ring-2 ring-brand-teal/30",
    gradientClass: "from-brand-teal/10 via-brand-teal/5 to-transparent",
    badge: "MÁS POPULAR",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    resultado: "Modelos ilimitados, posicionamiento destacado en catálogo y flujo continuo de prospectos calificados.",
    features: [
      { texto: "Modelos y fotos ilimitadas", ok: true },
      { texto: "Posicionamiento destacado en catálogo", ok: true },
      { texto: "Prioridad alta en tu región", ok: true },
      { texto: "Leads prioritarios sin límite", ok: true },
      { texto: "Sello de Constructora Verificada ✓", ok: true },
      { texto: "Módulo de Seguimiento de Obras", ok: true },
      { texto: "Soporte prioritario vía WhatsApp", ok: true },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Pro",
    ctaHref: "/checkout?plan=pro",
    ctaClass: "bg-brand-teal hover:bg-brand-teal/90 text-white shadow-lg shadow-brand-teal/25 font-black",
    ctaVariant: "default" as const,
  },
  {
    id: "premium",
    nombre: "Plan Pro+",
    subtitulo: "Posición Preferente + Campañas",
    duracion: "Mensual o Anual",
    precioMensual: "4.0",
    precioAnualEquiv: "3.2",
    precioAnualTotal: "38.4",
    precioOriginal: "4.0",
    descuento: "20% OFF ANUAL",
    icon: Crown,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/50 shadow-2xl shadow-amber-500/15 ring-2 ring-amber-500/20",
    gradientClass: "from-amber-500/10 via-brand-indigo/5 to-transparent",
    badge: "MÁXIMA PRIORIDAD",
    badgeClass: "bg-amber-500 text-slate-950 font-black border-amber-400",
    resultado: "Todo incluido: posición preferente #1 en tu región, campañas en redes y mención en artículos.",
    features: [
      { texto: "Todo lo incluido en el Plan Pro", ok: true },
      { texto: "Posición preferente #1 en tu región", ok: true },
      { texto: "Campañas activas en redes sociales y blog", ok: true },
      { texto: "Recomendación prioritaria a cotizantes", ok: true },
      { texto: "Co-marketing y menciones de marca", ok: true },
      { texto: "Asesoría comercial personalizada", ok: true },
      { texto: "Ejecutivo de cuenta dedicado 24/7", ok: true },
      { texto: "Acceso exclusivo constru.solocasaschile.com", ok: true },
    ],
    cta: "Elegir Plan Pro+",
    ctaHref: "/checkout?plan=premium",
    ctaClass: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black shadow-xl shadow-amber-500/25",
    ctaVariant: "default" as const,
  },
];

const FAQS = [
  {
    q: "¿Por qué decimos que la empresa no paga por aparecer sino por clientes potenciales?",
    a: "Porque estar en un directorio estático sin consultas no genera ventas. En SoloCasasChile estructuramos la plataforma para derivar cotizaciones directas y calificadas a tu constructora. Con un solo contrato cerrado gracias a los prospectos de la plataforma, el retorno de tu suscripción queda cubierto por años.",
  },
  {
    q: "¿Cómo se reciben los leads y cotizaciones?",
    a: "En los planes Crece, Pro y Pro+, las consultas que los compradores realizan a través de tu ficha y modelos llegan directamente a tu correo y WhatsApp en tiempo real, sin intermediarios ni comisiones sobre tus ventas.",
  },
  {
    q: "¿Cómo funciona el descuento anual del 20%?",
    a: "Al elegir pago anual obtienes automáticamente 20% de descuento en la tarifa mensual de cualquier plan. Pagas el año completo por adelantado y congelas tu tarifa por 12 meses.",
  },
  {
    q: "¿En qué moneda se cobra y cómo se factura?",
    a: "Los planes se expresan en Unidades de Fomento (UF) para transparencia y se facturan en pesos chilenos según el valor oficial diario de la UF al momento del pago mediante Flow (Webpay, tarjetas bancarias de débito/crédito y transferencia). Emitimos factura electrónica a nombre de tu empresa.",
  },
  {
    q: "¿Hay contrato de permanencia forzosa?",
    a: "En la modalidad mensual puedes suspender o cambiar tu suscripción en cualquier momento desde tu panel de constructora. La modalidad anual te asegura tarifa preferencial y prioridad durante los 12 meses contratados.",
  },
  {
    q: "¿Puedo probar la plataforma antes de pagar?",
    a: "¡Sí! Puedes crear tu cuenta y acceder a un período de prueba de 30 días sin tarjeta de crédito para configurar tu perfil, subir tus primeros modelos y evaluar el funcionamiento del panel.",
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
    const selectedPlan = PLANES.find((p) => p.id === planId);
    const priceUf = billing === "yearly"
      ? Number(selectedPlan?.precioAnualTotal || 0)
      : Number(selectedPlan?.precioMensual || 0);

    trackPlanCheckoutClick({
      plan: planId,
      billing,
      priceUf,
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
          <p className="text-sm font-black uppercase tracking-widest text-brand-indigo animate-pulse">
            Preparando checkout seguro...
          </p>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-44 pb-12 text-center overflow-hidden border-b border-border/40">
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
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    ¡Casi listo para publicar!
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight">
                    Solo falta completar tu pago para activar tu plan y empezar a recibir leads.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 border-none shadow-xl"
              >
                Elegir y Pagar Ahora
              </Button>
            </motion.div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-teal/8 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto px-4 md:px-8 relative z-10 space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
            Modelo de Suscripción para Constructoras
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight">
            No pagas por aparecer. <br />
            <span className="gradient-text">Pagas por acceder a clientes potenciales.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            Planes diseñados para constructoras y fabricantes de casas prefabricadas en Chile. Escala tu catálogo y recibe cotizaciones reales directamente en tu WhatsApp y correo.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?plan=gratis"
              onClick={() => trackRegistroStart("gratis")}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-teal hover:underline bg-brand-teal/10 px-4 py-2 rounded-full border border-brand-teal/20"
            >
              <Sparkles className="w-3.5 h-3.5" /> ¿Quieres probar antes? Inicia 30 días sin costo →
            </Link>
            <Link
              href="/para-constructoras"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Conoce el recorrido del panel para constructoras →
            </Link>
          </div>

          <div className="pt-4 flex flex-col items-center gap-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent max-w-2xl" />

            <div className="flex flex-col items-center gap-6">
              {/* Selector Mensual / Anual */}
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

              <div className="flex flex-col md:flex-row items-center gap-3 bg-primary/5 text-primary px-8 py-3.5 rounded-3xl border border-primary/15 font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> 
                  {isYearly ? "Ahorras hasta 9.6 UF al año con facturación anual" : "Facturación mensual sin compromiso de permanencia"}
                </div>
                {isYearly && (
                  <div className="flex items-center gap-2 border-l border-primary/20 pl-4 ml-1">
                    <Timer className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-[10px] text-muted-foreground">Promoción activa:</span>
                    <PromotionCountdown variant="compact" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing grid (4 Planes) ────────────────────────── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {PLANES.map((plan) => {
            const Icon = plan.icon;
            const currentPrice = isYearly ? plan.precioAnualEquiv : plan.precioMensual;
            const originalPrice = plan.precioOriginal;
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
                  <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", plan.gradientClass)} />
                )}

                {plan.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 z-20">
                    <Badge className={cn("rounded-none rounded-b-xl font-black text-[10px] tracking-widest px-4 py-1 border-x border-b shadow-sm", plan.badgeClass)}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="p-7 pt-11 flex flex-col gap-6 relative z-10 flex-1">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", plan.bgIcon)}>
                      <Icon className={cn("w-6 h-6", plan.color)} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-black tracking-tight text-foreground">{plan.nombre}</h2>
                      <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider mt-0.5">{plan.subtitulo}</p>
                      
                      <div className="flex flex-col gap-1 mt-4">
                        <div className="flex items-baseline gap-2">
                          {isYearly && originalPrice && (
                            <span className="text-base font-bold text-muted-foreground/40 line-through tracking-tighter">
                              {originalPrice}
                            </span>
                          )}
                          <span className="text-4xl font-black tracking-tighter text-foreground">{currentPrice}</span>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">{periodText}</span>
                            {isYearly && (
                              <span className="text-[9px] font-black text-brand-teal uppercase tracking-tighter">
                                Facturado {plan.precioAnualTotal} UF anual
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-muted-foreground mt-3 leading-relaxed border-t border-border/30 pt-3">
                        {plan.resultado}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 pt-2">
                    {plan.features.map((feat) => (
                      <li
                        key={feat.texto}
                        className={cn("flex items-start gap-2.5 text-xs font-medium leading-tight", !feat.ok && "opacity-35 line-through")}
                      >
                        {feat.ok ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span>{feat.texto}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="pt-4 border-t border-border/40">
                    <Button
                      onClick={() => handlePurchase(plan.id, isYearly ? "yearly" : "monthly")}
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

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground font-medium mt-12 opacity-85">
          Sin permanencia en planes mensuales · Precios en UF facturados en pesos según valor oficial del día · Factura electrónica inmediata vía Flow.
        </p>
      </section>

      {/* ── 3 Fuentes de Ingreso / Ventajas Comerciales ─────── */}
      <section className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-5xl mx-auto px-4 md:px-8 text-center space-y-8">
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-border">
            Por Qué Constructoras Eligen SoloCasasChile
          </Badge>
          <h3 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Diseñado para generar ROI desde el primer mes
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Acceso a Compradores Calificados</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Quien busca en SoloCasasChile ya tiene terreno o presupuesto para construir. Recibes cotizaciones con intención de compra real.
              </p>
            </div>

            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Sin Comisiones por Venta</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                El 100% del valor de la obra es tuyo. No cobramos porcentaje de corretaje ni intermediación sobre los contratos que cierres.
              </p>
            </div>

            <div className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-foreground">Sello de Confianza y Verificación</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Destaca por sobre constructoras informales con nuestro Score de Confianza que valida antecedentes técnicos y proyectos entregados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 md:px-8 py-20 space-y-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">Preguntas frecuentes</h2>
          <p className="text-muted-foreground font-medium">Condiciones comerciales claras y transparentes para constructoras.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-card/60 border border-border/40 rounded-2xl px-6 py-5 cursor-pointer open:border-primary/30 transition-all"
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
          ¿Tienes dudas o requieres una propuesta institucional para tu constructora?{" "}
          <a href="mailto:contacto@solocasaschile.com" className="text-primary font-bold hover:underline underline-offset-4">
            contacto@solocasaschile.com
          </a>
        </p>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="container max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-slate-900 border border-border/40 rounded-[3rem] p-12 md:p-16 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <Badge className="bg-white/15 text-white border-white/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
              Empieza Hoy
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Haz visible tu catálogo y accede a clientes potenciales en tu región
            </h2>
            <p className="text-white/80 font-medium text-sm md:text-base max-w-lg mx-auto">
              Elige el Plan Pro para máxima conversión con modelos ilimitados o prueba gratis por 30 días sin tarjeta de crédito.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                disabled={isPending}
                onClick={() => handlePurchase('pro', 'yearly')}
                className={cn(
                  "bg-white text-slate-900 hover:bg-white/95 font-black uppercase tracking-widest rounded-2xl h-14 px-8 gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                )}
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Iniciar con Plan Pro (20% OFF) <ArrowRight className="w-4 h-4" /></>
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
                Probar 30 días gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
