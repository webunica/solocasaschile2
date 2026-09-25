import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Award,
  Users,
  Search,
  MapPin,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Building2,
  Lock,
  Scale,
  Sparkles,
  PhoneCall,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormularioAsesoramiento } from "@/components/verificacion/formulario-asesoramiento";

export const metadata: Metadata = {
  title: "Verificación de Empresas Constructoras en Chile | SoloCasasChile",
  description:
    "Auditoría técnica independiente, criterios de confianza y verificación legal para constructoras de casas prefabricadas y modulares en Chile. Si una empresa no está verificada, solicita asesoramiento gratuito con nuestros especialistas.",
  keywords: [
    "verificacion de empresas constructoras",
    "auditoria constructoras chile",
    "como verificar constructora chile",
    "score de confianza constructoras",
    "constructoras verificadas chile",
    "evitar estafas casas prefabricadas",
    "asesoria construccion de casas",
    "contratos casas prefabricadas chile",
    "garantias casas modulares",
  ],
  alternates: {
    canonical: "https://solocasaschile.com/verificacion-de-empresas-constructoras",
  },
  openGraph: {
    title: "Verificación de Empresas Constructoras en Chile | SoloCasasChile",
    description:
      "Conoce cómo auditamos a las empresas constructoras y qué precauciones tomar si una empresa no está verificada. Asesoramiento técnico y legal gratuito.",
    url: "https://solocasaschile.com/verificacion-de-empresas-constructoras",
    siteName: "SoloCasasChile",
    locale: "es_CL",
    type: "article",
  },
};

const CRITERIOS_VIGENTES = [
  {
    title: "Identidad Legal y Vigencia Tributaria",
    icon: FileCheck,
    desc: "Validamos el RUT de la empresa, constitución societaria en el Registro de Empresas y Sociedades del Ministerio de Economía e inicio de actividades vigente ante el SII.",
  },
  {
    title: "Años de Operación y Experiencia",
    icon: Users,
    desc: "Comprobamos trayectoria efectiva y proyectos construidos demostrables para diferenciar fábricas consolidadas de intermediarios improvisados.",
  },
  {
    title: "Contacto e Infraestructura Verificable",
    icon: MapPin,
    desc: "Confirmamos plantas de fabricación, salas de venta físicas, teléfonos corporativos activos y canales oficiales sin intermediarios no autorizados.",
  },
  {
    title: "Cumplimiento Normativo (OGUC / LGUC)",
    icon: Scale,
    desc: "Revisamos que los modelos cumplan con la Ordenanza General de Urbanismo y Construcciones (aislación térmica artículo 4.1.10, cálculo estructural y resistencia al fuego).",
  },
  {
    title: "Garantías y Contratos Estandarizados",
    icon: ShieldCheck,
    desc: "Exigimos contratos claros con plazos de entrega definidos, hitos de pago contra avance de obra y las garantías legales mínimas exigidas por ley.",
  },
  {
    title: "Historial Comercial y Respaldo",
    icon: Search,
    desc: "Evaluación de antecedentes comerciales y comportamiento de postventa para asegurar seriedad en la entrega de la vivienda.",
  },
] as const;

const ESTADOS_AUDITORIA = [
  {
    label: "Verificada documentalmente",
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    titulo: "Nivel Máximo de Confianza",
    desc: "Empresa con antecedentes legales, tributarios y técnicos validados por nuestro equipo. Dispone de contratos formales, historial comprobable y modelos con especificaciones detalladas.",
  },
  {
    label: "Información básica validada",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    titulo: "Nivel Estándar",
    desc: "Datos de contacto, RUT e inicio de actividades comprobados. Cuenta con antecedentes operativos y continúa en proceso de validación técnica profunda.",
  },
  {
    label: "Perfil en revisión",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    titulo: "En Proceso de Auditoría",
    desc: "Empresa postulante o en actualización de catálogo. Sus antecedentes están siendo revisados por nuestro equipo técnico y legal antes de otorgar certificación activa.",
  },
  {
    label: "No verificada",
    badgeClass: "bg-slate-500/10 text-slate-500 border-slate-500/30",
    titulo: "Sin Validación Técnica",
    desc: "Constructora identificada en el mercado chileno que aún no ha iniciado ni completado el proceso de auditoría independiente de SoloCasasChile.",
  },
];

