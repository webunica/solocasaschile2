import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Clock, ThumbsUp, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Inline FAQ data (also rendered visually below) ───────────────────────────
export const HOME_FAQS = [
  {
    question: "¿Qué es una casa prefabricada en Chile?",
    answer:
      "Una casa prefabricada es una vivienda cuyas estructuras y componentes principales se fabrican en planta bajo condiciones controladas de calidad y luego se ensamblan en el terreno. En Chile, el mercado de casas prefabricadas ha crecido significativamente gracias a su menor costo, rapidez de construcción y alta eficiencia energética. Los sistemas más utilizados son el Panel SIP, el Steel Framing y la construcción modular.",
  },
  {
    question: "¿Cuánto cuesta una casa prefabricada en Chile en 2026?",
    answer:
      "El precio de una casa prefabricada en Chile en 2026 varía desde las 500 UF para modelos pequeños hasta más de 3.000 UF en construcciones de mayor superficie, dos pisos y terminaciones premium. El costo por m² promedio ronda las 12-25 UF, dependiendo del sistema constructivo y la constructora. En SolocasasChile puedes filtrar por precio y comparar cientos de modelos verificados.",
  },
  {
    question: "¿Qué es una casa SIP y cuáles son sus ventajas?",
    answer:
      "Una casa SIP (Structural Insulated Panel) es un sistema constructivo que utiliza paneles de poliestireno expandido recubiertos por tableros de OSB. Sus principales ventajas en Chile son: excelente aislación térmica y acústica, reducción de hasta un 40% en consumo de calefacción, construcción en 30 a 90 días, y bajo nivel de residuos en obra. Es ideal para zonas con variaciones extremas de temperatura como La Araucanía, Los Lagos o la Región Metropolitana.",
  },
  {
    question: "¿Cuál es la diferencia entre una casa modular y una prefabricada?",
    answer:
      "Una casa modular se construye como unidades tridimensionales completas (módulos) que incluyen terminaciones interiores, instalaciones eléctricas y sanitarias, y se transportan al terreno listas para unirse. Una casa prefabricada es un término más amplio que incluye sistemas donde solo los elementos estructurales se fabrican en planta. En la práctica, ambos términos se usan de forma intercambiable en el mercado chileno.",
  },
  {
    question: "¿Las casas prefabricadas tienen permiso de construcción en Chile?",
    answer:
      "Sí. Las casas prefabricadas en Chile tienen los mismos requisitos de permiso de edificación que la construcción tradicional. Deben cumplir con la Ordenanza General de Urbanismo y Construcciones (OGUC) y el Reglamento de Instalaciones Domiciliarias. Las constructoras verificadas en SolocasasChile te ayudan con toda la tramitación municipal.",
  },
  {
    question: "¿En qué regiones de Chile hay constructoras de casas prefabricadas?",
    answer:
      "SolocasasChile tiene constructoras de casas prefabricadas, SIP y modulares en las 16 regiones de Chile: desde Arica y Parinacota hasta Magallanes. Puedes filtrar por región en nuestro catálogo para ver los modelos disponibles y las empresas que operan en tu zona.",
  },
];

const VENTAJAS = [
  {
    icon: <Zap className="h-5 w-5 text-brand-teal" aria-hidden="true" />,
    title: "Mayor velocidad de obra",
    body: "La fabricación en planta permite reducir los tiempos de construcción entre un 40% y un 60% respecto a la construcción tradicional. Un proyecto de 80m² puede estar listo en menos de 90 días.",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />,
    title: "Control de calidad superior",
    body: "Los componentes se producen en ambientes industriales con control de humedad, temperatura y procesos estandarizados. Esto se traduce en terminaciones más precisas y menos imprevistos en obra.",
  },
  {
    icon: <Clock className="h-5 w-5 text-brand-teal" aria-hidden="true" />,
    title: "Eficiencia energética certificada",
    body: "Los paneles SIP y los sistemas de Steel Framing con aislación permiten obtener calificaciones energéticas superiores, reduciendo hasta un 40% los costos de climatización anuales.",
  },
  {
    icon: <ThumbsUp className="h-5 w-5 text-brand-teal" aria-hidden="true" />,
    title: "Menor impacto ambiental",
    body: "La prefabricación genera hasta un 80% menos de residuos de obra que la construcción en hormigón. Los materiales como el panel SIP y la madera tienen una huella de carbono significativamente menor.",
  },
];

