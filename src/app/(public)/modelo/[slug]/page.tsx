import { getModelBySlug } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CotizarForm } from "@/components/constructora/cotizar-form";
import { ImageGallery } from "@/components/ui/image-gallery";
import { StickyCTAMobile } from "@/components/modelo/sticky-cta-mobile";
import { cn } from "@/lib/utils";
import { Bed, Bath, Square, Clock, ShieldCheck, Star, ArrowLeft, MessageSquare, Zap } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const modelo = await getModelBySlug(slug);
    if (!modelo) return { title: "Modelo no encontrado | SolocasasChile" };
    return {
      title: `${modelo.nombre} | SolocasasChile`,
      description: modelo.descripcion?.substring(0, 160),
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
};

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

  return (
    <div className="min-h-screen bg-background relative">
      <StickyCTAMobile targetId="form-cotizar" />
      
      {/* Breadcrumb / Back button */}
      <div className="border-b bg-card/40 backdrop-blur-3xl sticky top-24 z-30">
        <div className="container max-w-7xl mx-auto px-6 md:px-12 py-5">
          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Explorar Catálogo
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-start">
          
          {/* Main Content (Left) */}
          <div className="space-y-16">
            {/* Gallery with Lightbox */}
            <ImageGallery
              images={imagenes.length > 0 ? imagenes : ['/placeholder.png']}
              altBase={modelo.nombre || 'Modelo'}
            />

            {/* Header Content */}
            <div className="space-y-6">
               <div className="flex flex-wrap items-center gap-3">
                  <Badge className="brand-gradient text-white border-none rounded-full px-4 py-1.5 font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20">
                    {TIPO_LABELS[modelo.tipo] || modelo.tipo || 'Casa'}
                  </Badge>
                  {constructora.plan === "premium" && (
                    <Badge variant="outline" className="border-amber-500/20 text-amber-600 font-black text-[10px] tracking-widest uppercase bg-amber-500/5 px-4 py-1.5 rounded-full">
                       <Star className="w-3 h-3 mr-2 fill-current" /> Destacado
                    </Badge>
                  )}
               </div>
               
               <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter text-foreground leading-[0.9]">
                 {modelo.nombre}
               </h1>

               <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                  <div className="w-16 h-16 rounded-[1.5rem] border-2 border-primary/20 bg-primary/5 flex items-center justify-center p-3">
                     <Image 
                        src={constructora.logo_url || '/placeholder.png'} 
                        alt={constructora.nombre || 'Logo'} 
                        width={48} height={48} 
                        className="object-contain"
                     />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Constructora Certificada</p>
                     <Link
                        href={`/constructora/${constructora.slug || 'unknown'}`}
                        className="text-2xl font-black text-brand-indigo hover:text-brand-teal transition-colors tracking-tight underline-offset-4 hover:underline"
                     >
                        {constructora.nombre}
                     </Link>
                  </div>
               </div>
            </div>

            <p className="text-2xl text-muted-foreground font-medium leading-[1.4] max-w-4xl border-l-4 border-primary/10 pl-8">
              {modelo.descripcion || 'Sin descripción disponible.'}
            </p>

            {/* Technical Specs Grid */}
            <div className="space-y-10">
               <h2 className="text-3xl font-heading font-black tracking-tight flex items-center gap-4">
                 <Square className="w-8 h-8 text-brand-teal opacity-40 shrink-0" /> 
                 Ficha Técnica Industrial
               </h2>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                    { icon: <Square className="w-6 h-6 text-brand-indigo" />, label: "Área Total", value: `${modelo.superficie_m2 || 0} m²` },
                    { icon: <Bed className="w-6 h-6 text-brand-indigo" />, label: "Dormitorios", value: `${modelo.dormitorios || 0} Dorms` },
                    { icon: <Bath className="w-6 h-6 text-brand-indigo" />, label: "Baños", value: `${modelo.banos || 0} Baños` },
                    { icon: <Clock className="w-6 h-6 text-brand-indigo" />, label: "Entrega Est.", value: modelo.tiempo_entrega || 'Consultar' },
                 ].map((spec) => (
                    <div key={spec.label} className="bg-muted/10 border border-border/40 p-8 rounded-[3rem] space-y-4 hover:bg-muted/20 transition-all hover:-translate-y-1 duration-500">
                       <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-xl shadow-black/5">
                          {spec.icon}
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 leading-none mb-2">
                            {spec.label}
                         </p>
                         <p className="text-xl font-black tracking-tight">{spec.value}</p>
                       </div>
                    </div>
                 ))}
               </div>
            </div>

            {/* Reputation Card (Trust) */}
            <div className="bg-background border-2 border-brand-indigo/10 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl shadow-primary/5">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-indigo/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
               <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                  <div className="shrink-0 scale-125">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="64" cy="64" r="58" className="stroke-muted-foreground/10 fill-none" strokeWidth="10" />
                           <circle 
                             cx="64" cy="64" r="58" 
                             className="stroke-brand-indigo fill-none transition-all duration-1000" 
                             strokeWidth="10" 
                             strokeDasharray={364.4}
                             strokeDashoffset={364.4 - (364.4 * score) / 100}
                             strokeLinecap="round"
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-3xl font-black text-brand-indigo">{score}</span>
                           <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Score</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                     <div className="space-y-2">
                        <h3 className="text-4xl font-heading font-black tracking-tighter">Constructora Certificada</h3>
                        <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">Auditoría aprobada por el sistema de verificación técnica SolocasasChile.</p>
                     </div>
                     <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {constructora.verificada && (
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal bg-brand-teal/5 px-6 py-3 rounded-full border border-brand-teal/10">
                            <ShieldCheck className="w-4 h-4" /> Verificada
                          </div>
                        )}
                        <Link href={`/constructora/${constructora.slug || 'unknown'}`} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-indigo bg-brand-indigo/5 px-6 py-3 rounded-full border border-brand-indigo/10 hover:bg-brand-indigo/10 transition-colors">
                           Ver Perfil Industrial <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Pricing & Checkout (Right Sticky) */}
          <div className="sticky top-40 space-y-8 h-fit pb-12">
             <div id="form-cotizar" className="bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[3.5rem] p-10 lg:p-12 shadow-2xl shadow-primary/10 relative overflow-hidden group/form">
                <div className="absolute top-0 left-0 right-0 h-2 animate-gradient shadow-xl brand-gradient" />
                
                <div className="space-y-10">
                   <div className="space-y-5">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Presupuesto Referencial</p>
                         <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 font-bold text-[8px] tracking-widest uppercase bg-emerald-500/5 px-3 py-1 rounded-full animate-pulse">
                            Disponibilidad Real
                         </Badge>
                      </div>
                      <div className="flex items-baseline gap-2">
                         <span className="text-7xl font-black tracking-tighter text-foreground leading-none">
                            {precio.toLocaleString("es-CL")}
                         </span>
                         <span className="text-2xl font-black text-brand-indigo">UF</span>
                      </div>
                      <div className="h-px bg-border/40 w-full" />
                      
                      {/* Social Proof Capsule */}
                      <div className="bg-muted/20 rounded-2xl p-4 flex items-center gap-4 border border-border/20">
                         <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shrink-0">
                            <Zap className="w-5 h-5 fill-current" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Alta Demanda</p>
                            <p className="text-xs font-bold text-muted-foreground">12 personas cotizaron hoy</p>
                         </div>
                      </div>
                   </div>

                   <CotizarForm
                      modeloId={modelo.id}
                      modeloNombre={modelo.nombre}
                      constructoraId={constructora.id || 'external'}
                      constructoraNombre={constructora.nombre || 'Constructora'}
                   />
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
