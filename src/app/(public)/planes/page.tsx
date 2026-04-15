"use client";

import { Suspense, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Crown,
  GalleryHorizontalEnd,
  Headphones,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/56964130601?text=Hola%20SolocasasChile%2C%20quiero%20conocer%20los%20planes%20de%20lanzamiento%20para%20mi%20constructora.";

const launchBenefits = [
  "Periodo de lanzamiento para empresas que quieren ser los primeros.",
  "Devolucion de dinero durante los primeros 30 dias en planes pagados.",
  "Configuracion inicial asistida para acelerar la publicacion.",
];

const pruebaFeatures = [
  "30 dias para probar la plataforma",
  "Perfil de empresa en SolocasasChile",
  "Publicacion inicial de modelos",
  "Boton directo a WhatsApp",
  "Recepcion de solicitudes de cotizacion",
  "Sello visible: Empresa en evaluacion",
  "Acceso al panel de constructora",
];

const avanzaFeatures = [
  "Hasta 10 tipos de modelos publicados",
  "10 fotos por modelo",
  "Perfil completo de constructora",
  "Formulario de cotizacion y CRM de leads",
  "Landing SEO propia para la empresa",
  "Testimonios y certificaciones visibles",
  "Galeria de proyectos terminados",
  "Badge de constructora verificada",
  "Posicion prioritaria en catalogo",
  "Estadisticas y analiticas basicas",
  "Sistema de seguimiento de obras",
  "Soporte de carga inicial y onboarding asistido",
];

const comparisonRows = [
  ["Duracion inicial", "30 dias", "Mensual", "En produccion"],
  ["Modelos publicados", "Publicacion inicial", "Hasta 10 tipos", "Mayor capacidad"],
  ["Fotos por modelo", "Basico", "10 fotos", "Avanzado"],
  ["WhatsApp directo", "Incluido", "Incluido", "Incluido"],
  ["Cotizaciones / leads", "Incluido", "CRM de leads", "Prioridad comercial"],
  ["Landing SEO propia", "No incluido", "Incluido", "Incluido"],
  ["Estadisticas", "No incluido", "Incluido", "Avanzado"],
  ["Seguimiento de obras", "No incluido", "Incluido", "Incluido"],
  ["Devolucion 30 dias", "No aplica", "Incluida", "Incluida"],
];

const faqs = [
  {
    q: "Por que ya no es un plan gratis?",
    a: "Porque la propuesta se mueve a una prueba real de 30 dias. La empresa entra sin pago, prueba el panel y valida si SolocasasChile le sirve antes de pasar a un plan pagado.",
  },
  {
    q: "Que significa Ser los primeros?",
    a: "Estamos en periodo de lanzamiento. Las constructoras que entren primero acceden a condiciones iniciales, apoyo de carga y visibilidad temprana antes de que los planes evolucionen.",
  },
  {
    q: "Como funciona la devolucion de dinero?",
    a: "En planes pagados puedes solicitar devolucion durante los primeros 30 dias si la plataforma no calza con tu constructora. La idea es reducir riesgo y facilitar la decision.",
  },
  {
    q: "El Plan Avanza se paga con Flow?",
    a: "Si. El pago de Avanza se inicia con Flow. Si aun no tienes cuenta, primero se crea el registro de empresa y luego puedes continuar con el pago.",
  },
  {
    q: "El tercer plan ya se puede contratar?",
    a: "No todavia. El plan superior queda visible como referencia, pero esta en produccion para una etapa posterior.",
  },
];

function PlanesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isStatusPending = searchParams.get("status") === "pending";

  const handlePurchase = () => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/register?plan=avanza&billing=monthly");
          return;
        }

        const response = await fetch("/api/payments/flow/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "avanza", billing: "monthly" }),
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          toast.error(data.error || "No se pudo iniciar el pago con Flow.");
          return;
        }

        window.location.href = data.url;
      } catch {
        toast.error("Ocurrio un error inesperado. Intenta nuevamente.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#fbfbf9] pb-24 text-slate-950">
      {isPending && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-sm">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo" />
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-indigo">
            Conectando con Flow
          </p>
        </div>
      )}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-teal/12 via-brand-teal/5 to-transparent" />
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-indigo/5 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl px-4 md:px-8">
          {isStatusPending && (
            <div className="mb-8 rounded-lg border border-brand-indigo/20 bg-brand-indigo/5 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-indigo text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-black tracking-tight text-brand-indigo">Tu registro esta listo para avanzar.</h2>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Completa el pago de Avanza con Flow para activar las funciones comerciales.
                    </p>
                  </div>
                </div>
                <Button onClick={handlePurchase} className="rounded-lg bg-brand-indigo font-black uppercase tracking-widest text-white">
                  Pagar Avanza
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-7">
              <Badge className="border-brand-teal/30 bg-brand-teal/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-brand-indigo">
                Periodo de lanzamiento
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-brand-indigo md:text-7xl">
                  Ser los primeros tiene ventaja.
                </h1>
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:text-xl">
                  Estamos abriendo SolocasasChile a constructoras reales. Entra con una prueba de 30 dias
                  o activa Avanza con Flow y condiciones de lanzamiento.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {launchBenefits.map((benefit) => (
                  <div key={benefit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <CheckCircle2 className="mb-3 h-5 w-5 text-brand-teal" />
                    <p className="text-xs font-bold leading-relaxed text-slate-600">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-brand-indigo/15 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-200">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-teal">Garantia simple</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">
                Prueba sin pago. Avanza con devolucion 30 dias.
              </h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-white/70">
                El foco no es forzar una compra temprana: es reducir riesgo, sumar oferta real y demostrar valor
                antes de subir la exigencia comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-brand-indigo/20 bg-white text-brand-indigo">
            2 planes iniciales + 1 en produccion
          </Badge>
          <h2 className="text-4xl font-black tracking-tight text-brand-indigo md:text-5xl">
            Elige como quieres entrar.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-600">
            La prueba permite validar sin pago. Avanza concentra las funciones comerciales para constructoras
            que quieren aparecer mejor desde el lanzamiento.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3 lg:items-start">
          <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <Badge className="mb-3 border-slate-200 bg-slate-50 text-slate-500">Sin pago inicial</Badge>
                <h3 className="text-3xl font-black tracking-tight text-brand-indigo">Plan Prueba</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">30 dias para conocer la plataforma.</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-indigo">
                <Clock3 className="h-6 w-6" />
              </div>
            </div>

            <div className="mb-7">
              <span className="text-5xl font-black tracking-tight">$0</span>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                30 dias de prueba
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {pruebaFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/register?plan=prueba"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-14 rounded-lg bg-slate-950 font-black uppercase tracking-widest text-white hover:bg-slate-800"
              )}
            >
              Iniciar prueba
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="relative flex h-full flex-col rounded-lg border border-brand-teal/50 bg-white p-7 shadow-2xl shadow-brand-teal/10 transition-transform duration-300 hover:-translate-y-1 lg:-translate-y-5">
            <div className="absolute -top-4 left-7">
              <Badge className="border-brand-teal bg-brand-teal px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-brand-indigo shadow-lg shadow-brand-teal/20">
                Ser los primeros
              </Badge>
            </div>

            <div className="mb-7 flex items-start justify-between gap-5 pt-2">
              <div>
                <Badge className="mb-3 border-brand-indigo/20 bg-brand-indigo/5 text-brand-indigo">
                  Plan de lanzamiento
                </Badge>
                <h3 className="text-3xl font-black tracking-tight text-brand-indigo">Plan Avanza</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Todas las caracteristicas clave con limite de 10 tipos de modelos.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="mb-7 rounded-lg border border-brand-teal/20 bg-brand-teal/5 p-5">
              <span className="text-5xl font-black tracking-tight">$25.000</span>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                + IVA / mes
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-indigo">
                <ShieldCheck className="h-4 w-4 text-brand-teal" />
                Devolucion primeros 30 dias
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {avanzaFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={handlePurchase}
              disabled={isPending}
              size="lg"
              className="mt-8 h-14 rounded-lg bg-brand-indigo font-black uppercase tracking-widest text-white hover:bg-brand-indigo/90"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pagar con Flow"}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </Button>
            <Link
              href={WHATSAPP_URL}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mt-2 rounded-lg font-black uppercase tracking-widest text-brand-indigo"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Resolver dudas
            </Link>
          </article>

          <article className="flex h-full flex-col rounded-lg border border-dashed border-slate-300 bg-white/70 p-7 opacity-90">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <Badge className="mb-3 border-amber-200 bg-amber-50 text-amber-700">En produccion</Badge>
                <h3 className="text-3xl font-black tracking-tight text-brand-indigo">Plan Escala</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Para una etapa posterior, con mayor exposicion y capacidades avanzadas.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Crown className="h-6 w-6" />
              </div>
            </div>

            <div className="mb-7">
              <span className="text-4xl font-black tracking-tight">Pronto</span>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Disponible en etapa 2
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {[
                "Mayor capacidad de modelos",
                "Ubicaciones destacadas premium",
                "Analiticas avanzadas",
                "Campanas de visibilidad",
                "Soporte comercial prioritario",
              ].map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-500">
                  <Timer className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={WHATSAPP_URL}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-8 h-14 rounded-lg border-slate-300 font-black uppercase tracking-widest text-brand-indigo"
              )}
            >
              Avisarme
            </Link>
          </article>
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-slate-500">
          Valores de planes pagados expresados + IVA. Avanza se paga mediante Flow.
        </p>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="space-y-4">
              <Badge className="border-brand-teal/30 bg-brand-teal/10 text-brand-indigo">
                Caracteristicas
              </Badge>
              <h2 className="text-3xl font-black tracking-tight text-brand-indigo md:text-4xl">
                Mas detalle, menos duda.
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                Rescatamos la profundidad de la pagina anterior, pero con una oferta mas simple:
                prueba primero, luego activa Avanza si quieres competir desde el lanzamiento.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: LayoutDashboard, title: "Panel comercial", copy: "Administra modelos, solicitudes y datos de tu empresa." },
                { icon: BarChart3, title: "Estadisticas", copy: "Lectura basica de rendimiento para tomar mejores decisiones." },
                { icon: GalleryHorizontalEnd, title: "Galeria y modelos", copy: "Publica tipos de casas con imagenes, ficha y contacto directo." },
                { icon: BadgeCheck, title: "Confianza visible", copy: "Sellos, testimonios y verificacion para elevar credibilidad." },
                { icon: Building2, title: "Landing SEO", copy: "Pagina propia para posicionar tu empresa dentro del ecosistema." },
                { icon: Headphones, title: "Onboarding", copy: "Apoyo inicial para cargar informacion y evitar friccion tecnica." },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                    <Icon className="mb-4 h-5 w-5 text-brand-teal" />
                    <h3 className="font-black tracking-tight text-brand-indigo">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-4 bg-slate-50 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            <div className="p-4">Comparacion</div>
            <div className="p-4">Prueba</div>
            <div className="bg-brand-teal/10 p-4 text-brand-indigo">Avanza</div>
            <div className="p-4">Escala</div>
          </div>
          {comparisonRows.map(([label, prueba, avanza, escala]) => (
            <div key={label} className="grid grid-cols-4 border-t border-slate-100 text-sm font-semibold text-slate-700">
              <div className="p-4 text-brand-indigo">{label}</div>
              <div className="p-4">{prueba}</div>
              <div className="bg-brand-teal/5 p-4 font-black text-brand-indigo">{avanza}</div>
              <div className="p-4">{escala}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 pb-20 md:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-brand-indigo">Preguntas frecuentes</h2>
          <p className="mt-3 text-sm font-medium text-slate-600">
            La oferta esta pensada para reducir riesgo en una plataforma nueva.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-lg border border-slate-200 bg-white p-6">
              <summary className="cursor-pointer list-none text-base font-black text-brand-indigo">
                {faq.q}
              </summary>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm font-medium leading-relaxed text-slate-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="rounded-lg bg-brand-indigo p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <Badge className="border-white/20 bg-white/10 text-white">Lanzamiento</Badge>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Se parte de las primeras constructoras en SolocasasChile.
              </h2>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-white/75">
                Prueba durante 30 dias o activa Avanza con Flow y devolucion durante el primer mes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/register?plan=prueba"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-lg bg-white px-7 font-black uppercase tracking-widest text-brand-indigo hover:bg-white/90"
                )}
              >
                Probar 30 dias
              </Link>
              <Button
                onClick={handlePurchase}
                disabled={isPending}
                size="lg"
                className="h-14 rounded-lg border border-white/20 bg-white/10 px-7 font-black uppercase tracking-widest text-white hover:bg-white/15"
              >
                Pagar Avanza
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function PlanesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fbfbf9]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-indigo/20 border-t-brand-indigo" />
        </main>
      }
    >
      <PlanesContent />
    </Suspense>
  );
}