const FAQS_VERIFICACION = [
  {
    q: "¿Por qué SoloCasasChile audita y verifica a las empresas?",
    a: "SoloCasasChile es una entidad independiente, no una constructora. Nuestra misión es transparentar el mercado de casas prefabricadas y modulares en Chile, protegiendo a las familias de malas prácticas, contratos abusivos o constructoras sin respaldo técnico.",
  },
  {
    q: "¿Qué debo hacer si la constructora que me interesa aparece 'En revisión' o 'No verificada'?",
    a: "Te recomendamos extremar precauciones: nunca transfieras anticipos sin verificar la existencia de la fábrica, exige siempre contrato notarial con hitos de pago contra avance y solicita asesoramiento gratuito con nuestros especialistas a través del formulario de esta página antes de firmar.",
  },
  {
    q: "¿Tiene algún costo el servicio de asesoramiento para el comprador?",
    a: "No. El asesoramiento técnico y la orientación para compradores es 100% gratuito. Nuestro objetivo es ayudarte a evaluar presupuestos (valor UF/m² real), especificaciones de materiales y cláusulas contractuales.",
  },
  {
    q: "¿Qué garantías exige la ley chilena para una casa prefabricada?",
    a: "La Ley General de Urbanismo y Construcciones (LGUC) establece garantías irrenunciables: 10 años por fallas que afecten la estructura de la vivienda, 5 años por fallas de elementos constructivos o instalaciones, y 3 años por terminaciones o acabados.",
  },
  {
    q: "¿Cómo puede una empresa constructora solicitar su verificación?",
    a: "Las empresas interesadas pueden postular su verificación enviando sus antecedentes a contacto@solocasaschile.com o suscribiéndose a los planes comerciales para iniciar el proceso de auditoría técnica.",
  },
];

