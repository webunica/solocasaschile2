import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as adminGuard from "@/lib/security/admin-guard";
import { POST } from "./route";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/security/admin-guard", () => ({
  checkRateLimit: vi.fn(),
}));

describe("Public Leads API Endpoint Integration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://test-supabase-url";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "placeholder_service_role_key";
    (adminGuard.checkRateLimit as unknown as Mock).mockReturnValue({ ok: true, retryAfterSeconds: 0 });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const validLeadBody = {
    nombre_cliente: "Cliente de Pruebas",
    email_cliente: "contacto@cliente.com",
    telefono_cliente: "+56911223344",
    mensaje: "Hola, cotizar",
  };

  it("returns 500 when required environment variables are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const req = new Request("http://localhost/api/leads/public", { method: "POST" });
    const res = (await POST(req)) as NextResponse;

    expect(res.status).toBe(500);
    expect(res.headers.get("x-request-id")).toBe("local");
  });

  it("returns 429 when the rate limiter blocks the request", async () => {
    (adminGuard.checkRateLimit as unknown as Mock).mockReturnValue({ ok: false, retryAfterSeconds: 60 });

    const req = new Request("http://localhost/api/leads/public", {
      method: "POST",
      headers: { "x-forwarded-for": "127.0.0.1" },
      body: JSON.stringify(validLeadBody),
    });

    const res = (await POST(req)) as NextResponse;

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
    expect(res.headers.get("x-request-id")).toBe("local");
  });

  it("returns 400 when the payload is invalid", async () => {
    const req = new Request("http://localhost/api/leads/public", {
      method: "POST",
      body: JSON.stringify({ nombre_cliente: "A" }),
    });

    const res = (await POST(req)) as NextResponse;

    expect(res.status).toBe(400);
    expect(res.headers.get("x-request-id")).toBe("local");
  });

  it("silently accepts honeypot submissions without touching the database", async () => {
    const req = new Request("http://localhost/api/leads/public", {
      method: "POST",
      body: JSON.stringify({ ...validLeadBody, website: "http://soy.un-bot.com" }),
    });

    const res = (await POST(req)) as NextResponse;

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("local");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("creates the lead using an admin client and returns x-request-id", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (createClient as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    });

    const req = new Request("http://localhost/api/leads/public", {
      method: "POST",
      body: JSON.stringify(validLeadBody),
    });

    const res = (await POST(req)) as NextResponse;

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("local");
    expect(await res.json()).toMatchObject({ ok: true });
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert.mock.calls[0][0][0]).toMatchObject({
      nombre_cliente: validLeadBody.nombre_cliente,
      email_cliente: validLeadBody.email_cliente,
      telefono_cliente: validLeadBody.telefono_cliente,
      estado: "nuevo",
    });
  });
});
