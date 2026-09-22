import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/admin-guard";
import { getRequestId, logError, logInfo, logWarn } from "@/lib/observability-logger";
import { evaluateAntiSpam, SILENT_DROP_RESPONSE } from "@/lib/security/anti-spam";

const PublicLeadSchema = z.object({
  nombre_cliente: z.string().min(2).max(120),
  email_cliente: z.string().email().max(180),
  telefono_cliente: z.string().min(6).max(40),
  mensaje: z.string().min(5).max(2000),
  modelo_id: z.string().uuid().nullable().optional(),
  constructora_id: z.string().uuid().nullable().optional(),
  website: z.string().optional(), // Honeypot 1
  b_website: z.string().optional(), // Honeypot 2
  _form_time: z.union([z.number(), z.string()]).optional(), // Timestamp guard
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
        { status: 500 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit general de capa de transporte (DDoS / flooding)
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
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
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
        { status: 400 }
      );
    }

    // --------------------------------------------------------------------------
    // EVALUACIÓN DE SEGURIDAD ANTI-SPAM MULTICAPA
    // --------------------------------------------------------------------------
    const antiSpam = evaluateAntiSpam({
      honeypot: parsed.data.website,
      honeypotAlt: parsed.data.b_website,
      formTime: parsed.data._form_time,
      name: parsed.data.nombre_cliente,
      email: parsed.data.email_cliente,
      phone: parsed.data.telefono_cliente,
      message: parsed.data.mensaje,
      ip,
    });

    if (antiSpam.isSpam) {
      logWarn("leads_public_spam_detected", route, requestId, {
        layer: antiSpam.layer,
        reason: antiSpam.reason,
        details: antiSpam.details ? JSON.stringify(antiSpam.details) : undefined,
        ip,
        ms: Date.now() - start,
      });

      // Descarte Silencioso (Silent Drop): Retorna HTTP 200 fingido
      // para que el bot asuma que tuvo éxito y no reintente ni altere sus payloads.
      return NextResponse.json(SILENT_DROP_RESPONSE, { status: 200 });
    }

    // Inserción en base de datos para leads legítimos verificados
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
        { status: 500 }
      );
    }

    logInfo("leads_public_inserted", route, requestId, {
      hasModeloId: Boolean(parsed.data.modelo_id),
      hasConstructoraId: Boolean(parsed.data.constructora_id),
      ms: Date.now() - start,
    });

    return NextResponse.json({ ok: true, success: true });
  } catch (error: unknown) {
    logError("leads_public_unexpected_error", route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      { error: "No pudimos procesar tu solicitud en este momento." },
      { status: 500 }
    );
  }
}
