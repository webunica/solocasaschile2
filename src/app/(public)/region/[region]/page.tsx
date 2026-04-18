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
  "metropolitana": {
    nombre: "Región Metropolitana",
    supabaseNombre: "Metropolitana",
    slug: "metropolitana",
    capital: "Santiago",
    clima: "Mediterráneo semiárido",
    recomendacion: "Prefabricada o SIP",
    intro: "La Región Metropolitana de Santiago concentra la mayor demanda de casas prefabricadas en Chile. Su clima mediterráneo moderado permite usar prácticamente cualquier sistema constructivo sin costos extra de aislación. Las constructoras que operan en la RM ofrecen desde modelos urbanos compactos hasta viviendas de dos pisos para terrenos en condominios.",
    faqs: [
      { q: "¿Cuánto cuesta una casa prefabricada en la Región Metropolitana?", a: "El precio de una casa prefabricada en la Región Metropolitana varía entre 700 y 2.500 UF dependiendo del sistema constructivo (SIP, modular o panelizado) y la superficie. El valor del terreno es el principal factor de costo en la RM, generalmente superior al de regiones." },
      { q: "¿Se puede construir una casa prefabricada en Santiago?", a: "Sí. En la Región Metropolitana puedes construir casa prefabricada en cualquier comunas que tenga zonificación habitacional. Debes tramitar el permiso de edificación en la DOM de tu municipio (Maipú, Puente Alto, Melipilla, etc.) y cumplir con las exigencias del plano regulador comunal." },
      { q: "¿Qué constructoras de casas prefabricadas cubren la Región Metropolitana?", a: "SolocasasChile tiene listadas varias constructoras que operan en la Región Metropolitana. Puedes filtrar por región en nuestro catálogo para comparar precios y modelos disponibles en Santiago y comunas aledañas." },
    ],
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
      { q: "¿Qué sistema constructivo es mejor para la costa de Valparaíso?", a: "Para zonas costeras de Valparaíso como Viña del Mar, Concón o Quintero, se recomienda el sistema SIP con OSB tratado o el Steel Framing galvanizado, ya que ambos resisten la humedad y la salitre mejor que los paneles de madera sin tratamiento." },
      { q: "¿Cuánto cuesta construir una casa en la Región de Valparaíso?", a: "El precio de una casa prefabricada en Valparaíso varía entre 650 y 2.300 UF según el sistema y superficie. Los costos de mano de obra son ligeramente menores que en la RM, lo que puede hacer más conveniente construir en ciudades como Quillota, San Felipe o Los Andes." },
      { q: "¿Se puede construir casa prefabricada en zonas de quema de Valparaíso?", a: "Sí, pero con restricciones adicionales. Muchas comunas de Valparaíso exigen materiales con mayor resistencia al fuego (REI 60 o superior). Los sistemas SIP con revestimiento de fibrocemento y los muros de hormigón prefabricado son los más recomendados en zonas de riesgo de incendio." },
    ],
  },
  "biobio": {
    nombre: "Región del Biobío",
    supabaseNombre: "Biobío",
    slug: "biobio",
    capital: "Concepción",
    clima: "Templado lluvioso",
    recomendacion: "Panel SIP",
    intro: "La Región del Biobío concentra una importante industria maderera que abastece a numerosas constructoras de casas prefabricadas en Chile. Su clima templado lluvioso (800-1.500 mm/año en la zona costera) hace imprescindible una buena aislación térmica e impermeabilización. El panel SIP es el sistema más adoptado en Concepción, Chillán y Los Ángeles por su alta performance en climas húmedos.",
    faqs: [
      { q: "¿Es el Biobío una buena región para casas prefabricadas?", a: "Sí. El Biobío es una de las regiones con mayor oferta de constructoras de casas prefabricadas en Chile, gracias a la disponibilidad local de madera y mano de obra capacitada. Los precios tienden a ser entre un 10-20% más bajos que en la Región Metropolitana." },
      { q: "¿Qué hacer si la zona tiene alta sismicidad como en Concepción?", a: "Todos los sistemas constructivos certificados en SolocasasChile cumplen con la NCh433, la norma chilena de diseño sísmico. El Panel SIP y el Steel Framing han demostrado excelente comportamiento sísmico en terremotos anteriores en la zona del Biobío." },
      { q: "¿Cuánto demora tramitar el permiso de edificación en el Biobío?", a: "En municipios como Concepción, Chillán o Los Ángeles el plazo promedio es de 30 a 60 días hábiles. Las constructoras verificadas en SolocasasChile conocen los requisitos locales y te acompañan en la tramitación." },
    ],
  },
  "araucania": {
    nombre: "Región de La Araucanía",
    supabaseNombre: "La Araucanía",
    slug: "araucania",
    capital: "Temuco",
    clima: "Templado lluvioso frío",
    recomendacion: "Panel SIP (alta aislación)",
    intro: "La Araucanía es la región donde el Panel SIP demuestra todo su potencial. Con inviernos fríos y lluviosos en Temuco, Villarrica y Pucón, y zonas cordilleranas con nevazones frecuentes, el sistema SIP de paneles gruesos (EPS 100 o 150mm) puede reducir el consumo de calefacción hasta un 60%. El mercado de casas prefabricadas en La Araucanía es muy activo, incluyendo cabañas y casas de segunda vivienda en zonas lacustres.",
    faqs: [
      { q: "¿Qué tipo de casa prefabricada es mejor para el clima de La Araucanía?", a: "Para La Araucanía se recomienda el sistema Panel SIP con paneles de al menos 100mm de EPS (idealmente 150mm en zonas cordilleranas) y cubierta de alta pendiente para evacuar la nieve. La ventilación controlada es fundamental para evitar condiciones de humedad en interiores." },
      { q: "¿Cuánto cuesta una casa prefabricada en Temuco o Villarrica?", a: "El precio en La Araucanía varía entre 800 y 2.800 UF. Las cabañas para zonas lacustres (Villarrica, Pucón, Coñaripe) suelen estar en el rango de 500 a 1.500 UF. El sistema SIP tiene un costo base entre 18-25 UF/m² en la región." },
      { q: "¿Se pueden construir casas prefabricadas en terrenos rurales de La Araucanía?", a: "Sí, con algunos requisitos adicionales. Los terrenos rurales (fuera del radio urbano) deben acreditar acceso a agua potable y sistema de tratamiento de aguas servidas (fosa séptica o biodepuradora). Muchas constructoras en La Araucanía tienen experiencia en proyectos rurales." },
    ],
  },
  "los-lagos": {
    nombre: "Región de Los Lagos",
    supabaseNombre: "Los Lagos",
    slug: "los-lagos",
    capital: "Puerto Montt",
    clima: "Templado oceánico lluvioso",
    recomendacion: "Panel SIP (ultra aislación)",
    intro: "La Región de Los Lagos tiene el clima más desafiante de Chile para la construcción: altos índices de lluvia (2.000-4.000 mm/año), vientos fuertes y temperaturas bajas. Las casas prefabricadas SIP con paneles de alta densidad y revestimiento exterior impermeable (fibrocemento, OSB tratado o madera nativa) son la solución más adoptada en Puerto Montt, Castro y Coyhaique.",
    faqs: [
      { q: "¿Qué aislación necesita una casa en Los Lagos?", a: "En Los Lagos se recomienda un mínimo de EPS 100mm en muros perimetrales y 150mm en cubierta. Los especialistas en SolocasasChile recomiendan además barreras de vapor en el interior de los paneles y ventilación controlada (VMC) para evitar condensaciones en climas tan húmedos." },
      { q: "¿Es más cara la construcción prefabricada en Los Lagos?", a: "Sí, ligeramente. El traslado de materiales y el acabado exterior más robusto requerido por el clima pueden encarecer el proyecto entre un 15-25% respecto a la RM. Sin embargo, la eficiencia energética que se logra con el sistema SIP reduce significativamente los costos operacionales de por vida." },
      { q: "¿Puede una casa prefabricada resistir los vientos de Los Lagos?", a: "Sí. Las casas SIP y de Steel Framing están diseñadas para resistir vientos de hasta 150 km/h cuando se instalan correctamente con anclajes al terreno según la NCh432 (carga de nieve y viento). Es fundamental contratar constructoras con experiencia en la zona." },
    ],
  },
  "ohiggins": {
    nombre: "Región de O'Higgins",
    supabaseNombre: "O'Higgins",
    slug: "ohiggins",
    capital: "Rancagua",
    clima: "Mediterráneo semiárido interior",
    recomendacion: "Prefabricada o Modular",
    intro: "La Región de O'Higgins tiene un clima mediterráneo semiárido similar pero más cálido que la RM, con veranos secos y calurosos e inviernos moderados. Rancagua, San Fernando y Santa Cruz son los principales mercados de casas prefabricadas en la región, con buena disponibilidad de terrenos urbanos y rurales a precios más accesibles que Santiago.",
    faqs: [
      { q: "¿Cuánto cuesta una casa prefabricada en Rancagua o San Fernando?", a: "En O'Higgins el precio de casas prefabricadas oscila entre 600 y 2.000 UF. Los terrenos son más económicos que en la RM, lo que hace a esta región muy atractiva para proyectos de primera vivienda. Las constructoras con cobertura en O'Higgins suelen operar también desde Santiago." },
    ],
  },
  "maule": {
    nombre: "Región del Maule",
    supabaseNombre: "Maule",
    slug: "maule",
    capital: "Talca",
    clima: "Mediterráneo húmedo de transición",
    recomendacion: "Prefabricada o SIP",
    intro: "La Región del Maule, con sus ciudades de Talca, Curicó, Linares y Cauquenes, representa un mercado creciente para casas prefabricadas. Su clima de transición entre el mediterráneo de Santiago y el templado del sur permite usar sistemas de aislación media, siendo el panel SIP y la prefabricada estándar las opciones más competitivas.",
    faqs: [
      { q: "¿Hay constructoras de casas prefabricadas en el Maule?", a: "Sí. Varias constructoras con sede en Talca, Curicó o Santiago cubren la Región del Maule. En SolocasasChile puedes filtrar por región para ver el catálogo disponible en el Maule." },
    ],
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
