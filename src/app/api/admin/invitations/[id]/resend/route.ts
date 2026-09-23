import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resolveAdminRole } from "@/lib/security/admin-guard";
import {
  markColdStepSent,
  logCampaignEmail,
} from "@/lib/invitations/generate";
import { renderInvitationCold1 } from "@/emails/invitation-cold-1";
import { renderInvitationCold2 } from "@/emails/invitation-cold-2";
import { renderInvitationCold3 } from "@/emails/invitation-cold-3";
import { resend } from "@/lib/resend";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured");
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

function getBaseUrl(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "solocasaschile.com";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const role = await resolveAdminRole(supabase, user);
  if (!role.isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({
    key: `admin-resend-invitation:${user.id}:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const { id } = await params;
  const service = getServiceClient();

  const { data: invitation, error } = await service
    .from("constructora_invitations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !invitation) {
    return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 });
  }

  if (invitation.status !== "pending") {
    return NextResponse.json(
      { error: `No se puede reenviar a una invitación con estado: ${invitation.status}` },
      { status: 400 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const step: "cold_1" | "cold_2" | "cold_3" = body.step || "cold_1";

    const baseUrl = getBaseUrl(request);
    const invitationUrl = `${baseUrl}/invitacion?token=${invitation.token}`;

    let html = "";
    let subject = "";

    if (step === "cold_3") {
      html = renderInvitationCold3({
        empresaNombre: invitation.empresa_nombre,
        contactoNombre: invitation.contacto_nombre ?? undefined,
        invitationUrl,
      });
      subject = `Último aviso: Tu invitación para publicar en SoloCasasChile vence pronto`;
    } else if (step === "cold_2") {
      html = renderInvitationCold2({
        empresaNombre: invitation.empresa_nombre,
        contactoNombre: invitation.contacto_nombre ?? undefined,
        invitationUrl,
      });
      subject = `¿Aún no publicas en SoloCasasChile, ${invitation.empresa_nombre}?`;
    } else {
      html = renderInvitationCold1({
        empresaNombre: invitation.empresa_nombre,
        contactoNombre: invitation.contacto_nombre ?? undefined,
        invitationUrl,
      });
      subject = `${invitation.empresa_nombre}: tu invitación para publicar gratis en SoloCasasChile`;
    }

    const sendResult = await resend.emails.send({
      from: "SoloCasasChile <invitaciones@solocasaschile.com>",
      to: invitation.email,
      subject,
      html,
    });

    const resendId = sendResult?.data?.id ?? undefined;
    await markColdStepSent(invitation.id, step);
    await logCampaignEmail(invitation.id, step, resendId);

    return NextResponse.json({
      success: true,
      step,
      resendId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al reenviar email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
