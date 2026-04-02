import { getConstructoraBySlug, getModelsByConstructoraId } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, Star, MapPin, 
  Calendar, Briefcase, ChevronRight,
  Bed, Bath, Square, ArrowRight
} from "lucide-react";
import type { Metadata } from "next";
import { ShareActions } from "@/components/ui/share-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const constructora = await getConstructoraBySlug(slug);
  return {
    title: constructora ? `${constructora.nombre} | Constructora en SolocasasChile` : "Constructora no encontrada",
    description: constructora?.descripcion || `Descubre los modelos de casas prefabricadas de ${constructora?.nombre}.`,
    openGraph: {
      title: constructora ? `${constructora.nombre} | Constructora en SolocasasChile` : "Constructora no encontrada",
      description: constructora?.descripcion || "",
      images: constructora?.logo_url ? [constructora.logo_url] : [],
      type: "profile"
    }
  };
}

export const revalidate = 3600; // Recalculate at most once per hour

import { StructuredData } from "@/components/seo/structured-data";

export default async function ConstructoraPage({ params }: PageProps) {
  const { slug } = await params;
  const constructora = await getConstructoraBySlug(slug);
  if (!constructora) notFound();

  const modelos = await getModelsByConstructoraId(constructora.id);

  // Fallbacks for data from DB
  const logo = constructora.logo_url || '/placeholder.png';
  const score = constructora.score_confianza || 50;
  const coverImage = constructora.image_url || '/recursos/hero-bg.jpg';
  const fundacion = constructora.anio_fundacion || '2020';
  const proyectos = constructora.proyectos_completados || 10;
  const reviews = constructora.total_reviews || 0;
  const regiones = Array.isArray(constructora.regiones) ? constructora.regiones : [];

  return (
    <div className="min-h-screen bg-background pt-20">
      <StructuredData 
        type="RealEstateAgent" 
        data={{
          name: constructora.nombre,
          image: logo,
          description: constructora.descripcion,
          url: `https://solocasaschile.com/constructora/${constructora.slug}`
        }} 
      />
      {/* Header / Banner area */}
      <div className="relative h-72 md:h-[450px] w-full overflow-hidden">
        <Image 
          src={coverImage} 
          alt={constructora.nombre}
          fill
          sizes="100vw"
          className="object-cover opacity-60 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="container relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 w-full text-center md:text-left">
            <div className="relative w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-background bg-card shadow-2xl shrink-0 group hover:scale-105 transition-transform duration-500 flex items-center justify-center p-6 bg-white">
               <Image src={logo} alt={constructora.nombre} fill sizes="(max-width: 768px) 160px, 160px" priority className="object-contain p-6" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none italic">{constructora.nombre}</h1>
                <div className="flex gap-2">
                  {constructora.verificada && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase rounded-full">
                      <ShieldCheck className="w-4 h-4 mr-2" /> Verificada
                    </Badge>
                  )}
                  {constructora.plan === "premium" && (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1.5 font-black text-[10px] tracking-widest uppercase rounded-full">
                      <Star className="w-4 h-4 mr-2 fill-current" /> Premium
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                <span className="flex items-center gap-2 font-bold"><Calendar className="w-4 h-4 text-primary" /> Desde {fundacion}</span>
                <span className="flex items-center gap-2 font-bold"><Briefcase className="w-4 h-4 text-primary" /> {proyectos}+ Terminadas</span>
                <span className="flex items-center gap-2 font-bold"><MapPin className="w-4 h-4 text-primary" /> {regiones.length} Regiones</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <ShareActions title={constructora.nombre} url={`/constructora/${constructora.slug}`} />
               <Button size="lg" className="rounded-3xl h-16 px-12 font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 bg-brand-indigo border-none hover:scale-105 active:scale-95 transition-all">
                  Contactar Pro
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          {/* Main content */}
          <div className="space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Sobre la Constructora</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {constructora.descripcion}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(constructora.badges || ['Eficiencia Energética', 'Garantía 5 años']).map((badge: string) => (
                  <Badge key={badge} variant="outline" className="text-xs py-1 px-3 border-border/60">
                    {badge}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Models Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold">Modelos Disponibles</h2>
                <span className="text-muted-foreground text-sm">{modelos.length} modelos publicados</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {modelos.map((modelo: any) => (
                  <Link key={modelo.id} href={`/modelo/${modelo.slug}`} className="group">
                    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg h-full flex flex-col">
                      <div className="relative h-44 w-full bg-muted flex items-center justify-center">
                        {modelo.imagenes_urls?.[0] ? (
                          <Image src={modelo.imagenes_urls[0]} alt={modelo.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="opacity-20 flex flex-col items-center gap-2">
                             <Square className="w-8 h-8" />
                             <span className="text-[8px] font-bold uppercase">Sin Imagen</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                           <p className="text-white font-bold text-sm">desde {modelo.precio_desde_uf?.toLocaleString('es-CL')} UF</p>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                         <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{modelo.nombre}</h3>
                         <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {modelo.superficie_m2}m²</span>
                            <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {modelo.dormitorios} dorms</span>
                            <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {modelo.banos} baños</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mt-2">
                            Ver detalles <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Stats */}
          <aside className="space-y-6">
             <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Score de Confianza</h3>
                <div className="flex items-center justify-between mb-4">
                   <div className="text-4xl font-bold text-primary">{score}</div>
                   <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase opacity-70">Posición</div>
                      <div className="font-bold text-foreground">Top 10%</div>
                   </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reseñas</span>
                      <span className="font-semibold">{reviews}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tiempo de Resp.</span>
                      <span className="font-semibold">&lt; 24h</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Certificaciones</span>
                      <span className="font-semibold text-emerald-500">Al día</span>
                   </div>
                </div>
                <Button variant="outline" className="w-full mt-6 border-primary/20 hover:bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest">Ver Certificaciones</Button>
             </div>

             <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-primary/60">
                  <MapPin className="w-4 h-4 text-primary" /> Cobertura
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {regiones.map((region: string) => (
                    <Badge key={region} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{region}</Badge>
                  ))}
                </div>
             </div>

             <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                   Especialidades
                </h3>
                <div className="space-y-2">
                   {(constructora.tipos_construccion || ['prefabricadas', 'SIP']).map((tipo: string) => (
                     <div key={tipo} className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/60 capitalize">
                        <span>{tipo.replace('-', ' ')}</span>
                        <ChevronRight className="w-4 h-4 text-primary/40" />
                     </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
