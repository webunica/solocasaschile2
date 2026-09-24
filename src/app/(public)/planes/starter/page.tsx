import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  X,
  Zap,
  Building2,
  ArrowRight,
  Sparkles,
  Lock,
  Gift,
  Star,
  Mail,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { StarterPlanesClient } from "./client";
import { WaitlistRequestForm } from "./waitlist-form";


export const metadata: Metadata = {
  title: "Plan Starter – 1 Modelo Gratuito por Invitación | SoloCasasChile",
  description:
    "Publica tu primer modelo de casa prefabricada de forma gratuita y permanente en SoloCasasChile. Solo por invitación. Sin tarjeta de crédito. Cuando quieras crecer, elige el plan que mejor se adapte.",
  robots: { index: false, follow: false }, // No indexar: es solo para invitados
  openGraph: {
    title: "Plan Starter – Tu primer modelo gratis en SoloCasasChile",
    description:
      "Acceso exclusivo por invitación. Publica 1 modelo de manera permanente sin costo. Únete al catálogo líder de casas prefabricadas en Chile.",
    url: "https://www.solocasaschile.com/planes/starter",
    type: "website",
  },
};

const STARTER_BENEFITS = [
  {
    icon: Gift,
    title: "1 Modelo publicado gratis y permanente",
    description:
      "Tu modelo aparece en el catálogo de SoloCasasChile sin fecha de vencimiento y sin costo, mientras mantengas tu cuenta activa.",
  },
  {
    icon: Building2,
    title: "Ficha oficial de tu constructora",
    description:
      "Perfil público con nombre, región, descripción y datos de contacto. Los compradores pueden ver quién eres antes de cotizar.",
  },
  {
    icon: Star,
    title: "Visibilidad en búsquedas por región",
    description:
      "Tu modelo aparece en los resultados cuando un comprador busca casas prefabricadas en tu región, sin pagar por publicidad.",
  },
  {
    icon: Mail,
    title: "Botón de contacto directo",
    description:
      "Los interesados pueden escribirte desde la ficha de tu modelo. Sin intermediarios, sin comisiones por contacto.",
  },
  {
    icon: ShieldCheck,
    title: "Sin tarjeta de crédito",
    description:
      "El Plan Starter no requiere datos de pago. Es completamente gratuito de forma permanente para los 1 modelo incluidos.",
  },
  {
    icon: Lock,
    title: "Acceso exclusivo por invitación",
    description:
      "Este plan está disponible solo para constructoras seleccionadas por nuestro equipo. No está disponible en el registro público.",
  },
];

const STARTER_INCLUDED = [
  { texto: "1 modelo publicado en catálogo", ok: true },
  { texto: "Hasta 3 fotos por modelo", ok: true },
  { texto: "Ficha de constructora con datos de contacto", ok: true },
  { texto: "Presencia en búsquedas por región", ok: true },
  { texto: "Botón cotizar desde la ficha del modelo", ok: true },
  { texto: "Recepción directa de leads (WhatsApp/Email)", ok: false },
  { texto: "Panel CRM de cotizaciones", ok: false },
  { texto: "Posicionamiento destacado", ok: false },
  { texto: "Modelos adicionales", ok: false },
];

const FAQS = [
  {
    q: "¿Qué pasa con mi modelo si quiero cancelar o no hago nada?",
    a: "Mientras tu cuenta esté activa, tu modelo permanece publicado sin costo. No hay fecha de expiración para el Plan Starter. Si desactivas tu cuenta, el modelo deja de mostrarse en el catálogo público.",
  },
  {
    q: "¿Puedo subir más de 1 modelo en el Plan Starter?",
    a: "No. El Plan Starter incluye exactamente 1 modelo publicado con hasta 3 fotos. Para publicar más modelos, puedes actualizar a cualquiera de los planes de pago desde tu panel de constructora.",
  },
  {
    q: "¿Cómo puedo recibir consultas de compradores?",
    a: "Con el Plan Starter, los interesados pueden ver tu ficha de constructora y enviarte mensajes mediante el botón de contacto de tu modelo. Para recibir leads directamente en tu WhatsApp y correo, necesitas el Plan Crece o superior.",
  },
  {
    q: "¿Cuándo puedo cambiar al Plan Basic, Crece o Pro?",
    a: "En cualquier momento desde tu panel de constructora. El upgrade es inmediato: tu modelo existente se mantiene y puedes agregar más según el plan elegido.",
  },
  {
    q: "¿El Plan Starter tiene algún costo oculto?",
    a: "No. Es completamente gratuito y no requiere tarjeta de crédito. El modelo publicado, la ficha de constructora y la visibilidad en búsquedas están incluidos sin costo.",
  },
];

