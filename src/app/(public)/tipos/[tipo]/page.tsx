import { getModelosFiltered } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { 
  Box, Layers, Hammer, Key, 
  CheckCircle2, Info, ArrowRight,
  ShieldCheck, Thermometer, Clock
} from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tipo: string }>;
}

const TIPO_INFO: Record<string, { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  benefits: string[];
  specs: { label: string; value: string }[];
  image: string;
}> = {
  prefabricada: {
    title: "Casas Prefabricadas",
    description: "La opción más rápida y económica para construir tu hogar. Paneles modulares de madera o metalcom ensamblados en sitio.",
    icon: <Box className="w-10 h-10 text-primary" />,
    benefits: ["Bajo costo por m2", "Montaje en tiempo récord", "Fácil de ampliar"],
    specs: [
        { label: "Tiempo montaje", value: "7-15 días" },
        { label: "Precio base", value: "8-18 UF/m2" },
        { label: "Escalabilidad", value: "Alta" }
    ],
    image: "/hero.png"
  },
  sip: {
    title: "Casas Panel SIP",
    description: "Paneles aislados estructurales que ofrecen una eficiencia térmica inigualable y una resistencia mecánica superior.",
    icon: <Layers className="w-10 h-10 text-primary" />,
    benefits: ["Ahorro 50% en calefacción", "Estructuralmente antisísmica", "Menos residuos en obra"],
    specs: [
        { label: "Eficiencia Térmica", value: "A+" },
        { label: "Precio base", value: "15-25 UF/m2" },
        { label: "Aislación Acústica", value: "Excelente" }
    ],
    image: "/hero2.png"
  },
  container: {
    title: "Casas Container",
    description: "Viviendas modulares a partir de contenedores marítimos reciclados. Diseño moderno, industrial y altamente resistente.",
    icon: <Hammer className="w-10 h-10 text-primary" />,
    benefits: ["Estructura indestructible", "Movilidad geográfica", "Diseño vanguardista"],
    specs: [
        { label: "Resistencia", value: "Ultra alta" },
        { label: "Precio base", value: "12-22 UF/m2" },
        { label: "Sustentabilidad", value: "Reciclado" }
    ],
    image: "/hero.png"
  },
  "llave-en-mano": {
    title: "Casas Llave en Mano",
    description: "Olvídate de las preocupaciones. Proyectos integrales que incluyen diseño, permisos, construcción y terminaciones finales.",
    icon: <Key className="w-10 h-10 text-primary" />,
    benefits: ["Un solo interlocutor", "Precio cerrado sin sorpresas", "Garantía total"],
    specs: [
        { label: "Esfuerzo Cliente", value: "Nulo" },
        { label: "Precio base", value: "22-35 UF/m2" },
        { label: "Personalización", value: "Total" }
    ],
    image: "/hero2.png"
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  return {
    title: info ? `${info.title} | Comparar Modelos` : "Tipo no encontrado",
    description: info?.description,
  };
}

export default async function TipoPage({ params }: PageProps) {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  if (!info) notFound();

  const modelos = await getModelosFiltered({ tipo });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section per Type */}
      <section className="relative py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden border-b border-border/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="container relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-widest uppercase">
                Sistema Constructivo
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary">
                   {info.icon}
                   <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight">{info.title}</h1>
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
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

            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl group">
               <Image src={info.image} alt={info.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-8 left-8 right-8">
                  <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col gap-4">
                     <h3 className="text-white font-bold flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-primary" /> Ventajas Clave
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
