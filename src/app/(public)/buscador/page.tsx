import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { ModelSearchBar } from "@/components/modelos/model-search-bar";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { CatalogoSkeleton } from "@/components/catalogo/catalogo-skeleton";
import { buildBreadcrumbJsonLd } from "@/components/seo/structured-data";
import { Search, ArrowRight, Home, Bed, Bath, Square } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscador de Modelos de Casas Prefabricadas | SolocasasChile",
  description:
    "Filtra modelos de casas por dormitorios, baños, metros cuadrados y tipo de construcción. Encuentra el modelo ideal para tu parcela o proyecto en Chile.",
  keywords: [
    "buscador casas prefabricadas chile",
    "buscar casa por dormitorios",
    "filtrar modelos casas chile",
    "casas 2 dormitorios chile",
    "casas 3 dormitorios prefabricadas",
  ],
  alternates: {
    canonical: "/buscador",
  },
};

interface PageProps {
  searchParams: Promise<{
    dormitorios?: string;
    banos?: string;
    m2min?: string;
    m2max?: string;
    tipo?: string;
    uso?: string;
  }>;
}

const STATS = [
  { icon: <Home className="w-5 h-5" />, label: "Modelos verificados", value: "7+" },
  { icon: <Bed className="w-5 h-5" />,  label: "Hasta 4 dormitorios", value: "1–4" },
  { icon: <Bath className="w-5 h-5" />, label: "Opciones de baños",   value: "1–3" },
  { icon: <Square className="w-5 h-5" />, label: "Rango de superficie", value: "74–120 m²" },
];

export default async function BuscadorPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const dormitorios = params.dormitorios ? parseInt(params.dormitorios) : undefined;
  const banosMin    = params.banos        ? parseInt(params.banos)       : undefined;
  const superficieMin = params.m2min     ? parseInt(params.m2min)        : undefined;
  const superficieMax = params.m2max     ? parseInt(params.m2max)        : undefined;
  const tipo          = params.tipo;
  const uso           = params.uso;

  const hasFilters = dormitorios || banosMin || superficieMin || superficieMax || tipo || uso;

  const modelos = hasFilters
    ? await getModelosFiltered({ dormitorios, banosMin, superficieMin, superficieMax, tipo, uso })
    : [];

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Inicio",    url: "https://solocasaschile.com" },
    { name: "Buscador",  url: "https://solocasaschile.com/buscador" },
  ]);

  // Reconstruct initial values for client SearchBar hydration
  const initialValues = {
    dormitorios,
    banos: banosMin,
    superficieMin,
    superficieMax,
    tipo,
    uso,
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: copy */}
          <div className="space-y-6 lg:pt-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">
                Buscador de modelos
              </p>
              <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter leading-[0.95] text-foreground">
                Encuentra tu{" "}
                <span className="gradient-text">casa ideal</span>
              </h1>
              <p className="text-muted-foreground text-lg mt-4 max-w-md leading-relaxed">
                Filtra por dormitorios, baños, metros cuadrados y tipo de
                construcción. Te mostramos los modelos que más se ajustan a lo
                que necesitas.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-4"
                >
                  <span className="text-primary">{s.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                    <p className="text-sm font-black text-foreground">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: search bar */}
          <div>
            <ModelSearchBar
              initialValues={{
                dormitorios: initialValues.dormitorios,
                banos: initialValues.banos,
                superficieMin: initialValues.superficieMin,
                superficieMax: initialValues.superficieMax,
                tipo: initialValues.tipo,
                uso: initialValues.uso,
              }}
              targetPath="/buscador"
            />
          </div>
        </div>
      </section>

      {/* ── Resultados ───────────────────────────────────────────────────── */}
      {hasFilters && (
        <section className="container max-w-7xl mx-auto px-6 md:px-12 mt-20">
          {/* Resultado header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-black tracking-tight text-foreground">
                {modelos.length > 0 ? (
                  <>
                    {modelos.length}{" "}
                    {modelos.length === 1 ? "modelo encontrado" : "modelos encontrados"}
                  </>
                ) : (
                  "Sin resultados"
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Basado en los filtros seleccionados
              </p>
            </div>
            <Link
              href="/buscador"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
            >
              Limpiar filtros
            </Link>
          </div>

          <Suspense fallback={<CatalogoSkeleton />}>
            {modelos.length > 0 ? (
              <CatalogoGrid modelos={modelos} />
            ) : (
              /* Empty state */
              <div className="rounded-[2.5rem] border border-border/40 bg-card/40 p-12 md:p-20 text-center space-y-6">
                <div className="text-5xl">🏠</div>
                <div>
                  <h3 className="text-2xl font-heading font-black tracking-tight">
                    No encontramos modelos con esos filtros
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    Prueba ajustando la cantidad de dormitorios o el rango de
                    superficie para ver más opciones.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/buscador"
                    className="rounded-2xl border border-border px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors"
                  >
                    Limpiar filtros
                  </Link>
                  <Link
                    href="/catalogo"
                    className="rounded-2xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Ver catálogo completo
                  </Link>
                </div>
              </div>
            )}
          </Suspense>
        </section>
      )}

      {/* ── CTA cuando no hay filtros ─────────────────────────────────────── */}
      {!hasFilters && (
        <section className="container max-w-7xl mx-auto px-6 md:px-12 mt-20">
          <div className="rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-10 md:p-16 text-center space-y-6">
            <Search className="w-10 h-10 text-primary/40 mx-auto" />
            <div>
              <h2 className="text-2xl font-heading font-black tracking-tight">
                Usa los filtros para encontrar tu modelo
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Selecciona cuántos dormitorios, baños y metros cuadrados
                necesitas. Te mostramos los modelos que mejor se adaptan.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3 text-xs font-black uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Explorar catálogo completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