export default function StarterPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 text-center overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-4 md:px-8 relative z-10 space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-brand-teal/15 text-brand-teal border-brand-teal/30 font-black uppercase tracking-widest text-xs px-4 py-1.5 gap-1.5">
              <Sparkles className="w-3 h-3" />
              Solo por Invitación
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
              Sin tarjeta · Permanente
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-tight">
            Tu primer modelo,{" "}
            <span className="gradient-text">gratis para siempre.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            El Plan Starter es nuestra invitación especial para que constructoras
            seleccionadas publiquen un modelo en el catálogo de SoloCasasChile{" "}
            <strong className="text-foreground">sin costo, sin fecha límite.</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/invitacion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-2xl bg-brand-teal px-8 text-xs font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-brand-teal/25 hover:bg-brand-teal/90 gap-2"
              )}
            >
              <Zap className="w-4 h-4" />
              Tengo una invitación
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#solicitar"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 rounded-2xl border-border/60 px-8 text-xs font-bold uppercase tracking-[0.14em] gap-2"
              )}
            >
              <Mail className="w-4 h-4" />
              Solicitar invitación →
            </Link>
            <Link
              href="#upgrade"
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Ver planes de pago →
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-bold text-muted-foreground">
            {["1 modelo publicado", "Hasta 3 fotos", "Sin tarjeta de crédito", "Permanente"].map(
              (chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full border border-border/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {chip}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Qué incluye ─────────────────────────────────────────────── */}
      <section className="container max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <Badge
            variant="outline"
            className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-border"
          >
            Incluido en el Plan Starter
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">
            Todo lo que necesitas para comenzar
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto">
            Presencia real en el catálogo más completo de casas prefabricadas de
            Chile, sin ningún costo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STARTER_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-card/70 border border-border/50 rounded-2xl p-6 space-y-3 hover:border-brand-teal/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-teal" />
                </div>
                <h3 className="font-black text-sm text-foreground leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comparativa rápida Starter vs planes ────────────────────── */}
      <section className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-lg mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight">
              ¿Qué incluye el Plan Starter?
            </h2>
          </div>

          <div className="bg-card/80 border-2 border-brand-teal/30 rounded-[2rem] overflow-hidden shadow-xl shadow-brand-teal/10">
            <div className="bg-brand-teal/10 px-6 py-4 border-b border-brand-teal/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-teal/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-teal" />
                </div>
                <span className="font-black text-foreground">Plan Starter</span>
              </div>
              <Badge className="bg-brand-teal text-white border-none font-black text-[10px] tracking-widest">
                GRATIS
              </Badge>
            </div>
            <ul className="p-6 space-y-3">
              {STARTER_INCLUDED.map((item) => (
                <li
                  key={item.texto}
                  className={cn(
                    "flex items-start gap-3 text-xs font-medium leading-tight",
                    !item.ok && "opacity-35 line-through"
                  )}
                >
                  {item.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span>{item.texto}</span>
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6 space-y-2">
              <Link
                href="#solicitar"
                className={cn(
                  buttonVariants(),
                  "w-full h-12 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 text-white font-black uppercase tracking-widest text-xs gap-2"
                )}
              >
                <Mail className="w-3.5 h-3.5" />
                Solicitar mi invitación gratis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/invitacion"
                className="block text-center text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors pt-1"
              >
                ¿Ya tienes un código o enlace? Actívalo aquí →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Planes de pago para crecer ──────────────────────────────── */}
      <section id="upgrade" className="container max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center space-y-4 mb-14">
          <Badge
            variant="outline"
            className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-border"
          >
            Cuando quieras escalar
          </Badge>
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter">
            Planes para crecer sin límites
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            El Plan Starter te da el primer paso. Cuando estés lista para recibir
            más leads, publicar más modelos y posicionarte en tu región, haz
            upgrade en cualquier momento sin perder lo que ya tienes.
          </p>
        </div>

        <StarterPlanesClient />

        <p className="text-center text-xs text-muted-foreground font-medium mt-10 opacity-85">
          Sin permanencia en planes mensuales · Precios en UF facturados en pesos según valor oficial del día · Factura electrónica inmediata vía Flow.
        </p>
      </section>

      {/* ── Solicitar invitación (sin token) ────────────────────────── */}
      <section id="solicitar" className="border-y border-border/40 bg-muted/20 py-16">
        <div className="container max-w-2xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-10">
            <Badge
              variant="outline"
              className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground border-border"
            >
              ¿No tienes invitación?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">
              Solicita tu invitación
            </h2>
            <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
              Deja tus datos y nuestro equipo evaluará tu solicitud. Si hay cupo
              disponible, te enviaremos tu invitación directamente al correo.
            </p>
          </div>

          <div className="bg-card/80 border border-border/50 rounded-[2rem] p-7 md:p-10 shadow-sm">
            <WaitlistRequestForm />
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 md:px-8 py-16 space-y-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground font-medium">
            Todo lo que necesitas saber sobre el Plan Starter.
          </p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-card/60 border border-border/40 rounded-2xl px-6 py-5 cursor-pointer open:border-brand-teal/30 transition-all"
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
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section className="container max-w-4xl mx-auto px-4 md:px-8 pt-8">
        <div className="bg-gradient-to-br from-brand-indigo to-brand-indigo/90 border border-border/40 rounded-[3rem] p-12 md:p-16 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-teal/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <Badge className="bg-white/15 text-white border-white/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
              Empieza sin costo
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
              Reclama tu modelo gratuito hoy
            </h2>
            <p className="text-white/80 font-medium text-sm md:text-base max-w-lg mx-auto">
              Si aún no tienes invitación, solicítala abajo. Si ya recibiste tu código o enlace por correo, actívalo en minutos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="#solicitar"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-brand-teal hover:bg-brand-teal/90 text-white font-black uppercase tracking-widest rounded-2xl h-14 px-8 gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                )}
              >
                <Mail className="w-4 h-4" />
                Solicitar mi invitación gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/invitacion"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-widest rounded-2xl h-14 px-8 gap-2"
                )}
              >
                <Zap className="w-4 h-4" />
                Ya tengo un enlace o código
              </Link>
            </div>
            <div className="pt-1">
              <Link
                href="/planes"
                className="text-xs font-bold text-white/70 hover:text-white transition-colors underline underline-offset-4"
              >
                O ver todos los planes de suscripción para constructoras →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
