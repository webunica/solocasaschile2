export type BillingCycle = "monthly" | "semiannual" | "yearly";
export type DirectCheckoutPlan = "basic" | "crece" | "pro" | "premium";
export type CheckoutCoupon = {
  code: string;
  label: string;
  percentOff: number;
  description: string;
};

export const CHECKOUT_PLANS: Record<
  DirectCheckoutPlan,
  {
    id: DirectCheckoutPlan;
    name: string;
    label: string;
    monthlyUf: number;
    semiannualMonthlyUf: number;
    semiannualTotalUf: number;
    yearlyMonthlyUf: number;
    yearlyTotalUf: number;
    annualDiscountLabel: string;
    features: string[];
  }
> = {
  basic: {
    id: "basic",
    name: "Plan Basic",
    label: "Basic",
    monthlyUf: 1.0,
    semiannualMonthlyUf: 0.9,
    semiannualTotalUf: 5.4,
    yearlyMonthlyUf: 0.8,
    yearlyTotalUf: 9.6,
    annualDiscountLabel: "20% OFF anual",
    features: [
      "Hasta 3 modelos en catálogo",
      "5 fotos por modelo",
      "Perfil verificado de constructora",
      "Presencia en búsquedas por región",
      "Ficha de contacto con botón cotizar",
    ],
  },
  crece: {
    id: "crece",
    name: "Plan Crece",
    label: "Crece",
    monthlyUf: 2.0,
    semiannualMonthlyUf: 1.8,
    semiannualTotalUf: 10.8,
    yearlyMonthlyUf: 1.6,
    yearlyTotalUf: 19.2,
    annualDiscountLabel: "20% OFF anual",
    features: [
      "Hasta 10 modelos en catálogo",
      "10 fotos por modelo",
      "Recepción directa de leads (WhatsApp/Email)",
      "CRM y métricas de consultas recibidas",
      "Galería de proyectos terminados",
    ],
  },
  pro: {
    id: "pro",
    name: "Plan Pro",
    label: "Pro",
    monthlyUf: 3.0,
    semiannualMonthlyUf: 2.7,
    semiannualTotalUf: 16.2,
    yearlyMonthlyUf: 2.4,
    yearlyTotalUf: 28.8,
    annualDiscountLabel: "20% OFF anual",
    features: [
      "Modelos y fotos ilimitadas",
      "Posicionamiento destacado en catálogo",
      "Prioridad alta en tu región",
      "Leads directos ilimitados",
      "Sello oficial Constructora Verificada ✓",
      "Módulo de Seguimiento de Obras",
    ],
  },
  premium: {
    id: "premium",
    name: "Plan Pro+",
    label: "Pro+",
    monthlyUf: 4.0,
    semiannualMonthlyUf: 3.6,
    semiannualTotalUf: 21.6,
    yearlyMonthlyUf: 3.2,
    yearlyTotalUf: 38.4,
    annualDiscountLabel: "20% OFF anual",
    features: [
      "Todo lo incluido en Plan Pro",
      "Posición preferente #1 en tu región",
      "Campañas activas en redes y blog",
      "Menciones prioritarias a cotizantes locales",
      "Asesoría comercial personalizada",
      "Ejecutivo de cuenta dedicado vía WhatsApp",
    ],
  },
} as const;

export const BILLING_OPTIONS: Array<{
  id: BillingCycle;
  months: number;
  title: string;
  badge?: string;
  benefit: string;
}> = [
  {
    id: "yearly",
    months: 12,
    title: "12 meses",
    badge: "Mejor ahorro",
    benefit: "Ahorra 20% y asegura tu visibilidad y leads por todo el año.",
  },
  {
    id: "semiannual",
    months: 6,
    title: "6 meses",
    badge: "Flexible",
    benefit: "Ahorra 10% con un compromiso intermedio.",
  },
  {
    id: "monthly",
    months: 1,
    title: "1 mes",
    benefit: "Paga mes a mes sin permanencia forzosa.",
  },
];

export const CHECKOUT_COUPONS: Record<string, CheckoutCoupon> = {
  SOLOCASAS10: {
    code: "SOLOCASAS10",
    label: "10% de descuento",
    percentOff: 10,
    description: "Descuento especial de lanzamiento.",
  },
  SOLOCASAS20: {
    code: "SOLOCASAS20",
    label: "20% de descuento",
    percentOff: 20,
    description: "Descuento para empresas pioneras.",
  },
};

export function isDirectCheckoutPlan(plan: string): plan is DirectCheckoutPlan {
  return plan in CHECKOUT_PLANS;
}

export function isBillingCycle(billing: string): billing is BillingCycle {
  return billing === "monthly" || billing === "semiannual" || billing === "yearly";
}

export function getCheckoutPlanPriceUf(plan: DirectCheckoutPlan, billing: BillingCycle) {
  const planConfig = CHECKOUT_PLANS[plan] || CHECKOUT_PLANS.pro;

  if (billing === "yearly") {
    return {
      displayUf: planConfig.yearlyMonthlyUf,
      totalUf: planConfig.yearlyTotalUf,
      label: "UF / mes equiv.",
    };
  }

  if (billing === "semiannual") {
    return {
      displayUf: planConfig.semiannualMonthlyUf,
      totalUf: planConfig.semiannualTotalUf,
      label: "UF / mes equiv.",
    };
  }

  return {
    displayUf: planConfig.monthlyUf,
    totalUf: planConfig.monthlyUf,
    label: "UF / mes",
  };
}

export function normalizeCouponCode(code?: string | null) {
  return (code ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export function getCheckoutCoupon(code?: string | null) {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return null;
  return CHECKOUT_COUPONS[normalized] ?? null;
}

function roundUf(value: number) {
  return Number(value.toFixed(2));
}

export function getCheckoutPriceWithCoupon(
  plan: DirectCheckoutPlan,
  billing: BillingCycle,
  couponCode?: string | null
) {
  const basePrice = getCheckoutPlanPriceUf(plan, billing);
  const coupon = getCheckoutCoupon(couponCode);
  const months = getBillingCycleMonths(billing);
  const discountUf = coupon ? roundUf(basePrice.totalUf * (coupon.percentOff / 100)) : 0;
  const discountedTotalUf = roundUf(Math.max(0.01, basePrice.totalUf - discountUf));
  const discountedDisplayUf = roundUf(discountedTotalUf / months);

  return {
    ...basePrice,
    subtotalUf: basePrice.totalUf,
    discountUf,
    totalUf: discountedTotalUf,
    displayUf: coupon ? discountedDisplayUf : basePrice.displayUf,
    coupon,
  };
}

export function getBillingCycleLabel(billing: BillingCycle | string) {
  if (billing === "yearly") return "Anual";
  if (billing === "semiannual") return "Semestral";
  return "Mensual";
}

export function getBillingCycleMonths(billing: BillingCycle) {
  if (billing === "yearly") return 12;
  if (billing === "semiannual") return 6;
  return 1;
}

export function getBillingCycleSavingsUf(plan: DirectCheckoutPlan, billing: BillingCycle) {
  const planConfig = CHECKOUT_PLANS[plan] || CHECKOUT_PLANS.pro;
  const months = getBillingCycleMonths(billing);
  const price = getCheckoutPlanPriceUf(plan, billing);
  const regularTotal = planConfig.monthlyUf * months;

  return Number((regularTotal - price.totalUf).toFixed(2));
}
