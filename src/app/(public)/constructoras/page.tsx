import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapaConstructoras } from "@/components/constructoras/mapa-constructoras";
import { ShieldCheck, Star, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio de Constructoras | SolocasasChile",
  description: "Encuentra las mejores empresas constructoras de casas prefabricadas, SIP y modulares en Chile. Revisa su score de confianza.",
};

export default async function ConstructorasPage() {
  const supabase = await createClient();
  const { data: constructoras = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, logo_url, descripcion, plan, verificada, score_confianza, regiones, proyectos_completados")
    .order("score_confianza", { ascending: false });

  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2 };
  const sorted = [...(constructoras || [])].sort((a, b) => {
    const diff = (planOrder[a.plan] ?? 2) - (planOrder[b.plan] ?? 2);
    if (diff !== 0) return diff;
    return (b.score_confianza ?? 0) - (a.score_confianza ?? 0);
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
            Directorio de <span className="gradient-text">Constructoras</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl">
            Empresas verificadas y rankeadas por score de confianza. Encuentra la constructora ideal para tu proyecto.
          </p>
          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
            <span>{sorted.length} constructoras registradas</span>
            <span>·</span>
            <span>{sorted.filter((c) => c.verificada).length} verificadas</span>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-20">
        {/* Mapa de Chile */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-black tracking-tight flex items-center gap-3">
              <MapPin className="w-7 h-7 text-brand-coral" /> Cobertura por Región
            </h2>
            <p className="text-muted-foreground font-medium">Haz clic en cualquier punto del mapa para ver las constructoras activas en esa región.</p>
          </div>
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-10 shadow-xl shadow-primary/5">
            <MapaConstructoras constructoras={sorted} />
          </div>
        </section>

        {/* Grid de Constructoras */}
        <section className="space-y-8">
          <h2 className="text-3xl font-heading font-black tracking-tight">
            Todas las Constructoras
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map((c) => (
              <Link
                key={c.id}
                href={`/constructora/${c.slug}`}
                className="group bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 hover:border-primary/30 hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/5 flex flex-col gap-6"
              >
                {/* Logo + plan badge */}
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl border-2 border-border/40 bg-background flex items-center justify-center p-3 overflow-hidden group-hover:border-primary/30 transition-colors">
                    {c.logo_url ? (
                      <Image src={c.logo_url} alt={c.nombre} width={48} height={48} className="object-contain" />
                    ) : (
                      <span className="text-2xl font-black text-brand-indigo">{c.nombre[0]}</span>
                    )}
                  </div>
                  {c.plan === "premium" ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-black text-[9px] uppercase tracking-widest">
                      <Star className="w-2.5 h-2.5 mr-1 fill-current" /> Premium
                    </Badge>
                  ) : c.plan === "pro" ? (
                    <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest">Pro</Badge>
                  ) : null}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-xl tracking-tight group-hover:text-primary transition-colors">{c.nombre}</h3>
                    {c.verificada && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                  </div>
                  {c.descripcion && (
                    <p className="text-muted-foreground font-medium text-sm line-clamp-2 leading-relaxed">{c.descripcion}</p>
                  )}
                </div>

                {/* Score + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Score Confianza</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-brand-indigo">{c.score_confianza ?? "–"}</span>
                      <span className="text-[10px] font-bold opacity-40">/100</span>
                    </div>
                  </div>
                  <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-primary group-hover:text-white border-border transition-all")}>
                    Ver Perfil <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
