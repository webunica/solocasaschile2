import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Clock, Camera, FileText, CheckCircle2, ArrowRight, BellRing, Gauge } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackingCodeSearch } from "@/components/obras/tracking-code-search";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";

const EXAMPLE_TRACKING_ID = "e356c78f-9374-4a71-ab07-52254530c6b3";
const PAGE_URL = "https://solocasaschile.com/seguimiento-de-obras";

const FAQS = [
  {
    question: "Como consulto el estado de mi obra?",
    answer:
      "Con tu codigo de seguimiento puedes revisar hitos, fotos, documentos y fechas clave desde cualquier dispositivo.",
  },
  {
    question: "Que tipo de evidencia muestra el sistema?",
    answer:
      "Se publican avances por etapa, registro fotografico, observaciones tecnicas y documentacion asociada a cada hito.",
  },
  {
    question: "Sirve para constructoras y para clientes?",
    answer:
      "Si. La constructora gestiona y reporta avances, y el cliente visualiza el estado real de su proyecto en una sola vista.",
  },
];

export const metadata: Metadata = {
  title: "Sistema de Seguimiento de Obras | Avance Real y Transparente",
  description:
    "Monitorea tu proyecto con fotos, hitos, documentos y alertas. El sistema de seguimiento de obras de SolocasasChile mejora transparencia y control para clientes y constructoras.",
  keywords: [
    "sistema de seguimiento de obras",
    "seguimiento de obra online",
    "avance de construccion",
    "control de obra digital",
    "bitacora de obra",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Sistema de Seguimiento de Obras | SolocasasChile",
    description: "Plataforma para revisar avances de obra, evidencias y cumplimiento de hitos en tiempo real.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://solocasaschile.com/og-image.jpg", width: 1200, height: 630, alt: "Sistema de seguimiento de obras" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seguimiento de Obras | SolocasasChile",
    description: "Control y transparencia para proyectos de construccion con hitos verificables.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default function SeguimientoObrasPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Seguimiento de obras", url: PAGE_URL },
  ]);

  const faqJsonLd = buildFAQJsonLd(FAQS);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Sistema de Seguimiento de Obras",
    provider: {
      "@type": "Organization",
      name: "SolocasasChile",
      url: "https://solocasaschile.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
    serviceType: "Seguimiento digital de proyectos de construccion",
    url: PAGE_URL,
  };

  return (
    <main className="min-h-screen bg-background pt-40 pb-20 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c") }} />

      <section className="container max-w-7xl mx-auto px-6 relative mb-20">
        <div className="absolute top-0 right-0 w-[620px] h-[620px] bg-brand-teal/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <Badge variant="outline" className="border-brand-teal/30 text-brand-teal bg-brand-teal/5 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
              Sistema 2026
            </Badge>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-heading font-black leading-[0.9] tracking-tighter text-brand-indigo">
              Sistema de
              <span className="text-brand-teal italic"> Seguimiento de Obras</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Una vista unica del avance real: hitos, evidencia visual, bitacora tecnica y alertas. Menos incertidumbre, mejores decisiones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/seguimiento/${EXAMPLE_TRACKING_ID}`} className={cn(buttonVariants({ size: "lg" }), "bg-brand-indigo text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-brand-indigo/20")}>
                VER DEMO
              </Link>
              <Link href="/constructoras" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-border rounded-2xl h-14 px-8 font-bold")}>
                VER CONSTRUCTORAS
              </Link>
            </div>
            <TrackingCodeSearch />
          </div>

          <div className="relative group">
            <div className="relative z-10 aspect-[4/3] bg-transparent">
              <Image
                src="/images/sistema-avances-01.jpg"
                alt="Dashboard de seguimiento de obras"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 z-20 w-56 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white p-6 space-y-4 transform rotate-6 group-hover:rotate-0 transition-all duration-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etapa actual</span>
              </div>
              <p className="font-heading font-black text-brand-indigo text-lg leading-tight">Montaje estructural finalizado</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500" />
              </div>
              <p className="text-[9px] font-bold text-emerald-600 uppercase">85% completado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-brand-indigo leading-tight">
              Transparencia operativa de principio a fin
            </h2>
            <p className="text-muted-foreground font-medium">Cada etapa queda visible, trazable y respaldada por evidencia.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Camera, title: "Evidencia visual", desc: "Fotos y registro real por etapa para validar avance sin visitas constantes.", color: "bg-blue-500/10 text-blue-600" },
              { icon: Clock, title: "Control de plazos", desc: "Linea de tiempo con fechas estimadas y fechas reales para detectar desalineaciones.", color: "bg-amber-500/10 text-amber-600" },
              { icon: FileText, title: "Bitacora digital", desc: "Documentos y observaciones tecnicas centralizadas en un historial unico.", color: "bg-emerald-500/10 text-emerald-600" },
              { icon: BellRing, title: "Alertas de avance", desc: "Notificaciones cuando se completan hitos o cuando aparece un bloqueo relevante.", color: "bg-rose-500/10 text-rose-600" },
            ].map((item) => (
              <article key={item.title} className="p-8 bg-white rounded-[2rem] border border-border/40 shadow-sm hover:shadow-xl transition-all space-y-5 group text-left">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black font-heading text-brand-indigo">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative min-h-[340px] sm:min-h-[460px] bg-transparent">
            <Image src="/images/sistema-avances-02.jpg" alt="Portal movil de seguimiento de obra" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" />
          </div>
          <div className="space-y-7">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1] text-brand-indigo">
              Como funciona el seguimiento
            </h2>
            <div className="space-y-5">
              {[
                { title: "1. Planificacion de hitos", desc: "La constructora define etapas, responsables y fechas objetivo." },
                { title: "2. Carga de evidencia", desc: "Se registran fotos, comentarios y archivos por cada hito completado." },
                { title: "3. Revision y trazabilidad", desc: "Cliente y equipo revisan avances en una sola interfaz historica." },
              ].map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-brand-indigo">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/demo" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto bg-brand-teal text-brand-indigo font-black rounded-2xl h-14 px-8 mt-2")}>
              SOLICITAR DEMO
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 mb-20">
        <div className="rounded-[2.5rem] border border-border/40 bg-card/30 p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-brand-teal" />
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-brand-indigo">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-border/50 bg-background p-5">
                <summary className="cursor-pointer text-sm font-black tracking-tight">{faq.question}</summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-6 mb-20">
        <div className="p-12 md:p-20 rounded-[3rem] bg-brand-indigo text-white text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-[150px] pointer-events-none" />
          <h2 className="text-3xl md:text-6xl font-heading font-black tracking-tighter leading-none relative z-10">
            Construye con visibilidad real
          </h2>
          <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto relative z-10">
            Busca constructoras con seguimiento activo y avanza con mas confianza desde el primer hito.
          </p>
          <Link href="/constructoras" className="inline-flex items-center gap-2 bg-white text-brand-indigo font-black px-10 py-5 rounded-[2rem] text-lg relative z-10 hover:scale-105 transition-transform active:scale-95">
            EXPLORAR CONSTRUCTORAS <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-6 pb-6">
        <div className="rounded-[2rem] border border-border/40 bg-slate-50 p-6 md:p-8 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-teal" />
            Nota de transparencia
          </p>
          <p>
            SolocasasChile entrega una plataforma de comparacion y seguimiento para mejorar trazabilidad del proyecto. La ejecucion de obra y cumplimiento contractual dependen de cada constructora.
          </p>
        </div>
      </section>
    </main>
  );
}
