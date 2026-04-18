import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, ArrowRight, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";
import { buttonVariants } from "@/components/ui/button";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";

// ─── Datos de regiones ──────────────────────────────────────────────────────

interface RegionInfo {
  nombre: string;          // Nombre display en chileno
  supabaseNombre: string;  // Nombre exacto usado en la DB (campo regiones[])
  slug: string;            // URL slug
  capital: string;
  clima: string;
  recomendacion: string;   // Sistema constructivo más recomendado para esa región
  intro: string;
  faqs: { q: string; a: string }[];
}

const REGIONES: Record<string, RegionInfo> = {
  "arica": {
    nombre: "Región de Arica y Parinacota",
    supabaseNombre: "Arica y Parinacota",
    slug: "arica",
    capital: "Arica",
    clima: "Desértico costero / Altiplánico",
    recomendacion: "Modular o Metalcom",
    intro: "La puerta norte de Chile presenta desafíos de alta radiación UV y aridez. Las casas prefabricadas en Arica deben priorizar la protección térmica del techo y materiales que no se degraden con el sol extremo y la salinidad costera.",
    faqs: [
      { q: "¿Qué casa es mejor para el calor de Arica?", a: "Se recomiendan sistemas con alta inercia térmica o aislación reflectiva. El Metalcom con recubrimiento adecuado es ideal para evitar la corrosión salina cerca de la costa." },
      { q: "¿Hay constructoras en Arica?", a: "Sí, contamos con proveedores que despachan kits y ofrecen montaje en la XV región y zonas altiplánicas como Putre." }
    ],
  },
  "tarapaca": {
    nombre: "Región de Tarapacá",
    supabaseNombre: "Tarapacá",
    slug: "tarapaca",
    capital: "Iquique",
    clima: "Desértico",
    recomendacion: "Modular o Container",
    intro: "En Tarapacá, la rapidez de montaje es clave para el sector minero y habitacional. Iquique y Alto Hospicio ven un auge en casas de containers y sistemas modulares por su adaptabilidad al terreno arenoso.",
    faqs: [
      { q: "¿Precio de casa prefabricada en Iquique?", a: "Los precios parten desde las 10 UF/m2 para kits básicos. El montaje en Alto Hospicio puede tener costos adicionales por nivelación de terreno." }
    ],
  },
  "antofagasta": {
    nombre: "Región de Antofagasta",
    supabaseNombre: "Antofagasta",
    slug: "antofagasta",
    capital: "Antofagasta",
    clima: "Desértico absoluto / Desértico costero",
    recomendacion: "Steel Framing o Hormigón Celular",
    intro: "La capital minera de Chile requiere viviendas robustas. Con oscilaciones térmicas día/noche en Calama y San Pedro de Atacama, el hormigón celular y el Steel Framing son las opciones más estables.",
    faqs: [
      { q: "¿Construyen en Calama?", a: "Sí, nuestras constructoras asociadas tienen soluciones para la altura y el frío nocturno del desierto interior." }
    ],
  },
  "atacama": {
    nombre: "Región de Atacama",
    supabaseNombre: "Atacama",
    slug: "atacama",
    capital: "Copiapó",
    clima: "Desértico transicional",
    recomendacion: "SIP o Metalcom",
    intro: "Copiapó y Vallenar presentan un clima seco ideal para la conservación de estructuras de metal. Las Tiny Houses son tendencia en los valles interiores de Atacama por su bajo impacto ambiental.",
    faqs: []
  },
  "coquimbo": {
    nombre: "Región de Coquimbo",
    supabaseNombre: "Coquimbo",
    slug: "coquimbo",
    capital: "La Serena",
    clima: "Mediterráneo transicional",
    recomendacion: "Prefabricada panelizada o SIP",
    intro: "La Serena, Coquimbo y el Valle del Elqui buscan estética y eficiencia. Las casas prefabricadas de madera tratada y SIP son las favoritas para segundas viviendas y turismo rural.",
    faqs: [
      { q: "¿Buscas casa en el Valle del Elqui?", a: "Recomendamos sistemas modulares de rápido montaje para minimizar la intervención en el paisaje natural del valle." }
    ]
  },
  "valparaiso": {
    nombre: "Región de Valparaíso",
    supabaseNombre: "Valparaíso",
    slug: "valparaiso",
    capital: "Valparaíso",
    clima: "Mediterráneo costero",
    recomendacion: "Panel SIP o Steel Framing",
    intro: "La Región de Valparaíso tiene un clima mediterráneo costero con alta humedad en el litoral y temperaturas más extremas en el interior (Quillota, Los Andes). Las casas prefabricadas SIP son ideales por su resistencia a la humedad, mientras que los sistemas de Steel Framing galvanizado ofrecen durabilidad extra frente a la salitre costera.",
    faqs: [
      { q: "¿Qué sistema es mejor para la costa?", a: "Para Viña del Mar o Concón, se recomienda SIP con OSB tratado o Steel Framing, ya que resisten la salinidad mejor que la madera sin tratar." },
    ],
  },
  "metropolitana": {
    nombre: "Región Metropolitana",
    supabaseNombre: "Metropolitana",
    slug: "metropolitana",
    capital: "Santiago",
    clima: "Mediterráneo semiárido",
    recomendacion: "Cualquier sistema (SIP el más eficiente)",
    intro: "La Región Metropolitana concentra la mayor demanda de Chile. Su clima moderado permite usar cualquier sistema, siendo el SIP el preferido para quienes buscan ahorro energético real en invierno y verano.",
    faqs: [
      { q: "¿Permisos en Santiago?", a: "Todas las constructoras en SolocasasChile ayudan con la carpeta técnica para la DOM de tu comuna en Santiago." },
    ],
  },
  "ohiggins": {
    nombre: "Región de O'Higgins",
    supabaseNombre: "O'Higgins",
    slug: "ohiggins",
    capital: "Rancagua",
    clima: "Mediterráneo interior",
    recomendacion: "Prefabricada o SIP",
    intro: "Rancagua y San Fernando tienen gran disponibilidad de parcelas de agrado. Las casas prefabricadas tipo campo con techos altos son las más solicitadas en la VI región.",
    faqs: []
  },
  "maule": {
    nombre: "Región del Maule",
    supabaseNombre: "Maule",
    slug: "maule",
    capital: "Talca",
    clima: "Mediterráneo húmedo",
    recomendacion: "Madera o SIP",
    intro: "El corazón agrícola de Chile. En Talca y Linares, la madera es el material noble por excelencia, evolucionando hacia paneles SIP para cumplir con las nuevas exigencias térmicas regionales.",
    faqs: []
  },
  "nuble": {
    nombre: "Región de Ñuble",
    supabaseNombre: "Ñuble",
    slug: "nuble",
    capital: "Chillán",
    clima: "Mediterráneo húmedo",
    recomendacion: "SIP o Metalcom",
    intro: "La región de Ñuble, con centro en Chillán, demanda viviendas que soporten inviernos fríos y veranos calurosos. El panel SIP es la solución más equilibrada para el centro-sur de Chile.",
    faqs: []
  },
  "biobio": {
    nombre: "Región del Biobío",
    supabaseNombre: "Biobío",
    slug: "biobio",
    capital: "Concepción",
    clima: "Templado lluvioso",
    recomendacion: "Panel SIP (impermeable)",
    intro: "Concepción y alrededores requieren protección contra la lluvia constante. El sistema SIP con membrana hidrófuga de alto tráfico es vital para asegurar la vida útil de la casa en el Biobío.",
    faqs: [
      { q: "¿Resisten sismos?", a: "Nuestros sistemas cumplen la NCh433 de diseño sísmico, vital para la zona de Concepción." },
    ],
  },
  "araucania": {
    nombre: "Región de La Araucanía",
    supabaseNombre: "La Araucanía",
    slug: "araucania",
    capital: "Temuco",
    clima: "Templado lluvioso frío",
    recomendacion: "SIP (Aislación extrema)",
    intro: "En Temuco, Pucón y Villarrica, el frío y la humedad son constantes. La Araucanía es el reino del Panel SIP en Chile, ofreciendo el mejor retorno de inversión en calefacción.",
    faqs: []
  },
  "los-rios": {
    nombre: "Región de Los Ríos",
    supabaseNombre: "Los Ríos",
    slug: "los-rios",
    capital: "Valdivia",
    clima: "Oceánico muy lluvioso",
    recomendacion: "SIP o Madera impregnada",
    intro: "Valdivia es la zona más lluviosa de Chile. Aquí la construcción prefabricada debe incluir sellos de silicona industrial y sobre-cimientos altos para evitar el contacto directo con la humedad del suelo.",
    faqs: []
  },
  "los-lagos": {
    nombre: "Región de Los Lagos",
    supabaseNombre: "Los Lagos",
    slug: "los-lagos",
    capital: "Puerto Montt",
    clima: "Oceánico lluvioso",
    recomendacion: "SIP (100mm mínimo)",
    intro: "Puerto Montt y Chiloé exigen resistencia al viento y la lluvia. Las casas SIP con paneles de alta densidad son la norma para asegurar confort en la X región.",
    faqs: []
  },
  "aysen": {
    nombre: "Región de Aysén",
    supabaseNombre: "Aysén",
    slug: "aysen",
    capital: "Coyhaique",
    clima: "Frío oceánico / Estepárico frío",
    recomendacion: "SIP de 150mm o Modular",
    intro: "Coyhaique y la Patagonia requieren aislación nivel experto. Aquí recomendamos paneles SIP de 150mm o sistemas modulares que llegan terminados de fábrica para evitar demoras por mal clima en obra.",
    faqs: [
      { q: "¿Llegan a la Carretera Austral?", a: "Sí, coordinamos logística de barcaza y camión para entregar kits en zonas remotas de Aysén." }
    ]
  },
  "magallanes": {
    nombre: "Región de Magallanes",
    supabaseNombre: "Magallanes",
    slug: "magallanes",
    capital: "Punta Arenas",
    clima: "Frío estepárico con vientos",
    recomendacion: "SIP alta densidad / Steel Framing",
    intro: "El extremo sur de Chile demanda casas capaces de soportar vientos de 120km/h y temperaturas bajo cero. El sistema de Punta Arenas debe priorizar la aislación de la loza de fundación y ventanas termopanel premium.",
    faqs: [
      { q: "¿Resisten el viento de Magallanes?", a: "Nuestras estructuras están calculadas para las cargas de viento extremas de la XII región según normativa NCh432." }
    ]
  },
};

