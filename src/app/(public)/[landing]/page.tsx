import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Hammer, Home, Search } from "lucide-react";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";
import { SEO_INTENT_PAGE_BY_SLUG, SEO_INTENT_PAGES } from "@/lib/seo/intent-pages";

const SITE_URL = "https://solocasaschile.com";
const CONTENT_REVIEWED_AT = "2026-04-28";

type PageProps = {
  params: Promise<{ landing: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_INTENT_PAGES.map((page) => ({ landing: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landing } = await params;
  const page = SEO_INTENT_PAGE_BY_SLUG.get(landing);

  if (!page) {
    return {
      title: "Pagina no encontrada | SolocasasChile",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "SolocasasChile",
      locale: "es_CL",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`${SITE_URL}/twitter-image.jpg`],
    },
  };
}

export default async function SeoIntentLandingPage({ params }: PageProps) {
  const { landing } = await params;
  const page = SEO_INTENT_PAGE_BY_SLUG.get(landing);

  if (!page) notFound();

  const models = await getModelosFiltered({
    tipo: page.type,
    sortBy: page.catalogHref.includes("sort=price_asc") ? "price_asc" : undefined,
  });
  const featuredModels = models.slice(0, 6);
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const relatedPages = SEO_INTENT_PAGES.filter((relatedPage) => {
    if (relatedPage.slug === page.slug) return false;
    if (page.type && relatedPage.type === page.type) return true;
    return relatedPage.primaryKeyword.includes(page.primaryKeyword.split(" ")[0]);
  }).slice(0, 4);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: SITE_URL },
    { name: page.h1, url: pageUrl },
  ]);
  const faqJsonLd = buildFAQJsonLd(page.faqs);
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    headline: page.h1,
    description: page.description,
    url: pageUrl,
    inLanguage: "es-CL",
    dateModified: CONTENT_REVIEWED_AT,
    isPartOf: {
      "@type": "WebSite",
      name: "SolocasasChile",
      url: SITE_URL,
    },
    about: page.keywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    reviewedBy: {
      "@type": "Organization",
      name: "SolocasasChile",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SolocasasChile",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Modelos destacados para ${page.primaryKeyword}`,
    itemListElement: featuredModels.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: model.nombre,
      url: `${SITE_URL}/modelo/${model.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background pt-36 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd).replace(/</g, "\\u003c") }}
      />
      {featuredModels.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
        />
      )}

      <section className="container mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid gap-10 rounded-[2rem] border border-border/50 bg-gradient-to-br from-brand-indigo/10 via-background to-brand-teal/10 p-7 md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div className="space-y-7">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
              {page.eyebrow}
            </p>
            <div className="space-y-5">
              <h1 className="font-heading text-4xl font-black leading-none tracking-tight md:text-6xl">
                {page.h1}
              </h1>
              <p className="max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground">
                {page.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={page.catalogHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Ver modelos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={page.secondaryHref}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-xs font-black uppercase tracking-widest transition hover:border-primary/40"
              >
                {page.secondaryLabel}
              </Link>
            </div>
          </div>

          <aside className="grid gap-3 self-start rounded-2xl border border-border/50 bg-card/60 p-5">
            {[
              { icon: Search, label: "Keyword objetivo", value: page.primaryKeyword },
              { icon: Home, label: "Modelos disponibles", value: `${models.length}` },
              { icon: Hammer, label: "Siguiente paso", value: "Cotizar y comparar" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-background/70 p-4">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-black">{item.value}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="container mx-auto mt-14 max-w-6xl px-6 md:px-12">
        <div className="grid gap-5 md:grid-cols-2">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-border/50 bg-card/35 p-6">
              <h2 className="text-xl font-black tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {(page.checklist || page.processSteps || page.costItems) && (
        <section className="container mx-auto mt-16 max-w-6xl px-6 md:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            {page.checklist && (
              <article className="rounded-2xl border border-border/50 bg-card/35 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                  Checklist antes de cotizar
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Datos que conviene tener claros
                </h2>
                <ul className="mt-5 space-y-3">
                  {page.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {page.processSteps && (
              <article className="rounded-2xl border border-border/50 bg-card/35 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                  Proceso recomendado
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Como avanzar sin comparar a ciegas
                </h2>
                <div className="mt-5 space-y-4">
                  {page.processSteps.map((step) => (
                    <div key={step.title} className="rounded-xl border border-border/40 bg-background/70 p-4">
                      <h3 className="text-sm font-black tracking-tight">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>

          {page.costItems && (
            <div className="mt-6 rounded-2xl border border-border/50 bg-card/35 p-6">
              <div className="max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                  Presupuesto real
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Partidas que explican el costo final
                </h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {page.costItems.map((item) => (
                  <article key={item.label} className="rounded-xl border border-border/40 bg-background/70 p-4">
                    <h3 className="text-sm font-black tracking-tight">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="container mx-auto mt-16 max-w-6xl px-6 md:px-12">
        <div className="grid gap-6 rounded-2xl border border-border/50 bg-card/35 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              Criterio editorial
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Como usamos esta guia
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
              SolocasasChile es un comparador independiente. Organizamos estas
              paginas por intencion de busqueda para ayudarte a comparar
              modelos, alcances y constructoras antes de pedir cotizaciones.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Datos comparables",
                detail: "Precio desde UF, superficie, sistema constructivo y cobertura regional.",
              },
              {
                title: "Alcance claro",
                detail: "Diferenciamos modelo base, traslado, montaje, fundaciones y terminaciones.",
              },
              {
                title: "Actualizacion",
                detail: `Contenido revisado el ${CONTENT_REVIEWED_AT} para mantener coherencia del cluster SEO.`,
              },
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-border/40 bg-background/70 p-4">
                <h3 className="text-sm font-black tracking-tight">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {featuredModels.length > 0 && (
        <section className="container mx-auto mt-16 max-w-6xl px-6 md:px-12">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                Seleccion inicial
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Modelos destacados</h2>
            </div>
            <Link href={page.catalogHref} className="text-xs font-black uppercase tracking-widest text-primary">
              Ver catalogo filtrado
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredModels.map((model) => (
              <article key={model.id} className="rounded-2xl border border-border/50 bg-card/40 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {model.tipo}
                </p>
                <h3 className="mt-2 text-lg font-black tracking-tight">{model.nombre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Desde {model.precio_desde_uf} UF · {model.superficie_m2} m2 · {model.dormitorios} dorm.
                </p>
                <Link href={`/modelo/${model.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary">
                  Ver modelo <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {relatedPages.length > 0 && (
        <section className="container mx-auto mt-16 max-w-6xl px-6 md:px-12">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Enlaces relacionados
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Sigue comparando por intencion
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedPages.map((relatedPage) => (
              <Link
                key={relatedPage.slug}
                href={`/${relatedPage.slug}`}
                className="group rounded-2xl border border-border/50 bg-card/35 p-5 transition hover:-translate-y-1 hover:border-primary/30"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {relatedPage.primaryKeyword}
                </p>
                <h3 className="mt-3 text-base font-black tracking-tight group-hover:text-primary">
                  {relatedPage.h1}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  Abrir pagina <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto mt-16 max-w-5xl px-6 md:px-12">
        <h2 className="text-2xl font-black tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-3">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-border/50 bg-card/30 p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-black tracking-tight">
                <span>{faq.question}</span>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-teal" aria-hidden="true" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
