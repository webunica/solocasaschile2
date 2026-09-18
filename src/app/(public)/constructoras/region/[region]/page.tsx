import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Building2, Star, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import {
  REGIONES_CHILE,
  mergeConstructoras,
  getTopByRegion,
} from "@/lib/constructoras-data";
import { RegionConstructorasClient } from "@/components/constructoras/region-constructoras-client";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, StructuredData } from "@/components/seo/structured-data";

// ─── Static params ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(REGIONES_CHILE).map((slug) => ({ region: slug }));
}

// ─── Metadata dinámica ─────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  const info = REGIONES_CHILE[region];
  if (!info) return { title: "Región no encontrada" };

  const title = `Top 40 Constructoras Casas Prefabricadas en ${info.nombre} 2026 | SoloCasasChile`;
  const description = `Las mejores empresas de casas prefabricadas, SIP y modulares en ${info.nombre}. Rankeadas por rating real de Google Maps. Teléfonos, sitios web y más.`;

  return {
    title,
    description,
    keywords: [
      `constructoras casas prefabricadas ${info.capital.toLowerCase()}`,
      `empresas casas prefabricadas ${info.nombre.toLowerCase()}`,
      `casas sip ${info.capital.toLowerCase()}`,
      `casas modulares ${info.nombre.toLowerCase()}`,
      `mejores constructoras ${info.capital.toLowerCase()}`,
    ],
    alternates: { canonical: `https://solocasaschile.com/constructoras/region/${region}` },
    openGraph: {
      title,
      description,
      url: `https://solocasaschile.com/constructoras/region/${region}`,
      siteName: "SoloCasasChile",
      locale: "es_CL",
      type: "website",
    },
  };
}

export const revalidate = 3600;

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ConstructorasRegionPage({ params }: PageProps) {
  const { region } = await params;
  const info = REGIONES_CHILE[region];
  if (!info) notFound();

  // Obtener datos de Supabase
  const supabase = await createClient();
  const { data: dbRows = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados, sitio_web, telefono, email, direccion, lat, lng")
    .order("score_confianza", { ascending: false });

  const allConstructoras = mergeConstructoras(dbRows ?? []);
  const topConstructoras = getTopByRegion(allConstructoras, info.supabaseNombre, 100);

  // Promedio de rating
  const ratingsValidos = topConstructoras.filter(c => c.rating !== null).map(c => c.rating as number);
  const avgRating = ratingsValidos.length > 0
    ? (ratingsValidos.reduce((a, b) => a + b, 0) / ratingsValidos.length).toFixed(1)
    : null;

  // JSON-LD
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Constructoras", url: "https://solocasaschile.com/constructoras" },
    { name: "Por Región", url: "https://solocasaschile.com/constructoras/region" },
    { name: info.nombre, url: `https://solocasaschile.com/constructoras/region/${region}` },
  ]);

  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {topConstructoras.length > 0 && (
        <StructuredData
          type="ItemList"
          data={buildItemListJsonLd(
            topConstructoras.slice(0, 40).map(c => ({
              name: c.nombre,
              url: c.sitio_web || `https://solocasaschile.com/constructora/${c.slug}`,
              description: c.descripcion,
            }))
          )}
        />
      )}

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-slate-950 pb-20 pt-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold text-white/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/constructoras" className="hover:text-white transition-colors">Constructoras</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-black">{info.nombre}</span>
          </nav>

          {/* Title + Intro */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-bold">
              <span>{info.emoji}</span>
              <span>{info.clima}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tight leading-[1.1]">
              Constructoras de Casas Prefabricadas en{" "}
              <span className="gradient-text">{info.nombre}</span>
            </h1>

            <p className="text-lg text-white/70 font-medium max-w-2xl leading-relaxed">
              {info.intro}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-fit">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Empresas</p>
              <div className="text-3xl font-black text-white">{topConstructoras.length}</div>
            </div>
            {avgRating && (
              <>
                <div className="w-px h-10 bg-white/10" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating promedio</p>
                  <div className="text-3xl font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400" />
                    {avgRating}
                  </div>
                </div>
              </>
            )}
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="space-y-1 hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Capital</p>
              <div className="text-lg font-black text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal" />
                {info.capital}
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="space-y-1 hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Recomendado</p>
              <div className="text-sm font-bold text-brand-teal">{info.recomendacion}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid con Filtros Interactivos por Tipo de Casa ─────────────── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
        {topConstructoras.length > 0 ? (
          <RegionConstructorasClient
            constructoras={topConstructoras}
            regionNombre={info.nombre}
          />
        ) : (
          <div className="text-center py-24 space-y-4">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto" />
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Próximamente en {info.nombre}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Estamos incorporando constructoras para esta región. Mientras tanto, revisa el{" "}
              <Link href="/constructoras" className="text-primary font-semibold hover:underline">
                directorio general
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      {/* ─── FAQs ─────────────────────────────────────────────────────── */}
      {info.faqs.length > 0 && (
        <section className="container max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <h2 className="text-2xl font-heading font-black tracking-tight">
            Preguntas frecuentes — {info.nombre}
          </h2>
          <div className="space-y-4">
            {info.faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border/40 bg-card/60">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Navegación entre regiones ─────────────────────────────────── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-4">
        <h2 className="text-lg font-heading font-bold text-muted-foreground">Otras regiones</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(REGIONES_CHILE)
            .filter(r => r.slug !== region)
            .map(r => (
              <Link
                key={r.slug}
                href={`/constructoras/region/${r.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border/40 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all"
              >
                <span>{r.emoji}</span>
                {r.capital}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
