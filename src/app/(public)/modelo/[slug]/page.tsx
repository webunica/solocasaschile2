import { getModelBySlug } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CotizarForm } from "@/components/constructora/cotizar-form";
import { ImageGallery } from "@/components/ui/image-gallery";
import { cn } from "@/lib/utils";
import { Bed, Bath, Square, Clock, ShieldCheck, Star, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  return {
    title: modelo ? `${modelo.nombre} | SolocasasChile` : "Modelo no encontrado",
    description: modelo?.descripcion,
  };
}

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
};

export default async function ModeloPage({ params }: PageProps) {
  const { slug } = await params;
  const modelo = await getModelBySlug(slug);
  if (!modelo) notFound();

  const { constructora } = modelo;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb / Back button */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 md:top-16 z-30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 py-4">
          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          
          {/* Main Content (Left) */}
          <div className="space-y-12">
            {/* Gallery with Lightbox */}
            <ImageGallery
              images={modelo.imagenes_urls || []}
              altBase={modelo.nombre}
            />

            {/* Description & Branding */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center p-2">
                    <Image 
                       src={constructora.logo_url || '/placeholder.png'} 
                       alt={constructora.nombre} 
                       width={32} height={32} 
                       className="object-contain"
                    />
                 </div>
                 <Link
                    href={`/constructora/${constructora.slug}`}
                    className="text-lg font-black text-brand-indigo hover:text-brand-coral transition-colors tracking-tight underline-offset-4 hover:underline"
                 >
                    {constructora.nombre}
                 </Link>
                 {constructora.verificada && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
              </div>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
                {modelo.descripcion}
              </p>
            </div>

            {/* Technical Specs Grid */}
            <div className="space-y-6">
               <h2 className="text-2xl font-heading font-black tracking-tight flex items-center gap-3">
                 <Square className="w-6 h-6 text-brand-coral" /> 
                 Especificaciones Técnicas
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { icon: <Square className="w-5 h-5 text-brand-indigo" />, label: "Área Total", value: `${modelo.superficie_m2} m²` },
                   { icon: <Bed className="w-5 h-5 text-brand-indigo" />, label: "Dormitorios", value: `${modelo.dormitorios} Dorms` },
                   { icon: <Bath className="w-5 h-5 text-brand-indigo" />, label: "Baños Completos", value: `${modelo.banos} Baños` },
                   { icon: <Clock className="w-5 h-5 text-brand-indigo" />, label: "Entrega Est.", value: modelo.tiempo_entrega || '45-60 días' },
                 ].map((spec) => (
                   <div key={spec.label} className="bg-muted/30 border border-border/40 p-6 rounded-[2rem] space-y-3 transition-colors hover:bg-muted/50">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                         {spec.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none mb-1">
                           {spec.label}
                        </p>
                        <p className="text-lg font-black tracking-tight">{spec.value}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Constructora Reputation Card */}
            <div className="bg-background border-2 border-brand-indigo/10 rounded-[3rem] p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-indigo/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-coral/5 transition-colors duration-700" />
               <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="shrink-0">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="64" cy="64" r="58" className="stroke-muted-foreground/10 fill-none" strokeWidth="12" />
                           <circle 
                             cx="64" cy="64" r="58" 
                             className="stroke-brand-indigo fill-none transition-all duration-1000" 
                             strokeWidth="12" 
                             strokeDasharray={364.4}
                             strokeDashoffset={364.4 - (364.4 * constructora.score_confianza) / 100}
                             strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-3xl font-black text-brand-indigo">{constructora.score_confianza}</span>
                           <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Score</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                     <h3 className="text-2xl font-heading font-black tracking-tight">Constructora Certificada</h3>
                     <p className="text-muted-foreground font-medium max-w-md">{constructora.descripcion || `Especialistas en viviendas de alta calidad, certificados por SolocasasChile con un score de confianza de ${constructora.score_confianza}/100.`}</p>
                     <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        {constructora.verificada && (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-indigo bg-brand-indigo/5 px-4 py-2 rounded-full border border-brand-indigo/10">
                            <ShieldCheck className="w-3 h-3" /> Verificada
                          </div>
                        )}
                        {(constructora.plan === 'pro' || constructora.plan === 'premium') && (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/10">
                            <Star className="w-3 h-3 fill-current" /> {constructora.plan === 'premium' ? 'Premium' : 'Pro'}
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Pricing & Checkout (Right Sticky) */}
          <div className="sticky top-24 space-y-6">
             <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 shadow-2xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 brand-gradient" />
                
                <div className="space-y-8">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Valor base del modelo</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-black tracking-tighter text-foreground">
                            {modelo.precio_desde_uf.toLocaleString("es-CL")}
                         </span>
                         <span className="text-xl font-bold text-brand-indigo">UF</span>
                      </div>
                      <div className="h-px bg-border/60 w-full" />
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        Precio base sujeto a factibilidad técnica y modificaciones de diseño premium.
                      </p>
                   </div>

                   {/* Local Server Action handled form */}
                   <CotizarForm
                      modeloId={modelo.id}
                      modeloNombre={modelo.nombre}
                      constructoraId={constructora.id}
                      constructoraNombre={constructora.nombre}
                   />
                </div>
             </div>

             <div className="bg-muted/20 border border-border/40 rounded-3xl p-6 text-center shadow-inner group">
                <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground max-w-[200px] mx-auto leading-relaxed opacity-60">
                   Protegido por el sistema de auditoría técnica de SolocasasChile
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
