import type { Metadata } from "next";
import Link from "next/link";
import { getModelosFiltered } from "@/lib/supabase/services";
import { buildBreadcrumbJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";
import { CasasSipHero } from "@/components/casas-sip/casas-sip-hero";
import { CasasSipCarouselBanner } from "@/components/casas-sip/casas-sip-carousel-banner";
import {
  ThermometerSnowflake,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Building2,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://solocasaschile.com/casas-paneles-sip";

const FAQS = [
  {
    question: "¿Qué ventajas tienen las casas de paneles SIP en comparación con la construcción tradicional en Chile?",
    answer:
      "Las casas de paneles SIP ofrecen una envolvente térmica continua sin puentes de frío, lo que permite ahorrar hasta un 60% en calefacción y aire acondicionado. Además, su fabricación industrializada reduce el tiempo de montaje en terreno en hasta un 70%, disminuye el desperdicio de materiales y proporciona una resistencia estructural monolítica de alto desempeño antisísmico certificada bajo norma chilena NCh433.",
  },
  {
    question: "¿Cuánto cuesta el metro cuadrado de una casa de paneles SIP en Chile?",
    answer:
      "El valor varía según el nivel de terminación: un Kit Básico estructural de paneles SIP suele oscilar entre 7 y 11 UF/m²; un Kit Armado en terreno entre 14 y 19 UF/m²; y una solución Llave en Mano completa con fundaciones, instalaciones sanitarias/eléctricas y terminaciones de alta gama va desde 22 a 32 UF/m² dependiendo de la región y especificaciones técnicas.",
  },
  {
    question: "¿Las casas con paneles SIP resisten la lluvia y humedad extrema del sur de Chile?",
    answer:
      "Sí, siempre que cuenten con una correcta instalación de barrera de humedad y viento (membranas hidrófugas como Tyvek o similar) y ventilación cruzada con fachadas ventiladas. En el sur de Chile (zonas térmicas 5, 6 y 7), las casas SIP son el estándar predilecto por su extraordinaria capacidad para mantener el calor interior y evitar condensaciones intersticiales.",
  },
  {
    question: "¿Qué espesor de panel SIP se recomienda según la zona térmica de Chile (OGUC)?",
    answer:
      "Para muros perimetrales en la Zona Central (Santiago, Valparaíso, O'Higgins) se utiliza habitualmente panel SIP de 90 mm a 114 mm de espesor total. Para la Zona Sur y Austral (desde el Maule hasta Magallanes) se recomiendan paneles de 162 mm o más en muros y de 162 mm a 210 mm en techumbres, cumpliendo holgadamente las exigencias del Art. 4.1.10 de la OGUC.",
  },
  {
    question: "¿Cuánto demora el montaje de una casa con paneles SIP en terreno?",
    answer:
      "Una vivienda de 60 a 100 m² en paneles SIP suele montar su estructura de muros y techumbre en seco entre 10 y 20 días hábiles una vez listo el radier o los pilotes de fundación. Esto es hasta tres veces más rápido que la albañilería tradicional o el tabique convencional de madera.",
  },
  {
    question: "¿Se pueden personalizar los planos o ampliar una casa de paneles SIP en el futuro?",
    answer:
      "Sí. Los paneles SIP se adaptan a proyectos a medida y admiten todo tipo de revestimientos (siding de fibrocemento, tinglado de madera, zinc emballetado, estuco térmico EIFS, etc.). Para ampliaciones futuras, se dejan previstas soleras de unión estructural moduladas para conectarse sin fisuras.",
  },
];

const COMPARATIVA_TECNICA = [
  {
    criterio: "Aislación Térmica & Confort",
    sip: "Excelente (R100+ continuo, sin puentes térmicos en la unión)",
    tradicional: "Media/Baja (puentes térmicos en pies derechos de madera o perfiles metálicos)",
  },
  {
    criterio: "Ahorro Energético",
    sip: "Hasta un 50% - 60% menor consumo en calefacción",
    tradicional: "Demanda estándar o alta si no se complementa con EIFS",
  },
  {
    criterio: "Tiempo de Montaje en Terreno",
    sip: "10 a 20 días para estructura completa",
    tradicional: "60 a 120 días con mayor exposición al clima y lluvia",
  },
  {
    criterio: "Desperdicio de Materiales",
    sip: "Menor al 3% (dimensionado industrializado en fábrica)",
    tradicional: "Entre 15% y 25% de escombros en obra",
  },
  {
    criterio: "Resistencia Sísmica (NCh433)",
    sip: "Monolítica y ligera, absorbe cargas dinámicas uniformemente",
    tradicional: "Rígida y pesada, sujeta a fisuras por asentamiento",
  },
];

export const metadata: Metadata = {
  title: "Casas Paneles SIP en Chile | Precios, Modelos y Planos 2026",
  description:
    "Compara modelos de casas prefabricadas con paneles SIP en Chile. Revisa planos arquitectónicos de 36m², 60m² y 80m², precios en UF, corte técnico y cotiza con constructoras verificadas.",
  keywords: [
    ...SEO_KEYWORDS.casasSip,
    "planos casas sip",
    "casas sip llave en mano",
    "precio m2 casa sip chile",
    "aislacion termica panel sip",
    "modelos casas sip chile precios",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Casas Paneles SIP en Chile | Modelos, Planos y Precios",
    description:
      "Catálogo de casas de paneles SIP en Chile. Alta eficiencia térmica, montaje rápido y planos arquitectónicos con corte constructivo.",
    url: PAGE_URL,
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://solocasaschile.com/images/modelos/sip/modelo-sip-60m2-plano.png",
        width: 1024,
        height: 369,
        alt: "Casas paneles SIP en Chile con plano de distribución",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Paneles SIP en Chile | Modelos y Planos",
    description:
      "Modelos de casas SIP en Chile: ahorra hasta 60% en calefacción con paneles térmicos continuos y montaje rápido.",
    images: ["https://solocasaschile.com/images/modelos/sip/modelo-sip-60m2-plano.png"],
  },
};

export default async function CasasPanelesSipPage() {
  const sipModels = await getModelosFiltered({ tipo: "sip" });
  const topSip = sipModels.slice(0, 8);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "https://solocasaschile.com" },
    { name: "Casas paneles SIP", url: PAGE_URL },
  ]);
  const faqJsonLd = buildFAQJsonLd(FAQS);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Modelos SIP en Chile",
    itemListElement: topSip.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://solocasaschile.com/modelo/${model.slug}`,
      name: model.nombre,
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SolocasasChile",
    url: "https://solocasaschile.com",
    image: "https://solocasaschile.com/og-image.jpg",
    description: "Comparador de casas prefabricadas de paneles SIP y constructoras en Chile.",
    telephone: "+56 9 6619 8752",
    address: { "@type": "PostalAddress", addressCountry: "CL" },
    areaServed: { "@type": "Country", name: "Chile" },
  };

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-20">
      {/* Datos Estructurados Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. HERO PRINCIPAL REDISEÑADO */}
      <CasasSipHero totalModelos={sipModels.length || 35} />

      {/* 2. BANNER CARRUSEL CON 3 IMÁGENES ROTATIVAS DE MODELOS Y PLANOS */}
      <CasasSipCarouselBanner />

      {/* 3. COMPARATIVA TÉCNICA: PANELES SIP VS SISTEMAS TRADICIONALES */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xs p-6 sm:p-10 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
              <Layers className="h-3 w-3" />
              ANÁLISIS COMPARATIVO EN CHILE
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
              ¿Por qué Elegir Paneles SIP Frente a la Madera o Albañilería?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              La combinación de paneles estructurales isotérmicos resuelve de raíz los principales problemas de habitabilidad en las zonas climáticas de Chile: condensación, puentes de frío y sobrecostos por plazos extendidos de construcción.
            </p>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/80">
                  <th className="py-3 px-4 font-black uppercase text-xs tracking-wider text-muted-foreground w-1/3">
                    Factor de Evaluación
                  </th>
                  <th className="py-3 px-4 font-black uppercase text-xs tracking-wider text-brand-teal w-1/3 bg-brand-teal/5 rounded-t-xl">
                    Sistema Paneles SIP
                  </th>
                  <th className="py-3 px-4 font-black uppercase text-xs tracking-wider text-muted-foreground w-1/3">
                    Construcción Tradicional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {COMPARATIVA_TECNICA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-foreground">
                      {item.criterio}
                    </td>
                    <td className="py-4 px-4 font-semibold text-foreground bg-brand-teal/5">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                        <span>{item.sip}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {item.tradicional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. MODELOS SIP DISPONIBLES EN EL CATÁLOGO */}
      {topSip.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-brand-teal">
                DISPONIBLES PARA COTIZAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
                Modelos de Casas SIP en Catálogo
              </h2>
              <p className="text-sm text-muted-foreground">
                Compara especificaciones de constructoras verificadas en distintas regiones.
              </p>
            </div>
            <Link
              href="/catalogo?tipo=sip"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
            >
              Ver todos los modelos SIP
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topSip.map((model) => (
              <article
                key={model.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 hover:border-brand-teal/60 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-md mb-3">
                    Panel SIP · {model.superficie_m2} m²
                  </span>
                  <h3 className="text-lg font-heading font-black text-foreground group-hover:text-primary transition-colors">
                    {model.nombre}
                  </h3>
                  <p className="text-sm font-bold text-foreground mt-3">
                    Desde {model.precio_desde_uf} UF
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {model.dormitorios} dorm · {model.banos} baños
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/40">
                  <Link
                    href={`/modelo/${model.slug}`}
                    className="inline-flex items-center justify-center w-full rounded-xl bg-secondary hover:bg-primary hover:text-white py-2.5 text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    Ver Modelo & Cotizar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. PREGUNTAS FRECUENTES SOBRE CASAS PANELES SIP EN CHILE */}
      <section className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="text-center space-y-2 mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" />
            RESOLVEMOS TUS DUDAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
            Preguntas Frecuentes sobre Casas de Paneles SIP
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber antes de construir o comprar una casa térmica en Chile.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6 transition-all hover:border-brand-teal/40 open:border-brand-teal/60 open:bg-card"
            >
              <summary className="cursor-pointer font-heading font-black text-base sm:text-lg text-foreground flex items-center justify-between gap-4 select-none">
                <span>{faq.question}</span>
                <span className="text-brand-teal transition-transform group-open:rotate-180 text-xl font-mono">
                  ↓
                </span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 sm:mt-4 leading-relaxed border-t border-border/40 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 6. BANNER DE CIERRE: COTIZACIÓN CON CONSTRUCTORAS SIP */}
      <section className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="rounded-3xl border-2 border-brand-teal/40 bg-gradient-to-br from-brand-teal/15 via-card to-background p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-teal/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-teal">
            <Building2 className="h-4 w-4" />
            CONSTRUCTORAS CERTIFICADAS EN CHILE
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground max-w-2xl mx-auto">
            ¿Listo para construir tu casa térmica de paneles SIP?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Recibe cotizaciones y propuestas técnicas de constructoras con experiencia en sistemas SIP en tu región, con presupuestos transparentes y plazos definidos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/catalogo?tipo=sip"
              className="flex w-full sm:w-auto min-h-[50px] items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/25 transition-all active:scale-95 cursor-pointer"
            >
              Explorar Catálogo SIP
            </Link>
            <Link
              href="/constructoras"
              className="flex w-full sm:w-auto min-h-[50px] items-center justify-center rounded-2xl border-2 border-border/80 bg-card hover:bg-muted/60 px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-foreground transition-all active:scale-95 cursor-pointer"
            >
              Ver Constructoras
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
