export const PLAN_LIMITS = {
  starter: {
    maxModels: 1,
    maxPhotos: 3,
    features: {
      leads: false,
      obras: false,
      testimonials: false,
      certifications: false,
      gallery: false,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: false,
    }
  },
  prueba: {
    maxModels: 3,
    maxPhotos: 3,
    features: {
      leads: true,
      obras: false,
      testimonials: false,
      certifications: false,
      gallery: false,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: false,
    }
  },
  gratis: {
    maxModels: 1,
    maxPhotos: 3,
    features: {
      leads: false,
      obras: false,
      testimonials: false,
      certifications: false,
      gallery: false,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: false,
    }
  },
  basic: {
    maxModels: 3,
    maxPhotos: 5,
    features: {
      leads: false,
      obras: false,
      testimonials: false,
      certifications: false,
      gallery: false,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: false,
    }
  },
  crece: {
    maxModels: 10,
    maxPhotos: 10,
    features: {
      leads: true,
      obras: false,
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: true,
    }
  },
  avanza: {
    maxModels: 10,
    maxPhotos: 10,
    features: {
      leads: true,
      obras: false,
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: true,
    }
  },
  pro: {
    maxModels: 999,
    maxPhotos: 15,
    features: {
      leads: true,
      obras: true,
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: true,
      priorityPosition: true,
      analytics: true,
    }
  },
  premium: {
    maxModels: 1000,
    maxPhotos: 20,
    features: {
      leads: true,
      obras: true,
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: true,
      priorityPosition: true,
      analytics: true,
    }
  },
  pro_plus: {
    maxModels: 1000,
    maxPhotos: 20,
    features: {
      leads: true,
      obras: true,
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: true,
      priorityPosition: true,
      analytics: true,
    }
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string = 'basic') {
  const p = plan.toLowerCase() as PlanType;
  return PLAN_LIMITS[p] || PLAN_LIMITS.basic;
}

// ─── Display names ─────────────────────────────────────────────────────────────
// Mapeo oficial de planes:
// Plan Basic: 1 UF (3 modelos)
// Plan Crece: 2 UF (10 modelos + leads)
// Plan Pro: 3 UF (Posicionamiento + modelos ilimitados + leads)
// Plan Pro+: 4 UF (Todo + Posición preferente + campañas)

export const PLAN_DISPLAY: Record<string, {
  nombre: string;
  tagline: string;
  precioUF: number;
}> = {
  basic:       { nombre: "Plan Basic",  tagline: "Presencia en catálogo (3 modelos)",                precioUF: 1 },
  crece:       { nombre: "Plan Crece",  tagline: "10 modelos + recepción de leads directos",         precioUF: 2 },
  pro:         { nombre: "Plan Pro",    tagline: "Posicionamiento + modelos ilimitados + leads",     precioUF: 3 },
  premium:     { nombre: "Plan Pro+",   tagline: "Todo + posición preferente regional + campañas",   precioUF: 4 },
  pro_plus:    { nombre: "Plan Pro+",   tagline: "Todo + posición preferente regional + campañas",   precioUF: 4 },
  gratis:      { nombre: "Plan Basic",  tagline: "Presencia en catálogo (3 modelos)",                precioUF: 1 },
  avanza:      { nombre: "Plan Crece",  tagline: "10 modelos + recepción de leads directos",         precioUF: 2 },
  prueba:      { nombre: "Prueba 30D",  tagline: "30 días de prueba sin costo",                      precioUF: 0 },
  starter:     { nombre: "Plan Starter", tagline: "1 modelo en catálogo · Solo por invitación",       precioUF: 0 },
  informativo: { nombre: "—",           tagline: "Perfil informativo",                               precioUF: 0 },
};

/** Devuelve el nombre de marketing del plan para mostrar en la UI */
export function getPlanNombre(planId: string): string {
  return PLAN_DISPLAY[planId]?.nombre ?? planId;
}
