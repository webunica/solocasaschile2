import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Crown, MessageCircle, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/56964130601?text=Hola%20SolocasasChile%2C%20quiero%20conocer%20los%20planes%20para%20mi%20constructora.";

const plans = [
  {
    id: "gratis",
    name: "Plan gratis",
    badge: "Entrada simple",
    price: "$0",
    suffix: "Solicitalo aqui",
    description:
      "Para constructoras que quieren aparecer en la plataforma, validar demanda y comenzar sin riesgo.",
    icon: Building2,
    cta: "Solicitalo aqui",
    href: "/register?plan=gratis",
    secondaryCta: "Hablar por WhatsApp",
    secondaryHref: WHATSAPP_URL,
    cardClass: "border-border/60 bg-white",
    iconClass: "bg-slate-100 text-brand-indigo",
    features: [
      "Perfil de empresa en SolocasasChile",
      "Publicacion de 1 a 2 modelos",
      "Boton directo a WhatsApp",
      "Sello visible: Empresa en evaluacion",
      "Ideal para probar la plataforma antes de invertir",
    ],
  },
  {
    id: "fundadores",
    name: "Plan Fundadores",
    badge: "Mas recomendado",
    price: "$25.000",
    suffix: "+ IVA / mes",
    description:
      "La opcion principal para constructoras que quieren entrar temprano, publicar mejor y recibir apoyo inicial.",
    icon: Zap,
    cta: "Unirme como fundador",
    href: "/register?plan=fundadores",
    secondaryCta: "Resolver dudas",
    secondaryHref: WHATSAPP_URL,
    featured: true,
    cardClass: "border-brand-teal/50 bg-white shadow-2xl shadow-brand-teal/10 md:-translate-y-4",
    iconClass: "bg-brand-teal/10 text-brand-teal",
    features: [
      "Hasta 10 modelos publicados",
      "Ficha destacada dentro del catalogo",
      "Aparicion prioritaria en listados",
      "Formulario de cotizacion",
      "Landing SEO propia de la empresa",
      "Estadisticas basicas",
      "Configuracion inicial asistida",
      "Primeros 2 meses a precio fundador",
    ],
  },
  {
    id: "destacado",
    name: "Plan Destacado",
    badge: "Visibilidad premium",
    price: "$49.990",
    suffix: "+ IVA / mes",
    description:
      "Para empresas que ya estan listas para aumentar presencia y tomar posiciones de mayor visibilidad.",
    icon: Crown,
    cta: "Solicitar destacado",
    href: "/register?plan=destacado",
    secondaryCta: "Cotizar por WhatsApp",
    secondaryHref: WHATSAPP_URL,
    cardClass: "border-brand-indigo/20 bg-white",
    iconClass: "bg-brand-indigo/10 text-brand-indigo",
    features: [
      "Mayor exposicion dentro del ecosistema",
      "Ubicaciones destacadas segun disponibilidad",
      "Mas modelos y presencia editorial",
      "Prioridad en oportunidades comerciales",
      "Pensado para una segunda etapa de crecimiento",
    ],
  },
];

const comparisons = [
  ["Perfil de empresa", "Incluido", "Incluido", "Incluido"],
  ["Modelos publicados", "1 a 2", "Hasta 10", "Mayor capacidad"],
  ["WhatsApp directo", "Incluido", "Incluido", "Incluido"],
  ["Formulario de cotizacion", "Basico", "Incluido", "Incluido"],
  ["Landing SEO propia", "No incluido", "Incluido", "Incluido"],
  ["Prioridad en listados", "No incluido", "Incluido", "Alta visibilidad"],
  ["Onboarding asistido", "No incluido", "Incluido", "Incluido"],
];

const faqs = [
  {
    q: "Por que existe un plan gratis?",
    a: "Porque SolocasasChile esta en etapa de crecimiento y necesitamos que constructoras reales entren con baja friccion. El objetivo es poblar la plataforma, validar oferta y construir confianza.",
  },
  {
    q: "El Plan Fundadores mantiene el precio para siempre?",
    a: "El precio fundador aplica para esta etapa inicial y los primeros cupos. La idea es premiar a las empresas que entran temprano antes de que la plataforma suba precios con mas trafico y casos de exito.",
  },
  {
    q: "Los valores incluyen IVA?",
    a: "No. Todos los valores pagados se muestran mas IVA.",
  },
  {
    q: "Hay permanencia obligatoria?",
    a: "La entrada debe ser simple. La recomendacion comercial es trabajar sin permanencia larga al inicio y enfocar la conversion en demostrar valor durante los primeros meses.",
  },
  {
    q: "Puedo partir gratis y luego pasar a Fundadores?",
    a: "Si. El plan gratis permite comenzar con presencia basica. Cuando la empresa quiera mas modelos, prioridad y apoyo de carga, puede pasar al Plan Fundadores.",
  },
];

