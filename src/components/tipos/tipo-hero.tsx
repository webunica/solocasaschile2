import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Box,
  MapPin,
  Home,
} from "lucide-react";

export interface TipoHeroProps {
  tipo: string;
  info: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    benefits?: string[];
    specs?: { label: string; value: string }[];
    image: string;
  };
  heroImageAlt: string;
}

const SYSTEM_HERO_CONFIG: Record<
  string,
  {
    etiqueta: string;
    h1Title: string;
    h1Accent: string;
    descripcion: string;
    btnMain: string;
    btnSec: string;
    secHref: string;
    beneficios: string[];
    aclaracion: string;
    cardTitle: string;
    cardSubtitle: string;
    cardSpecs: string;
    cardBadge: string;
  }
> = {
  container: {
    etiqueta: "CASAS CONTAINER EN CHILE",
    h1Title: "Casas Container en Chile.",
    h1Accent: "Diseño moderno y entrega rápida.",
    descripcion:
      "Compara modelos habitables a partir de contenedores marítimos ISO adaptados. Máxima durabilidad de acero COR-TEN, aislamiento térmico certificado y rapidez de montaje en cualquier terreno.",
    btnMain: "Ver modelos container",
    btnSec: "Cotizar proyecto",
    secHref: "/cotizar?tipo=container",
    beneficios: [
      "Acero COR-TEN ultra resistente",
      "Montaje rápido en 30 a 60 días",
      "Diseño modular y sustentable",
    ],
    aclaracion:
      "Rango típico: 12 a 22 UF/m² · Proyectos habitacionales llave en mano con aislación certificada.",
    cardTitle: "Modelo Container Austral 90 m²",
    cardSubtitle: "Estructura marítima ISO 40HC",
    cardSpecs: "2D · 1B · Terraza integrada · Aislación certificada",
    cardBadge: "Llave en mano",
  },
  sip: {
    etiqueta: "CASAS PANELES SIP EN CHILE",
    h1Title: "Casas Panel SIP en Chile.",
    h1Accent: "Máxima aislación térmica y eficiencia energética.",
    descripcion:
      "Compara modelos construidos con paneles estructurales aislados (SIP). Hasta un 50% de ahorro en calefacción, comportamiento antisísmico certificado y tiempos de obra reducidos.",
    btnMain: "Ver modelos SIP",
    btnSec: "Cotizar casa SIP",
    secHref: "/cotizar?tipo=sip",
    beneficios: [
      "Ahorro térmico de hasta 50%",
      "Estructura antisísmica NCh433",
      "Montaje en 30 a 60 días",
    ],
    aclaracion:
      "Rango típico: 15 a 25 UF/m² · Envolvente continua de alta eficiencia para climas exigentes.",
    cardTitle: "Modelo SIP Cordillera 110 m²",
    cardSubtitle: "Paneles EPS alta densidad + OSB",
    cardSpecs: "3D · 2B · Eficiencia Térmica A+ · Llave en mano",
    cardBadge: "Aislación Continua",
  },
  prefabricada: {
    etiqueta: "CASAS PREFABRICADAS EN CHILE",
    h1Title: "Casas Prefabricadas en Chile.",
    h1Accent: "Compara modelos, planos y precios reales.",
    descripcion:
      "Descubre la mayor oferta de casas prefabricadas en Chile. Compara valores por metro cuadrado, tiempos de entrega y constructoras con modelos llave en mano listos para instalar.",
    btnMain: "Ver modelos prefabricados",
    btnSec: "Cotizar mi proyecto",
    secHref: "/cotizar?tipo=prefabricada",
    beneficios: [
      "Desde 8 a 18 UF/m²",
      "Montaje récord en 7 a 20 días",
      "Escalable y ampliable en el tiempo",
    ],
    aclaracion:
      "Opciones desde kit básico hasta llave en mano · Cobertura en las 16 regiones de Chile.",
    cardTitle: "Modelo Volcán Puntiagudo 84 m²",
    cardSubtitle: "Estructura panelizada tratada al vacío",
    cardSpecs: "3D · 2B · Madera tratada y zinc prepintado",
    cardBadge: "Montaje rápido",
  },
  modular: {
    etiqueta: "CASAS MODULARES EN CHILE",
    h1Title: "Casas Modulares en Chile.",
    h1Accent: "95% terminadas en fábrica y montaje en días.",
    descripcion:
      "Módulos volumétricos 3D completos con instalaciones y terminaciones interiores de fábrica. Mínimo impacto en terreno, estándar de calidad industrial y posibilidad de ampliación modular futura.",
    btnMain: "Ver modelos modulares",
    btnSec: "Cotizar casa modular",
    secHref: "/cotizar?tipo=modular",
    beneficios: [
      "95% de avance en planta",
      "Montaje en terreno en 2 a 5 días",
      "Ampliaciones modulares sin obra húmeda",
    ],
    aclaracion:
      "Rango típico: 20 a 30 UF/m² · Alta precisión industrial y estándar premium llave en mano.",
    cardTitle: "Modelo Modular Panorámico 120 m²",
    cardSubtitle: "Ensamblaje volumétrico 3D llave en mano",
    cardSpecs: "3D · 2B · Ventanales termopanel de piso a cielo",
    cardBadge: "95% en fábrica",
  },
  "steel-framing": {
    etiqueta: "CASAS STEEL FRAMING EN CHILE",
    h1Title: "Casas Steel Framing en Chile.",
    h1Accent: "Precisión milimétrica y máxima durabilidad.",
    descripcion:
      "Estructuras de perfiles de acero galvanizado conformados en frío. Inmune a plagas, resistencia sísmica insuperable, muros perfectamente aplomados y mínimo mantenimiento a lo largo de los años.",
    btnMain: "Ver modelos Steel Framing",
    btnSec: "Cotizar Steel Framing",
    secHref: "/cotizar?tipo=steel-framing",
    beneficios: [
      "Perfiles de acero galvanizado",
      "100% inmune a termitas y humedad",
      "Precisión y estabilidad estructural",
    ],
    aclaracion:
      "Rango típico: 18 a 28 UF/m² · Diseños contemporáneos con certificación estructural OGUC.",
    cardTitle: "Modelo Steel Frame Vanguardia 135 m²",
    cardSubtitle: "Estructura de acero liviano galvanizado",
    cardSpecs: "4D · 3B · Estándar antisísmico de alta gama",
    cardBadge: "Acero galvanizado",
  },
  madera: {
    etiqueta: "CASAS DE MADERA EN CHILE",
    h1Title: "Casas de Madera en Chile.",
    h1Accent: "Calidez natural, solidez y diseño sustentable.",
    descripcion:
      "Viviendas construidas en maderas seleccionadas y tratadas. Confort térmico orgánico, estética noble con vigas a la vista y huella de carbono positiva para parcelas y entornos naturales de Chile.",
    btnMain: "Ver modelos de madera",
    btnSec: "Cotizar casa de madera",
    secHref: "/cotizar?tipo=madera",
    beneficios: [
      "Maderas tratadas de alta densidad",
      "Huella de carbono negativa y sustentable",
      "Confort térmico y acústico natural",
    ],
    aclaracion:
      "Rango típico: 10 a 20 UF/m² · Diseños rústicos y modernos para climas del centro y sur.",
    cardTitle: "Modelo Roble & Coigüe 125 m²",
    cardSubtitle: "Maderas nativas y pino impregnado al vacío",
    cardSpecs: "3D · 2B · Vigas a la vista · Chimenea integrada",
    cardBadge: "Confort natural",
  },
  hormigon: {
    etiqueta: "CASAS DE HORMIGÓN EN CHILE",
    h1Title: "Casas de Hormigón en Chile.",
    h1Accent: "Solidez definitiva y aislación acústica máxima.",
    descripcion:
      "Viviendas de hormigón celular o paneles prefabricados de hormigón armado. Incombustible, masa térmica constante, máxima plusvalía en el tiempo y nulo mantenimiento estructural.",
    btnMain: "Ver modelos de hormigón",
    btnSec: "Cotizar casa de hormigón",
    secHref: "/cotizar?tipo=hormigon",
    beneficios: [
      "Estructura incombustible y eterna",
      "Aislamiento acústico insuperable",
      "Máxima plusvalía patrimonial",
    ],
    aclaracion:
      "Rango típico: 25 a 35 UF/m² · Resistencia G25 antisísmica con terminaciones de alto estándar.",
    cardTitle: "Modelo Hormigón Celular 150 m²",
    cardSubtitle: "Muros térmicos de concreto de alta resistencia",
    cardSpecs: "4D · 3B · Losa de hormigón y ventanales panorámicos",
    cardBadge: "Máxima durabilidad",
  },
  "tiny-house": {
    etiqueta: "TINY HOUSES EN CHILE",
    h1Title: "Tiny Houses en Chile.",
    h1Accent: "Minimalismo inteligente y libertad habitacional.",
    descripcion:
      "Casas pequeñas ultra optimizadas de 15 a 45 m². Máxima eficiencia por metro cuadrado, bajo consumo de mantenimiento, diseño autosuficiente y opción de movilidad o fundaciones livianas.",
    btnMain: "Ver modelos Tiny House",
    btnSec: "Cotizar Tiny House",
    secHref: "/cotizar?tipo=tiny-house",
    beneficios: [
      "Espacios 100% optimizados",
      "Bajo consumo y fácil mantención",
      "Opción fija o sobre ruedas (chasis)",
    ],
    aclaracion:
      "Rango típico: 450 a 1.200 UF · Llave en mano con equipamiento interior integral.",
    cardTitle: "Tiny House Compact 24 m²",
    cardSubtitle: "Diseño modular inteligente y autosuficiente",
    cardSpecs: "1D loft · 1B · Cocina integrada · Chasis opcional",
    cardBadge: "Minimalismo inteligente",
  },
};

