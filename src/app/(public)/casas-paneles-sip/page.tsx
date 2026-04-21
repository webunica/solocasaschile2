import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-paneles-sip";

const FAQS = [
  {
    question: "Que ventajas tienen las casas SIP?",
    answer:
      "Destacan por su aislacion termica, mejor eficiencia energetica y buena velocidad de montaje en comparacion con obra tradicional.",
  },
  {
    question: "Una casa SIP sirve para zonas frias del sur de Chile?",
    answer:
      "Si. Es uno de los sistemas mas buscados en zonas frias por su comportamiento termico y capacidad de control de puentes de calor.",
  },
  {
    question: "Puedo comparar casas SIP de distintas constructoras?",
    answer:
      "Si. Puedes revisar modelos, metraje y rango de precio para evaluar alternativas antes de cotizar.",
  },
];

export const metadata: Metadata = {
  title: "Casas Paneles SIP en Chile | Modelos SIP y Ventajas",
  description:
    "Conoce modelos de casas paneles SIP en Chile, compara precios y revisa ventajas de aislacion, rapidez y eficiencia energetica.",
  keywords: [
    "casas paneles sip",
    "casas sip",
    "casas prefabricadas sip",
    "casas prefabricadas paneles sip",
    "panel sip chile",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Casas Paneles SIP en Chile | SolocasasChile",
    description: "Pagina pilar tecnologica para casas SIP en Chile.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://solocasaschile.com/og-image.jpg", width: 1200, height: 630, alt: "Casas paneles SIP en Chile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Paneles SIP en Chile | SolocasasChile",
    description: "Modelos SIP en Chile, ventajas tecnicas y comparacion por constructora.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default async function CasasPanelesSipPage() {
  const sipModels = await getModelosFiltered({ tipo: "sip" });
  const topSip = sipModels.slice(0, 8);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Casas paneles SIP", url: PAGE_URL },
  ]);
  const faqJsonLd = buildFAQJsonLd(FAQS);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modelos SIP en Chile",
    itemListElement: topSip.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://solocasaschile.com/modelo/${model.slug}`,
      name: model.nombre,
    })),
  };

  return (
    <div className="min-h-screen bg-background pt-36 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />

      <section className="container max-w-6xl mx-auto px-6 md:px-12">
        <div className="rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-brand-teal/10 via-background to-brand-indigo/10 p-8 md:p-12 space-y-7">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cluster tecnologico</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">Casas Paneles SIP en Chile</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Esta pagina concentra busquedas de tecnologia SIP y enlaza hacia modelos listos para evaluacion comercial.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-sm font-black">Aislacion termica</p>
              <p className="text-xs text-muted-foreground mt-2">Mejor confort y menor demanda energetica.</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-sm font-black">Rapidez constructiva</p>
              <p className="text-xs text-muted-foreground mt-2">Montaje mas predecible en terreno.</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-sm font-black">Escalabilidad</p>
              <p className="text-xs text-muted-foreground mt-2">Modelos de distinto metraje y configuracion.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogo?tipo=sip" className="rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
              Ver modelos SIP
            </Link>
            <Link href="/casas-prefabricadas" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Pilar principal
            </Link>
            <Link href="/modelos-casas-prefabricadas" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Pilar modelos
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-14">
        <h2 className="text-2xl font-black tracking-tight mb-6">Modelos SIP destacados</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topSip.map((model) => (
            <article key={model.id} className="rounded-2xl border border-border/50 p-5 bg-card/40">
              <h3 className="text-base font-black tracking-tight">{model.nombre}</h3>
              <p className="text-sm text-muted-foreground mt-2">Desde {model.precio_desde_uf} UF · {model.superficie_m2} m2</p>
              <Link href={`/modelo/${model.slug}`} className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-primary">
                Ver detalle
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 md:px-12 mt-16">
        <h2 className="text-2xl font-black tracking-tight mb-6">Preguntas frecuentes SIP</h2>
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
