export const PLAN_LIMITS = {
  gratis: {
    maxModels: 3,
    maxPhotos: 3,
    features: {
      testimonials: false,
      certifications: false,
      gallery: false,
      verifiedBadge: false,
      priorityPosition: false,
      analytics: false,
    }
  },
  pro: {
    maxModels: 15,
    maxPhotos: 10,
    features: {
      testimonials: true,
      certifications: true,
      gallery: true,
      verifiedBadge: true,
      priorityPosition: true,
      analytics: true,
    }
  },
  premium: {
    maxModels: 1000, // Ilimitado en la práctica
    maxPhotos: 20,
    features: {
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

export function getPlanLimits(plan: string = 'gratis') {
  const p = plan.toLowerCase() as PlanType;
  return PLAN_LIMITS[p] || PLAN_LIMITS.gratis;
}
