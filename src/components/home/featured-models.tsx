import { getModelosFiltered } from "@/lib/supabase/services";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bed, Bath, Square, ArrowRight, Star } from "lucide-react";

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  "modular": "Modular",
  "steel-framing": "Steel Framing",
};

export async function FeaturedModelsSection() {
  const models = await getModelosFiltered({});
  // Filtrar modelos de Constructora Master (ID: cb85b919-4008-46bc-bbb8-b3211152280c)
  const masterId = 'cb85b919-4008-46bc-bbb8-b3211152280c';
  const featured = models.filter(m => m.constructora_id === masterId).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl space-y-4">
             <Badge variant="outline" className="border-primary/20 text-primary uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
                Lo más nuevo
             </Badge>
             <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none">
               Últimos Modelos de <span className="text-brand-indigo text-nowrap">Constructora Master</span>
             </h2>
             <p className="text-muted-foreground text-xl font-medium max-w-xl">
               Diseños de vanguardia con los más altos estándares de eficiencia y arquitectura en Chile.
             </p>
          </div>
          <Link 
            href="/catalogo" 
            className={cn(buttonVariants({ size: "lg" }), "rounded-2xl font-bold uppercase tracking-widest bg-brand-indigo shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white hover:text-white")}
          >
            Ver Catálogo Completo
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {featured.map((modelo, i) => (
            <div 
              key={modelo.id}
              className="group relative flex flex-col bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] overflow-hidden hover:shadow-[0_48px_100px_-24px_rgba(27,0,136,0.15)] hover:-translate-y-2 transition-all duration-700"
            >
               {/* Image Area */}
               <div className="relative h-72 overflow-hidden shrink-0">
                  <Image 
                    src={modelo.imagenes_urls?.[0] || '/hero.png'}
                    alt={modelo.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={i < 2} // Preload the first few models for LCP
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                     <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-4 py-1.5 font-bold tracking-widest uppercase rounded-full">
                       {TIPO_LABELS[modelo.tipo] || modelo.tipo}
                     </Badge>
                  </div>

                  {modelo.constructora?.plan === "premium" && (
                    <div className="absolute top-6 right-6">
                       <div className="bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-2xl">
                          <Star className="w-3 h-3 fill-current" /> Premium
                       </div>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-8">
                     <p className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">Desde</p>
                     <p className="text-white text-3xl font-black tracking-tighter">
                       {modelo.precio_desde_uf.toLocaleString("es-CL")} <span className="text-sm font-medium ml-1">UF</span>
                     </p>
                  </div>
               </div>

               {/* Info Area */}
               <div className="p-10 flex flex-col flex-1 items-start">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-6 h-6 rounded-full border border-border/40 bg-muted overflow-hidden relative grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <Image 
                          src={modelo.constructora?.logo_url || '/placeholder.png'} 
                          alt={modelo.constructora?.nombre}
                          fill
                          sizes="24px"
                          className="object-contain p-0.5"
                        />
                     </div>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                       {modelo.constructora?.nombre}
                     </span>
                  </div>

                  <h3 className="text-2xl font-heading font-black tracking-tight text-foreground mb-8 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {modelo.nombre}
                  </h3>

                  <div className="grid grid-cols-3 gap-6 w-full border-t border-border/40 pt-8 mt-auto">
                     <div className="flex flex-col gap-1.5">
                        <Square className="w-4 h-4 text-brand-teal opacity-60" />
                        <span className="text-lg font-black tracking-tight text-foregroundLeading">{modelo.superficie_m2}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none">m² totales</span>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <Bed className="w-4 h-4 text-brand-indigo opacity-60" />
                        <span className="text-lg font-black tracking-tight text-foregroundLeading">{modelo.dormitorios}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none">dormitorios</span>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <Bath className="w-4 h-4 text-primary opacity-60" />
                        <span className="text-lg font-black tracking-tight text-foregroundLeading">{modelo.banos}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none">baños</span>
                     </div>
                  </div>

                  <Link
                    href={`/modelo/${modelo.slug}`}
                    className={cn(buttonVariants({ size: "lg" }), "w-full mt-10 rounded-2xl font-black tracking-wider text-sm uppercase bg-brand-indigo shadow-xl shadow-brand-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-7 text-white hover:text-white")}
                  >
                    Detalles Técnicos <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
