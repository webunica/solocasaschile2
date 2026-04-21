import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-modulares";

const FAQS = [
  {
    question: "Que diferencia hay entre casa modular y prefabricada tradicional?",
    answer:
      "La modular suele ensamblarse con volumenes de mayor avance en fabrica, lo que reduce tiempos de montaje y variabilidad en terreno.",
  },
  {
    question: "Las casas modulares son aptas para uso permanente?",
    answer:
      "Si. Existen soluciones modulares para primera vivienda y segunda vivienda, segun especificaciones del proyecto y constructora.",
  },
  {
    question: "Como comparar modelos modulares?",
    answer:
      "Conviene revisar m2, programa, plazo de entrega, terminaciones y rango de UF antes de pasar a cotizacion.",
  },
];

export const metadata: Metadata = {
  title: "Casas Modulares en Chile | Modelos, Diferencias y Precios",
  description:
    "Conoce casas modulares en Chile, compara modelos y revisa diferencias frente a otros sistemas prefabricados para tomar una mejor decision.",
  keywords: [
    "casas modulares",
    "casas modulares chile",
    "precio casas modulares",
    "casas prefabricadas modulares",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Casas Modulares en Chile | SolocasasChile",
    description: "Pagina pilar para capturar demanda de casas modulares en Chile.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://solocasaschile.com/og-image.jpg", width: 1200, height: 630, alt: "Casas modulares en Chile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Modulares en Chile | SolocasasChile",
    description: "Compara modelos modulares y revisa diferencias frente a otros sistemas prefabricados.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default async function CasasModularesPage() {
  const modularModels = await getModelosFiltered({ tipo: "modular" });
  const topModular = modularModels.slice(0, 9);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Casas modulares", url: PAGE_URL },
  ]);
  const faqJsonLd = buildFAQJsonLd(FAQS);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modelos de casas modulares en Chile",
    itemListElement: topModular.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: model.nombre,
      url: `https://solocasaschile.com/modelo/${model.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background pt-36 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />

      <section className="container max-w-6xl mx-auto px-6 md:px-12">
        <div className="rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-brand-teal/10 via-background to-brand-teal/5 p-8 md:p-12 space-y-7">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nueva oportunidad</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">Casas Modulares en Chile</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Landing enfocada en capturar demanda modular con una propuesta clara de comparacion y conversion a cotizacion.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/50 p-5 bg-card/50">
              <h2 className="text-lg font-black tracking-tight">Modular vs prefabricada tradicional</h2>
              <p className="text-sm text-muted-foreground mt-2">
                El sistema modular prioriza ensamblaje de volumenes casi terminados para reducir tiempos y mejorar control de calidad.
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 p-5 bg-card/50">
              <h2 className="text-lg font-black tracking-tight">Objetivo comercial</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Convertir trafico de investigacion en solicitudes de contacto con modelos concretos y constructoras activas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/catalogo?tipo=modular" className="rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
              Ver modulares
            </Link>
            <Link href="/casas-prefabricadas" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Pilar principal
            </Link>
            <Link href="/modelos-casas-prefabricadas" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Ver modelos
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-14">
        <h2 className="text-2xl font-black tracking-tight mb-6">Modelos modulares destacados</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topModular.map((model) => (
            <article key={model.id} className="rounded-2xl border border-border/50 p-5 bg-card/40">
              <h3 className="text-lg font-black tracking-tight">{model.nombre}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Desde {model.precio_desde_uf} UF · {model.superficie_m2} m2 · {model.dormitorios} dormitorios
              </p>
              <Link href={`/modelo/${model.slug}`} className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-primary">
                Ver modelo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 md:px-12 mt-16">
        <h2 className="text-2xl font-black tracking-tight mb-6">Preguntas frecuentes modulares</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border/50 bg-card/30 p-5">
              <summary className="cursor-pointer text-sm font-black tracking-tight">{faq.question}</summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
