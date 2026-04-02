import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, X, Zap, Crown, Building2, ArrowRight,
  Star, Users, TrendingUp, Shield, ChevronDown
} from "lucide-react";

export const metadata: Metadata = {
  title: "Planes para Constructoras | SolocasasChile",
  description: "Publica tus modelos de casas prefabricadas en SolocasasChile. Planes Gratis, Pro y Premium con alcance nacional a +50.000 familias chilenas.",
};

const PLANES = [
  {
    id: "premium",
    nombre: "Premium",
    precio: "2.9",
    periodo: "UF / mes",
    icon: Crown,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/30 shadow-2xl shadow-amber-500/10",
    gradientClass: "from-amber-500/5 to-transparent",
    badge: "Top Constructora",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    features: [
      { texto: "Modelos ilimitados (Escalabilidad total)", ok: true },
      { texto: "20 fotos por modelo + video tour", ok: true },
      { texto: "Perfil premium con video corporativo", ok: true },
      { texto: "CRM + analíticas completas de mercado", ok: true },
      { texto: "Testimonios ilimitados (Social Proof)", ok: true },
      { texto: "Certificaciones ilimitadas", ok: true },
      { texto: "Galería ilimitada de proyectos", ok: true },
      { texto: "Badge Premium ⭐ posicionamiento VIP", ok: true },
      { texto: "Posición #1 destacada en catálogo", ok: true },
      { texto: "Soporte dedicado 24/7 por WhatsApp", ok: true },
    ],
    cta: "Dominar el Mercado",
    ctaHref: "/register?plan=premium",
    ctaClass: "bg-brand-indigo text-white hover:opacity-90",
    ctaVariant: "default" as const,
  },
  {
    id: "pro",
    nombre: "Pro",
    precio: "1.9",
    periodo: "UF / mes",
    icon: Zap,
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/40 shadow-2xl shadow-brand-teal/10",
    gradientClass: "from-brand-teal/5 to-transparent",
    badge: "Más Rentable",
    badgeClass: "bg-brand-teal/10 text-brand-teal border-brand-teal/30",
    features: [
      { texto: "15 modelos publicados", ok: true },
      { texto: "10 fotos por modelo", ok: true },
      { texto: "Perfil completo de constructora", ok: true },
      { texto: "CRM de leads avanzado", ok: true },
      { texto: "Hasta 5 testimonios verificados", ok: true },
      { texto: "5 certificaciones de calidad", ok: true },
      { texto: "10 proyectos en galería", ok: true },
      { texto: "Badge Constructora Verificada ✓", ok: true },
      { texto: "Posición prioritaria en catálogo", ok: true },
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
    precio: "0",
    periodo: "para siempre",
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
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí. Puedes subir o bajar de plan en cualquier momento desde tu panel. Los cambios se aplican al inicio del siguiente período de facturación.",
  },
  {
    q: "¿En qué moneda se cobra?",
    a: "Los planes Pro y Premium se cobran en UF (Unidad de Fomento chilena). El valor exacto en pesos se calcula al momento de la facturación según el valor diario de la UF.",
  },
  {
    q: "¿Qué pasa con mis leads si bajo al plan Gratis?",
    a: "Nunca pierdes tus leads. Todo el historial de prospectos permanece accesible siempre, independientemente del plan que tengas activo.",
  },
  {
    q: "¿Cómo funciona el Badge 'Verificada'?",
    a: "La verificación confirma que tu empresa está legalmente constituida en Chile. Nuestro equipo revisa los antecedentes y, si todo es correcto, activa el badge en tu perfil.",
  },
  {
    q: "¿Hay contrato de permanencia?",
    a: "No. Todos los planes son mes a mes, sin contratos de permanencia. Puedes cancelar en cualquier momento y no se te cobrará el siguiente período.",
  },
];

export default function PlanesPage() {
  return (
    <div className="min-h-screen bg-background pb-32">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative py-28 text-center overflow-hidden border-b border-border/40">
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
            Conecta tus modelos de casas prefabricadas con más de{" "}
            <strong className="text-foreground">50.000 familias chilenas</strong>{" "}
            que buscan su hogar ideal cada mes.
          </p>
        </div>
      </section>



      {/* ── Pricing grid ────────────────────────────────────── */}
      <section className="container max-w-6xl mx-auto px-4 md:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANES.map((plan) => {
            const Icon = plan.icon;
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
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black tracking-tighter">{plan.precio}</span>
                        <span className="text-muted-foreground font-bold text-sm">{plan.periodo}</span>
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
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      buttonVariants({ variant: plan.ctaVariant, size: "lg" }),
                      "w-full rounded-2xl h-14 font-bold uppercase tracking-widest gap-2",
                      plan.ctaClass
                    )}
                  >
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground font-medium mt-12 opacity-60">
          Sin permanencia · Cancela cuando quieras · Los precios en UF se actualizan diariamente
        </p>
      </section>

      {/* ── Social proof ──────────────────────────────────── */}
      <section className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-5xl mx-auto px-4 md:px-8 text-center space-y-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Lo que dicen nuestras constructoras</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "En el primer mes recibimos 18 leads cualificados. El ROI fue inmediato.", name: "Carlos Mena", company: "Casas Mena SPA", plan: "Pro" },
              { quote: "El badge verificada nos da credibilidad ante los clientes. Vale cada peso.", name: "Andrea Flores", company: "Constructora Biobío", plan: "Premium" },
              { quote: "Empezamos con el plan gratis y en 2 meses ya teníamos clientes reales.", name: "Felipe Torres", company: "SIP Chile", plan: "Gratis → Pro" },
            ].map((t) => (
              <div key={t.name} className="bg-card/60 border border-border/40 rounded-[2rem] p-8 text-left space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-black text-sm text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{t.company} · Plan {t.plan}</p>
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
          <p className="text-muted-foreground font-medium">Todo lo que necesitas saber antes de comenzar.</p>
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
          <a href="mailto:contacto@solocasaschile.cl" className="text-primary font-bold hover:underline underline-offset-4">
            contacto@solocasaschile.cl
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
              Tu próximo cliente<br />ya está buscando
            </h2>
            <p className="text-white/80 font-medium text-lg max-w-md mx-auto">
              Únete a más de 226 constructoras que ya usan SolocasasChile para hacer crecer su negocio.
            </p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-brand-indigo hover:bg-white/95 font-bold uppercase tracking-widest rounded-2xl h-14 px-10 gap-2"
              )}
            >
              Crear cuenta gratuita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
