/**
 * constructoras-data.ts
 * Capa de datos compartida que fusiona:
 *  1. Datos del scraper (constructoras-geo.json) — rating real de Google Maps
 *  2. Supabase DB — constructoras verificadas con planes
 *  3. Mock data — CONSTRUCTORAS estáticas
 *
 * Expone funciones listas para usar en páginas Server Component.
 */

import { CONSTRUCTORAS } from "@/lib/mock-data";
import geoDataJson from "@/data/constructoras-geo.json";

// ─── Tipos ─────────────────────────────────────────────────────────────────

export interface ConstructoraUnificada {
  id: string;
  nombre: string;
  slug: string;
  logo_url: string | null;
  descripcion: string;
  plan: string;
  verificada: boolean;
  score_confianza: number;
  rating: number | null;
  reviews: number | null;
  regiones: string[];
  proyectos_completados: number;
  sitio_web: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
}

// ─── Mapa de regiones ──────────────────────────────────────────────────────

export interface RegionInfo {
  nombre: string;          // Nombre display completo
  supabaseNombre: string;  // Nombre en DB / geo JSON
  slug: string;
  capital: string;
  clima: string;
  recomendacion: string;
  intro: string;
  faqs: { q: string; a: string }[];
  emoji: string;
}

export const REGIONES_CHILE: Record<string, RegionInfo> = {
  "metropolitana": {
    nombre: "Región Metropolitana", supabaseNombre: "Metropolitana",
    slug: "metropolitana", capital: "Santiago",
    clima: "Mediterráneo semiárido", recomendacion: "SIP o Metalcom", emoji: "🏙️",
    intro: "La Región Metropolitana concentra la mayor demanda del país. Su clima moderado permite usar cualquier sistema, siendo el SIP el preferido para ahorro energético.",
    faqs: [{ q: "¿Permisos en Santiago?", a: "Las constructoras en SolocasasChile ayudan con la carpeta técnica para la DOM de tu comuna." }],
  },
  "valparaiso": {
    nombre: "Región de Valparaíso", supabaseNombre: "Valparaíso",
    slug: "valparaiso", capital: "Valparaíso",
    clima: "Mediterráneo costero", recomendacion: "Panel SIP o Steel Framing", emoji: "⛵",
    intro: "Alta humedad costera y salitre. Las casas prefabricadas SIP y Steel Framing galvanizado son las más durables en Viña del Mar y alrededores.",
    faqs: [{ q: "¿Qué sistema resiste la salinidad?", a: "Steel Framing galvanizado o SIP con OSB tratado son los más recomendados en zonas costeras." }],
  },
  "biobio": {
    nombre: "Región del Biobío", supabaseNombre: "Biobío",
    slug: "biobio", capital: "Concepción",
    clima: "Templado lluvioso", recomendacion: "Panel SIP impermeable", emoji: "🌧️",
    intro: "Concepción y alrededores requieren protección contra la lluvia constante. El SIP con membrana hidrófuga es esencial en el Biobío.",
    faqs: [{ q: "¿Las casas resisten sismos?", a: "Sí, los sistemas cumplen NCh433 de diseño sísmico, vital para la zona de Concepción." }],
  },
  "araucania": {
    nombre: "Región de La Araucanía", supabaseNombre: "La Araucanía",
    slug: "araucania", capital: "Temuco",
    clima: "Templado lluvioso frío", recomendacion: "SIP aislación extrema", emoji: "🌲",
    intro: "En Temuco, Pucón y Villarrica el frío y la humedad son constantes. La Araucanía es el reino del Panel SIP en Chile.",
    faqs: [],
  },
  "los-lagos": {
    nombre: "Región de Los Lagos", supabaseNombre: "Los Lagos",
    slug: "los-lagos", capital: "Puerto Montt",
    clima: "Oceánico lluvioso", recomendacion: "SIP 100mm mínimo", emoji: "🌊",
    intro: "Puerto Montt y Chiloé exigen resistencia al viento y la lluvia. Las casas SIP de alta densidad son la norma.",
    faqs: [],
  },
  "coquimbo": {
    nombre: "Región de Coquimbo", supabaseNombre: "Coquimbo",
    slug: "coquimbo", capital: "La Serena",
    clima: "Mediterráneo transicional", recomendacion: "Prefabricada panelizada o SIP", emoji: "🌵",
    intro: "La Serena y el Valle del Elqui buscan estética y eficiencia. Las casas prefabricadas de madera y SIP son favoritas para segundas viviendas.",
    faqs: [],
  },
  "ohiggins": {
    nombre: "Región de O'Higgins", supabaseNombre: "O'Higgins",
    slug: "ohiggins", capital: "Rancagua",
    clima: "Mediterráneo interior", recomendacion: "Prefabricada o SIP", emoji: "🐄",
    intro: "Rancagua y San Fernando tienen gran disponibilidad de parcelas de agrado. Las casas tipo campo son las más solicitadas.",
    faqs: [],
  },
  "maule": {
    nombre: "Región del Maule", supabaseNombre: "Maule",
    slug: "maule", capital: "Talca",
    clima: "Mediterráneo húmedo", recomendacion: "Madera o SIP", emoji: "🍇",
    intro: "El corazón agrícola de Chile. En Talca y Linares la madera evolucionó hacia paneles SIP para cumplir las nuevas exigencias térmicas.",
    faqs: [],
  },
  "nuble": {
    nombre: "Región de Ñuble", supabaseNombre: "Ñuble",
    slug: "nuble", capital: "Chillán",
    clima: "Mediterráneo húmedo", recomendacion: "SIP o Metalcom", emoji: "🌾",
    intro: "Chillán demanda viviendas que soporten inviernos fríos y veranos calurosos. El panel SIP es la solución más equilibrada.",
    faqs: [],
  },
  "los-rios": {
    nombre: "Región de Los Ríos", supabaseNombre: "Los Ríos",
    slug: "los-rios", capital: "Valdivia",
    clima: "Oceánico muy lluvioso", recomendacion: "SIP o Madera impregnada", emoji: "🌿",
    intro: "Valdivia es la zona más lluviosa de Chile. La construcción prefabricada debe incluir sellos industriales y sobre-cimientos altos.",
    faqs: [],
  },
  "antofagasta": {
    nombre: "Región de Antofagasta", supabaseNombre: "Antofagasta",
    slug: "antofagasta", capital: "Antofagasta",
    clima: "Desértico absoluto", recomendacion: "Steel Framing o Hormigón Celular", emoji: "⛏️",
    intro: "La capital minera de Chile requiere viviendas robustas con gran oscilación térmica día/noche.",
    faqs: [],
  },
  "atacama": {
    nombre: "Región de Atacama", supabaseNombre: "Atacama",
    slug: "atacama", capital: "Copiapó",
    clima: "Desértico transicional", recomendacion: "SIP o Metalcom", emoji: "🏜️",
    intro: "Copiapó y Vallenar tienen clima seco ideal para estructuras de metal. Las Tiny Houses son tendencia en los valles interiores.",
    faqs: [],
  },
  "tarapaca": {
    nombre: "Región de Tarapacá", supabaseNombre: "Tarapacá",
    slug: "tarapaca", capital: "Iquique",
    clima: "Desértico", recomendacion: "Modular o Container", emoji: "🌅",
    intro: "En Iquique y Alto Hospicio el auge de containers y sistemas modulares se adapta al terreno arenoso.",
    faqs: [],
  },
  "arica": {
    nombre: "Región de Arica y Parinacota", supabaseNombre: "Arica y Parinacota",
    slug: "arica", capital: "Arica",
    clima: "Desértico costero / Altiplánico", recomendacion: "Modular o Metalcom", emoji: "🌞",
    intro: "Alta radiación UV y aridez. Las casas prefabricadas en Arica priorizan protección térmica y materiales resistentes a la salinidad costera.",
    faqs: [],
  },
  "aysen": {
    nombre: "Región de Aysén", supabaseNombre: "Aysén",
    slug: "aysen", capital: "Coyhaique",
    clima: "Frío oceánico / Estepárico", recomendacion: "SIP 150mm o Modular", emoji: "🏔️",
    intro: "Coyhaique y la Patagonia requieren aislación de nivel experto. Paneles SIP de 150mm o sistemas modulares terminados de fábrica.",
    faqs: [{ q: "¿Llegan a la Carretera Austral?", a: "Sí, se coordina logística de barcaza y camión para zonas remotas de Aysén." }],
  },
  "magallanes": {
    nombre: "Región de Magallanes", supabaseNombre: "Magallanes",
    slug: "magallanes", capital: "Punta Arenas",
    clima: "Frío estepárico con vientos", recomendacion: "SIP alta densidad / Steel Framing", emoji: "🧊",
    intro: "El extremo sur de Chile exige casas capaces de soportar vientos de 120km/h y temperaturas bajo cero.",
    faqs: [{ q: "¿Resisten el viento?", a: "Las estructuras están calculadas para cargas de viento extremas según NCh432." }],
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Convierte datos del geo JSON al formato unificado */
function geoToUnificada(g: any): ConstructoraUnificada {
  return {
    id: `scraped-${g.slug}`,
    nombre: g.nombre,
    slug: g.slug,
    logo_url: null,
    descripcion: `Constructora de casas prefabricadas en Chile. Ubicación: ${g.direccion || g.regiones?.[0] || "Chile"}.`,
    plan: "informativo",
    verificada: false,
    score_confianza: g.rating ? Math.min(100, Math.round(g.rating * 18)) : 65,
    rating: g.rating ?? null,
    reviews: g.reviews ?? null,
    regiones: g.regiones || ["Metropolitana"],
    proyectos_completados: 0,
    sitio_web: g.sitio_web || null,
    telefono: g.telefono || null,
    email: null,
    direccion: g.direccion || null,
    lat: g.lat ?? null,
    lng: g.lng ?? null,
  };
}

/** Convierte mock data al formato unificado */
function mockToUnificada(c: any, geo?: any): ConstructoraUnificada {
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    logo_url: c.logo ?? null,
    descripcion: c.descripcion,
    plan: c.plan,
    verificada: c.verificada ?? false,
    score_confianza: c.scoreConfianza ?? 70,
    rating: geo?.rating ?? null,
    reviews: geo?.reviews ?? c.reviews ?? null,
    regiones: c.regiones ?? [],
    proyectos_completados: c.proyectosCompletados ?? 0,
    sitio_web: c.sitio_web ?? geo?.sitio_web ?? null,
    telefono: c.telefono ?? geo?.telefono ?? null,
    email: null,
    direccion: c.direccion ?? geo?.direccion ?? null,
    lat: c.lat ?? geo?.lat ?? null,
    lng: c.lng ?? geo?.lng ?? null,
  };
}

/** Convierte registro de Supabase al formato unificado, enriqueciendo con geo si falta lat/lng */
function dbToUnificada(c: any, geo?: any): ConstructoraUnificada {
  return {
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    logo_url: c.logo_url ?? null,
    descripcion: c.descripcion ?? "",
    plan: c.plan ?? "informativo",
    verificada: c.verificada ?? false,
    score_confianza: c.score_confianza ?? 65,
    rating: geo?.rating ?? null,
    reviews: geo?.reviews ?? null,
    regiones: c.regiones ?? [],
    proyectos_completados: c.proyectos_completados ?? 0,
    sitio_web: c.sitio_web ?? geo?.sitio_web ?? null,
    telefono: c.telefono ?? geo?.telefono ?? null,
    email: c.email ?? null,
    direccion: c.direccion ?? geo?.direccion ?? null,
    lat: c.lat ?? geo?.lat ?? null,
    lng: c.lng ?? geo?.lng ?? null,
  };
}

/** Orden de plan para ranking */
const PLAN_ORDER: Record<string, number> = {
  premium: 0, avanza: 1, pro: 2, prueba: 3, gratis: 4, informativo: 5,
};

/** Combina y deduplica las 3 fuentes. Requiere dbRows de Supabase. */
export function mergeConstructoras(dbRows: any[]): ConstructoraUnificada[] {
  const geo = geoDataJson as Record<string, any>;

  const mockUnified = CONSTRUCTORAS.map(c => mockToUnificada(c, geo[c.slug]));
  const dbUnified = dbRows.map(c => dbToUnificada(c, geo[c.slug]));

  const existingSlugs = new Set([
    ...mockUnified.map(m => m.slug),
    ...dbUnified.map(d => d.slug),
  ]);

  const scrapedExtra = Object.values(geo)
    .filter((g: any) => g?.slug && !existingSlugs.has(g.slug))
    .map((g: any) => geoToUnificada(g));

  const all = [...mockUnified, ...dbUnified, ...scrapedExtra];

  // Deduplicar por slug, quedándonos con el de mayor plan
  const bySlug = new Map<string, ConstructoraUnificada>();
  for (const c of all) {
    const existing = bySlug.get(c.slug);
    if (!existing || (PLAN_ORDER[c.plan] ?? 9) < (PLAN_ORDER[existing.plan] ?? 9)) {
      bySlug.set(c.slug, c);
    }
  }

  return Array.from(bySlug.values());
}

/** Filtra top N constructoras de una región, ordenadas por rating + plan */
export function getTopByRegion(
  all: ConstructoraUnificada[],
  supabaseNombre: string,
  limit = 40,
): ConstructoraUnificada[] {
  return all
    .filter(c =>
      c.regiones.some(r =>
        r.toLowerCase().includes(supabaseNombre.toLowerCase()) ||
        supabaseNombre.toLowerCase().includes(r.toLowerCase())
      )
    )
    .sort((a, b) => {
      const planDiff = (PLAN_ORDER[a.plan] ?? 9) - (PLAN_ORDER[b.plan] ?? 9);
      if (planDiff !== 0) return planDiff;
      // Prioriza rating real de Google Maps
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.score_confianza ?? 0) - (a.score_confianza ?? 0);
    })
    .slice(0, limit);
}

/** Cuenta constructoras por región */
export function countByRegion(
  all: ConstructoraUnificada[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const region of Object.values(REGIONES_CHILE)) {
    counts[region.slug] = all.filter(c =>
      c.regiones.some(r =>
        r.toLowerCase().includes(region.supabaseNombre.toLowerCase()) ||
        region.supabaseNombre.toLowerCase().includes(r.toLowerCase())
      )
    ).length;
  }
  return counts;
}