export default function VerificacionEmpresasConstructorasPage() {
  // Schema.org JSON-LD para SEO enriquecido
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://solocasaschile.com/verificacion-de-empresas-constructoras",
        "url": "https://solocasaschile.com/verificacion-de-empresas-constructoras",
        "name": "Verificación de Empresas Constructoras en Chile | SoloCasasChile",
        "description": "Auditoría técnica independiente y criterios de confianza para constructoras de casas prefabricadas en Chile.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://solocasaschile.com" },
            { "@type": "ListItem", "position": 2, "name": "Constructoras", "item": "https://solocasaschile.com/constructoras" },
            { "@type": "ListItem", "position": 3, "name": "Verificación de empresas constructoras", "item": "https://solocasaschile.com/verificacion-de-empresas-constructoras" },
          ],
        },
      },
      {
        "@type": "Service",
        "name": "Auditoría y Verificación de Empresas Constructoras",
        "provider": {
          "@type": "Organization",
          "name": "SoloCasasChile",
          "url": "https://solocasaschile.com",
        },
        "areaServed": "CL",
        "serviceType": "Verificación técnica de constructoras de casas prefabricadas",
        "description": "Validación de personería jurídica, capacidades constructivas y cumplimiento normativo para fabricantes de viviendas en Chile.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_VERIFICACION.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/constructoras"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al directorio de constructoras
        </Link>

        {/* ── 1. Hero Header ────────────────────────────────────────────── */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal/20 bg-brand-teal/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-teal shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Auditoría Técnica y Transparencia
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
            Verificación de empresas <br className="hidden sm:block" />
            <span className="gradient-text">constructoras en Chile</span>
          </h1>

          <p className="max-w-3xl text-lg sm:text-xl font-medium leading-relaxed text-muted-foreground">
            <strong>SoloCasasChile no es una constructora.</strong> Somos una plataforma independiente que audita la identidad legal, capacidad operativa y antecedentes técnicos de las empresas de casas prefabricadas y modulares para que construyas con seguridad.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#asesoria"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#073E48]/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#27D8BE]" />
              Solicitar Asesoramiento Gratuito
            </a>
            <a
              href="#criterios"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border border-border/60 hover:bg-muted/30 text-foreground font-bold text-xs uppercase tracking-wider transition-all"
            >
              Ver Criterios de Auditoría
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── 2. Estados de Confianza (Sellos) ─────────────────────────── */}
        <section className="mb-20 space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
              Niveles de Auditoría
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Estados de verificación y sellos visibles
            </h2>
            <p className="text-sm font-medium text-muted-foreground max-w-2xl">
              Identifica fácilmente el grado de validación técnica de cada constructora presente en el catálogo de SoloCasasChile:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ESTADOS_AUDITORIA.map((estado, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 space-y-3 shadow-sm hover:border-brand-teal/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                      estado.badgeClass
                    )}
                  >
                    {estado.label}
                  </span>
                  <span className="text-xs font-black text-muted-foreground opacity-40">#{idx + 1}</span>
                </div>
                <h3 className="font-heading text-lg font-black text-foreground">
                  {estado.titulo}
                </h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-muted-foreground">
                  {estado.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Criterios de Auditoría Técnica ────────────────────────── */}
        <section id="criterios" className="mb-20 space-y-8 scroll-mt-32">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
              Metodología de Validación
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              ¿Qué auditamos en cada empresa constructora?
            </h2>
            <p className="text-sm font-medium text-muted-foreground max-w-2xl">
              Cada parámetro es evaluado rigurosamente antes de otorgar una certificación activa en nuestra plataforma:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CRITERIOS_VIGENTES.map((crit, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border/60 bg-card p-6 space-y-4 shadow-sm hover:border-brand-teal/30 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <crit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-base font-black text-foreground">
                    {crit.title}
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                    {crit.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/40 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Requisito obligatorio
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. SECCIÓN ESPECIAL: EMPRESA NO VERIFICADA + ASESORÍA ────── */}
        <section id="asesoria" className="mb-24 space-y-12 scroll-mt-32">
          <div className="rounded-[3rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-background p-8 sm:p-12 space-y-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/40 pb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Alerta para Cotizantes
                </div>
                <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                  ¿La constructora que te interesa no está verificada?
                </h2>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-muted-foreground">
                  Si una empresa figura con estado <strong>&quot;No verificada&quot;</strong> o <strong>&quot;Perfil en revisión&quot;</strong>, no significa necesariamente que cometa irregularidades, pero sí implica que aún no ha acreditado su respaldo técnico, financiero o legal en nuestra plataforma.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-2xl p-5 shrink-0 max-w-xs space-y-2 text-xs font-medium text-muted-foreground shadow-sm">
                <p className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> ¿Por qué es riesgoso?
                </p>
                <p>El 78% de los reclamos en el rubro ocurren por pagos adelantados sin boleta de garantía o contratos sin especificaciones técnicas.</p>
              </div>
            </div>

            {/* 3 Riesgos principales */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2 rounded-2xl bg-background/60 p-5 border border-border/40">
                <div className="font-black text-xs uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 1. Pagos sin Respaldo
                </div>
                <h3 className="font-bold text-sm text-foreground">Anticipos no garantizados</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Muchas empresas exigen el 50% o más de pie sin boleta de garantía bancaria ni póliza de seguro de cumplimiento.
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-background/60 p-5 border border-border/40">
                <div className="font-black text-xs uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 2. Incumplimiento de Plazo
                </div>
                <h3 className="font-bold text-sm text-foreground">Retrasos sin indemnización</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contratos sin multas por día de atraso o cláusulas ambiguas de fuerza mayor que dejan desprotegido al comprador.
                </p>
              </div>

              <div className="space-y-2 rounded-2xl bg-background/60 p-5 border border-border/40">
                <div className="font-black text-xs uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 3. Mala Aislación Térmica
                </div>
                <h3 className="font-bold text-sm text-foreground">Problemas de habitabilidad</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paneles SIP con densidad insuficiente o maderas sin secado en cámara que provocan deformaciones y condensación interior.
                </p>
              </div>
            </div>

            {/* Asesoramiento Especializado */}
            <div className="pt-4 space-y-6">
              <div className="space-y-2 text-center max-w-xl mx-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal">
                  Protege tu Inversión
                </span>
                <h3 className="font-heading text-2xl font-black tracking-tight text-foreground">
                  Te asesoramos de forma personalizada y sin costo
                </h3>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Un especialista de SoloCasasChile revisará contigo el presupuesto, las especificaciones y los antecedentes de la constructora antes de cualquier pago.
                </p>
              </div>

              {/* Formulario de Asesoramiento */}
              <FormularioAsesoramiento />
            </div>
          </div>
        </section>

        {/* ── 5. FAQ SEO ──────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
              Preguntas Frecuentes
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Dudas habituales sobre verificación de constructoras
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS_VERIFICACION.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-border/60 bg-card p-6 cursor-pointer transition-all open:border-brand-teal/40"
              >
                <summary className="flex items-center justify-between font-black text-sm list-none gap-4">
                  <span className="text-foreground">{faq.q}</span>
                  <span className="text-brand-teal font-black text-lg transition-transform group-open:rotate-45 shrink-0">
                    +
                  </span>
                </summary>
                <p className="pt-4 text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed border-t border-border/40 mt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 6. Disclaimer de Independencia ──────────────────────────── */}
        <div className="mt-16 rounded-3xl border border-border/40 bg-muted/20 p-6 text-center space-y-2">
          <p className="text-xs font-bold text-foreground">
            SoloCasasChile · Entidad Independiente de Auditoría y Comparación de Viviendas
          </p>
          <p className="text-[11px] text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            La información y sellos de verificación emitidos representan una auditoría técnica documental a la fecha de publicación. Recomendamos a todos los usuarios formalizar siempre contratos ante notario público y verificar antecedentes en terreno.
          </p>
        </div>
      </div>
    </main>
  );
}
