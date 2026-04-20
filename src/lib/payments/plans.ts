export type BillingCycle = "monthly" | "yearly";
export type DirectCheckoutPlan = "pro";

export const CHECKOUT_PLANS = {
  pro: {
    id: "pro",
    name: "Plan Pro",
    label: "Pro",
    monthlyUf: 0.6,
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

export function isDirectCheckoutPlan(plan: string): plan is DirectCheckoutPlan {
  return plan in CHECKOUT_PLANS;
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

  return {
    displayUf: planConfig.monthlyUf,
    totalUf: planConfig.monthlyUf,
    label: "UF / mes",
  };
}
