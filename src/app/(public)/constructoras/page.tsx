import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { MapaConstructoras } from "@/components/constructoras/mapa-constructoras";
import { MapPin, Building2, List, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CONSTRUCTORAS } from "@/lib/mock-data";
import { InformativeListClient } from "@/components/constructoras/informative-list-client";
import { PremiumCarousel } from "@/components/constructoras/premium-carousel";
import { StructuredData, buildItemListJsonLd } from "@/components/seo/structured-data";
import { REGIONES_CHILE } from "@/lib/constructoras-data";

import geoDataJson from "@/data/constructoras-geo.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio de Constructoras de Casas Prefabricadas en Chile | SolocasasChile",
  description: "Compara las mejores constructoras de casas prefabricadas, SIP y modulares en Chile. Score de confianza, proyectos verificados y cobertura regional.",
  keywords: [
    "constructoras casas prefabricadas chile",
    "mejores constructoras casas sip",
    "empresas casas modulares chile",
    "directorio constructoras chile",
    "constructoras verificadas chile",
  ],
  alternates: { canonical: "https://solocasaschile.com/constructoras" },
};

export default async function ConstructorasPage() {
  const supabase = await createClient();
  let dbConstructoras: any[] = [];

  const { data, error } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados, sitio_web, telefono, email, direccion, lat, lng")
    .order("score_confianza", { ascending: false });

  if (error) {
    // Si la tabla en Supabase aún no tiene columnas lat/lng
    const fallbackRes = await supabase
      .from("constructoras")
      .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados, sitio_web, telefono, email, direccion")
      .order("score_confianza", { ascending: false });
    dbConstructoras = fallbackRes.data || [];
  } else {
    dbConstructoras = data || [];
  }

  // Enriquecer registros de DB con coordenadas locales si no las tienen
  const enrichedDb = dbConstructoras.map(c => {
    const geo = (geoDataJson as Record<string, any>)[c.slug];
    return {
      ...c,
      lat: c.lat ?? geo?.lat ?? null,
      lng: c.lng ?? geo?.lng ?? null,
      direccion: c.direccion || geo?.direccion || null,
      telefono: c.telefono || geo?.telefono || null,
      sitio_web: c.sitio_web || geo?.sitio_web || null,
    };
  });

  // Map Mocks to match DB structure (snake_case)
  const mockMapped = CONSTRUCTORAS.map(c => {
    const geo = (geoDataJson as Record<string, any>)[c.slug];
    return {
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
      sitio_web: c.sitio_web || geo?.sitio_web || null,
      telefono: c.telefono || geo?.telefono || null,
      email: null,
      direccion: c.direccion || geo?.direccion || null,
      lat: c.lat ?? geo?.lat ?? null,
      lng: c.lng ?? geo?.lng ?? null,
    };
  });

  const existingSlugs = new Set([
    ...mockMapped.map(m => m.slug),
    ...enrichedDb.map(d => d.slug),
  ]);

  // Incluir constructoras extraídas del scraper que aún no estén en la base de datos
  const scrapedExtra = Object.values(geoDataJson as Record<string, any>)
    .filter((g: any) => g?.slug && !existingSlugs.has(g.slug))
    .map((g: any) => ({
      id: `scraped-${g.slug}`,
      nombre: g.nombre,
      slug: g.slug,
      logo_url: null,
      descripcion: `Fabricante y constructora de casas en Chile. Ubicación: ${g.direccion || g.regiones?.[0] || "Chile"}.`,
      plan: "informativo",
      verificada: false,
      score_confianza: g.rating ? Math.min(100, Math.round(g.rating * 18)) : 65,
      regiones: g.regiones || ["Metropolitana"],
      proyectos_completados: 0,
      sitio_web: g.sitio_web || null,
      telefono: g.telefono || null,
      email: null,
      direccion: g.direccion || null,
      lat: g.lat ?? null,
      lng: g.lng ?? null,
    }));

  const combined = [...mockMapped, ...enrichedDb, ...scrapedExtra];

  const planOrder: Record<string, number> = { premium: 0, avanza: 1, pro: 2, prueba: 3, gratis: 4, informativo: 5 };
  const sorted = combined.sort((a, b) => {
    const diff = (planOrder[a.plan] ?? 4) - (planOrder[b.plan] ?? 4);
    if (diff !== 0) return diff;
    return (b.score_confianza ?? 0) - (a.score_confianza ?? 0);
  });

  const asociadas = sorted.filter(c => c.plan !== "informativo");

  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      {sorted.length > 0 && (
        <StructuredData 
          type="ItemList" 
          data={buildItemListJsonLd(
            sorted.map(c => ({
              name: c.nombre,
              url: `https://solocasaschile.com/constructora/${c.slug || c.id}`,
              image: c.logo_url || undefined,
              description: c.descripcion || undefined
            }))
          )} 
        />
      )}
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
        <section className="space-y-8" aria-labelledby="section-mapa-heading">
          <div className="space-y-2">
            <h2 id="section-mapa-heading" className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
              <MapPin className="w-7 h-7 text-brand-teal" aria-hidden="true" /> Cobertura por Región
            </h2>
            <p className="text-muted-foreground font-medium">Haz clic en cualquier punto del mapa para ver nuestra red de constructoras asociadas.</p>
          </div>
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-6 sm:p-10 shadow-xl shadow-primary/5">
            <MapaConstructoras constructoras={sorted} />
          </div>
        </section>

        {/* Busca por Región */}
        <section className="space-y-6" aria-labelledby="section-regiones-heading">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border/40" aria-hidden="true">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 id="section-regiones-heading" className="text-2xl font-heading font-black tracking-tight text-foreground">
                  Busca por Región
                </h2>
                <p className="text-sm text-muted-foreground">Top 40 constructoras mejor valoradas de cada región</p>
              </div>
            </div>
            <Link
              href="/constructoras/region"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Ver todas las regiones <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(REGIONES_CHILE).map((region) => (
              <Link
                key={region.slug}
                href={`/constructoras/region/${region.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border border-border/40 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all duration-200"
              >
                <span aria-hidden="true">{region.emoji}</span>
                {region.capital}
              </Link>
            ))}
          </div>
        </section>

        {/* Carrusel Constructoras Asociadas */}
        {asociadas.length > 0 && (
          <section className="space-y-12" aria-labelledby="section-destacadas-heading">
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20" aria-hidden="true">
                      <Building2 className="w-5 h-5" />
                   </div>
                   <h2 id="section-destacadas-heading" className="text-3xl font-heading font-black tracking-tight text-foreground">
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
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000" aria-labelledby="section-directorio-heading">
           <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border/40" aria-hidden="true">
                     <List className="w-5 h-5" />
                  </div>
                  <h2 id="section-directorio-heading" className="text-3xl font-heading font-black tracking-tight text-foreground">
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