export default function PlanesPage() {
  return (
    <main className="min-h-screen bg-[#fbfbf9] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pt-36 pb-20 md:pt-44 md:pb-24">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-teal/10 to-transparent" />
        <div className="container relative mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-7">
            <Badge className="border-brand-teal/30 bg-brand-teal/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-brand-indigo">
              Constructoras fundadoras
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-brand-indigo md:text-7xl">
                Entra temprano. Publica simple. Valida demanda real.
              </h1>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:text-xl">
                Planes pensados para constructoras chilenas que quieren aparecer en una plataforma sectorial,
                recibir oportunidades comerciales y crecer con bajo riesgo inicial.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register?plan=fundadores"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-lg bg-brand-indigo px-7 font-black uppercase tracking-widest text-white hover:bg-brand-indigo/90"
                )}
              >
                Unirme como fundador
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={WHATSAPP_URL}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 rounded-lg border-brand-indigo/20 px-7 font-black uppercase tracking-widest text-brand-indigo"
                )}
              >
                Hablar con ventas
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-brand-teal/20 bg-brand-teal/10 p-6 shadow-xl shadow-brand-teal/5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-brand-teal shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-indigo">
                  Oferta de etapa inicial
                </p>
                <h2 className="text-2xl font-black tracking-tight text-brand-indigo">
                  Plan Fundadores desde $25.000 + IVA/mes
                </h2>
                <p className="text-sm font-semibold leading-relaxed text-slate-600">
                  Primeros 2 meses a precio fundador, configuracion asistida y prioridad para empresas que
                  entren durante la etapa de captacion.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <Badge className="mb-4 border-brand-indigo/15 bg-white text-brand-indigo">
              Valores + IVA
            </Badge>
            <h2 className="text-4xl font-black tracking-tight text-brand-indigo md:text-5xl">
              El Plan Fundadores es el foco comercial.
            </h2>
          </div>
          <p className="text-base font-medium leading-relaxed text-slate-600 md:text-lg">
            El gratis elimina la barrera de entrada, Fundadores convierte a las primeras empresas pagadas y
            Destacado queda como una opcion premium secundaria para quienes quieren mayor visibilidad.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.id}
                className={cn(
                  "relative flex h-full flex-col rounded-lg border p-7 transition-transform duration-300 hover:-translate-y-1",
                  plan.cardClass
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-7">
                    <Badge className="border-brand-teal bg-brand-teal px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-brand-indigo shadow-lg shadow-brand-teal/20">
                      Hero comercial
                    </Badge>
                  </div>
                )}
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge className="border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      {plan.badge}
                    </Badge>
                    <h3 className="text-2xl font-black tracking-tight text-brand-indigo">{plan.name}</h3>
                  </div>
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", plan.iconClass)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-4xl font-black tracking-tight text-slate-950">{plan.price}</span>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {plan.suffix}
                    </p>
                  </div>
                  <p className="min-h-20 text-sm font-medium leading-relaxed text-slate-600">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-3">
                  <Link
                    href={plan.href}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-13 w-full rounded-lg font-black uppercase tracking-widest",
                      plan.featured
                        ? "bg-brand-indigo text-white hover:bg-brand-indigo/90"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={plan.secondaryHref}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-full rounded-lg font-black uppercase tracking-widest text-brand-indigo"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {plan.secondaryCta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-slate-500">
          Todos los valores pagados son mas IVA. La activacion final se confirma con el equipo comercial.
        </p>
      </section>

      <section className="border-y border-slate-200/70 bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="space-y-4">
              <Badge className="border-brand-teal/30 bg-brand-teal/10 text-brand-indigo">
                Comparacion rapida
              </Badge>
              <h2 className="text-3xl font-black tracking-tight text-brand-indigo md:text-4xl">
                Simple de entender, facil de vender.
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                La arquitectura evita sobrecargar la decision: una entrada gratis, una oferta fundadora clara
                y una opcion premium que no roba protagonismo.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-4 bg-slate-50 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <div className="p-4">Beneficio</div>
                <div className="p-4">Gratis</div>
                <div className="bg-brand-teal/10 p-4 text-brand-indigo">Fundadores</div>
                <div className="p-4">Destacado</div>
              </div>
              {comparisons.map(([benefit, free, founders, featured]) => (
                <div key={benefit} className="grid grid-cols-4 border-t border-slate-100 text-sm font-semibold text-slate-700">
                  <div className="p-4 text-brand-indigo">{benefit}</div>
                  <div className="p-4">{free}</div>
                  <div className="bg-brand-teal/5 p-4 font-black text-brand-indigo">{founders}</div>
                  <div className="p-4">{featured}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3 md:px-8 md:py-20">
        {[
          {
            icon: ShieldCheck,
            title: "Menos riesgo percibido",
            copy: "La constructora no parte comprando una promesa cara. Primero entra, publica y valida.",
          },
          {
            icon: Star,
            title: "Mas oferta real",
            copy: "El plan gratis ayuda a poblar la plataforma con empresas y modelos reales desde el inicio.",
          },
          {
            icon: Sparkles,
            title: "Mejor momento comercial",
            copy: "Fundadores se siente como oportunidad temprana, no como gasto incierto.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-brand-indigo">{item.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{item.copy}</p>
            </div>
          );
        })}
      </section>

      <section className="container mx-auto max-w-3xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black tracking-tight text-brand-indigo">Preguntas frecuentes</h2>
          <p className="mt-3 text-sm font-medium text-slate-600">
            Respuestas pensadas para reducir objeciones antes de hablar con ventas.
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

      <section className="container mx-auto max-w-5xl px-4 pb-24 md:px-8">
        <div className="rounded-lg bg-brand-indigo p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-3">
              <Badge className="border-white/20 bg-white/10 text-white">
                Cupos fundadores
              </Badge>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Unite como empresa fundadora desde $25.000 + IVA/mes
              </h2>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-white/75">
                Configuracion asistida, publicacion inicial y una propuesta facil de justificar para validar
                SolocasasChile como canal comercial.
              </p>
            </div>
            <Link
              href="/register?plan=fundadores"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-lg bg-white px-7 font-black uppercase tracking-widest text-brand-indigo hover:bg-white/90"
              )}
            >
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
