import { createClient } from "@/lib/supabase/server";
import { CONSTRUCTORAS } from "@/lib/mock-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PremiumCarousel } from "@/components/constructoras/premium-carousel";

export async function FeaturedConstructorsSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, plan, score_confianza, logo_url, verificada, descripcion, user_id")
    .not("user_id", "is", null)
    .order("score_confianza", { ascending: false })
    .limit(12);

  const featured = data && data.length > 0
    ? data
    : CONSTRUCTORAS.slice(0, 3).map((constructora) => ({
        id: constructora.id,
        nombre: constructora.nombre,
        slug: constructora.slug,
        plan: constructora.plan,
        score_confianza: constructora.scoreConfianza,
        logo_url: constructora.logo,
        verificada: constructora.verificada,
      }));

  return (
    <section className="section-frame relative overflow-hidden px-4 py-28 sm:px-6 md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,82,66,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(214,124,70,0.12),transparent_30%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow">Constructoras destacadas</span>
            <h2 className="max-w-4xl text-[clamp(2.7rem,6vw,5rem)] font-black tracking-[-0.05em]">
              Empresas con presencia regional y modelos publicados.
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground/90">
              Revisa datos de contacto, regiones de cobertura y catálogos de cada empresa para cotizar con información clara.
            </p>
          </div>

          <Link
            href="/constructoras"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full border-brand-indigo/15 px-8 py-6 font-extrabold uppercase tracking-[0.18em]"
            )}
          >
            Ver directorio completo
            <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </div>

        <PremiumCarousel constructoras={featured || []} />
      </div>
    </section>
  );
}
