import { getModelsByIds } from "@/lib/supabase/services";
import { ComparadorTable } from "@/components/comparador/comparador-table";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparador de Modelos | SolocasasChile",
  description: "Compara hasta 3 modelos de casas prefabricadas lado a lado. Precios, specs, constructora y score de confianza.",
};

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function CompararPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const idsParam = params.ids?.split(",").filter(Boolean).slice(0, 3) ?? [];
  
  // Real fetch from Supabase
  const modelos = await getModelsByIds(idsParam);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter mb-2">
            Comparador de <span className="gradient-text">Modelos</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl">
            Lado a lado, analiza precio, superficie y el ranking de confianza de cada constructora para tomar la mejor decisión.
          </p>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
        {modelos.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6 bg-muted/20 border-2 border-dashed border-border rounded-[3rem] px-4">
            <div className="text-6xl animate-bounce">⚖️</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Selecciona al menos 2 modelos</h3>
              <p className="text-muted-foreground max-w-md mx-auto font-medium">
                Navega por el catálogo comercial, selecciona los modelos que te interesen y utiliza la barra flotante inferior para contrastarlos aquí.
              </p>
            </div>
            <Link href="/catalogo" className={buttonVariants({ variant: "default", size: "lg", className: "rounded-2xl font-black text-[10px] tracking-widest uppercase brand-gradient shadow-xl" })}>
              Ir al Catálogo de Modelos
            </Link>
          </div>
        ) : (
          <ComparadorTable modelos={modelos} />
        )}
      </div>
    </div>
  );
}
