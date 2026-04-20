export type BillingCycle = "monthly" | "semiannual" | "yearly";
export type DirectCheckoutPlan = "pro";
export type CheckoutCoupon = {
  code: string;
  label: string;
  percentOff: number;
  description: string;
};

export const CHECKOUT_PLANS = {
  pro: {
    id: "pro",
    name: "Plan Pro",
    label: "Pro",
    monthlyUf: 0.6,
    semiannualMonthlyUf: 0.54,
    semiannualTotalUf: 3.24,
    yearlyMonthlyUf: 0.48,
    yearlyTotalUf: 5.76,
    annualDiscountLabel: "20% OFF anual",
    features: [
      "15 modelos publicados",
      "10 fotos por modelo",
      "CRM de leads avanzado",
      "Sistema de Seguimiento de Obras",
      "Badge Constructora Verificada",
      "Soporte por email prioritario",
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
    benefit: "Ahorra 20% y asegura tu visibilidad por todo el ano.",
  },
  {
    id: "semiannual",
    months: 6,
    title: "6 meses",
    badge: "Flexible",
    benefit: "Ahorra 10% con un compromiso menor.",
  },
  {
    id: "monthly",
    months: 1,
    title: "1 mes",
    benefit: "Paga mes a mes y prueba el canal sin permanencia.",
  },
];

export const CHECKOUT_COUPONS: Record<string, CheckoutCoupon> = {
  SOLOCASAS10: {
    code: "SOLOCASAS10",
    label: "10% de descuento",
    percentOff: 10,
    description: "Descuento especial de lanzamiento.",
  },
};

export function isDirectCheckoutPlan(plan: string): plan is DirectCheckoutPlan {
  return plan in CHECKOUT_PLANS;
}

export function isBillingCycle(billing: string): billing is BillingCycle {
  return billing === "monthly" || billing === "semiannual" || billing === "yearly";
}

export function getCheckoutPlanPriceUf(plan: DirectCheckoutPlan, billing: BillingCycle) {
  const planConfig = CHECKOUT_PLANS[plan];

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
  const planConfig = CHECKOUT_PLANS[plan];
  const months = getBillingCycleMonths(billing);
  const price = getCheckoutPlanPriceUf(plan, billing);
  const regularTotal = planConfig.monthlyUf * months;

  return Number((regularTotal - price.totalUf).toFixed(2));
}
