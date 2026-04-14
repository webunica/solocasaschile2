import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, resolveAdminRole } from "./admin-guard";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("allows requests until the limit is reached", () => {
    const first = checkRateLimit({
      key: "rate-limit:test:allow",
      limit: 2,
      windowMs: 1000,
    });
    const second = checkRateLimit({
      key: "rate-limit:test:allow",
      limit: 2,
      windowMs: 1000,
    });
    const third = checkRateLimit({
      key: "rate-limit:test:allow",
      limit: 2,
      windowMs: 1000,
    });

    expect(first.ok).toBe(true);
    expect(first.remaining).toBe(1);
    expect(second.ok).toBe(true);
    expect(second.remaining).toBe(0);
    expect(third.ok).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets the bucket after the time window expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T10:00:00Z"));

    const first = checkRateLimit({
      key: "rate-limit:test:reset",
      limit: 1,
      windowMs: 1000,
    });

    vi.advanceTimersByTime(1001);

    const second = checkRateLimit({
      key: "rate-limit:test:reset",
      limit: 1,
      windowMs: 1000,
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.remaining).toBe(0);
  });
});

describe("resolveAdminRole", () => {
  it("detects admin from profile role", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { role: "admin" },
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const result = await resolveAdminRole(
      { from } as never,
      {
        id: "user-1",
        app_metadata: {},
        user_metadata: {},
      } as never
    );

    expect(from).toHaveBeenCalledWith("constructoras");
    expect(select).toHaveBeenCalledWith("role");
    expect(eq).toHaveBeenCalledWith("id", "user-1");
    expect(result).toEqual({
      isAdmin: true,
      isSuperAdmin: false,
      role: "admin",
    });
  });

  it("detects superadmin from metadata even without profile role", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { role: null },
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const result = await resolveAdminRole(
      { from } as never,
      {
        id: "user-2",
        app_metadata: { is_superadmin: true },
        user_metadata: {},
      } as never
    );

    expect(result).toEqual({
      isAdmin: true,
      isSuperAdmin: true,
      role: null,
    });
  });
});
