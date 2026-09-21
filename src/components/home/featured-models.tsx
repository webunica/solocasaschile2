import { getModelosFiltered } from "@/lib/supabase/services";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedModelsCarousel } from "./featured-models-carousel";

export async function FeaturedModelsSection() {
  const models = await getModelosFiltered({});
  const masterId = "cb85b919-4008-46bc-bbb8-b3211152280c";
  const filteredByMaster = models.filter((model) => model.constructora_id === masterId);
  const featured = filteredByMaster.length > 0 ? filteredByMaster : models;

  if (featured.length === 0) return null;

  return (
    <section className="section-frame overflow-hidden px-4 py-24 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow">Selección de modelos</span>
            <h2 className="max-w-4xl text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold tracking-[-0.05em] leading-[1.05]">
              Modelos destacados para comparar superficie, precio y sistema constructivo.
            </h2>
            <p className="max-w-2xl text-base sm:text-lg font-medium leading-relaxed text-foreground/85">
              Revisa dimensiones, número de dormitorios, baños y especificaciones de cada diseño con cotización directa a la constructora.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="cta-pill px-8 py-3 text-sm font-extrabold uppercase tracking-[0.18em] shrink-0"
          >
            Ver catálogo completo
            <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </div>

        <FeaturedModelsCarousel models={featured} />
      </div>
    </section>
  );
}
