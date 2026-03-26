import { CONSTRUCTORAS, MODELOS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, Star, Building2, MapPin, 
  Calendar, Briefcase, ChevronRight, ArrowLeft,
  Bed, Bath, Square, ArrowRight
} from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const constructora = CONSTRUCTORAS.find((c) => c.slug === slug);
  return {
    title: constructora ? `${constructora.nombre} | Perfil Constructora` : "Constructora no encontrada",
    description: constructora?.descripcion,
  };
}

export default async function ConstructoraPage({ params }: PageProps) {
  const { slug } = await params;
  const constructora = CONSTRUCTORAS.find((c) => c.slug === slug);
  if (!constructora) notFound();

  const modelos = MODELOS.filter((m) => m.constructoraId === constructora.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Banner area */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image 
          src={constructora.image} 
          alt={constructora.nombre}
          fill
          className="object-cover opacity-60 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="container relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full text-center md:text-left">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-card shadow-xl shrink-0">
               <Image src={constructora.logo} alt={constructora.nombre} fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-heading font-bold">{constructora.nombre}</h1>
                {constructora.verificada && (
                   <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                     <ShieldCheck className="w-3 h-3 mr-1" /> Verificada
                   </Badge>
                )}
                {constructora.plan === "premium" && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Premium
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground text-sm font-medium">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Fundada en {constructora.anioFundacion}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {constructora.proyectosCompletados}+ Proyectos</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {constructora.regiones.length} Regiones</span>
              </div>
            </div>
            <div className="flex gap-2">
               <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/25">Contactar</Button>
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
                {constructora.badges.map(badge => (
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
                {modelos.map((modelo) => (
                  <Link key={modelo.id} href={`/modelo/${modelo.slug}`} className="group">
                    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg h-full flex flex-col">
                      <div className="relative h-44 w-full">
                        <Image src={modelo.imagenes[0]} alt={modelo.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                           <p className="text-white font-bold text-sm">desde {modelo.precioDesdeUF.toLocaleString('es-CL')} UF</p>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                         <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{modelo.nombre}</h3>
                         <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {modelo.superficieM2}m²</span>
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
                   <div className="text-4xl font-bold text-primary">{constructora.scoreConfianza}</div>
                   <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase opacity-70">Posición</div>
                      <div className="font-bold text-foreground">Top 10%</div>
                   </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary" style={{ width: `${constructora.scoreConfianza}%` }} />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reseñas</span>
                      <span className="font-semibold">{constructora.reviews}</span>
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
                <Button variant="outline" className="w-full mt-6 border-primary/20 hover:bg-primary/5 text-primary">Ver Certificaciones</Button>
             </div>

             <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Cobertura
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {constructora.regiones.map(region => (
                    <Badge key={region} variant="secondary" className="bg-white/10 text-xs">{region}</Badge>
                  ))}
                </div>
             </div>

             <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                   Tipos de Construcción
                </h3>
                <div className="space-y-2">
                   {constructora.tiposConstruccion.map(tipo => (
                     <div key={tipo} className="flex items-center justify-between text-sm capitalize">
                        <span>{tipo.replace('-', ' ')}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
