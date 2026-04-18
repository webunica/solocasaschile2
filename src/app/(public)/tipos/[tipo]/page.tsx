import { getModelosFiltered } from "@/lib/supabase/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CatalogoGrid } from "@/components/catalogo/catalogo-grid";
import { 
  CheckCircle2, ArrowRight,
  ShieldCheck, Thermometer, Clock
} from "lucide-react";
import type { Metadata } from "next";
import { SYSTEM_DETAILS as TIPO_INFO } from "@/config/construction-systems";
import { buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/components/seo/structured-data";
import { SystemsComparison } from "@/components/seo/systems-comparison";

interface PageProps {
  params: Promise<{ tipo: string }>;
}

// Long-tail keywords por tipo — refuerza la semántica de cada landing
const TIPO_EXTRA_KEYWORDS: Record<string, string[]> = {
  sip: [
    "casas sip precio chile", "panel sip aislación térmica", "casas sip 2 pisos",
    "casas panel sip chile 2026", "casa sip vs tradicional", "casas sip húmedo chile",
  ],
  modular: [
    "casas modulares llave en mano chile", "precio casas modulares 2026",
    "casas modulares ampliables", "modulos habitacionales chile", "casa modular 60m2",
  ],
  prefabricada: [
    "casas prefabricadas baratas chile", "casas prefabricadas rapidas",
    "casas prefabricadas permanentes", "precio casa prefabricada chile 2026",
    "financiamiento casas prefabricadas", "crédito hipotecario casa prefabricada chile",
  ],
  container: [
    "casas container precio chile", "casas container 2 pisos", "casa contenedor chile",
    "construir con containers chile", "precio container habitable chile",
  ],
  "tiny-house": [
    "tiny house chile precio", "donde comprar tiny house chile", "tiny house con ruedas chile",
    "tiny house llave en mano", "modelos tiny house 2026", "mini casas prefabricadas",
  ],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  const baseUrl = 'https://solocasaschile.com';

  if (!info) return { title: "Tipo no encontrado | SolocasasChile" };

  const title = `${info.title} en Chile 2026 | Modelos, Precios y Constructoras | SolocasasChile`;
  const description = info.description
    ? `${info.description} Compara modelos, precios desde UF y constructoras verificadas en Chile. Guía actualizada 2026.`
    : `Conoce todo sobre ${info.title} en Chile: precios, constructoras y modelos disponibles en 2026.`;

  const extraKeywords = TIPO_EXTRA_KEYWORDS[tipo] || [];

  return {
    title,
    description,
    keywords: [
      `${info.title.toLowerCase()} chile`,
      `casas ${tipo} chile`,
      `precio ${tipo} chile`,
      `constructoras ${tipo}`,
      `casas ${tipo} 2026`,
      "casas prefabricadas chile",
      "comparador casas prefabricadas",
      ...extraKeywords,
    ],
    alternates: { canonical: `${baseUrl}/tipos/${tipo}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/tipos/${tipo}`,
      siteName: "SolocasasChile",
      locale: "es_CL",
      type: "website",
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@solocasaschile",
      title,
      description,
    },
  };
}

// ─── Contenido editorial expandido por tipo ───────────────────────────────────
const TIPO_EDITORIAL: Record<string, {
  intro: string;
  faqs: { q: string; a: string }[];
  normativa: string;
}> = {
  sip: {
    intro: `Las **casas SIP (Structural Insulated Panels) en Chile** son la opción preferida para climas extremos como La Araucanía, Los Lagos y la zona andina. Sus paneles de poliestireno expandido de alta densidad (EPS) entre dos tableros de OSB crean una envoltura térmica continua que reduce el consumo de calefacción hasta en un 40-50% respecto a la construcción tradicional. En Chile, el sistema SIP cumple con la Ordenanza General de Urbanismo y Construcciones (OGUC) y puede ser empleado en viviendas de hasta dos pisos.`,
    faqs: [
      { q: "¿Cuánto cuesta una casa SIP en Chile en 2026?", a: "El precio de una casa SIP en Chile varía entre 15 y 25 UF/m². Una vivienda de 80m² puede costar entre 1.200 y 2.000 UF, dependiendo de las terminaciones, la región y la constructora. En zonas con incentivos regionales o subsidios de eficiencia energética el costo puede reducirse." },
      { q: "¿Es antisísmica una casa SIP?", a: "Sí. Las casas SIP tienen un excelente comportamiento sísmico gracias a la continuidad de la envoltura estructural. En los terremotos de 2010 y 2014, las viviendas SIP en Chile no registraron daños estructurales significativos, lo que las posiciona como una de las opciones más seguras del mercado." },
      { q: "¿Cuánto tarda en construirse una casa SIP en Chile?", a: "Una casa SIP de 80m² puede montarse en terreno en entre 30 y 60 días hábiles. El tiempo total incluyendo instalaciones, terminaciones e inspección municipal es de 60 a 120 días, mucho menos que los 12-18 meses de una construcción en albañilería." },
      { q: "¿Las casas SIP necesitan mantención especial?", a: "No. Las casas SIP tienen muy baja mantención. La principal recomendación es proteger los bordes de los paneles de la humedad directa mediante marcos y sellantes adecuados, especialmente en zonas con lluvias intensas como el sur de Chile. Un buen sistema de pinturas exteriores asegura durabilidad por más de 20 años." },
    ],
    normativa: "Las casas SIP en Chile deben cumplir con la OGUC, la NCh433 (diseño sísmico) y las especificaciones térmicas de la Norma Chilena NCh1079 de zonificación climática habitacional. Los modelos certificados en SolocasasChile incluyen este cumplimiento.",
  },
  modular: {
    intro: `Las **casas modulares en Chile** son productos volumétricos tridimensionales completos — con terminaciones interiores, instalaciones eléctricas y sanitarias — que salen de fábrica con un 90-95% de avance. Se transportan en camión al terreno y se ensamblan en días, sin casi obra húmeda. Son ideales para terrenos en pendiente o de difícil acceso, y permiten ampliaciones futuras mediante nuevos módulos.`,
    faqs: [
      { q: "¿Cuánto cuesta una casa modular en Chile?", a: "Las casas modulares en Chile tienen un precio base de entre 20 y 30 UF/m², siendo más caras que otros sistemas por el alto grado de terminaciones en planta. Para 60m², el rango típico es de 1.200 a 1.800 UF. Muchas constructoras ofrecen financiamiento propio o tramitación de crédito hipotecario." },
      { q: "¿Cuánto tiempo demora una casa modular en Chile?", a: "La fabricación en planta tarda entre 30 y 60 días. El montaje en terreno es de apenas 1 a 5 días dependiendo del número de módulos. Incluyendo permisos e instalaciones, el tiempo total suele ser de 60 a 90 días desde la firma del contrato." },
      { q: "¿Se pueden ampliar las casas modulares?", a: "Sí. Una de las ventajas de la construcción modular es la escalabilidad. Puedes comenzar con 2 módulos (40-50m²) y añadir módulos adicionales a medida que crece tu familia o necesitas espacio, sin intervenir la estructura existente." },
      { q: "¿Funcionan con crédito hipotecario las casas modulares?", a: "En Chile, la mayoría de los bancos y Cajas de Compensación financian casas modulares siempre que se construyan sobre terreno propio y cumplan con los requisitos de la OGUC. Algunas constructoras tienen convenios con bancos para facilitar el proceso." },
    ],
    normativa: "Las casas modulares en Chile requieren permiso de edificación municipal bajo la misma normativa que la construcción tradicional (OGUC). Los módulos fabricados en planta deben contar con un sistema de inspección técnica equivalente al rol del inspector de obra.",
  },
  prefabricada: {
    intro: `Las **casas prefabricadas en Chile** son la categoría más amplia del mercado: incluye cualquier vivienda cuya estructura o paneles se fabrican en planta y se ensamblan en terreno. Es el sistema de mayor adopción en Chile, con presencia en las 16 regiones y una oferta que va desde modelos económicos de 500 UF hasta proyectos premium llave en mano de más de 3.000 UF.`,
    faqs: [
      { q: "¿Cuánto vale una casa prefabricada en Chile 2026?", a: "El precio de una casa prefabricada en Chile varía desde 8 hasta 18 UF/m² dependiendo del sistema (paneles de madera, metalcom, SIP). Para una vivienda de 70m², el rango va de 560 a 1.260 UF solo por la construcción, sin considerar terreno, fundaciones, instalaciones ni gastos de permiso que pueden sumar entre un 20-30% adicional." },
      { q: "¿Se puede pedir crédito hipotecario para una casa prefabricada?", a: "Sí. El Banco Estado, Scotiabank y varias cooperativas financian casas prefabricadas en Chile. El requisito es que la vivienda se construya sobre terreno propio, cuente con recepción final municipal y esté inscrita en el Conservador de Bienes Raíces. Algunas constructoras gestionan el crédito junto con el proyecto." },
      { q: "¿Cuánto dura una casa prefabricada en Chile?", a: "Una casa prefabricada bien construida en Chile tiene una vida útil de 50 a 80 años, comparable a la construcción tradicional, siempre que reciba mantención básica (pintura exterior cada 10-15 años, revisión de sellos y cubiertas). Los sistemas SIP y Steel Framing tienen las mayores durabilidades." },
      { q: "¿Las casas prefabricadas tienen permiso de construcción en Chile?", a: "Sí, requieren las mismas tramitaciones que una construcción tradicional: permiso de edificación ante la DOM, inspección técnica, y recepción final. El plazo varía por municipio entre 30 y 90 días. Las constructoras verificadas en SolocasasChile te acompañan en toda la tramitación." },
    ],
    normativa: "Todas las casas prefabricadas en Chile están sujetas a la Ordenanza General de Urbanismo y Construcciones (OGUC), la NCh433 de diseño sísmico y las normas térmicas según zona climática (NCh1079). Las constructoras asociadas en SolocasasChile cumplen con esta normativa.",
  },
  container: {
    intro: `Las **casas container en Chile** se construyen a partir de contenedores marítimos ISO de 20 o 40 pies reciclados. Son reconocidas por su durabilidad extrema (acero COR-TEN de 3mm), su estética industrial vanguardista y su rapidez de instalación. En Chile, son especialmente populares en zonas costeras, proyectos vacacionales y terrenos rurales de difícil acceso.`,
    faqs: [
      { q: "¿Cuánto cuesta una casa container en Chile?", a: "El precio de una casa container en Chile varía entre 12 y 22 UF/m², siendo más económica que el Panel SIP pero con mayor costo de aislación interior obligatoria. Un proyecto de 40m² (2 contenedores de 20 pies) puede costar entre 500 y 900 UF terminado." },
      { q: "¿Son habitables todo el año las casas container en Chile?", a: "Sí, si tienen la aislación correcta. El acero transmite calor y frío con facilidad, por lo que las casas container en Chile requieren aislación interior de alta performance (lana de roca o espuma de poliuretano) para ser confortables en zonas frías como el sur o la cordillera." },
      { q: "¿Necesita permiso una casa container en Chile?", a: "Sí. La DOM exige permiso de edificación para casas container permanentes, igual que cualquier otra vivienda. En algunos municipios rurales el trámite es más ágil. Para instalaciones temporales o móviles existen alternativas regulatorias distintas." },
      { q: "¿Cuántos contenedores necesito para una casa en Chile?", a: "Un contenedor de 40 pies tiene aproximadamente 30m² de superficie habitable. Para una casa de 2 dormitorios necesitas al menos 2 contenedores de 40 pies o 4 de 20 pies, dependiendo del diseño. La mayoría de los proyectos combina contenedores horizontales con volúmenes adicionales" },
    ],
    normativa: "Las casas container en Chile están sujetas a la OGUC y requieren que el contenedor tenga certificación de aptitud estructural emitida por profesional competente. Se recomienda siempre trabajar con constructoras que gestionen la documentación técnica completa.",
  },
  "tiny-house": {
    intro: "Las **Tiny Houses en Chile** han pasado de ser una curiosidad a una solución real de vivienda eficiente y minimalista. Con superficies que varían entre los 15 y 45 m², estas pequeñas casas optimizan cada centímetro mediante diseño inteligente. Son ideales para segundas viviendas en el litoral o la montaña, o como primera vivienda para personas que buscan reducir su huella ecológica y de mantenimiento.",
    faqs: [
      { q: "¿Cuánto cuesta una Tiny House en Chile en 2026?", a: "El precio de una Tiny House en Chile parte desde las 450 UF para modelos básicos de 15m² hasta las 1.200 UF para modelos premium de 40m² con equipamiento completo. El valor por m² es superior a una tradicional debido a la alta densidad de diseño e instalaciones en espacios reducidos." },
      { q: "¿Se puede vivir legalmente en una Tiny House en Chile?", a: "Sí, siempre que cumpla con la normativa local. Si la Tiny House está fijada al terreno con cimientos, requiere permiso de edificación municipal (OGUC). Si es una Tiny House sobre ruedas, se rige por la normativa de vehículos recreativos o casas rodantes, lo que permite mayor movilidad pero restricciones en servicios básicos fijos." },
      { q: "¿Cómo se calientan las Tiny Houses en el sur de Chile?", a: "Debido a su pequeño volumen, una Tiny House requiere muy poca energía para calefaccionarse. Los sistemas más usados en Chile son las estufas a pellet de baja potencia, paneles calefactores eléctricos o aire acondicionado inverter. Una buena aislación térmica es crítica para evitar condensaciones." },
    ],
    normativa: "Si la Tiny House se proyecta como vivienda definitiva, debe cumplir con los estándares de altura mínima y superficie habitable de la OGUC. Los modelos llave en mano suelen venir con la carpeta técnica lista para tramitación municipal.",
  },
};

export default async function TipoPage({ params }: PageProps) {
  const { tipo } = await params;
  const info = TIPO_INFO[tipo];
  if (!info) notFound();

  const modelos = await getModelosFiltered({ tipo });
  const editorial = TIPO_EDITORIAL[tipo];

  return (
    <div className="min-h-screen bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd([
            { name: "Inicio", url: "https://solocasaschile.com" },
            { name: "Tipos de Casas", url: "https://solocasaschile.com/catalogo" },
            { name: info.title, url: `https://solocasaschile.com/tipos/${tipo}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFAQJsonLd(
            editorial?.faqs.map(f => ({ question: f.q, answer: f.a })) ?? [
              {
                question: `¿Qué es una casa ${info.title} en Chile?`,
                answer: info.description || `Una casa ${info.title} es un sistema constructivo industrializado adaptado al clima y normativa chilena. ${info.benefits?.join('. ') || ''}`,
              },
              {
                question: `¿Cuánto cuesta una casa ${info.title} en Chile?`,
                answer: `El precio de una casa ${info.title} en Chile varía según el modelo y la constructora. En SolocasasChile puedes comparar precios desde UF de las mejores constructoras verificadas.`,
              },
              {
                question: `¿Cuánto demora construir una casa ${info.title}?`,
                answer: `Los tiempos de construcción de una casa ${info.title} son significativamente menores que la construcción tradicional. Dependen del modelo elegido y la constructora, pero pueden ir desde 30 días hasta 6 meses.`,
              },
            ]
          )),
        }}
      />
      {/* Hero Section per Type */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-indigo/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase">
                Sistema Constructivo
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-6">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                      {info.icon}
                   </div>
                   <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-white leading-none">
                     {info.title}
                   </h1>
                </div>
                <p className="text-xl text-white/60 leading-relaxed max-w-xl font-medium">
                  {info.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {info.specs.map(spec => (
                  <div key={spec.label} className="bg-background border border-border/50 p-4 rounded-xl shadow-sm">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">{spec.label}</p>
                    <p className="text-lg font-bold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#modelos"
                  className={buttonVariants({ size: "lg", className: "font-semibold shadow-lg shadow-primary/20" })}
                >
                  Ver modelos disponibles
                </a>
                <Link
                  href="/catalogo"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "font-semibold border-white/20 text-white hover:bg-white/10" })}
                >
                  Explorar catálogo
                </Link>
              </div>
            </div>

             <div className="relative h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10">
                <Image src={info.image} alt={`${info.title} en Chile — SolocasasChile`} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex flex-col gap-6">
                      <h3 className="text-white font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-brand-teal" /> Ventajas Clave
                      </h3>
                     <div className="space-y-2">
                        {info.benefits.map(benefit => (
                          <div key={benefit} className="flex items-center gap-2 text-white/90 text-sm">
                             <ShieldCheck className="w-4 h-4 text-primary" /> {benefit}
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section id="modelos" className="py-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tight">
                Catálogo de {info.title} en Chile
              </h2>
              <p className="text-muted-foreground">
                Encuentra los mejores modelos del sistema {info.title.toLowerCase()} en Chile. 
                Compara precios, m² y constructoras verificadas.
              </p>
            </div>
            <Link href="/catalogo" className={buttonVariants({ variant: "ghost", className: "text-primary hover:text-primary/80" })}>
               Explorar catálogo completo <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <CatalogoGrid modelos={modelos} />
          
          {modelos.length === 0 && (
             <div className="bg-muted/30 border border-dashed border-border rounded-3xl py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Aún no hay modelos para este tipo</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Estamos trabajando con nuevas constructoras para traerte la mejor oferta en este sistema constructivo.</p>
                <Link href="/catalogo" className={buttonVariants()}>Ver modelos de otros tipos</Link>
             </div>
          )}
        </div>
      </section>

      {/* Editorial SEO Section — contenido real, no placeholders */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 mt-4" aria-labelledby={`section-info-${tipo}`}>
         <div className="container max-w-4xl mx-auto px-4 md:px-8 space-y-16">

           {/* Intro editorial */}
           {editorial?.intro && (
             <div className="space-y-4 max-w-3xl">
               <h2 id={`section-info-${tipo}`} className="text-3xl font-heading font-bold tracking-tight">
                 ¿Qué son las {info.title} en Chile?
               </h2>
               <p className="text-muted-foreground leading-relaxed text-lg">
                 {editorial.intro.replace(/\*\*/g, '')}
               </p>
             </div>
           )}

           {/* Specs grid */}
           <div className="grid sm:grid-cols-2 gap-8">
             <div className="space-y-3">
               <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
                 <Thermometer className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-lg">Aislamiento y Climatización</h4>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 {tipo === 'sip'
                   ? 'El sistema SIP es el líder en eficiencia térmica para Chile. Su núcleo de EPS de alta densidad elimina los puentes térmicos típicos de otros sistemas, logrando calificación energética A o A+ en la mayoría de las regiones.'
                   : `El sistema ${info.title} ofrece características térmicas adaptadas al clima chileno. Dependiendo de la región, puede complementarse con aislación adicional para cumplir los estándares de la NCh1079.`}
               </p>
             </div>
             <div className="space-y-3">
               <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
                 <Clock className="w-6 h-6" />
               </div>
               <h4 className="font-bold text-lg">Tiempos de Construcción</h4>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 {info.specs.find(s => s.label.toLowerCase().includes('tiempo') || s.label.toLowerCase().includes('montaje'))
                   ? `Tiempo de montaje en terreno: ${info.specs.find(s => s.label.toLowerCase().includes('tiempo') || s.label.toLowerCase().includes('montaje'))?.value}. A esto se suman los tiempos de tramitación municipal y terminaciones.`
                   : `Las ${info.title} permiten reducir significativamente los tiempos comparado con la construcción tradicional, gracias a la prefabricación en planta bajo condiciones controladas.`}
               </p>
             </div>
           </div>

           {/* Tabla Comparativa de Sistemas */}
           <div className="py-12 border-t border-border/40">
             <SystemsComparison />
           </div>

          {/* FAQ visible */}
          {editorial?.faqs && (
            <div className="space-y-8">
              <h3 className="text-2xl font-heading font-bold tracking-tight">
                Preguntas Frecuentes sobre {info.title} en Chile
              </h3>
              <div className="space-y-3">
                {editorial.faqs.map((faq, i) => (
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
          )}

          {/* Normativa */}
          {editorial?.normativa && (
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 space-y-3">
              <h4 className="font-black text-sm uppercase tracking-widest text-primary">Normativa y Permisos en Chile</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{editorial.normativa}</p>
            </div>
          )}

          {/* CTA final */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
            >
              Ver catálogo completo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/constructoras"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/40"
            >
              Constructoras verificadas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

