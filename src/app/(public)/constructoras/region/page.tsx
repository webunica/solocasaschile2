import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { REGIONES_CHILE, mergeConstructoras, countByRegion } from "@/lib/constructoras-data";

export const metadata: Metadata = {
  title: "Constructoras de Casas Prefabricadas por Región | SoloCasasChile",
  description:
    "Encuentra las mejores constructoras de casas prefabricadas, SIP y modulares en tu región de Chile. Top 40 empresas rankeadas por rating y verificación.",
  alternates: { canonical: "https://solocasaschile.com/constructoras/region" },
};

export const revalidate = 3600;

export default async function ConstructorasRegionIndexPage() {
  // Obtener datos de Supabase
  const supabase = await createClient();
  const { data: dbRows = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados, sitio_web, telefono, email, direccion, lat, lng")
    .order("score_confianza", { ascending: false });

  const allConstructoras = mergeConstructoras(dbRows ?? []);
  const counts = countByRegion(allConstructoras);

  const regiones = Object.values(REGIONES_CHILE).sort(
    (a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0)
  );

  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40 bg-card/10 pb-20 pt-12">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none" />

        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground" aria-label="Navegación">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/constructoras" className="hover:text-foreground transition-colors">Constructoras</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Por Región</span>
          </nav>

          <div className="space-y-5">
            <Badge variant="outline" className="brand-gradient text-white border-none px-6 py-1.5 rounded-full text-[9px] tracking-[0.3em] font-black uppercase shadow-xl shadow-primary/20">
              Directorio Regional
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
              Top 40 por <br />
              <span className="gradient-text">Región</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Las <strong className="text-foreground">mejores constructoras de casas prefabricadas</strong> de cada región de Chile, ordenadas por rating real de Google Maps.
            </p>
          </div>

          <div className="flex items-center gap-8 bg-background/40 backdrop-blur-xl border border-border/40 p-6 rounded-[2rem] w-fit shadow-xl shadow-primary/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Total empresas</p>
              <div className="text-3xl font-black text-brand-indigo">{allConstructoras.length}</div>
            </div>
            <div className="w-px h-10 bg-border/40" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Regiones</p>
              <div className="text-3xl font-black text-foreground">16</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid de Regiones ──────────────────────────────────────────── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regiones.map((region) => {
            const count = counts[region.slug] ?? 0;
            return (
              <Link
                key={region.slug}
                href={`/constructoras/region/${region.slug}`}
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-border/40 bg-card/60 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Emoji + Nombre */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" role="img" aria-label={region.nombre}>
                    {region.emoji}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {count > 0 ? `${Math.min(count, 40)} empresas` : "Próximamente"}
                  </span>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                    {region.nombre}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {region.capital}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground mt-auto flex items-center justify-between">
                  <span className="font-medium text-brand-teal text-[10px] uppercase tracking-wider">
                    {region.recomendacion}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── CTA volver al directorio ──────────────────────────────────── */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <div className="flex items-center gap-3 p-6 rounded-2xl border border-border/40 bg-card/40">
          <Building2 className="w-5 h-5 text-brand-teal shrink-0" />
          <p className="text-sm text-muted-foreground">
            ¿Prefieres ver todas las constructoras sin filtro de región?{" "}
            <Link href="/constructoras" className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-2">
              Ver directorio general →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
