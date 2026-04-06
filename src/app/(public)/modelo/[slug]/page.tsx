import { getModelBySlug, getModelsByConstructoraId } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CotizarForm } from "@/components/constructora/cotizar-form";
import { ImageGallery } from "@/components/ui/image-gallery";
import { StickyCTAMobile } from "@/components/modelo/sticky-cta-mobile";
import { cn } from "@/lib/utils";
import { Bed, Bath, Square, Clock, ShieldCheck, Star, ArrowLeft, MessageSquare, Zap, Video, Building2, Package, TrendingUp } from "lucide-react";
import { PriceNotify } from "@/components/modelo/price-notify";
import { FichaExpandida } from "@/components/modelo/ficha-expandida";
import { PruebaSocial } from "@/components/modelo/prueba-social";
import { ModeloResumenHero } from "@/components/modelo/modelo-resumen-hero";
import { FichaTecnicaCompleta } from "@/components/modelo/ficha-tecnica-completa";
import { IncluyeNoIncluye } from "@/components/modelo/incluye-no-incluye";
import { ModeloPlano } from "@/components/modelo/modelo-plano";
import { ScoreInfoModal } from "@/components/modelo/score-info-modal";
import { DynamicUrgency } from "@/components/ui/dynamic-urgency";
import type { Metadata } from "next";


interface PageProps {
  params: Promise<{ slug: string }>;
}

import { buildModelJsonLd, buildBreadcrumbJsonLd, StructuredData } from "@/components/seo/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const modelo = await getModelBySlug(slug);
    if (!modelo) return { title: "Modelo no encontrado | SolocasasChile" };

    const m = modelo as any; // includes extended fields from DB
    const baseUrl = 'https://solocasaschile.com';

    const title = m.seo_title || `${m.nombre} | Casa ${TIPO_LABELS[m.tipo] || m.tipo} en Chile | SolocasasChile`;
    const description = m.seo_description || m.descripcion?.substring(0, 160) || `Cotiza el modelo ${m.nombre} en SolocasasChile.`;
    const ogImage = m.seo_og_image || (m.imagenes_urls?.[0]) || `${baseUrl}/og-image.jpg`;
    const canonical = m.canonical_url || `${baseUrl}/modelo/${m.slug}`;
    const keywords = m.seo_keywords?.length ? m.seo_keywords.join(', ') : `${m.nombre}, casa prefabricada chile, ${m.tipo} chile`;

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: m.nombre }],
        type: "article",
        locale: "es_CL",
        siteName: "SolocasasChile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return { title: "Modelo | SolocasasChile" };
  }
}

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  "modular": "Modular",
  "steel-framing": "Steel Framing",
};

export const revalidate = 3600; // Recalculate at most once per hour

import { ShareActions } from "@/components/ui/share-actions";
import { getYoutubeEmbedUrl } from "@/lib/utils";