export function SeoContent() {
  return (
    <section
      className="relative overflow-hidden border-t border-border/40 bg-background py-24 md:py-32"
      aria-labelledby="seo-section-heading"
    >
      {/* Background decor */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-indigo/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-teal/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto max-w-5xl px-6">
        <div className="space-y-24">

          {/* ─── BLOQUE 1: Intro editorial ─────────────────────────────────── */}
          <div className="max-w-3xl space-y-8">
            <Badge
              variant="outline"
              className="rounded-2xl border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              Guía Experta 2026
            </Badge>
            <h2
              id="seo-section-heading"
              className="font-heading text-4xl font-black leading-none tracking-tighter md:text-6xl"
            >
              Casas Prefabricadas en Chile:{" "}
              <span className="gradient-text">La Guía Definitiva</span>
            </h2>
            <div className="prose prose-lg max-w-none font-medium leading-relaxed text-muted-foreground dark:prose-invert space-y-4">
              <p>
                El mercado de <strong>casas prefabricadas en Chile</strong> ha
                experimentado un crecimiento sin precedentes en los últimos
                años. Con más de 1.500 modelos disponibles entre{" "}
                <strong>casas SIP</strong>,{" "}
                <strong>casas modulares</strong>, casas container y sistemas
                de Steel Framing, hoy es posible acceder a una vivienda de
                alta calidad en plazos y costos imposibles para la
                construcción tradicional.
              </p>
              <p>
                SolocasasChile es el <strong>comparador independiente de casas
                prefabricadas más completo de Chile</strong>. No somos una
                constructora ni vendemos directamente viviendas: nuestro
                trabajo es analizar, verificar y publicar información objetiva
                sobre cientos de modelos y empresas, para que tomes la mejor
                decisión antes de cotizar.
              </p>
              <p>
                Si quieres ir directo por intención de búsqueda, revisa nuestras
                guías pilares de{" "}
                <Link href="/casas-prefabricadas">casas prefabricadas en Chile</Link>,{" "}
                <Link href="/casas-paneles-sip">casas paneles SIP</Link>,{" "}
                <Link href="/casas-modulares">casas modulares</Link> y{" "}
                <Link href="/modelos-casas-prefabricadas">modelos de casas prefabricadas</Link>.
              </p>
            </div>
          </div>

          {/* ─── BLOQUE 2: Ventajas + Imagen ──────────────────────────────── */}
          <div className="grid items-start gap-16 border-t border-border/40 pt-20 md:grid-cols-2">
            <div className="space-y-10">
              <h3 className="font-heading text-3xl font-black uppercase tracking-tighter">
                ¿Por qué elegir una casa prefabricada?
              </h3>
              <div className="space-y-8">
                {VENTAJAS.map((v) => (
                  <div key={v.title} className="group">
                    <h4 className="mb-3 flex items-center gap-3 text-lg font-bold">
                      {v.icon}
                      {v.title}
                    </h4>
                    <p className="border-l-2 border-border/40 pl-6 font-medium leading-relaxed text-muted-foreground transition-colors group-hover:border-brand-teal">
                      {v.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
                alt="Casa prefabricada SIP moderna en Chile — vista exterior"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* ─── BLOQUE 3: Tipos de sistemas constructivos ─────────────────── */}
          <div className="border-t border-border/40 pt-20 space-y-12">
            <div className="max-w-2xl space-y-4">
              <h3 className="font-heading text-3xl font-black tracking-tighter md:text-4xl">
                Tipos de Casas Prefabricadas en Chile
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Cada sistema constructivo tiene características distintas. Aquí
                te explicamos los principales para que elijas el que mejor se
                adapta a tu terreno, presupuesto y región.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  tipo: "Casas SIP",
                  href: "/casas-paneles-sip",
                  desc: "Paneles estructurales de poliestireno + OSB. Alta aislación térmica y acústica. Ideal para zonas frías. Construcción en 45-90 días.",
                  tag: "Panel SIP",
                },
                {
                  tipo: "Casas Modulares",
                  href: "/casas-modulares",
                  desc: "Módulos tridimensionales ensamblados en fábrica. Llegada al terreno casi lista. Máxima flexibilidad de distribución y diseño.",
                  tag: "Modular",
                },
                {
                  tipo: "Modelos de Casas Prefabricadas",
                  href: "/modelos-casas-prefabricadas",
                  desc: "Compara metraje, dormitorios y rango de precio para elegir el modelo adecuado antes de cotizar.",
                  tag: "Modelos",
                },
              ].map((item) => (
                <Link
                  key={item.tipo}
                  href={item.href}
                  className="group flex flex-col gap-4 rounded-[2.5rem] border border-border/40 bg-card/50 p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                >
                  <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                    {item.tag}
                  </span>
                  <h4 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                    {item.tipo}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <span className="mt-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary">
                    Ver modelos <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ─── BLOQUE 4: FAQ visible ─────────────────────────────────────── */}
          <div className="border-t border-border/40 pt-20 space-y-12">
            <div className="max-w-2xl space-y-4">
              <h3 className="font-heading text-3xl font-black tracking-tighter md:text-4xl">
                Preguntas Frecuentes sobre Casas Prefabricadas
              </h3>
              <p className="text-muted-foreground font-medium">
                Todo lo que necesitas saber antes de cotizar tu casa
                prefabricada, SIP o modular en Chile.
              </p>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-[2rem] border border-border/40 bg-card/50 overflow-hidden open:border-primary/20 transition-all"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 font-bold text-base list-none [&::-webkit-details-marker]:hidden hover:bg-muted/20 transition-colors">
                    <span>{faq.question}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground group-open:rotate-45 group-open:border-primary group-open:text-primary transition-all">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-muted-foreground font-medium leading-relaxed text-sm">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Explorar Catálogo Completo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/constructoras"
                className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40 hover:bg-card"
              >
                Ver Constructoras Verificadas
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
