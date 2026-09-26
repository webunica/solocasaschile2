import { createPublicClient } from "@/lib/supabase/server";
import { ConstructorasHero } from "@/components/constructoras/constructoras-hero";
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

export const revalidate = 3600;

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
  const supabase = await createPublicClient();
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

  // Constructoras ficticias para las demás empresas destacadas (sin acceso a perfil, botón 'En revisión')
  const fictitiousDestacadas = [
    {
      id: "destacada-andina",
      nombre: "Constructora Andina SpA",
      slug: "constructora-andina",
      logo_url: null,
      descripcion: "Especialistas en ingeniería modular y casas prefabricadas en madera tratada. Perfil técnico en revisión documental.",
      plan: "pro",
      score_confianza: 78,
      verificada: false,
      isMaster: false,
      regiones: ["Metropolitana", "Valparaíso", "O'Higgins"],
    },
    {
      id: "destacada-modular-sur",
      nombre: "Modular Sur SpA",
      slug: "modular-sur",
      logo_url: null,
      descripcion: "Fabricación de módulos habitacionales y estructuras con eficiencia energética. Perfil en proceso de auditoría técnica.",
      plan: "avanza",
      score_confianza: 74,
      verificada: false,
      isMaster: false,
      regiones: ["Biobío", "La Araucanía", "Los Lagos"],
    },
    {
      id: "destacada-casas-valle",
      nombre: "Casas del Valle Prefabricadas",
      slug: "casas-del-valle",
      logo_url: null,
      descripcion: "Modelos llave en mano para parcelas y sectores rurales. En proceso de validación documental.",
      plan: "pro",
      score_confianza: 72,
      verificada: false,
      isMaster: false,
      regiones: ["Maule", "Ñuble", "Metropolitana"],
    },
    {
      id: "destacada-vanguardia",
      nombre: "Vanguardia SIP Chile",
      slug: "vanguardia-sip",
      logo_url: null,
      descripcion: "Soluciones de paneles SIP de alto rendimiento térmico y antisísmico. En etapa de revisión de antecedentes.",
      plan: "premium",
      score_confianza: 80,
      verificada: false,
      isMaster: false,
      regiones: ["Metropolitana", "Valparaíso", "Coquimbo"],
    },
    {
      id: "destacada-ecoviviendas",
      nombre: "EcoViviendas Austral",
      slug: "ecoviviendas-austral",
      logo_url: null,
      descripcion: "Diseño y montaje de casas térmicas para climas extremos del sur de Chile. Perfil en auditoría documental.",
      plan: "pro",
      score_confianza: 76,
      verificada: false,
      isMaster: false,
      regiones: ["Los Ríos", "Los Lagos", "Aysén"],
    },
  ];

  // Solo Constructora Master tiene acceso a su perfil
  const masterOfficial = sorted.find(c => 
    c.slug === "constructora-master" || 
    c.slug === "javier-cb85b919" || 
    c.nombre.toLowerCase().includes("master")
  ) || {
    id: "cb85b919-4008-46bc-bbb8-b3211152280c",
    nombre: "Constructora Master",
    slug: "constructora-master",
    logo_url: "https://pereskyvymsyiqbihydj.supabase.co/storage/v1/object/public/model_images/logos/cb85b919-4008-46bc-bbb8-b3211152280c-1775228477059.png",
    descripcion: "Constructora Master SpA es una empresa líder en desarrollo de viviendas prefabricadas, SIP y modulares de alto estándar en Chile con más de 14 años de experiencia y trayectoria.",
    plan: "premium",
    verificada: true,
    score_confianza: 100,
    regiones: ["La Araucanía", "Los Ríos", "Los Lagos", "Metropolitana", "Valparaíso", "Biobío", "Maule", "Ñuble", "Coquimbo"],
  };

  const asociadas = [
    { ...masterOfficial, isMaster: true, slug: masterOfficial.slug || "constructora-master" },
    ...fictitiousDestacadas,
  ];

  // Optimización de payload: campos requeridos para mapa
  const mapConstructoras = sorted.map(c => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    lat: c.lat,
    lng: c.lng,
    regiones: c.regiones,
    plan: c.plan,
    verificada: c.verificada,
    direccion: c.direccion,
    telefono: c.telefono,
    sitio_web: c.sitio_web,
  }));

  // Optimización de payload: campos requeridos para directorio general
  const listConstructoras = sorted.map(c => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    regiones: c.regiones,
    telefono: c.telefono,
    email: c.email,
    sitio_web: c.sitio_web,
    plan: c.plan,
    verificada: c.verificada,
    score_confianza: c.score_confianza,
  }));

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 sm:pt-28">
      {sorted.length > 0 && (
        <StructuredData 
          type="ItemList" 
          data={buildItemListJsonLd(
            sorted.slice(0, 50).map(c => ({
              name: c.nombre,
              url: (c.slug === "constructora-master" || c.slug === "javier-cb85b919" || c.nombre?.toLowerCase().includes("master"))
                ? `https://solocasaschile.com/constructora/${c.slug || "constructora-master"}`
                : `https://solocasaschile.com/constructoras`,
              image: c.logo_url || undefined,
              description: c.descripcion || undefined
            }))
          )} 
        />
      )}
      {/* Header / Hero Section Rediseñado para Constructoras */}
      <ConstructorasHero />


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
            <MapaConstructoras constructoras={mapConstructoras} />
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

        {/* Listado de Constructoras / Directorio General */}
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
                 Explora todas las empresas registradas en Chile. Utiliza el buscador y filtro regional para encontrar constructoras en tu zona.
              </p>
           </div>

           <InformativeListClient constructoras={listConstructoras} />
        </section>
      </div>
    </div>
  );
}
