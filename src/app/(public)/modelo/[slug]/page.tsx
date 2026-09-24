import { getModelBySlug, getModelsByConstructoraId, getSellosDeConstructora } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CotizarModal } from "@/components/modelo/cotizar-modal";
import { ImageGallery } from "@/components/ui/image-gallery";
import { StickyCTAMobile } from "@/components/modelo/sticky-cta-mobile";
import { cn, getYoutubeEmbedUrl } from "@/lib/utils";
import { SellosGrid } from "@/components/constructora/sellos-grid";
import { Clock, ShieldCheck, Star, ArrowLeft, MessageSquare, Zap, Building2, TrendingUp, FileDown } from "lucide-react";
import { FichaExpandida } from "@/components/modelo/ficha-expandida";
import { IncluyeNoIncluye } from "@/components/modelo/incluye-no-incluye";
import { ModeloPlano } from "@/components/modelo/modelo-plano";
import { buildModelJsonLd, buildFAQJsonLd, StructuredData } from "@/components/seo/structured-data";
import { FichaViewTracker } from "@/components/modelo/ficha-view-tracker";
import type { Metadata } from "next";
import type { Testimonio } from "@/components/dashboard/testimonios-manager";

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
  madera: "Madera",
  hormigon: "Hormigón",
  sociales: "Casas Sociales",
  otro: "Otro Sistema",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  if (!modelo) return { title: "Modelo no encontrado" };
  const imagenPrincipal = modelo.imagenes_urls?.[0];
  const tipoLabel = TIPO_LABELS[modelo.tipo] || 'Prefabricada';
  const descripcion = modelo.descripcion
    ? modelo.descripcion.slice(0, 155)
    : `Casa ${tipoLabel} de ${modelo.superficie_m2}m², ${modelo.dormitorios} dormitorios y ${modelo.banos} baños. Desde ${modelo.precio_desde_uf} UF. Constructora verificada en Chile.`;

  const pageTitle = `${modelo.nombre} | Casa ${tipoLabel} en Chile | SolocasasChile`;

  return {
    title: pageTitle,
    description: descripcion,
    keywords: [
      modelo.nombre,
      `casa ${tipoLabel.toLowerCase()} chile`,
      `casas ${tipoLabel.toLowerCase()}s chile`,
      `casa ${tipoLabel.toLowerCase()} ${modelo.superficie_m2}m2`,
      'casas prefabricadas chile',
      modelo.constructora?.nombre || '',
    ].filter(Boolean),
    alternates: { canonical: `https://solocasaschile.com/modelo/${slug}` },
    openGraph: {
      title: pageTitle,
      description: descripcion,
      url: `https://solocasaschile.com/modelo/${slug}`,
      images: imagenPrincipal ? [{ url: imagenPrincipal, width: 1200, height: 630, alt: `${modelo.nombre} — Casa ${tipoLabel} Chile` }] : [],
      type: 'website',
      locale: 'es_CL',
      siteName: 'SolocasasChile',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@solocasaschile',
      title: pageTitle,
      description: descripcion,
      images: imagenPrincipal ? [imagenPrincipal] : [],
    },
  };
}