export default async function ModeloPage({ params }: PageProps) {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  if (!modelo) notFound();

  // Robust data extraction
  const constructora = modelo.constructora || {
    id: 'unknown',
    nombre: 'Constructora no disponible',
    slug: 'unknown',
    logo_url: '/placeholder.png',
    score_confianza: 0,
    verificada: false,
    plan: 'gratis'
  };

  const precio = typeof modelo.precio_desde_uf === 'number' ? modelo.precio_desde_uf : 0;
  const score = typeof constructora.score_confianza === 'number' ? constructora.score_confianza : 0;
  const imagenes = Array.isArray(modelo.imagenes_urls) ? modelo.imagenes_urls : [];

  const relatedModels = await getModelsByConstructoraId(constructora.id);
  const otherModels = relatedModels.filter(m => m.id !== modelo.id).slice(0, 3);
  const hasOtherModels = otherModels.length > 0;

  return (
    <div className="min-h-screen bg-background relative pt-16 md:pt-24">
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
          pisos: (modelo as any).pisos,
          tiempo_entrega: modelo.tiempo_entrega,
          garantia_anos: modelo.garantia_anos,
          recintos: (modelo as any).recintos,
          tipo: modelo.tipo,
          uso: (modelo as any).uso,
          terminaciones: (modelo as any).terminaciones,
          aislacion: (modelo as any).aislacion,
          slug: modelo.slug,
          constructora: constructora ? {
            nombre: constructora.nombre,
            sitio_web: (constructora as any).sitio_web,
            logo_url: constructora.logo_url,
          } : null,
        })}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd([
            { name: "Inicio", url: "https://solocasaschile.com" },
            { name: "Catálogo", url: "https://solocasaschile.com/catalogo" },
            { name: modelo.nombre, url: `https://solocasaschile.com/modelo/${modelo.slug}` },
          ])),
        }}
      />
      <StickyCTAMobile targetId="form-cotizar" />
      
      {/* Breadcrumb / Back button */}
      <div className="border-b bg-background/95 backdrop-blur-3xl sticky top-20 md:top-32 z-[80]">
        <div className="container max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Explorar Catálogo
          </Link>

          <ShareActions 
            title={modelo.nombre || 'Modelo de Casa'} 
            url={`/modelo/${modelo.slug}`} 
          />
        </div>
      </div>

      <div className="container max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 md:px-12 py-8 md:py-16 overflow-x-hidden">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-12 lg:gap-24 items-start w-full">
          
          {/* Main Content (Left) */}
          <div className="space-y-12 md:space-y-16">
            {/* Gallery with Lightbox */}
            <ImageGallery
              images={imagenes.length > 0 ? imagenes : ['/placeholder.png']}
              altBase={modelo.nombre || 'Modelo'}
            />

            {/* Header Content */}
            <div className="space-y-6">
               <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-brand-indigo text-white border-none rounded-full px-4 py-1.5 font-bold tracking-widest uppercase shadow-lg shadow-primary/20">
                    {TIPO_LABELS[modelo.tipo] || modelo.tipo || 'Casa'}
                  </Badge>
                  {constructora.plan === "premium" && (
                    <Badge variant="outline" className="border-amber-500/20 text-amber-600 font-bold tracking-widest uppercase bg-amber-500/5 px-4 py-1.5 rounded-full">
                       <Star className="w-3 h-3 mr-2 fill-current" /> Destacado
                    </Badge>
                  )}
               </div>
               
               <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground leading-tight md:leading-[0.9] overflow-visible w-full break-normal">
                 {modelo.nombre}
               </h1>

               <ModeloResumenHero modelo={modelo} className="pt-2" />

               <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-[0.8rem] md:rounded-[1.5rem] border-2 border-primary/20 bg-primary/5 flex items-center justify-center p-2 md:p-3 shrink-0">
                     <Image 
                        src={constructora.logo_url || '/placeholder.png'} 
                        alt={constructora.nombre || 'Logo'} 
                        width={48} height={48} 
                        priority
                        className="object-contain"
                     />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 truncate">Constructora Certificada</p>
                     <Link
                        href={`/constructora/${constructora.slug || 'unknown'}`}
                        className="text-lg md:text-2xl font-black text-brand-indigo hover:text-brand-teal transition-colors tracking-tight block truncate"
                     >
                        {constructora.nombre}
                     </Link>
                  </div>
               </div>

               {/* Dedicated Mobile Price/Action Bar (Shows only on mobile) */}
               <div className="lg:hidden bg-card/80 backdrop-blur-3xl border border-primary/10 rounded-[2rem] p-5 space-y-5 shadow-xl shadow-primary/5 relative z-10 w-full overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Precio desde</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black tracking-tighter text-foreground">
                             {precio.toLocaleString("es-CL")}
                           </span>
                           <span className="text-base font-black text-brand-indigo">UF</span>
                        </div>
                     </div>
                     <Link 
                        href="#form-cotizar"
                        className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto rounded-xl h-14 px-8 font-bold uppercase tracking-widest bg-brand-indigo shadow-lg shadow-primary/20 flex items-center justify-center")}
                     >
                        Cotizar Ahora
                     </Link>
                  </div>
                  <div className="pt-2">
                     <DynamicUrgency variant="compact" modeloId={modelo.id} initialCount={modelo.visitas} />
                  </div>
               </div>
            </div>

            <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-[1.6] md:leading-[1.4] max-w-4xl border-l-4 border-primary/10 pl-6 md:pl-8">
              {modelo.descripcion || 'Sin descripción disponible.'}
            </p>

            {/* Reputation Card (Trust) */}
            <div className="bg-background border border-brand-indigo/20 rounded-[2.5rem] md:rounded-[3rem] p-8 relative overflow-hidden group shadow-lg shadow-brand-indigo/5 mt-8">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-indigo/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
               <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 w-full">
                  <div className="shrink-0 scale-100 md:scale-110">
                     <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="48" cy="48" r="44" className="stroke-muted-foreground/10 fill-none" strokeWidth="8" />
                           <circle 
                             cx="48" cy="48" r="44" 
                             className="stroke-brand-indigo fill-none transition-all duration-1000" 
                             strokeWidth="8" 
                             strokeDasharray={276.46}
                             strokeDashoffset={276.46 - (276.46 * score) / 100}
                             strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-2xl font-black text-brand-indigo">{score}</span>
                           <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 mb-1">Score</span>
                           <ScoreInfoModal />
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left w-full">
                     <div className="space-y-1 text-left w-full">
                        <h3 className="text-2xl font-heading font-black tracking-tighter">Constructora Certificada</h3>
                        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">Auditoría aprobada por el sistema de verificación técnica SolocasasChile.</p>
                     </div>
                  </div>
               </div>
            </div>

            <ModeloPlano planoUrl={(modelo as any).construccion?.plano_url} recintos={(modelo as any).recintos} superficie={modelo.superficie_m2} />

            <IncluyeNoIncluye modelo={modelo} className="py-12 border-t border-border/20" />

            {/* Video Section */}
               {modelo.video_url && getYoutubeEmbedUrl(modelo.video_url) && (
                  <div className="space-y-8 md:space-y-10">
                     <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight flex items-center gap-4">
                        <Video className="w-6 h-6 md:w-8 md:h-8 text-brand-indigo opacity-40 shrink-0" /> 
                        Tour Virtual en Video
                     </h2>
                     <div className="relative aspect-video w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-4 border-border/40 shadow-2xl shadow-primary/10 group">
                        <iframe
                           src={getYoutubeEmbedUrl(modelo.video_url)!}
                           title={`Video tour de ${modelo.nombre}`}
                           className="absolute inset-0 w-full h-full"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                        />
                     </div>
                  </div>
               )}
          </div>

          {/* Sidebar (Right) */}
          <div className="sticky top-28 space-y-8 h-fit max-h-[calc(100vh-140px)] overflow-y-auto pr-3 scrollbar-hide pb-20">
             <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 shadow-xl shadow-primary/5 space-y-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-indigo/80" />
                <h2 className="text-xl font-heading font-black tracking-tight flex items-center gap-3">
                  <Square className="w-5 h-5 text-brand-indigo opacity-50 shrink-0" /> 
                  Ficha Técnica
                </h2>
                <FichaTecnicaCompleta modelo={modelo} className="space-y-6" />
                <FichaExpandida modelo={modelo} />
             </div>

             {/* 4 Build Features block */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-card border border-border/40 rounded-3xl p-5 hover:bg-muted/30 transition-colors">
                  <Building2 className="w-8 h-8 text-brand-indigo mb-3 opacity-80" />
                  <p className="text-sm font-black tracking-tight leading-tight">Sistema Integrado</p>
               </div>
               <div className="bg-card border border-border/40 rounded-3xl p-5 hover:bg-muted/30 transition-colors">
                  <Package className="w-8 h-8 text-brand-teal mb-3 opacity-80" />
                  <p className="text-sm font-black tracking-tight leading-tight">Entrega Optimizada</p>
               </div>
               <div className="bg-card border border-border/40 rounded-3xl p-5 hover:bg-muted/30 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-brand-indigo mb-3 opacity-80" />
                  <p className="text-sm font-black tracking-tight leading-tight">Garantía Extendida</p>
               </div>
               <div className="bg-card border border-border/40 rounded-3xl p-5 hover:bg-muted/30 transition-colors">
                  <TrendingUp className="w-8 h-8 text-emerald-500 mb-3 opacity-80" />
                  <p className="text-sm font-black tracking-tight leading-tight">Diseño Eficiente</p>
               </div>
             </div>

             <div id="form-cotizar" className="bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl shadow-primary/10 relative overflow-hidden group/form">
                <div className="absolute top-0 left-0 right-0 h-2 animate-gradient shadow-xl bg-brand-indigo" />
                
                <div className="space-y-8 md:space-y-10">
                   <div className="space-y-5">
                      <div className="flex items-center justify-between">
                         <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Presupuesto Referencial</p>
                         <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 font-bold text-[8px] tracking-widest uppercase bg-emerald-500/5 px-3 py-1 rounded-full animate-pulse">
                            Disponibilidad Real
                         </Badge>
                      </div>
                      {/* Price — guarded against 0 */}
                      {precio > 0 ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
                              {precio.toLocaleString("es-CL")}
                            </span>
                            <span className="text-2xl font-black text-brand-indigo">UF</span>
                          </div>

                          <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Valor M²</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black tracking-tight">{(precio / (modelo.superficie_m2 || 1)).toFixed(2)}</span>
                                <span className="text-[10px] font-bold text-brand-indigo uppercase">UF/M²</span>
                              </div>
                            </div>
                            <div className="h-8 w-px bg-border/40" />
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Área</span>
                              <span className="text-lg font-bold">{modelo.superficie_m2 || 0} m²</span>
                            </div>
                          </div>

                          {/* Microcopy */}
                          <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium border-l-2 border-border/30 pl-3">
                            Precio referencial. No incluye obras de fundación, conexiones a servicios, terminaciones de piso flotante ni permisos de construcción.
                          </p>

                          {/* Variant link */}
                          <a href="#form-cotizar" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-indigo hover:text-brand-teal transition-colors">
                            <span>→</span> Consultar versión 72 m² o 110 m²
                          </a>
                        </>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-3xl font-black tracking-tight text-muted-foreground">Consultar precio</p>
                          <p className="text-[11px] text-muted-foreground/60 font-medium leading-relaxed">Solicita tu cotización personalizada para obtener el valor según tu región, terreno y especificaciones.</p>
                        </div>
                      )}

                      <div className="h-px bg-border/40 w-full" />

                      <PriceNotify 
                         modeloId={modelo.id}
                         modeloNombre={modelo.nombre}
                         constructoraId={constructora.id}
                         currentPrice={precio}
                      />
                      
                      {/* Social Proof Capsule */}
                      <PruebaSocial 
                         modeloId={modelo.id} 
                         initialCount={modelo.visitas}
                         constructora={constructora}
                         updatedAt={(modelo as any).updated_at}
                      />
                   </div>

                   <CotizarForm
                      modeloId={modelo.id}
                      modeloNombre={modelo.nombre}
                      constructoraId={constructora.id || 'external'}
                      constructoraNombre={constructora.nombre || 'Constructora'}
                   />
                </div>
             </div>

             {/* Sección: Proyectos entregados (o otros modelos destacados) */}
            <div className="space-y-8">
               <div className="flex items-end justify-between">
                 <div className="space-y-2">
                   <h2 className="text-2xl font-heading font-black tracking-tight">
                     {hasOtherModels ? 'Otros modelos destacados' : 'Proyectos de esta constructora'}
                   </h2>
                   <p className="text-muted-foreground text-sm font-medium">
                     {hasOtherModels 
                        ? `Explora más opciones de diseños de ${constructora.nombre}.`
                        : `Más de 120 familias ya viven la experiencia ${constructora.nombre}.`
                     }
                   </p>
                 </div>
                 <Link href={`/constructora/${constructora.slug}`} className="text-brand-indigo font-black text-[10px] uppercase tracking-widest hover:underline">
                    Ver Catálogo Completo →
                 </Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(hasOtherModels ? otherModels : [
                    { nombre: `Proyecto Pucón, Araucanía`, m2: "110 m²", imagenes_urls: [imagenes[0]], slug: null },
                    { nombre: `Proyecto Puerto Varas, Los Lagos`, m2: "72 m²", imagenes_urls: [imagenes[1] || imagenes[0]], slug: null },
                    { nombre: `Proyecto Villarrica, Araucanía`, m2: "90 m²", imagenes_urls: [imagenes[2] || imagenes[0]], slug: null },
                  ]).map((proj: any, i: number) => (
                    <div key={i} className="group cursor-pointer">
                       <Link href={proj.slug ? `/modelo/${proj.slug}` : '#'}>
                          <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl mb-4">
                             <Image 
                                src={proj.imagenes_urls?.[0] || '/placeholder.png'} 
                                fill 
                                alt="" 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                             />
                          </div>
                          <div className="px-2">
                             <h4 className="text-sm font-black tracking-tight group-hover:text-brand-indigo transition-colors">{proj.nombre}</h4>
                             <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                                {proj.superficie_m2 ? `${proj.superficie_m2} m²` : proj.m2}
                             </p>
                          </div>
                       </Link>
                    </div>
                  ))}
               </div>
            </div>

             <div className="bg-muted/10 border border-border/40 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
                <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-emerald-500/60 group-hover:scale-110 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">
                   Soporte Técnico de por vida certificado por la Asociación de Constructoras
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