// Genera una lista de paths estáticos para ISR
export function generateStaticParams() {
  return Object.keys(REGIONES).map((slug) => ({ region: slug }));
}

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  const info = REGIONES[region];
  if (!info) return { title: "Región no encontrada" };

  const title = `Casas Prefabricadas en ${info.nombre} 2026 | Modelos y Constructoras | SolocasasChile`;
  const description = `Compara modelos de casas prefabricadas, SIP y modulares en ${info.nombre}. Constructoras verificadas, precios desde UF y guía especializada para construir en ${info.capital} y alrededores.`;

  return {
    title,
    description,
    keywords: [
      `casas prefabricadas ${info.nombre.toLowerCase()}`,
      `casas sip ${info.capital.toLowerCase()}`,
      `casas modulares ${info.nombre.toLowerCase()}`,
      `constructoras ${info.nombre.toLowerCase()}`,
      `construir casa ${info.capital.toLowerCase()}`,
      `precio casa prefabricada ${info.nombre.toLowerCase()}`,
      "casas prefabricadas chile",
    ],
    alternates: { canonical: `https://solocasaschile.com/region/${region}` },
    openGraph: {
      title,
      description,
      url: `https://solocasaschile.com/region/${region}`,
      siteName: "SolocasasChile",
      locale: "es_CL",
      type: "website",
    },
  };
}

