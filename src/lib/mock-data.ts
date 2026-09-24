// -------------------------------------------------------
// Mock data — replaces Supabase until DB is wired up
// -------------------------------------------------------

export type TipoModelo = "sip" | "prefabricada" | "modular" | "container" | "steel-framing" | "madera" | "hormigon" | "llave-en-mano" | "sociales" | "otro";
export type PlanConstructora = "gratis" | "pro" | "premium";

export interface Constructora {
  id: string;
  nombre: string;
  slug: string;
  logo: string;
  descripcion: string;
  regiones: string[];
  tiposConstruccion: TipoModelo[];
  plan: PlanConstructora;
  scoreConfianza: number;
  reviews: number;
  anioFundacion: number;
  proyectosCompletados: number;
  badges: string[];
  verificada: boolean;
  image: string;
  lat?: number | null;
  lng?: number | null;
  direccion?: string | null;
  telefono?: string | null;
  sitio_web?: string | null;
}

export interface Modelo {
  id: string;
  constructoraId: string;
  constructoraNombre: string;
  constructoraSlug: string;
  constructoraPlan: PlanConstructora;
  nombre: string;
  slug: string;
  tipo: TipoModelo;
  superficieM2: number;
  dormitorios: number;
  banos: number;
  precioDesdeUF: number;
  imagenes: string[];
  tiempoEntrega: string;
  descripcion: string;
  especificaciones: Record<string, string>;
  garantiaAnos: number;
  postventa: boolean;
  disponible: boolean;
  videoUrl?: string;
}


