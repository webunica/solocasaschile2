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
    <div className="min-h-screen bg-background pb-24 pt-32">
      {/* Header / Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-card/10 pb-20 pt-12">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-border/20 hidden lg:block" />
        
        {/* Subtle Andes Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] opacity-[0.04] pointer-events-none select-none z-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <path fill="currentColor" className="text-primary" d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,149.3C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
              Comparador de <br />
              <span className="gradient-text">Modelos</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              Analiza precio, superficie y score de confianza <span className="text-foreground font-bold">lado a lado</span> para tomar una decisión técnica e inteligente.
            </p>
          </div>
        </div>
      </section>
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
