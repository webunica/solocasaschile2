import { getModelosFiltered } from "@/lib/supabase/services";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bath, Bed, Ruler, Star } from "lucide-react";

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  modular: "Modular",
  "steel-framing": "Steel Framing",
};

export async function FeaturedModelsSection() {
  const models = await getModelosFiltered({});
  const masterId = "cb85b919-4008-46bc-bbb8-b3211152280c";
  const filteredByMaster = models.filter((model) => model.constructora_id === masterId);
  const featured = (filteredByMaster.length >= 3 ? filteredByMaster : models).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="section-frame overflow-hidden px-4 py-24 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow">Selección de modelos</span>
            <h2 className="max-w-4xl text-[clamp(2.7rem,6vw,5rem)] font-semibold tracking-[-0.05em]">
              Modelos destacados para comparar superficie, precio y sistema constructivo.
            </h2>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground/90">
              Revisa dimensiones, número de dormitorios, baños y valor referencial para cotizar directamente con la empresa responsable del proyecto.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="cta-pill px-8 py-3 text-sm font-extrabold uppercase tracking-[0.18em]"
          >
            Ver catálogo completo
            <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featured.map((modelo, index) => {
            const hasValidPrice = typeof modelo.precio_desde_uf === "number" && modelo.precio_desde_uf > 0;

            return (
              <article
                key={modelo.id}
                className="group overflow-hidden rounded-[2rem] border border-border/70 bg-white"
              >
                <Link href={`/modelo/${modelo.slug}`} className="relative block h-80 overflow-hidden">
                  <Image
                    src={modelo.imagenes_urls?.[0] || "/hero.png"}
                    alt={modelo.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                    <Badge className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {TIPO_LABELS[modelo.tipo] || modelo.tipo}
                    </Badge>

                    {modelo.constructora?.plan === "premium" && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-evergreen-dark">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Premium
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="inline-block rounded-2xl bg-[rgba(0,38,43,0.72)] px-4 py-3 backdrop-blur-sm">
                      {hasValidPrice ? (
                        <>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/72">Desde</p>
                          <p className="mt-1 text-3xl font-semibold tracking-[-0.05em]">
                            {modelo.precio_desde_uf.toLocaleString("es-CL")} <span className="text-base font-semibold">UF</span>
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-bold tracking-tight text-white py-1">
                          Precio a consultar
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="space-y-8 p-7">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-indigo/70">
                      {modelo.constructora?.nombre}
                    </p>
                    <Link href={`/modelo/${modelo.slug}`}>
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground transition-colors group-hover:text-brand-indigo">
                        {modelo.nombre}
                      </h3>
                    </Link>
                    <p className="text-sm font-medium leading-relaxed text-foreground/85">
                      Modelo con especificaciones técnicas disponibles, fotos referenciales y cotización directa a la constructora.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-y border-border/60 py-5">
                    <div>
                      <Ruler className="mb-2 h-4 w-4 text-brand-teal" />
                      <p className="text-xl font-semibold tracking-tight text-brand-indigo">{modelo.superficie_m2}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/60">m2</p>
                    </div>
                    <div>
                      <Bed className="mb-2 h-4 w-4 text-brand-teal" />
                      <p className="text-xl font-semibold tracking-tight text-brand-indigo">{modelo.dormitorios}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/60">dorm.</p>
                    </div>
                    <div>
                      <Bath className="mb-2 h-4 w-4 text-brand-teal" />
                      <p className="text-xl font-semibold tracking-tight text-brand-indigo">{modelo.banos}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-foreground/60">baños</p>
                    </div>
                  </div>

                  <Link
                    href={`/modelo/${modelo.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-indigo"
                  >
                    Revisar ficha técnica
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
