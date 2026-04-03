import { getModelosFiltered } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { 
  CheckCircle2, ArrowRight,
  ShieldCheck, Thermometer, Clock
} from "lucide-react";
import type { Metadata } from "next";
import { SYSTEM_DETAILS as TIPO_INFO } from "@/config/construction-systems";
import { buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/components/seo/structured-data";

interface PageProps {
  params: Promise<{ tipo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  const baseUrl = 'https://solocasaschile.com';

  if (!info) return { title: "Tipo no encontrado | SolocasasChile" };

  const title = `${info.title} en Chile | Modelos y Precios | SolocasasChile`;
  const description = info.description
    ? `${info.description} Compara modelos, precios desde UF y constructoras verificadas en Chile.`
    : `Conoce todo sobre ${info.title} en Chile: precios, constructoras y modelos disponibles.`;

  return {
    title,
    description,
    keywords: [
      `${info.title.toLowerCase()} chile`,
      `casas ${tipo} chile`,
      `precio ${tipo} chile`,
      `constructoras ${tipo}`,
      "casas prefabricadas chile",
    ],
    alternates: { canonical: `${baseUrl}/tipos/${tipo}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/tipos/${tipo}`,
      siteName: "SolocasasChile",
      locale: "es_CL",
      type: "website",
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@solocasaschile",
      title,
      description,
    },
  };
}

export default async function TipoPage({ params }: PageProps) {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  if (!info) notFound();

  const modelos = await getModelosFiltered({ tipo });

  return (
    <div className="min-h-screen bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd([
            { name: "Inicio", url: "https://solocasaschile.com" },
            { name: "Tipos de Casas", url: "https://solocasaschile.com/catalogo" },
            { name: info.title, url: `https://solocasaschile.com/tipos/${tipo}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQJsonLd([
            {
              question: `¿Qué es una casa ${info.title} en Chile?`,
              answer: info.description || `Una casa ${info.title} es un sistema constructivo industrializado adaptado al clima y normativa chilena. ${info.benefits?.join('. ') || ''}`,
            },
            {
              question: `¿Cuánto cuesta una casa ${info.title} en Chile?`,
              answer: `El precio de una casa ${info.title} en Chile varía según el modelo y la constructora. En SolocasasChile puedes comparar precios desde UF de las mejores constructoras verificadas.`,
            },
            {
              question: `¿Cuánto demora construir una casa ${info.title}?`,
              answer: `Los tiempos de construcción de una casa ${info.title} son significativamente menores que la construcción tradicional. Dependen del modelo elegido y la constructora, pero pueden ir desde 30 días hasta 6 meses.`,
            },
          ])),
        }}
      />
      {/* Hero Section per Type */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-indigo/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase">
                Sistema Constructivo
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-6">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                      {info.icon}
                   </div>
                   <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white leading-none">
                     {info.title}
                   </h1>
                </div>
                <p className="text-xl text-white/60 leading-relaxed max-w-xl font-medium">
                  {info.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {info.specs.map(spec => (
                  <div key={spec.label} className="bg-background border border-border/50 p-4 rounded-xl shadow-sm">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">{spec.label}</p>
                    <p className="text-lg font-bold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="font-semibold shadow-lg shadow-primary/20">
                   Ver modelos disponibles
                </Button>
                <Button variant="outline" size="lg" className="font-semibold">
                   Descargar Guía SIP
                </Button>
              </div>
            </div>

             <div className="relative h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10">
                <Image src={info.image} alt={info.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex flex-col gap-6">
                      <h3 className="text-white font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-brand-teal" /> Ventajas Clave
                      </h3>
                     <div className="space-y-2">
                        {info.benefits.map(benefit => (
                          <div key={benefit} className="flex items-center gap-2 text-white/90 text-sm">
                             <ShieldCheck className="w-4 h-4 text-primary" /> {benefit}
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tight">Catálogo de modelos {info.title.split(' ')[1] || 'disponibles'}</h2>
              <p className="text-muted-foreground">
                Encuentra los mejores modelos construidos bajo el sistema {info.title.toLowerCase()} en Chile. 
                Compara precios, m2 y constructoras.
              </p>
            </div>
            <Link href="/catalogo" className={buttonVariants({ variant: "ghost", className: "text-primary hover:text-primary/80" })}>
               Explorar catálogo completo <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <CatalogoGrid modelos={modelos} />
          
          {modelos.length === 0 && (
             <div className="bg-muted/30 border border-dashed border-border rounded-3xl py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Aún no hay modelos para este tipo</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Estamos trabajando con nuevas constructoras para traerte la mejor oferta en este sistema constructivo.</p>
                <Link href="/catalogo" className={buttonVariants()}>Ver modelos de otros tipos</Link>
             </div>
          )}
        </div>
      </section>

      {/* Info section / FAQ placeholder for SEO */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 mt-10">
         <div className="container max-w-4xl mx-auto px-4 md:px-8 text-center space-y-12">
            <div className="space-y-4">
               <h2 className="text-3xl font-heading font-bold">¿Por qué elegir {info.title}?</h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                 Aquí puedes detallar información técnica sobre el sistema constructivo para mejorar el SEO y ayudar al usuario en su decisión de compra.
               </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 text-left">
               <div className="space-y-3">
                  <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
                     <Thermometer className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg">Aislamiento Térmico</h4>
                  <p className="text-sm text-muted-foreground">Explicación técnica del aislamiento para mejorar posiciones en Google para keywords relacionadas a clima y ahorro.</p>
               </div>
               <div className="space-y-3">
                  <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
                     <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg">Velocidad de Obra</h4>
                  <p className="text-sm text-muted-foreground">Detalle sobre los tiempos de fabricación y montaje comparado con construcción tradicional.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
