import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/admin-guard";
import { getRequestId, logError, logInfo, logWarn } from "@/lib/observability-logger";
import { evaluateAntiSpam, SILENT_DROP_RESPONSE } from "@/lib/security/anti-spam";
import { resend } from "@/lib/resend";

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

    // --------------------------------------------------------------------------
    // ENVIAR CORREO DE CORTESÍA AL CLIENTE Y NOTIFICACIÓN AL ADMIN VIA RESEND
    // --------------------------------------------------------------------------
    try {
      if (process.env.RESEND_API_KEY) {
        const clientEmailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #073E48; padding: 32px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
                SoloCasas<span style="color: #27D8BE;">Chile</span>
              </h1>
              <p style="color: #27D8BE; margin: 6px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">
                Cotización de Proyecto Recibida
              </p>
            </div>
            
            <div style="padding: 36px 30px; line-height: 1.6; color: #334155; font-size: 15px;">
              <p style="font-size: 17px; margin-top: 0; color: #073E48; font-weight: 700;">
                ¡Hola ${parsed.data.nombre_cliente}! 👋
              </p>
              
              <p>
                Muchas gracias por cotizar en <strong>SoloCasasChile</strong>. Hemos recibido con éxito los requerimientos para tu proyecto de vivienda y ya se encuentran registrados en nuestra plataforma.
              </p>
              
              <div style="background: #f8fafc; padding: 22px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 12px 0; font-weight: 800; color: #073E48; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                  📋 Resumen de tu solicitud:
                </p>
                <div style="font-size: 13px; color: #475569; white-space: pre-line; line-height: 1.6;">
${parsed.data.mensaje}
                </div>
              </div>

              <div style="background: #e6faf7; padding: 18px 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #b7f1e7;">
                <p style="margin: 0 0 6px 0; font-weight: 700; color: #073E48; font-size: 14px;">
                  ⏱️ ¿Cuáles son los próximos pasos?
                </p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #0f515d; line-height: 1.5;">
                  <li>Empresas y constructoras verificadas con cobertura en tu zona evaluarán tu configuración.</li>
                  <li>Te contactarán a la brevedad vía <strong>WhatsApp (${parsed.data.telefono_cliente})</strong> o por este mismo correo con presupuestos reales, planos y asesoría técnica.</li>
                  <li>La cotización y asesoría es <strong>100% gratuita y sin compromiso</strong>.</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 32px 0 20px 0;">
                <a href="https://solocasaschile.com/catalogo" style="display: inline-block; background-color: #073E48; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border: 2px solid #27D8BE;">
                  Explorar modelos en el catálogo →
                </a>
              </div>

              <p style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
                Atentamente,<br>
                <strong style="color: #073E48;">El equipo de SoloCasasChile.com</strong><br>
                <span style="font-size: 12px; color: #94a3b8;">El comparador de casas prefabricadas de Chile</span>
              </p>
            </div>
          </div>
        `;

        // 1. Enviar correo de confirmación/cortesía al cliente
        await resend.emails.send({
          from: "SoloCasasChile <contacto@solocasaschile.com>",
          to: [parsed.data.email_cliente],
          subject: "Hemos recibido tu solicitud de cotización - SoloCasasChile 🏡",
          html: clientEmailHtml,
        });

        // 2. Enviar correo de notificación al administrador
        const adminEmail = process.env.ADMIN_EMAIL || "info.javiermillar@gmail.com";
        await resend.emails.send({
          from: "SoloCasasChile <leads@solocasaschile.com>",
          to: [adminEmail],
          replyTo: parsed.data.email_cliente,
          subject: `🔔 Nueva Cotización recibida: ${parsed.data.nombre_cliente} (${parsed.data.telefono_cliente})`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px;">
              <h2 style="color: #073E48; margin-top: 0;">🚀 Nueva Cotización en SoloCasasChile</h2>
              <p><strong>Cliente:</strong> ${parsed.data.nombre_cliente}</p>
              <p><strong>Email:</strong> <a href="mailto:${parsed.data.email_cliente}">${parsed.data.email_cliente}</a></p>
              <p><strong>WhatsApp / Teléfono:</strong> <a href="tel:${parsed.data.telefono_cliente}">${parsed.data.telefono_cliente}</a></p>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0 0 8px 0; font-weight: bold;">Detalle de la cotización:</p>
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; font-size: 13px;">${parsed.data.mensaje}</pre>
              </div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      logWarn("leads_public_email_send_warning", route, requestId, {
        error: emailErr instanceof Error ? emailErr.message : String(emailErr),
      });
    }

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
