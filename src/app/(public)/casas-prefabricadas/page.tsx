import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-prefabricadas";

const FAQS = [
  {
    question: "Cuanto cuestan las casas prefabricadas en Chile?",
    answer:
      "Depende del sistema, m2 y nivel de terminaciones. En SolocasasChile puedes comparar modelos por UF y pasar directo a cotizacion con constructoras verificadas.",
  },
  {
    question: "Que diferencia hay entre SIP, modular y prefabricada tradicional?",
    answer:
      "SIP destaca por aislacion y eficiencia, modular por rapidez de ensamblaje en terreno y prefabricada tradicional por variedad de configuraciones y precio.",
  },
  {
    question: "Puedo cotizar con mas de una constructora?",
    answer:
      "Si. El objetivo de la plataforma es comparar alternativas y cotizar con varias empresas para decidir con mejor informacion.",
  },
];

export const metadata: Metadata = {
  title: "Casas Prefabricadas en Chile | Modelos, Precios y Constructoras",
  description:
    "Compara casas prefabricadas en Chile, revisa modelos disponibles y conecta con constructoras verificadas para cotizar con mas claridad.",
  keywords: [
    "casas prefabricadas",
    "casas prefabricadas chile",
    "venta de casas prefabricadas",
    "prefabricadas chile",
    "constructoras casas prefabricadas",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Casas Prefabricadas en Chile | SolocasasChile",
    description: "Pagina pilar para comparar casas prefabricadas, modelos y constructoras verificadas en Chile.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [{ url: "https://solocasaschile.com/og-image.jpg", width: 1200, height: 630, alt: "Casas prefabricadas en Chile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Prefabricadas en Chile | SolocasasChile",
    description: "Compara modelos y constructoras de casas prefabricadas en Chile.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default async function CasasPrefabricadasPage() {
  const models = await getModelosFiltered({});
  const topModels = models.slice(0, 9);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Casas prefabricadas", url: PAGE_URL },
  ]);

  const faqJsonLd = buildFAQJsonLd(FAQS);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modelos de casas prefabricadas destacados",
    itemListElement: topModels.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: model.nombre,
      url: `https://solocasaschile.com/modelo/${model.slug}`,
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SolocasasChile",
    url: "https://solocasaschile.com",
    image: "https://solocasaschile.com/og-image.jpg",
    description: "Comparador de casas prefabricadas y constructoras en Chile.",
    telephone: "+56 9 6413 0601",
    address: { "@type": "PostalAddress", addressCountry: "CL" },
    areaServed: { "@type": "Country", name: "Chile" },
  };

  return (
    <div className="min-h-screen bg-background pt-36 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }} />

      <section className="container max-w-6xl mx-auto px-6 md:px-12">
        <div className="rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-brand-indigo/10 via-background to-brand-teal/10 p-8 md:p-12 space-y-7">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cluster principal</p>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">Casas Prefabricadas en Chile</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Pagina pilar para busqueda masiva: compara alternativas, entiende diferencias tecnicas y pasa a cotizacion con constructoras verificadas.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modelos</p>
              <p className="text-2xl font-black tracking-tight">{models.length}</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cobertura</p>
              <p className="text-2xl font-black tracking-tight">16 regiones</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/70 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Objetivo</p>
              <p className="text-2xl font-black tracking-tight">Cotizar mejor</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogo" className="rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
              Ver catalogo
            </Link>
            <Link href="/constructoras" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Ver constructoras
            </Link>
            <Link href="/casas-paneles-sip" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Casas SIP
            </Link>
            <Link href="/casas-modulares" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
              Casas modulares
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-14">
        <h2 className="text-2xl font-black tracking-tight mb-6">Modelos destacados</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topModels.map((model) => (
            <article key={model.id} className="rounded-2xl border border-border/50 p-5 bg-card/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{model.tipo}</p>
              <h3 className="text-lg font-black tracking-tight mt-2">{model.nombre}</h3>
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