export function TipoHero({ tipo, info, heroImageAlt }: TipoHeroProps) {
  const config = SYSTEM_HERO_CONFIG[tipo];

  const etiqueta = config?.etiqueta || `${info.title.toUpperCase()} EN CHILE`;
  const h1Title = config?.h1Title || `${info.title} en Chile.`;
  const h1Accent = config?.h1Accent || "Modelos y precios actualizados.";
  const descripcion =
    config?.descripcion ||
    info.description ||
    `Compara modelos, precios y opciones de ${info.title} en Chile con constructoras verificadas.`;
  const btnMain = config?.btnMain || `Ver modelos ${info.title.toLowerCase()}`;
  const btnSec = config?.btnSec || "Cotizar proyecto";
  const secHref = config?.secHref || `/cotizar?tipo=${tipo}`;
  const beneficios = config?.beneficios || info.benefits || [];
  const aclaracion =
    config?.aclaracion ||
    "Compara especificaciones técnicas, precios base y modelos llave en mano disponibles.";
  const cardTitle = config?.cardTitle || `Modelo ${info.title} 90 m²`;
  const cardSubtitle =
    config?.cardSubtitle || "Sistema constructivo industrializado en Chile";
  const cardSpecs =
    config?.cardSpecs || "3D · 2B · Llave en mano en tu región";
  const cardBadge = config?.cardBadge || "Verificado";

  return (
    <section
      aria-labelledby="hero-tipo-heading"
      className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-card/40 via-background to-background pt-4 sm:pt-6 lg:pt-8 pb-12 lg:pb-16"
    >
      {/* Fondo sutil con trama de puntos y resplandor suave */}
      <div
        className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* ── COLUMNA IZQUIERDA: Contenido y Acciones ── */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-5 sm:space-y-6">
            
            {/* 1. Etiqueta / Eyebrow */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 border border-brand-teal/30 px-3.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-brand-teal shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-teal shrink-0" aria-hidden="true" />
                <span>{etiqueta}</span>
              </span>
            </div>

            {/* 2. H1 Grande (Ajustado a 3-4 líneas legibles en mobile) */}
            <h1
              id="hero-tipo-heading"
              className="font-heading font-black text-foreground tracking-tight leading-[1.08] lg:leading-[1.04] text-[clamp(2rem,7vw,3.6rem)] text-balance"
            >
              {h1Title}{" "}
              <span className="text-brand-teal block sm:inline">
                {h1Accent}
              </span>
            </h1>

            {/* 3. Descripción */}
            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-xl text-pretty">
              {descripcion}
            </p>

            {/* 4. Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              {/* Botón Principal (Ancho completo en mobile con área táctil cómoda) */}
              <a
                href="#modelos"
                className="group relative flex w-full sm:w-auto min-h-[54px] sm:min-h-[56px] items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/25 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] cursor-pointer"
              >
                <span>{btnMain}</span>
                <ArrowRight className="ml-2.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </a>

              {/* Botón Secundario (Menor énfasis debajo en mobile) */}
              <Link
                href={secHref}
                className="inline-flex w-full sm:w-auto min-h-[50px] sm:min-h-[56px] items-center justify-center rounded-2xl border border-border/80 bg-card hover:bg-muted/70 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center"
              >
                {btnSec}
              </Link>
            </div>

            {/* 5. Beneficios breves con chips */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-semibold text-muted-foreground">
                {beneficios.map((b: string) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 bg-muted/60 border border-border/40 px-3 py-1.5 rounded-full"
                  >
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                      aria-hidden="true"
                    />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Aclaración discreta / Rango de precios */}
            <p className="text-xs text-muted-foreground/80 font-medium">
              {aclaracion}
            </p>
          </div>

          {/* ── COLUMNA DERECHA (DESKTOP) / INFERIOR (MOBILE): Fotografía y Tarjeta Visual ── */}
          <div className="lg:col-span-5 xl:col-span-6 w-full pt-4 lg:pt-0">
            <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-border/50 bg-card shadow-2xl shadow-primary/10">
              
              {/* Fotografía protagonista del modelo constructivo */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[5/4] w-full overflow-hidden">
                <Image
                  src={info.image}
                  alt={heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Tarjeta visual discreta sobre la foto */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-xl">
                
                {/* Encabezado del modelo */}
                <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-border/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0 text-brand-teal">
                      <Box className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-foreground truncate">
                          {cardTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <MapPin className="w-3 h-3 text-brand-teal shrink-0" aria-hidden="true" />
                        <span className="truncate">{cardSubtitle}</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-wider bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full border border-brand-teal/20">
                    {cardBadge}
                  </span>
                </div>

                {/* Especificaciones clave */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      <Home className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-xs truncate">
                        {cardSpecs}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        Disponibilidad en catálogo regional
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                    Verificado
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