export const revalidate = 3600;

export default async function RegionPage({ params }: PageProps) {
  const { region } = await params;
  const info = REGIONES[region];
  if (!info) notFound();

  // Fetch modelos filtrados por this region using the same service as catálogo
  const modelos = await getModelosFiltered({ region });

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Regiones", url: "https://solocasaschile.com/constructoras" },
    { name: `Casas Prefabricadas ${info.nombre}`, url: `https://solocasaschile.com/region/${region}` },
  ]);
  const faqLd = buildFAQJsonLd(info.faqs.map(f => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-background pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-teal/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-indigo/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-12">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/constructoras" className="hover:text-white/80 transition-colors">Regiones</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">{info.nombre}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase">
                <MapPin className="w-3.5 h-3.5 text-brand-teal" /> {info.nombre}
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white leading-[0.95]">
                  Casas Prefabricadas<br />
                  <span className="text-brand-teal">en {info.nombre}</span>
                </h1>
                <p className="text-lg text-white/60 leading-relaxed max-w-xl font-medium">
                  {info.intro.substring(0, 200)}...
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Capital", value: info.capital },
                  { label: "Clima", value: info.clima },
                  { label: "Recomendado", value: info.recomendacion },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-white leading-tight">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#modelos"
                  className={buttonVariants({ size: "lg", className: "font-semibold" })}
                >
                  Ver modelos disponibles
                </a>
                <Link
                  href="/catalogo"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "border-white/20 text-white hover:bg-white/10 font-semibold" })}
                >
                  Todo el catálogo nacional
                </Link>
              </div>
            </div>

            {/* Stats / trust card */}
            <div className="hidden lg:block">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-[3rem] p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-brand-teal" />
                  </div>
                  <div>
                    <p className="font-black text-white text-lg">
                      {modelos.length > 0 ? `${modelos.length}+` : "Varios"} modelos
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">disponibles en {info.nombre}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Constructoras verificadas con cobertura regional",
                    "Permisos de edificación gestionados",
                    "Entrega en 60-120 días desde la firma",
                    "Cumplimiento OGUC garantizado",
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/constructoras"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-teal hover:text-brand-teal/80 transition-colors"
                >
                  Ver directorio de constructoras <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Catálogo filtrado ────────────────────────────────────── */}
      <section id="modelos" className="py-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tight">
                Catálogo para <span className="text-primary">{info.nombre}</span>
              </h2>
              <p className="text-muted-foreground">
                Modelos de constructoras que operan en {info.nombre}. Compara precios, m² y sistemas constructivos.
              </p>
            </div>
            <Link href="/catalogo" className={buttonVariants({ variant: "ghost", className: "text-primary hover:text-primary/80" })}>
              Ver catálogo completo <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {modelos.length > 0 ? (
            <CatalogoGrid modelos={modelos} />
          ) : (
            <div className="bg-muted/30 border border-dashed border-border rounded-3xl py-20 text-center space-y-4">
              <div className="text-5xl">📦</div>
              <h3 className="text-xl font-bold">Cargando modelos para {info.nombre}…</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Usa el catálogo completo para ver todos los modelos disponibles y filtra por región.
              </p>
              <div className="flex justify-center gap-4 flex-wrap pt-2">
                <Link href={`/catalogo?region=${region}`} className={buttonVariants()}>
                  Buscar por región en catálogo
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Editorial + FAQ ──────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="container max-w-4xl mx-auto px-4 md:px-8 space-y-16">

          {/* Intro editorial */}
          <div className="space-y-4 max-w-3xl">
            <Badge variant="outline" className="border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary rounded-full">
              Guía Regional
            </Badge>
            <h2 className="text-3xl font-heading font-bold tracking-tight">
              ¿Por qué construir en {info.nombre}?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {info.intro}
            </p>
          </div>

          {/* FAQ visible */}
          <div className="space-y-8">
            <h3 className="text-2xl font-heading font-bold tracking-tight">
              Preguntas frecuentes sobre casas prefabricadas en {info.nombre}
            </h3>
            <div className="space-y-3">
              {info.faqs.map((faq, i) => (
                <details key={i} className="group rounded-[2rem] border border-border/40 bg-background overflow-hidden open:border-primary/20 transition-all">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-bold text-sm list-none [&::-webkit-details-marker]:hidden hover:bg-muted/20 transition-colors">
                    <span>{faq.q}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-open:rotate-45 group-open:border-primary group-open:text-primary transition-all text-base font-black">+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-2 text-muted-foreground font-medium leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Otras regiones */}
          <div className="border-t border-border/40 pt-12 space-y-6">
            <h3 className="text-lg font-bold tracking-tight text-muted-foreground uppercase tracking-widest text-sm">
              Otras regiones de Chile
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(REGIONES)
                .filter(([slug]) => slug !== region)
                .map(([slug, r]) => (
                  <Link
                    key={slug}
                    href={`/region/${slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 text-xs font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                  >
                    <MapPin className="w-3 h-3" /> {r.nombre}
                  </Link>
                ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
            >
              Explorar Catálogo Completo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/constructoras"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40"
            >
              Ver Constructoras Verificadas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
