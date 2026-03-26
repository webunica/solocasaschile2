import { getModelosFiltered } from "@/lib/supabase/services";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { CatalogoFilters } from "@/components/catalogo/catalogo-filters";
import { CatalogoEmpty } from "@/components/catalogo/catalogo-empty";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Modelos | SolocasasChile",
  description: "Explora y compara más de 1.500 modelos de casas prefabricadas, SIP, container y llave en mano en Chile.",
};

interface PageProps {
  searchParams: Promise<{ tipo?: string; min?: string; max?: string; region?: string }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tipoFilter = params.tipo;
  const regionFilter = params.region;
  const minUF = params.min ? parseInt(params.min) : undefined;
  const maxUF = params.max ? parseInt(params.max) : undefined;

  // Real fetch from Supabase
  const modelos = await getModelosFiltered({
    tipo: tipoFilter,
    minUF,
    maxUF,
    region: regionFilter
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground">
                 Catálogo de <span className="gradient-text">Modelos</span>
               </h1>
               <p className="text-muted-foreground font-medium text-lg">
                 {modelos.length} modelos encontrados en tiempo real
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
               <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
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
          <main className="flex-1 min-w-0">
            <Suspense fallback={
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-[2.5rem]" />
                ))}
              </div>
            }>
               {modelos.length > 0 ? (
                 <CatalogoGrid modelos={modelos} />
               ) : (
                 <CatalogoEmpty />
               )}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
