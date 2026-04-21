import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-modulares";

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
};

export default async function CasasModularesPage() {
  const modularModels = await getModelosFiltered({ tipo: "modular" });
  const topModular = modularModels.slice(0, 8);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="container max-w-6xl mx-auto px-6 md:px-12 space-y-8">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nueva oportunidad</p>
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
          Casas Modulares en Chile
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Esta pagina esta orientada a subir cobertura en busquedas de modulares y capturar demanda que hoy no se transforma por completo.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/50 p-5 bg-card/40">
            <h2 className="text-lg font-black tracking-tight">Modular vs prefabricada tradicional</h2>
            <p className="text-sm text-muted-foreground mt-2">
              El sistema modular prioriza ensamblaje de volumenes casi terminados, reduciendo tiempos de obra y variabilidad en terreno.
            </p>
          </div>
          <div className="rounded-2xl border border-border/50 p-5 bg-card/40">
            <h2 className="text-lg font-black tracking-tight">Objetivo comercial</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Convertir trafico de investigacion en cotizaciones, con enlaces directos a modelos y constructoras verificadas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/catalogo?tipo=modular" className="rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
            Ver modulares
          </Link>
          <Link href="/casas-prefabricadas" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
            Ir a pilar principal
          </Link>
          <Link href="/constructoras" className="rounded-xl border border-border px-5 py-3 text-xs font-black uppercase tracking-widest">
            Ver constructoras
          </Link>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto px-6 md:px-12 mt-12">
        <h2 className="text-2xl font-black tracking-tight mb-6">Modelos modulares destacados</h2>
        <div className="grid gap-4 md:grid-cols-2">
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
    </div>
  );
}
