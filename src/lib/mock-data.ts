// -------------------------------------------------------
// Mock data — replaces Supabase until DB is wired up
// -------------------------------------------------------

export type TipoModelo = "sip" | "prefabricada" | "modular" | "container" | "steel-framing" | "madera" | "hormigon" | "llave-en-mano" | "sociales";
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
  },
];

export const MODELOS: Modelo[] = [
  {
    id: "m1",
    constructoraId: "c1",
    constructoraNombre: "TecnoFast Home",
    constructoraSlug: "tecnofast-home",
    constructoraPlan: "premium",
    nombre: "Casa Nogal SIP 120",
    slug: "casa-nogal-sip-120",
    tipo: "sip",
    superficieM2: 120,
    dormitorios: 3,
    banos: 2,
    precioDesdeUF: 1200,
    imagenes: ["/hero.png", "/hero2.png"],
    tiempoEntrega: "90 días",
    descripcion: "Casa de panel SIP de 120m² con terminaciones premium. Diseño contemporáneo para toda la familia.",
    especificaciones: {
      "Estructura": "Panel SIP 162mm",
      "Cubierta": "Techo inclinado zinc-aluminio",
      "Terminaciones": "Stucco exterior, piso flotante",
      "Calefacción": "Losa radiante + VRF",
      "Garantía": "5 años estructura",
    },
    garantiaAnos: 5,
    postventa: true,
    disponible: true,
  },
  {
    id: "m2",
    constructoraId: "c1",
    constructoraNombre: "TecnoFast Home",
    constructoraSlug: "tecnofast-home",
    constructoraPlan: "premium",
    nombre: "Casa Roble Prefab 80",
    slug: "casa-roble-prefab-80",
    tipo: "prefabricada",
    superficieM2: 80,
    dormitorios: 2,
    banos: 1,
    precioDesdeUF: 750,
    imagenes: ["/hero2.png"],
    tiempoEntrega: "60 días",
    descripcion: "Diseño compacto y eficiente para parejas o pequeñas familias. Lista para habitar en 60 días.",
    especificaciones: {
      "Estructura": "Madera laminada encolada",
      "Cubierta": "Teja asfáltica",
      "Terminaciones": "Pino oregón exterior, porcelanato",
      "Calefacción": "Termopanel + estufa pellet",
      "Garantía": "3 años estructura",
    },
    garantiaAnos: 3,
    postventa: true,
    disponible: true,
  },
  {
    id: "m3",
    constructoraId: "c2",
    constructoraNombre: "Casas Imperio",
    constructoraSlug: "casas-imperio",
    constructoraPlan: "premium",
    nombre: "Imperio SIP 150",
    slug: "imperio-sip-150",
    tipo: "sip",
    superficieM2: 150,
    dormitorios: 4,
    banos: 2,
    precioDesdeUF: 1650,
    imagenes: ["/hero2.png", "/hero.png"],
    tiempoEntrega: "100 días",
    descripcion: "La solución más completa para familias grandes. Excelente aislación para zonas frías.",
    especificaciones: {
      "Estructura": "Panel SIP 200mm",
      "Cubierta": "Techo plano membrana EPDM",
      "Terminaciones": "Revestimiento vinílico, porcelanato",
      "Calefacción": "Piso radiante + bomba calor",
      "Garantía": "7 años estructura",
    },
    garantiaAnos: 7,
    postventa: true,
    disponible: true,
  },
  {
    id: "m4",
    constructoraId: "c3",
    constructoraNombre: "Metalkit",
    constructoraSlug: "metalkit",
    constructoraPlan: "pro",
    nombre: "MetalBox Studio 40",
    slug: "metalbox-studio-40",
    tipo: "container",
    superficieM2: 40,
    dormitorios: 1,
    banos: 1,
    precioDesdeUF: 350,
    imagenes: ["/hero.png"],
    tiempoEntrega: "45 días",
    descripcion: "Studio tipo loft de container marítimo reciclado. Perfecto como oficina, cabaña o primera vivienda.",
    especificaciones: {
      "Estructura": "Container 20' HC modificado",
      "Cubierta": "Cubierta plana ventilada",
      "Terminaciones": "Aislación inyectada, madera interior",
      "Calefacción": "Split inverter",
      "Garantía": "2 años estructura",
    },
    garantiaAnos: 2,
    postventa: false,
    disponible: true,
  },
  {
    id: "m5",
    constructoraId: "c3",
    constructoraNombre: "Metalkit",
    constructoraSlug: "metalkit",
    constructoraPlan: "pro",
    nombre: "MetalBox Casa 80",
    slug: "metalbox-casa-80",
    tipo: "container",
    superficieM2: 80,
    dormitorios: 2,
    banos: 1,
    precioDesdeUF: 680,
    imagenes: ["/hero2.png"],
    tiempoEntrega: "60 días",
    descripcion: "Dos contenedores 40' unidos. Diseño arquitectónico industrial con grandes ventanales.",
    especificaciones: {
      "Estructura": "2x Container 40' HC",
      "Cubierta": "Techo zinc-aluminio inclinado",
      "Terminaciones": "Aislación inyectada + madera",
      "Calefacción": "Split + losa radiante baño",
      "Garantía": "3 años estructura",
    },
    garantiaAnos: 3,
    postventa: true,
    disponible: true,
  },
  {
    id: "m6",
    constructoraId: "c4",
    constructoraNombre: "Prefab Sur",
    constructoraSlug: "prefab-sur",
    constructoraPlan: "pro",
    nombre: "Sur Classic 90",
    slug: "sur-classic-90",
    tipo: "prefabricada",
    superficieM2: 90,
    dormitorios: 3,
    banos: 2,
    precioDesdeUF: 820,
    imagenes: ["/hero.png"],
    tiempoEntrega: "75 días",
    descripcion: "Clásico diseño sureño adaptado al frío y la lluvia. Materiales de primera calidad.",
    especificaciones: {
      "Estructura": "Entramado madera nativa",
      "Cubierta": "Tejuela raulí",
      "Terminaciones": "Pino oregón, tinglado",
      "Calefacción": "Estufa leña + termopanel",
      "Garantía": "5 años estructura",
    },
    garantiaAnos: 5,
    postventa: true,
    disponible: true,
  },
];
