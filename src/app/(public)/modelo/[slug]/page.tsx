import { getModelBySlug, getModelsByConstructoraId } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CotizarForm } from "@/components/constructora/cotizar-form";
import { CotizarModal } from "@/components/modelo/cotizar-modal";
import { ImageGallery } from "@/components/ui/image-gallery";
import { StickyCTAMobile } from "@/components/modelo/sticky-cta-mobile";
import { cn, getYoutubeEmbedUrl } from "@/lib/utils";
import { Bed, Bath, Square, Clock, ShieldCheck, Star, ArrowLeft, MessageSquare, Zap, Video, Building2, Package, TrendingUp } from "lucide-react";
import { FichaExpandida } from "@/components/modelo/ficha-expandida";
import { IncluyeNoIncluye } from "@/components/modelo/incluye-no-incluye";
import { ModeloPlano } from "@/components/modelo/modelo-plano";
import { buildModelJsonLd, buildBreadcrumbJsonLd, StructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  "modular": "Modular",
  "steel-framing": "Steel Framing",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  if (!modelo) return { title: "Modelo no encontrado" };
  return { title: `${modelo.nombre} | SolocasasChile` };
}

export default async function ModeloPage({ params }: PageProps) {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  if (!modelo) notFound();

  const constructora = modelo.constructora || { id: 'unknown', nombre: 'Constructora', logo_url: '/placeholder.png', score_confianza: 0 };
  const precio = modelo.precio_desde_uf || 0;
  const score = constructora.score_confianza || 0;
  const imagenes = modelo.imagenes_urls || [];
  const relatedModels = await getModelsByConstructoraId(constructora.id);
  const otherModels = relatedModels.filter(m => m.id !== modelo.id).slice(0, 3);
  const hasOtherModels = otherModels.length > 0;

  return (
    <div className="min-h-screen bg-background relative pt-16 md:pt-24 font-sans">
      <StructuredData
        type="House"
        data={buildModelJsonLd({
          nombre: modelo.nombre,
          descripcion: modelo.descripcion,
          imagenes_urls: imagenes,
          precio_desde_uf: precio,
          superficie_m2: modelo.superficie_m2,
          dormitorios: modelo.dormitorios,
          banos: modelo.banos,
          slug: modelo.slug,
          constructora: { nombre: constructora.nombre, logo_url: constructora.logo_url }
        })}
      />
      
      <StickyCTAMobile targetId="form-cotizar" />
      
      <div className="border-b bg-background/95 backdrop-blur-3xl sticky top-20 md:top-32 z-[80]">
        <div className="container max-w-screen-2xl mx-auto px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
          <Link href="/catalogo" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Explorar Catálogo
          </Link>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-4 md:px-12 py-8 md:py-16 overflow-x-hidden space-y-12">
        
        {/* TOP ROW: Gallery + Price Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
           <ImageGallery
              images={imagenes.length > 0 ? imagenes : ['/placeholder.png']}
              altBase={modelo.nombre || 'Modelo'}
              videoUrl={modelo.video_url}
           />

           <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 space-y-8 relative overflow-hidden group/price">
                 <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-indigo/10 group-hover/price:bg-brand-indigo transition-colors" />
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Presupuesto Referencial</p>
                       <Badge variant="outline" className="border-brand-teal/20 text-brand-teal font-black text-[9px] tracking-widest uppercase bg-brand-teal/5 px-3 py-1 rounded-full animate-pulse">
                          Disponibilidad Real
                       </Badge>
                    </div>
                    
                    {precio > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-black tracking-tighter text-foreground leading-none">{precio.toLocaleString("es-CL")}</span>
                          <span className="text-2xl font-black text-brand-indigo">UF</span>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">{(precio / (modelo.superficie_m2 || 1)).toFixed(2)} UF/m²</p>
                      </div>
                    ) : (
                      <p className="text-3xl font-black tracking-tight text-muted-foreground">Consultar precio</p>
                    )}

                    <div className="grid grid-cols-3 gap-2 border-t border-b border-border/40 py-6">
                       <div className="text-center space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Superficie</p>
                          <p className="text-sm font-black">{modelo.superficie_m2}m²</p>
                       </div>
                       <div className="text-center space-y-1 border-x border-border/40 px-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Dorm</p>
                          <p className="text-sm font-black">{modelo.dormitorios}</p>
                       </div>
                       <div className="text-center space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Baños</p>
                          <p className="text-sm font-black">{modelo.banos}</p>
                       </div>
                    </div>

                    {/* Modal Trigger for Pricing Card */}
                    <CotizarModal
                       modeloId={modelo.id}
                       modeloNombre={modelo.nombre}
                       constructoraId={constructora.id}
                       constructoraNombre={constructora.nombre}
                       trigger={
                          <Button size="lg" variant="secondary" className="w-full rounded-2xl h-16 font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-teal/20 flex items-center justify-center text-xs">
                             <MessageSquare className="w-4 h-4 mr-2" /> Solicitar Cotización
                          </Button>
                       }
                    />

                    <CotizarModal
                       modeloId={modelo.id}
                       modeloNombre={modelo.nombre}
                       constructoraId={constructora.id}
                       constructoraNombre={constructora.nombre}
                       trigger={
                          <button className="block w-full text-brand-indigo font-black text-[10px] uppercase tracking-widest hover:underline text-center">
                             Ver otros formatos →
                          </button>
                       }
                    />
                 </div>
              </div>

              <div className="bg-muted/10 border border-border/40 rounded-[2rem] p-6 flex items-center gap-4 transition-colors hover:bg-muted/20">
                 <div className="w-10 h-10 rounded-full bg-brand-indigo/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-indigo" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-foreground/90 leading-tight">{modelo.visitas || 39} personas vieron este diseño hoy</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Alta demanda</p>
                 </div>
              </div>
           </div>
        </div>

        {/* MIDDLE ROW: Info Header + Specs + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-start">
           <div className="space-y-24">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-foreground leading-[0.9]">{modelo.nombre}</h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-bold tracking-tight opacity-80">
                       Casa {TIPO_LABELS[modelo.tipo] || 'Modelo'} de {modelo.superficie_m2} m² | {modelo.dormitorios} dormitorios | {modelo.banos} baños
                       {modelo.tiempo_entrega && ` | Entrega en ${modelo.tiempo_entrega} días`}
                    </p>
                 </div>
                 <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-[1.4] max-w-4xl border-l-[6px] border-brand-indigo/10 pl-8">
                   {modelo.descripcion || 'Diseño de concepto abierto, amplio y eficiente.'}
                 </p>
                 <div className="flex flex-wrap gap-4 pt-4">
                    {[
                      { icon: <Zap className="w-4 h-4" />, text: "Eficiencia térmica" },
                      { icon: <Clock className="w-4 h-4" />, text: "Entrega rápida" },
                      { icon: <TrendingUp className="w-4 h-4" />, text: "Diseño premium" },
                      { icon: <ShieldCheck className="w-4 h-4" />, text: "Certificado" }
                    ].map((badge, i) => (
                      <Badge key={i} variant="outline" className="border-border/60 text-foreground font-black text-[10px] tracking-widest uppercase px-6 py-3 rounded-2xl flex items-center gap-3 bg-card/50">
                         {badge.icon} {badge.text}
                      </Badge>
                    ))}
                 </div>
              </div>

              <FichaExpandida modelo={modelo} />

               {/* Related Designs */}
               <div className="space-y-10">
                  <h2 className="text-3xl font-heading font-black tracking-tight">Otros diseños destacados</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {(hasOtherModels ? otherModels : []).map((m: any) => (
                      <Link key={m.id} href={`/modelo/${m.slug}`} className="group">
                         <div className="relative aspect-video rounded-[1.5rem] overflow-hidden shadow-xl mb-4">
                            <Image src={m.imagenes_urls?.[0] || '/placeholder.png'} fill alt={m.nombre} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                         </div>
                         <h4 className="text-sm font-black tracking-tight group-hover:text-brand-indigo transition-colors">{m.nombre}</h4>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{m.superficie_m2}m²</p>
                      </Link>
                    ))}
                  </div>
               </div>

              <ModeloPlano planoUrl={(modelo as any).construccion?.plano_url} recintos={(modelo as any).recintos} superficie={modelo.superficie_m2} />
              
              {modelo.video_url && getYoutubeEmbedUrl(modelo.video_url) && (
                <div className="space-y-10">
                   <h2 className="text-3xl font-heading font-black tracking-tight">Tour Virtual</h2>
                   <div className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-card shadow-2xl">
                      <iframe src={getYoutubeEmbedUrl(modelo.video_url)!} className="absolute inset-0 w-full h-full" allowFullScreen />
                   </div>
                </div>
              )}
           </div>

           {/* Sidebar Sticky Form */}
           <div className="sticky top-40 space-y-12">
              <div className="bg-card border border-brand-indigo/10 rounded-[3rem] p-10 flex flex-col gap-8 items-center text-center shadow-xl shadow-brand-indigo/5">
                 <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="56" cy="56" r="50" className="stroke-muted-foreground/10 fill-none" strokeWidth="10" />
                       <circle cx="56" cy="56" r="50" className="stroke-brand-indigo fill-none" strokeWidth="10" strokeDasharray="314.16" strokeDashoffset={314.16 - (314.16 * (score || 85)) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-brand-indigo">{score || 85}</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Confianza</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Sello de Calidad</h3>
                    <p className="text-sm text-muted-foreground font-medium px-4">Verificación técnica oficial.</p>
                 </div>
              </div>

               <div id="form-cotizar" className="bg-brand-indigo rounded-[3.5rem] p-12 text-white shadow-2xl shadow-brand-indigo/30 relative overflow-hidden text-center flex flex-col items-center gap-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 space-y-4">
                     <h3 className="text-2xl font-black tracking-tight leading-tight">¿Listo para cotizar tu casa?</h3>
                     <p className="text-sm font-medium opacity-80">Recibe una propuesta personalizada en menos de 24 horas.</p>
                  </div>
                  <CotizarModal
                     modeloId={modelo.id}
                     modeloNombre={modelo.nombre}
                     constructoraId={constructora.id}
                     constructoraNombre={constructora.nombre}
                     trigger={
                        <Button size="lg" variant="secondary" className="w-full rounded-2xl h-16 font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-teal/20 relative z-10">
                           <MessageSquare className="w-4 h-4 mr-2" /> Solicitar Asesoría
                        </Button>
                     }
                  />
                  <div className="relative z-10 grid grid-cols-3 gap-4 w-full pt-4 border-t border-white/10 opacity-60">
                     <div className="text-[8px] font-black uppercase tracking-widest flex flex-col items-center gap-1">
                        <Clock className="w-3 h-3" /> 24h
                     </div>
                     <div className="text-[8px] font-black uppercase tracking-widest flex flex-col items-center gap-1 border-x border-white/10">
                        <MessageSquare className="w-3 h-3" /> Sin compromiso
                     </div>
                     <div className="text-[8px] font-black uppercase tracking-widest flex flex-col items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                     </div>
                  </div>
               </div>
           </div>
        </div>

        <div className="bg-muted/10 border border-border/40 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 group">
           <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight">¿Deseas personalizar este diseño?</h2>
              <p className="text-muted-foreground text-lg font-medium max-w-xl">Adapta los planos según tus necesidades y terreno.</p>
           </div>
           <CotizarModal
              modeloId={modelo.id}
              modeloNombre={modelo.nombre}
              constructoraId={constructora.id}
              constructoraNombre={constructora.nombre}
              trigger={
                 <Button size="lg" variant="secondary" className="rounded-full px-12 h-20 text-lg font-black uppercase tracking-widest shadow-2xl shadow-brand-teal/20">
                    Conversar con Asesor
                 </Button>
              }
           />
        </div>

      </div>
    </div>
  );
}
