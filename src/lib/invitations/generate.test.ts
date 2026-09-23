import { describe, expect, it } from "vitest";
import { PLAN_LIMITS, PLAN_DISPLAY, getPlanLimits } from "@/lib/constants/plans";
import { renderInvitationCold1 } from "@/emails/invitation-cold-1";
import { renderInvitationCold2 } from "@/emails/invitation-cold-2";
import { renderInvitationCold3 } from "@/emails/invitation-cold-3";

describe("Plan Starter Configuration", () => {
  it("has starter plan defined with 1 model limit", () => {
    expect(PLAN_LIMITS.starter).toBeDefined();
    expect(PLAN_LIMITS.starter.maxModels).toBe(1);
    expect(PLAN_LIMITS.starter.maxPhotos).toBe(3);
    expect(PLAN_LIMITS.starter.features.verifiedBadge).toBe(false);
  });

  it("returns starter limits correctly via getPlanLimits", () => {
    const limits = getPlanLimits("starter");
    expect(limits.maxModels).toBe(1);
  });

  it("has correct marketing display for starter plan", () => {
    expect(PLAN_DISPLAY.starter).toBeDefined();
    expect(PLAN_DISPLAY.starter.nombre).toBe("Plan Starter");
    expect(PLAN_DISPLAY.starter.precioUF).toBe(0);
  });

  it("enforces strict limit of 1 model for starter plan", () => {
    const limits = getPlanLimits("starter");
    const allowedFirstModel = (0) < limits.maxModels;
    const allowedSecondModel = (1) < limits.maxModels;

    expect(allowedFirstModel).toBe(true);
    expect(allowedSecondModel).toBe(false);
  });
});

describe("Invitation Email Templates", () => {
  const sampleData = {
    empresaNombre: "Constructora Cordillera SpA",
    contactoNombre: "Marta Gómez",
    invitationUrl: "https://solocasaschile.com/invitacion?token=test-uuid-1234",
  };

  it("renders cold_1 email with proper company name and CTA link", () => {
    const html = renderInvitationCold1(sampleData);
    expect(html).toContain("Constructora Cordillera SpA");
    expect(html).toContain("Marta Gómez");
    expect(html).toContain("https://solocasaschile.com/invitacion?token=test-uuid-1234");
    expect(html).toContain("Plan Starter");
    expect(html).toContain("1 modelo de casa");
  });

  it("renders cold_2 email with follow up messaging", () => {
    const html = renderInvitationCold2(sampleData);
    expect(html).toContain("Constructora Cordillera SpA");
    expect(html).toContain("https://solocasaschile.com/invitacion?token=test-uuid-1234");
    expect(html).toContain("Activar mi modelo gratis ahora");
  });

  it("renders cold_3 email with urgency notice", () => {
    const html = renderInvitationCold3(sampleData);
    expect(html).toContain("Constructora Cordillera SpA");
    expect(html).toContain("https://solocasaschile.com/invitacion?token=test-uuid-1234");
    expect(html).toContain("Aprovechar mi invitación ahora");
  });
});
