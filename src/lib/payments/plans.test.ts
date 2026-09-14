import { describe, expect, it } from "vitest";
import { getCheckoutCoupon, getCheckoutPriceWithCoupon, normalizeCouponCode } from "./plans";

describe("checkout plans", () => {
  it("normaliza codigos de cupon", () => {
    expect(normalizeCouponCode(" solo casas10 ")).toBe("SOLOCASAS10");
  });

  it("aplica SOLOCASAS10 sobre el total del periodo", () => {
    const price = getCheckoutPriceWithCoupon("pro", "yearly", "SOLOCASAS10");

    expect(price.coupon?.percentOff).toBe(10);
    expect(price.subtotalUf).toBe(6.72);
    expect(price.discountUf).toBe(0.67);
    expect(price.totalUf).toBe(6.05);
    expect(price.displayUf).toBe(0.5);
  });

  it("ignora cupones inexistentes", () => {
    const price = getCheckoutPriceWithCoupon("pro", "monthly", "NOPE");

    expect(getCheckoutCoupon("NOPE")).toBeNull();
    expect(price.discountUf).toBe(0);
    expect(price.totalUf).toBe(0.7);
  });
});
