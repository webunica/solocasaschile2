import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, X, Zap, Crown, Building2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Planes para Constructoras | SolocasasChile",
  description: "Publica tus modelos de casas prefabricadas en SolocasasChile. Planes Gratis, Pro y Premium con alcance nacional.",
};

const PLANES = [
  {
    id: "gratis",
    nombre: "Gratis",
    precio: "0",
    periodo: "siempre",
    icon: Building2,
    color: "text-muted-foreground",
    borderClass: "border-border/60",
    features: [
      { texto: "3 modelos publicados", ok: true },
      { texto: "3 fotos por modelo", ok: true },
      { texto: "Perfil básico", ok: true },
      { texto: "Sistema de leads", ok: true },
      { texto: "Testimonios y certificaciones", ok: false },
      { texto: "Galería de proyectos", ok: false },
      { texto: "Badge Verificada", ok: false },
      { texto: "Posición prioritaria en catálogo", ok: false },
      { texto: "Estadísticas avanzadas", ok: false },
      { texto: "Soporte dedicado", ok: false },
    ],
    cta: "Comenzar Gratis",
    ctaHref: "/register",
    ctaClass: "border-border text-foreground hover:bg-muted",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro",
    nombre: "Pro",
    precio: "2",
    periodo: "UF / mes",
    icon: Zap,
    color: "text-blue-600",
    borderClass: "border-blue-500/30 shadow-2xl shadow-blue-500/10",
    badge: "Más Popular",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    features: [
      { texto: "15 modelos publicados", ok: true },
      { texto: "10 fotos por modelo", ok: true },
      { texto: "Perfil completo", ok: true },
      { texto: "Sistema de leads avanzado", ok: true },
      { texto: "Hasta 5 testimonios", ok: true },
      { texto: "5 certificaciones", ok: true },
      { texto: "10 proyectos en galería", ok: true },
      { texto: "Badge Verificada", ok: true },
      { texto: "Posición prioritaria en catálogo", ok: true },
      { texto: "Soporte prioritario", ok: true },
    ],
    cta: "Elegir Plan Pro",
    ctaHref: "/register?plan=pro",
    ctaClass: "bg-blue-600 hover:bg-blue-700 text-white",
    ctaVariant: "default" as const,
  },
  {
    id: "premium",
    nombre: "Premium",
    precio: "5",
    periodo: "UF / mes",
    icon: Crown,
    color: "text-amber-500",
    borderClass: "border-amber-500/30 shadow-2xl shadow-amber-500/10",
    badge: "Top Constructora",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    features: [
      { texto: "Modelos ilimitados", ok: true },
      { texto: "20 fotos por modelo", ok: true },
      { texto: "Perfil premium con video", ok: true },
      { texto: "CRM leads + analíticas completas", ok: true },
      { texto: "Testimonios ilimitados", ok: true },
      { texto: "Certificaciones ilimitadas", ok: true },
      { texto: "Galería ilimitada de proyectos", ok: true },
      { texto: "Badge Premium ⭐ destacada", ok: true },
      { texto: "Posición destacada (top catálogo)", ok: true },
      { texto: "Soporte dedicado 24/7", ok: true },
    ],
    cta: "Elegir Premium",
    ctaHref: "/register?plan=premium",
    ctaClass: "brand-gradient text-white hover:opacity-90",
    ctaVariant: "default" as const,
  },
];

export default function PlanesPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="py-24 text-center relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 md:px-8 relative z-10 space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px] px-4 py-1.5">
            Para Constructoras
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
            Elige el plan <span className="gradient-text">correcto</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Publica tus modelos de casas y conecta con +50.000 familias que buscan su hogar ideal en Chile cada mes.
          </p>
        </div>
      </section>

      {/* Plans grid */}
      <section className="container max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANES.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-card/60 backdrop-blur-xl border rounded-[3rem] p-10 flex flex-col gap-8 transition-all hover:-translate-y-1",
                  plan.borderClass
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className={cn("font-black text-[10px] uppercase tracking-widest px-4 py-1 border", plan.badgeClass)}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="space-y-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", plan.id === "gratis" ? "bg-muted" : plan.id === "pro" ? "bg-blue-500/10" : "bg-amber-500/10")}>
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
                    <li key={feat.texto} className={cn("flex items-center gap-3 text-sm font-medium", !feat.ok && "opacity-40")}>
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
                    "w-full rounded-2xl h-14 font-black text-xs uppercase tracking-widest",
                    plan.ctaClass
                  )}
                >
                  {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ teaser */}
        <div className="mt-20 text-center space-y-4">
          <p className="text-muted-foreground font-medium">
            ¿Tienes dudas? Escríbenos a{" "}
            <a href="mailto:contacto@solocasaschile.cl" className="text-primary font-bold hover:underline">
              contacto@solocasaschile.cl
            </a>
          </p>
          <p className="text-sm text-muted-foreground opacity-60">
            Todos los planes incluyen acceso al CRM de prospectos y panel de gestión. Los precios están expresados en UF chilenas.
          </p>
        </div>
      </section>
    </div>
  );
}