export const CONSTRUCTORAS: Constructora[] = [
  {
    id: "cb85b919-4008-46bc-bbb8-b3211152280c",
    nombre: "Constructora Master",
    slug: "javier-cb85b919",
    logo: "https://pereskyvymsyiqbihydj.supabase.co/storage/v1/object/public/model_images/logos/cb85b919-4008-46bc-bbb8-b3211152280c-1775228477059.png",
    descripcion: "Constructora Master SpA es una empresa líder en desarrollo de viviendas prefabricadas, SIP y modulares de alto estándar en Chile con más de 14 años de experiencia y trayectoria.",
    regiones: [
      "La Araucanía",
      "Los Ríos",
      "Los Lagos",
      "Metropolitana",
      "Valparaíso",
      "Biobío",
      "Maule",
      "Ñuble",
      "Coquimbo"
    ],
    tiposConstruccion: ["sip", "prefabricada", "modular", "steel-framing", "madera"],
    plan: "premium",
    scoreConfianza: 100,
    reviews: 48,
    anioFundacion: 2010,
    proyectosCompletados: 40,
    badges: ["Verificada", "Top Rated", "Partner Oro"],
    verificada: true,
    image: "https://pereskyvymsyiqbihydj.supabase.co/storage/v1/object/public/model_images/banners/cb85b919-4008-46bc-bbb8-b3211152280c-1775509005054.jpg",
    lat: -38.7359,
    lng: -72.5904,
    direccion: "Avenida San Martín 4303, Temuco, La Araucanía",
    telefono: "+56 9 8441 0379",
    sitio_web: "https://constructoramaster.com",
  },
  {
    id: "c0",
    nombre: "Austral SIP",
    slug: "austral-sip",
    logo: "/images/modelos/austral/frente.jpg",
    descripcion: "Especialistas en arquitectura modular SIP de alta gama. Diseño bioclimático y eficiencia extrema.",
    regiones: ["Metropolitana", "Valparaíso", "Biobío", "Los Lagos"],
    tiposConstruccion: ["sip"],
    plan: "premium",
    scoreConfianza: 100,
    reviews: 245,
    anioFundacion: 2014,
    proyectosCompletados: 120,
    badges: ["Verificada", "Top Rated", "Partner Oro"],
    verificada: true,
    image: "/images/modelos/austral/nocturna.jpg",
    lat: -33.4189,
    lng: -70.6038,
    direccion: "Av. Vitacura 2909, Las Condes, Región Metropolitana",
    telefono: "+56 9 6140 5052",
    sitio_web: "https://australsip.cl",
  },
  {
    id: "c1",
    nombre: "TecnoFast Home",
    slug: "tecnofast-home",
    logo: "/hero.png",
    descripcion: "Líderes en construcción prefabricada de alto estándar en Chile desde 2005.",
    regiones: ["Metropolitana", "Valparaíso", "Biobío"],
    tiposConstruccion: ["prefabricada"],
    plan: "premium",
    scoreConfianza: 98,
    reviews: 124,
    anioFundacion: 2005,
    proyectosCompletados: 340,
    badges: ["Verificada", "Top Rated", "+50 Proyectos"],
    verificada: true,
    image: "/hero.png",
    lat: -33.3645,
    lng: -70.6872,
    direccion: "Av. Panamericana Norte 9990, Quilicura, Región Metropolitana",
    telefono: "+56 2 2990 0000",
    sitio_web: "https://tecnofast.cl",
  },
  {
    id: "c2",
    nombre: "Casas Imperio",
    slug: "casas-imperio",
    logo: "/hero2.png",
    descripcion: "Especialistas en paneles SIP y construcción de alta eficiencia energética.",
    regiones: ["Metropolitana", "La Araucanía", "Los Lagos"],
    tiposConstruccion: ["sip", "prefabricada"],
    plan: "premium",
    scoreConfianza: 95,
    reviews: 89,
    anioFundacion: 2010,
    proyectosCompletados: 210,
    badges: ["Verificada", "Respuesta Rápida", "Certificada"],
    verificada: true,
    image: "/hero2.png",
    lat: -38.7397,
    lng: -72.5901,
    direccion: "Av. Rudecindo Ortega 02150, Temuco, La Araucanía",
    telefono: "+56 45 220 3000",
    sitio_web: "https://casasimperio.cl",
  },
  {
    id: "c3",
    nombre: "Metalkit",
    slug: "metalkit",
    logo: "/hero.png",
    descripcion: "Casas container de diseño moderno con entrega en tiempo récord.",
    regiones: ["Metropolitana", "Coquimbo", "Atacama"],
    tiposConstruccion: ["container"],
    plan: "pro",
    scoreConfianza: 92,
    reviews: 56,
    anioFundacion: 2015,
    proyectosCompletados: 98,
    badges: ["Top Rated", "Certificada"],
    verificada: true,
    image: "/hero.png",
    lat: -29.9533,
    lng: -71.3436,
    direccion: "Ruta 5 Norte Km 465, Coquimbo",
    telefono: "+56 51 223 4455",
    sitio_web: "https://metalkit.cl",
  },
  {
    id: "c4",
    nombre: "Prefab Sur",
    slug: "prefab-sur",
    logo: "/hero2.png",
    descripcion: "Casas prefabricadas para el clima del sur de Chile. Buen precio.",
    regiones: ["Los Lagos", "Aysén", "Magallanes"],
    tiposConstruccion: ["prefabricada", "sip"],
    plan: "pro",
    scoreConfianza: 87,
    reviews: 34,
    anioFundacion: 2012,
    proyectosCompletados: 75,
    badges: ["Verificada"],
    verificada: true,
    image: "/hero2.png",
    lat: -41.4693,
    lng: -72.9424,
    direccion: "Ruta 5 Sur Km 1025, Puerto Montt, Los Lagos",
    telefono: "+56 65 234 5678",
    sitio_web: "https://prefabsur.cl",
  },
  {
    id: "c5",
    nombre: "ContainerHouse CL",
    slug: "containerhouse-cl",
    logo: "/hero.png",
    descripcion: "Transformamos contenedores en hogares modernos y sustentables.",
    regiones: ["Metropolitana", "Valparaíso"],
    tiposConstruccion: ["container"],
    plan: "gratis",
    scoreConfianza: 78,
    reviews: 12,
    anioFundacion: 2019,
    proyectosCompletados: 22,
    badges: [],
    verificada: false,
    image: "/hero.png",
    lat: -33.0472,
    lng: -71.6127,
    direccion: "Camino La Pólvora 1500, Valparaíso",
    telefono: "+56 32 212 3456",
    sitio_web: "https://containerhouse.cl",
  },
];

