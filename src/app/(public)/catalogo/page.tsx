import { getModelosFiltered, getFeaturedModelsByRegion } from "@/lib/supabase/services";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { FeaturedSlider } from "@/components/catalogo/featured-slider";
import { CatalogoFilters } from "@/components/catalogo/catalogo-filters";
import { CatalogoEmpty } from "@/components/catalogo/catalogo-empty";
import { CatalogoControls } from "@/components/catalogo/catalogo-controls";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { getRegionDisplayName } from "@/lib/regions";
import type { TipoModelo } from "@/lib/mock-data";
import { CatalogoSkeleton } from "@/components/catalogo/catalogo-skeleton";
import { StructuredData, buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/components/seo/structured-data";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Casas Prefabricadas, SIP y Modulares en Chile | SolocasasChile",
  description: "Compara más de 1.500 modelos de casas prefabricadas, SIP, modulares y container en Chile. Filtra por región, precio y número de dormitorios. Constructoras verificadas.",
  keywords: [
    "casas prefabricadas chile",
    "catalogo casas prefabricadas",
    "casas sip chile precios",
    "casas modulares chile",
    "casas container chile",
    "comprar casa prefabricada",
    "constructoras casas prefabricadas",
  ],
  alternates: {
    canonical: "/catalogo",
  },
};

interface PageProps {
  searchParams: Promise<{ 
    tipo?: string; 
    min?: string; 
    max?: string; 
    region?: string;
    sort?: string;
  }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tipoFilter = params.tipo as TipoModelo | undefined;
  const regionFilter = params.region;
  const minUF = params.min ? parseInt(params.min) : undefined;
  const maxUF = params.max ? parseInt(params.max) : undefined;
  const sortBy = params.sort;

  // Resolve region display name for slider label using the shared utility
  const regionLabel = getRegionDisplayName(regionFilter);
  const tipoLabel = tipoFilter
    ? tipoFilter
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : null;
  const breadcrumbItems = [
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Catalogo", url: "https://solocasaschile.com/catalogo" },
    ...(regionLabel ? [{ name: regionLabel, url: `https://solocasaschile.com/catalogo?region=${regionFilter}` }] : []),
    ...(tipoLabel ? [{ name: tipoLabel, url: `https://solocasaschile.com/catalogo?tipo=${tipoFilter}` }] : []),
  ];

  // Real fetch from Supabase
  const [modelos, featuredModels] = await Promise.all([
    getModelosFiltered({ tipo: tipoFilter, minUF, maxUF, region: regionFilter, sortBy }),
    getFeaturedModelsByRegion(regionFilter)
  ]);

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Canonical dinámico: si hay filtro de tipo, apunta a la landing dedicada */}
      {tipoFilter && (
        <link
          rel="canonical"
          href={`https://solocasaschile.com/tipos/${tipoFilter}`}
        />
      )}
      {modelos.length > 0 && (
        <StructuredData 
          type="ItemList" 
          data={buildItemListJsonLd(
            modelos.map(m => ({
              name: m.nombre,
              url: `https://solocasaschile.com/modelo/${m.slug}`,
              image: m.imagenes_urls?.[0],
              description: m.descripcion || m.tipo || undefined
            }))
          )} 
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbItems)) }}
      />
      <div className="border-b bg-card/40 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
               <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-foreground">
                 Casas <span className="gradient-text">Prefabricadas</span>
                 <span className="block text-3xl md:text-4xl text-muted-foreground font-medium tracking-tight mt-2">SIP · Modulares · Container · Chile</span>
               </h1>
               <p className="text-muted-foreground font-medium text-lg max-w-md">
                 Compara {modelos.length} modelos verificados listos para construir en Chile.
               </p>
            </div>
            
            <CatalogoControls 
              tipo={tipoFilter} 
              region={regionFilter} 
              min={minUF} 
              max={maxUF} 
              sort={sortBy} 
            />
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* 1. Featured Slider - Full Width of Container */}
        {featuredModels.length > 0 && (
          <FeaturedSlider models={featuredModels} regionLabel={regionLabel} />
        )}

        {/* 2. Main Content: Filters + Grid */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-72 shrink-0" aria-label="Filtros del catálogo">
            <div className="sticky top-32">
               <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem]" />}>
                 <CatalogoFilters
                   currentTipo={tipoFilter}
                   currentRegion={regionFilter}
                   currentMin={minUF}
                   currentMax={maxUF}
                 />
               </Suspense>
            </div>
          </aside>

          {/* Catalog Main */}
          <main className="flex-1 min-w-0" aria-label="Resultados del catálogo">
            <Suspense fallback={<CatalogoSkeleton />}>
               <div className="space-y-12">
                 {modelos.length > 0 ? (
                   <CatalogoGrid modelos={modelos} />
                 ) : (
                   <div className="py-12 lg:py-20">
                      <CatalogoEmpty />
                   </div>
                 )}
               </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