export default async function ModeloPage({ params }: PageProps) {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  
  if (!modelo) {
    notFound();
  }

  const constructora = modelo.constructora || { id: 'unknown', nombre: 'Constructora', logo_url: '/placeholder.png', score_confianza: 0 };
  const precio = modelo.precio_desde_uf || 0;
  const imagenes = modelo.imagenes_urls || [];
  const relatedModels = await getModelsByConstructoraId(constructora.id);
  const otherModels = relatedModels.filter((m: { id: string }) => m.id !== modelo.id).slice(0, 3);
  const hasOtherModels = otherModels.length > 0;
  const construccion = modelo.construccion;
  const planoUrl = typeof construccion?.plano_url === "string" ? construccion.plano_url : null;
  
  const sellos = await getSellosDeConstructora(constructora.id);
  const maxSellosTotales = 2;
  const scoreConfianza = Math.max(10, Math.min(100, Math.round((sellos.length / maxSellosTotales) * 100)));

  return (
    <div className="min-h-screen bg-background relative pt-16 md:pt-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQJsonLd([
            {
              question: `¿Cuánto cuesta el modelo ${modelo.nombre}?`,
              answer: modelo.precio_desde_uf > 0 
                ? `El precio referencial del modelo ${modelo.nombre} comienza desde las ${modelo.precio_desde_uf} UF en Chile. Este valor puede variar según la región de instalación y las terminaciones elegidas.`
                : `Para conocer el precio actualizado del modelo ${modelo.nombre}, puedes solicitar una cotización directa a ${constructora.nombre} a través de nuestro portal.`
            },
            {
              question: `¿Qué dimensiones tiene la casa ${modelo.nombre}?`,
              answer: `El modelo ${modelo.nombre} cuenta con una superficie de ${modelo.superficie_m2} m², distribuidos en ${modelo.dormitorios} dormitorios y ${modelo.banos} baños. Es un diseño de tipo ${TIPO_LABELS[modelo.tipo] || 'prefabricada'}.`
            },
            {
              question: `¿Quién construye el modelo ${modelo.nombre}?`,
              answer: `Este modelo es diseñado y construido por ${constructora.nombre}, una empresa verificada en SolocasasChile con cobertura en ${constructora.regiones?.join(', ') || 'diversas regiones de Chile'}.`
            }
          ])),
        }}
      />
      
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

      <FichaViewTracker
        modelId={modelo.id}
        modelName={modelo.nombre}
        constructoraId={constructora.id}
        constructoraName={constructora.nombre}
        tipo={modelo.tipo}
        precioUf={precio}
      />
      
      <StickyCTAMobile 
        modeloId={modelo.id}
        modeloNombre={modelo.nombre}
        constructoraId={constructora.id}
        constructoraNombre={constructora.nombre}
      />
      
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
                       <Badge variant="outline" className="border-teal-300 text-teal-800 font-black text-[9px] tracking-widest uppercase bg-teal-100 px-3 py-1 rounded-full animate-pulse">
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
                      <div className="space-y-1">
                        <p className="text-3xl md:text-4xl font-black tracking-tight text-foreground">A consultar</p>
                        <p className="text-xs font-bold text-muted-foreground">Cotización a medida según terreno y región</p>
                      </div>
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

                    {typeof construccion?.pdf_url === "string" && (
                      <a
                        href={construccion.pdf_url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full rounded-2xl h-14 font-black uppercase tracking-[0.15em] border border-border/80 hover:border-brand-indigo hover:bg-brand-indigo/5 text-foreground hover:text-brand-indigo flex items-center justify-center text-xs gap-2 transition-all group/btn shadow-sm"
                      >
                        <FileDown className="w-4 h-4 text-brand-indigo group-hover/btn:scale-110 transition-transform" />
                        Descargar Ficha en PDF
                      </a>
                    )}

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
        {/* We use flex-col for mobile and order- classes to ensure Sidebar comes BEFORE Related Designs in mobile stack */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-start">
           <div className="space-y-24 order-1 min-w-0">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <h1 className="text-2xl md:text-4xl font-heading font-black tracking-tight text-foreground leading-[1.15]">{modelo.nombre}</h1>
                    <p className="text-sm md:text-base text-[#4285F4] font-bold tracking-tight">
                       Casa {TIPO_LABELS[modelo.tipo] || 'Modelo'} de {modelo.superficie_m2} m² | {modelo.dormitorios} dormitorios | {modelo.banos} baños
                       {modelo.tiempo_entrega && ` | Entrega en ${modelo.tiempo_entrega.toLowerCase().includes('día') ? modelo.tiempo_entrega : `${modelo.tiempo_entrega} días`}`}
                    </p>
                 </div>
                 <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-4xl border-l-[4px] border-brand-indigo/10 pl-6 whitespace-pre-line">
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

                {/* Testimonios del Modelo (Social Proof) */}
                {(() => {
                  const testimonios = (constructora.testimonios as Testimonio[] | null) || [];
                  // Show testimonials for this specific model OR general ones
                  const modelTestimonios = testimonios.filter(t => t.modelo_id === modelo.id || t.modelo_id === 'general' || !t.modelo_id);
                  
                  if (modelTestimonios.length === 0) return null;

                  return (
                    <div className="space-y-8 py-12 border-t border-border/40">
                       <div className="space-y-2">
                         <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight italic">Testimonios Verificados</h2>
                         <p className="text-muted-foreground text-sm font-medium">Experiencias construyendo con {constructora.nombre}</p>
                       </div>
                       
                       <div className="relative">
                          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                             {modelTestimonios.map((t, i) => (
                               <div key={i} className="min-w-[280px] md:min-w-[320px] bg-card border border-border/40 rounded-[2rem] p-6 space-y-4 shadow-sm hover:shadow-lg transition-all duration-300 group snap-center">
                                  <div className="flex gap-1">
                                     {[...Array(5)].map((_, starI) => (
                                       <Star key={starI} className={cn("w-3.5 h-3.5", t.estrellas > starI ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
                                     ))}
                                  </div>
                                  <p className="text-sm md:text-base font-medium italic leading-relaxed text-foreground/90 line-clamp-4">&ldquo;{t.texto}&rdquo;</p>
                                  <div className="pt-2 flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center font-black text-brand-indigo text-sm">
                                        {t.nombre.charAt(0)}
                                     </div>
                                     <div>
                                        <p className="font-black text-sm leading-tight">{t.nombre}</p>
                                        {t.cargo && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{t.cargo}</p>}
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </div>
                      </div>
                    </div>
                  );
                })()}

               <ModeloPlano
                 planoUrl={planoUrl}
                 recintos={modelo.recintos}
                 superficie={modelo.superficie_m2}
                 dimensiones={typeof construccion?.dimensiones === "string" ? construccion.dimensiones : null}
                 pdfUrl={typeof construccion?.pdf_url === "string" ? construccion.pdf_url : null}
                 nombreModelo={modelo.nombre}
               />
               
               {modelo.video_url && getYoutubeEmbedUrl(modelo.video_url) && (
                 <div className="space-y-10">
                    <h2 className="text-3xl font-heading font-black tracking-tight">Tour Virtual</h2>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-card shadow-2xl">
                       <iframe
                          src={getYoutubeEmbedUrl(modelo.video_url)!}
                          title={`Tour virtual: ${modelo.nombre}`}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                        />
                    </div>
                 </div>
               )}
            </div>

            {/* Sidebar Sticky Form - order-2 in mobile means it comes AFTER the main column content but BEFORE anything after the grid */}
            <div className="sticky top-40 space-y-12 order-2">
               {/* Constructora Spotlight with Score */}
               <div className="bg-card border border-border/40 rounded-[3rem] p-8 space-y-6 shadow-xl shadow-brand-indigo/5 hover:border-brand-indigo/30 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-brand-indigo/5 to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col items-center text-center space-y-5 relative z-10 pt-2">
                     <div className="relative w-32 h-32 flex items-center justify-center mb-2 group">
                        {/* Dynamic Circular Graph */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm transition-all duration-1000">
                           <circle cx="64" cy="64" r="60" className="stroke-muted/30 fill-none" strokeWidth="4" />
                           <circle cx="64" cy="64" r="60" className="stroke-brand-indigo fill-none transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray="376.99" strokeDashoffset={376.99 - (376.99 * scoreConfianza) / 100} strokeLinecap="round" />
                        </svg>
                        
                        {/* Logo inside circle */}
                        {constructora.logo_url && (
                            <div className="relative w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center p-3 shadow-inner shadow-black/5 overflow-hidden z-10 border border-border/40 group-hover:scale-105 transition-transform">
                               <Image src={constructora.logo_url} width={80} height={80} alt={constructora.nombre} className="w-full h-auto max-h-[80px] object-contain" />
                            </div>
                        )}
                        
                        {/* Score Badge */}
                        <div className="absolute -bottom-3 bg-brand-indigo text-white font-black text-[12px] rounded-full px-4 py-1 shadow-xl z-20 border-[3px] border-background animate-in slide-in-from-bottom-2 fade-in duration-500">
                           {scoreConfianza}% Confianza
                        </div>
                     </div>

                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-1.5"><Building2 className="w-3 h-3" /> Construido por</p>
                        <h3 className="text-2xl font-black">{constructora.nombre}</h3>
                     </div>
                  </div>

                  {sellos.length > 0 && (
                     <div className="bg-brand-indigo/5 border border-brand-indigo/10 rounded-[2rem] p-6 space-y-4 relative z-10">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-indigo/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-brand-indigo">Insignias Obtenidas</p>
                           <Badge variant="outline" className="border-indigo-300 text-indigo-800 bg-indigo-100 text-[9px] px-2 h-5 rounded-full font-black">
                              {sellos.length} / {maxSellosTotales} completadas
                           </Badge>
                        </div>
                        <SellosGrid sellos={sellos.slice(0, 4)} compact />
                     </div>
                  )}

                  <Link 
                     href={`/constructora/${constructora.slug}`}
                     className="relative z-10 flex items-center justify-center w-full rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest hover:bg-brand-indigo hover:text-white transition-all border border-brand-indigo/20 text-brand-indigo shadow-sm"
                  >
                     Ver Perfil y {sellos.length > 4 ? `+${sellos.length - 4}` : 'Más'} Insignias →
                  </Link>
               </div>

               <IncluyeNoIncluye modelo={modelo} isSidebar className="mb-4" />

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
                           <MessageSquare className="w-4 h-4 mr-2" /> Solicitar cotización
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

        {/* Otros diseños destacados moved OUTSIDE the main grid to ensure it's at the VERY bottom in mobile stack */}
        {hasOtherModels && (
           <div className="space-y-12 pt-16 border-t border-border/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <h2 className="text-3xl font-heading font-black tracking-tight">Otros diseños de {constructora.nombre}</h2>
                 <Link href={`/constructora/${constructora.slug}`} className="text-xs font-black uppercase tracking-widest text-brand-indigo hover:underline">Ver catálogo completo →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {otherModels.map((m) => (
                  <Link key={m.id} href={`/modelo/${m.slug}`} className="group space-y-4">
                     <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-indigo/5">
                        <Image src={m.imagenes_urls?.[0] || '/placeholder.png'} fill alt={m.nombre} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-tight group-hover:text-brand-indigo transition-colors">{m.nombre}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <span>{m.superficie_m2}m²</span>
                           <span>•</span>
                           <span>{m.dormitorios} Dorm</span>
                        </div>
                     </div>
                  </Link>
                ))}
              </div>
           </div>
         )}

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
