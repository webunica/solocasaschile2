import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/modelos-casas-prefabricadas";

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
};

export default async function ModelosCasasPrefabricadasPage() {
  const models = await getModelosFiltered({});
  const topModels = models.slice(0, 12);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="container max-w-6xl mx-auto px-6 md:px-12 space-y-8">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cluster transaccional</p>
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
          Modelos de Casas Prefabricadas
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Pagina orientada a evaluacion comercial. Aqui el usuario compara m2, dormitorios, precio y tipo de sistema para pasar de interes a cotizacion.
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
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-12">
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
    </div>
  );
}
