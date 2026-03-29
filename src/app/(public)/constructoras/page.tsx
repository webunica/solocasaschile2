import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { MapaConstructoras } from "@/components/constructoras/mapa-constructoras";
import { MapPin, Building2, List } from "lucide-react";
import type { Metadata } from "next";

import { CONSTRUCTORAS } from "@/lib/mock-data";
import { InformativeListClient } from "@/components/constructoras/informative-list-client";
import { PremiumCarousel } from "@/components/constructoras/premium-carousel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio de Constructoras | SolocasasChile",
  description: "Encuentra las mejores empresas constructoras de casas prefabricadas, SIP y modulares en Chile. Revisa su score de confianza.",
};

export default async function ConstructorasPage() {
  const supabase = await createClient();
  const { data: dbConstructoras = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados, sitio_web, telefono, email")
    .order("score_confianza", { ascending: false });

  // Map Mocks to match DB structure (snake_case)
  const mockMapped = CONSTRUCTORAS.map(c => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    logo_url: c.logo,
    descripcion: c.descripcion,
    plan: c.plan,
    verificada: c.verificada,
    score_confianza: c.scoreConfianza,
    regiones: c.regiones,
    proyectos_completados: c.proyectosCompletados,
    sitio_web: null,
    telefono: null,
    email: null
  }));

  const combined = [...mockMapped, ...(dbConstructoras || [])];

  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2, informativo: 3 };
  const sorted = combined.sort((a, b) => {
    const diff = (planOrder[a.plan] ?? 4) - (planOrder[b.plan] ?? 4);
    if (diff !== 0) return diff;
    return (b.score_confianza ?? 0) - (a.score_confianza ?? 0);
  });

  const asociadas = sorted.filter(c => c.plan !== "informativo");

  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      {/* Header / Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-card/10 pb-20 pt-12">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-border/20 hidden lg:block" />
        
        {/* Subtle Andes Silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] opacity-[0.04] pointer-events-none select-none z-0">
          <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <path fill="currentColor" className="text-primary" d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,149.3C960,117,1056,75,1152,74.7C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12 space-y-10">
          <div className="space-y-6">
            <Badge variant="outline" className="brand-gradient text-white border-none px-6 py-1.5 rounded-full text-[9px] tracking-[0.3em] font-black uppercase shadow-xl shadow-primary/20">
              Directorio Verificado
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
              Directorio de <br />
              <span className="gradient-text">Constructoras</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Empresas verificadas y rankeadas por el sistema de <span className="text-foreground font-bold">score de confianza</span> de SolocasasChile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-12 bg-background/40 backdrop-blur-xl border border-border/40 p-8 rounded-[2.5rem] w-fit shadow-2xl shadow-primary/5">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Empresas Chile</p>
               <div className="text-3xl font-black text-brand-indigo">{asociadas.length}</div>
            </div>
            <div className="w-px h-10 bg-border/40 hidden sm:block" />
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Regiones</p>
               <div className="text-3xl font-black text-foreground">16</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-20">
        
        {/* Mapa de Chile */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
              <MapPin className="w-7 h-7 text-brand-teal" /> Cobertura por Región
            </h2>
            <p className="text-muted-foreground font-medium">Haz clic en cualquier punto del mapa para ver nuestra red de constructoras asociadas.</p>
          </div>
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-10 shadow-xl shadow-primary/5">
            <MapaConstructoras constructoras={asociadas} />
          </div>
        </section>

        {/* Carrusel Constructoras Asociadas */}
        {asociadas.length > 0 && (
          <section className="space-y-12">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                     <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">
                    Empresas Destacadas
                  </h2>
               </div>
               <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-3xl">
                 Explora el catálogo de constructoras líderes. Empresas verificadas con historial real de proyectos y atención premium.
               </p>
            </div>
            <PremiumCarousel constructoras={asociadas} />
          </section>
        )}

        {/* Listado de Constructoras Informativas / Directorio General */}
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border/40">
                    <List className="w-5 h-5" />
                 </div>
                 <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">
                    Directorio <span className="gradient-text">General</span>
                 </h2>
              </div>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-3xl">
                 Otras empresas del sector en Chile. Este listado incluye empresas en proceso de verificación o con perfiles informativos básicos.
              </p>
           </div>

           <InformativeListClient constructoras={sorted.filter(c => c.plan === "informativo")} />
        </section>
      </div>
    </div>
  );
}
