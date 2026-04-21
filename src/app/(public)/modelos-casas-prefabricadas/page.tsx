import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/modelos-casas-prefabricadas";

const FAQS = [
  {
    question: "Como elegir un modelo de casa prefabricada?",
    answer:
      "Define presupuesto, metraje y programa (dormitorios, banos), luego compara sistema constructivo y tiempo de entrega antes de cotizar.",
  },
  {
    question: "Los precios publicados son finales?",
    answer:
      "Los valores son referenciales para comparacion inicial. El valor final depende de terminaciones, region, fundaciones e instalaciones.",
  },
  {
    question: "Puedo filtrar por tipo de sistema?",
    answer:
      "Si. Puedes filtrar por SIP, modular y otros tipos para encontrar modelos que calcen con tu objetivo.",
  },
];

export const metadata: Metadata = {
  title: "Modelos de Casas Prefabricadas en Chile | Catalogo y Precios",
  description:
    "Explora modelos de casas prefabricadas en Chile y compara superficie, dormitorios y precio estimado para avanzar a cotizacion.",
  keywords: [
    "modelos casas prefabricadas",
    "modelos de casas prefabricadas chile",
    "planos casas prefabricadas",
    "precios casas prefabricadas chile",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Modelos de Casas Prefabricadas | SolocasasChile",
    description: "Pagina pilar orientada a modelos, comparacion y conversion.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://solocasaschile.com/og-image.jpg", width: 1200, height: 630, alt: "Modelos de casas prefabricadas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modelos de Casas Prefabricadas | SolocasasChile",
    description: "Compara metraje, dormitorios y precio por modelo antes de cotizar.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default async function ModelosCasasPrefabricadasPage() {
  const models = await getModelosFiltered({});
  const topModels = models.slice(0, 12);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Modelos casas prefabricadas", url: PAGE_URL },
  ]);
  const faqJsonLd = buildFAQJsonLd(FAQS);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modelos de casas prefabricadas",
    itemListElement: topModels.map((model, index) => ({
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
        <div className="rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-brand-indigo/10 via-background to-brand-indigo/5 p-8 md:p-12 space-y-7">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cluster transaccional</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">Modelos de Casas Prefabricadas</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Landing de comparacion comercial: metraje, dormitorios, precio referencial y acceso rapido a cotizacion por modelo.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/catalogo?tipo=sip" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Filtrar SIP
            </Link>
            <Link href="/catalogo?tipo=modular" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Filtrar modulares
            </Link>
            <Link href="/catalogo?sort=price_asc" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Menor precio
            </Link>
            <Link href="/catalogo" className="rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
              Catalogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-14">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topModels.map((model) => (
            <article key={model.id} className="rounded-2xl border border-border/50 p-5 bg-card/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{model.tipo}</p>
              <h2 className="text-lg font-black tracking-tight mt-2">{model.nombre}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {model.superficie_m2} m2 · {model.dormitorios} dorm · {model.banos} banos
              </p>
              <p className="text-sm font-bold mt-2">Desde {model.precio_desde_uf} UF</p>
              <Link href={`/modelo/${model.slug}`} className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-primary">
                Revisar modelo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container max-w-5xl mx-auto px-6 md:px-12 mt-16">
        <h2 className="text-2xl font-black tracking-tight mb-6">Preguntas frecuentes</h2>
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
