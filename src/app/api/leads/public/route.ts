import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/admin-guard";
import {
  getRequestId,
  logError,
  logInfo,
  logWarn,
  withRequestIdHeaders,
} from "@/lib/observability-logger";

const PublicLeadSchema = z.object({
  nombre_cliente: z.string().min(2).max(120),
  email_cliente: z.string().email().max(180),
  telefono_cliente: z.string().min(6).max(40),
  mensaje: z.string().min(5).max(2000),
  modelo_id: z.string().uuid().nullable().optional(),
  constructora_id: z.string().uuid().nullable().optional(),
  website: z.string().optional(), // Honeypot
});

export async function POST(req: Request) {
  const route = "/api/leads/public";
  const requestId = getRequestId(req);
  const start = Date.now();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      logError("leads_public_config_missing", route, requestId, new Error("missing_supabase_server_env"));
      return NextResponse.json(
        { error: "Servicio temporalmente no disponible." },
        withRequestIdHeaders({ status: 500 }, requestId)
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit({
      key: `public-lead:${ip}`,
      limit: 8,
      windowMs: 60_000,
    });

    if (!limit.ok) {
      logWarn("leads_public_rate_limited", route, requestId, {
        retryAfterSeconds: limit.retryAfterSeconds,
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento antes de reenviar." },
        withRequestIdHeaders(
          { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
          requestId
        )
      );
    }

    const body = await req.json();
    const parsed = PublicLeadSchema.safeParse(body);

    if (!parsed.success) {
      logWarn("leads_public_validation_failed", route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "Datos inválidos para enviar la consulta." },
        withRequestIdHeaders({ status: 400 }, requestId)
      );
    }

    if (parsed.data.website && parsed.data.website.trim() !== "") {
      // Respuesta silenciosa para bots
      logWarn("leads_public_honeypot_triggered", route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json({ ok: true }, withRequestIdHeaders({}, requestId));
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("leads").insert([
      {
        nombre_cliente: parsed.data.nombre_cliente.trim(),
        email_cliente: parsed.data.email_cliente.trim().toLowerCase(),
        telefono_cliente: parsed.data.telefono_cliente.trim(),
        mensaje: parsed.data.mensaje.trim(),
        modelo_id: parsed.data.modelo_id ?? null,
        constructora_id: parsed.data.constructora_id ?? null,
        estado: "nuevo",
      },
    ]);

    if (error) {
      logError("leads_public_insert_failed", route, requestId, error, {
        code: error.code,
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "No pudimos procesar tu solicitud en este momento." },
        withRequestIdHeaders({ status: 500 }, requestId)
      );
    }

    logInfo("leads_public_inserted", route, requestId, {
      hasModeloId: Boolean(parsed.data.modelo_id),
      hasConstructoraId: Boolean(parsed.data.constructora_id),
      ms: Date.now() - start,
    });

    return NextResponse.json({ ok: true }, withRequestIdHeaders({}, requestId));
  } catch (error: unknown) {
    logError("leads_public_unexpected_error", route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      { error: "No pudimos procesar tu solicitud en este momento." },
      withRequestIdHeaders({ status: 500 }, requestId)
    );
  }
}