export const MODELOS: Modelo[] = [
  {
    id: "master-roble-andino",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Roble Andino",
    slug: "modelo-roble-andino-115m2",
    tipo: "sip",
    superficieM2: 120,
    dormitorios: 2,
    banos: 1,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_roble_render_raw.png",
      "/ejemplos/images/modelo_roble_plano_raw.jpeg"
    ],
    tiempoEntrega: "60 a 90 días",
    descripcion: "Vivienda contemporánea de 120 m² con 2 amplios dormitorios y baño completo. Zona social de concepto abierto, cocina americana con isla y conexión a terraza con cubierta a cuatro aguas.",
    especificaciones: {
      "Estructura": "Panel SIP estructural 160 mm",
      "Cubierta": "4 aguas metálica PV4 anticorrosión",
      "Dimensiones": "12.45 m × 11.68 m",
      "Ventanas": "Termopanel PVC doble vidriado",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-valle-central",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Valle Central",
    slug: "modelo-valle-central-112m2",
    tipo: "steel-framing",
    superficieM2: 112,
    dormitorios: 2,
    banos: 1,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_valle_render_raw.png",
      "/ejemplos/images/modelo_valle_plano_raw.jpeg"
    ],
    tiempoEntrega: "60 a 75 días",
    descripcion: "Diseño alargado de 112 m² ideal para parcelas. Fachada vanguardista en acero corrugado con pórtico de acceso en madera nativa y ventanales termopanel de piso a cielo.",
    especificaciones: {
      "Estructura": "Steel Framing Metalcom estructural",
      "Cubierta": "Zincalum prepintado negro mate",
      "Dimensiones": "14.48 m × 8.28 m",
      "Aislación": "Lana de roca mineral 100 mm R100",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-cordillera",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Cordillera",
    slug: "modelo-cordillera-92m2",
    tipo: "modular",
    superficieM2: 92,
    dormitorios: 2,
    banos: 2,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_cordillera_render_raw.png",
      "/ejemplos/images/modelo_cordillera_plano_raw.jpeg"
    ],
    tiempoEntrega: "45 a 60 días",
    descripcion: "Planta modular vanguardista de 92 m² con 2 dormitorios y 2 baños completos. Optimizada para montaje express y máxima eficiencia energética en zonas frías y cordillera.",
    especificaciones: {
      "Estructura": "Chasis de acero y panelería SIP",
      "Cubierta": "Membrana monocapa EPDM impermeable",
      "Dimensiones": "6.65 m × 14.68 m",
      "Ventanas": "Termopanel PVC antracita",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-alerce-austral",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Alerce Austral",
    slug: "modelo-alerce-austral-80m2",
    tipo: "prefabricada",
    superficieM2: 80,
    dormitorios: 2,
    banos: 2,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_alerce_render_raw.png",
      "/ejemplos/images/modelo_alerce_plano_raw.jpeg"
    ],
    tiempoEntrega: "45 a 60 días",
    descripcion: "Acogedora vivienda de 80 m² de arquitectura tradicional chilena en siding blanco, con 2 dormitorios, 2 baños y doble puerta vidriada hacia el jardín posterior.",
    especificaciones: {
      "Estructura": "Pino impregnado y panelería SIP",
      "Cubierta": "Teja asfáltica gravillada",
      "Dimensiones": "13.67 m × 7.57 m",
      "Fachada": "Siding blanco durable",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-costa-brava",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Costa Brava",
    slug: "modelo-costa-brava-78m2",
    tipo: "prefabricada",
    superficieM2: 78,
    dormitorios: 3,
    banos: 1,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_costa_render_raw.png",
      "/ejemplos/images/modelo_costa_plano_raw.jpeg"
    ],
    tiempoEntrega: "45 a 60 días",
    descripcion: "La solución familiar definitiva en 78 m²: 3 cómodos dormitorios, baño central, cocina abierta y sala de estar con iluminación natural cruzada.",
    especificaciones: {
      "Estructura": "Panelizado prefabricado tradicional",
      "Cubierta": "Cubierta metálica anticorrosiva",
      "Dimensiones": "15.85 m × 6.45 m",
      "Distribución": "3 dormitorios familiares",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-loft-arrayan",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Loft Arrayán",
    slug: "modelo-loft-arrayan-74m2",
    tipo: "madera",
    superficieM2: 74,
    dormitorios: 2,
    banos: 2,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_loft_render_raw.png",
      "/ejemplos/images/modelo_loft_plano_raw.jpeg"
    ],
    tiempoEntrega: "60 a 90 días",
    descripcion: "Cabaña contemporánea estilo alpino escandinavo con revestimiento en madera vertical, doble altura, altillo panorámico, 2 baños y deck exterior.",
    especificaciones: {
      "Estructura": "Vigas madera laminada y paneles SIP",
      "Cubierta": "Zinc prepintado negro mate",
      "Dimensiones": "9.75 m × 9.25 m",
      "Estilo": "Alpino Escandinavo",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  },
  {
    id: "master-pradera-cottage",
    constructoraId: "cb85b919-4008-46bc-bbb8-b3211152280c",
    constructoraNombre: "Constructora Master",
    constructoraSlug: "javier-cb85b919",
    constructoraPlan: "premium",
    nombre: "Modelo Pradera Cottage",
    slug: "modelo-pradera-cottage-86m2",
    tipo: "sip",
    superficieM2: 86,
    dormitorios: 2,
    banos: 2,
    precioDesdeUF: 0,
    imagenes: [
      "/ejemplos/images/modelo_pradera_render_raw.png",
      "/ejemplos/images/modelo_pradera_plano_raw.jpeg"
    ],
    tiempoEntrega: "60 a 75 días",
    descripcion: "Estética clásica y sobria estilo cottage campestre en 86 m² con zócalo de piedra, cubierta a dos aguas, 2 dormitorios y 2 baños completos.",
    especificaciones: {
      "Estructura": "Panel SIP y zócalo en mampostería",
      "Cubierta": "Teja asfáltica color pizarra",
      "Dimensiones": "12.70 m × 8.38 m",
      "Fachada": "Siding gris cálido y piedra",
      "Garantía": "10 años estructura"
    },
    garantiaAnos: 10,
    postventa: true,
    disponible: true
  }
];
