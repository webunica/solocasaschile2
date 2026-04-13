import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/admin-guard";

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
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Servicio temporalmente no disponible." },
        { status: 500 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit({
      key: `public-lead:${ip}`,
      limit: 8,
      windowMs: 60_000,
    });

    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento antes de reenviar." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const parsed = PublicLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos para enviar la consulta." },
        { status: 400 }
      );
    }

    if (parsed.data.website && parsed.data.website.trim() !== "") {
      // Respuesta silenciosa para bots
      return NextResponse.json({ ok: true });
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
      console.error("[public.leads] insert_error", { code: error.code, message: error.message });
      return NextResponse.json(
        { error: "No pudimos procesar tu solicitud en este momento." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "internal_error";
    console.error("[public.leads] unexpected_error", { message });
    return NextResponse.json(
      { error: "No pudimos procesar tu solicitud en este momento." },
      { status: 500 }
    );
  }
}
