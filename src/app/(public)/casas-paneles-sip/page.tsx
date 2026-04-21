import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-paneles-sip";

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
};

export default async function CasasPanelesSipPage() {
  const sipModels = await getModelosFiltered({ tipo: "sip" });
  const topSip = sipModels.slice(0, 8);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="container max-w-6xl mx-auto px-6 md:px-12 space-y-8">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cluster tecnologico</p>
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
          Casas Paneles SIP en Chile
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Esta pagina concentra la demanda de casas SIP y paneles SIP. Su foco es explicar beneficios reales del sistema y derivar a modelos con intencion de cotizacion.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/50 p-5 bg-card/40">
            <p className="text-sm font-black">Aislacion termica</p>
            <p className="text-sm text-muted-foreground mt-2">Reduce consumo energetico y mejora confort en climas frios y templados.</p>
          </div>
          <div className="rounded-2xl border border-border/50 p-5 bg-card/40">
            <p className="text-sm font-black">Rapidez constructiva</p>
            <p className="text-sm text-muted-foreground mt-2">Plazos mas cortos frente a obra tradicional, con menor variacion en terreno.</p>
          </div>
          <div className="rounded-2xl border border-border/50 p-5 bg-card/40">
            <p className="text-sm font-black">Consistencia tecnica</p>
            <p className="text-sm text-muted-foreground mt-2">Componentes industrializados y performance mas predecible.</p>
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
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-12">
        <h2 className="text-2xl font-black tracking-tight mb-6">Modelos SIP destacados</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {topSip.map((model) => (
            <article key={model.id} className="rounded-2xl border border-border/50 p-5 bg-card/40">
              <h3 className="text-lg font-black tracking-tight">{model.nombre}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Desde {model.precio_desde_uf} UF · {model.superficie_m2} m2
              </p>
              <Link href={`/modelo/${model.slug}`} className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-primary">
                Ver detalle
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
