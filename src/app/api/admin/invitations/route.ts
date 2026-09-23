import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resolveAdminRole } from "@/lib/security/admin-guard";
import {
  createInvitation,
  listInvitations,
  markColdStepSent,
  logCampaignEmail,
} from "@/lib/invitations/generate";
import { renderInvitationCold1 } from "@/emails/invitation-cold-1";
import { resend } from "@/lib/resend";

function getBaseUrl(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "solocasaschile.com";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
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
    key: `admin-list-invitations:${user.id}:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const list = await listInvitations();
    return NextResponse.json({ data: list });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener invitaciones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    key: `admin-create-invitation:${user.id}:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes de envío." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const { email, empresa_nombre, contacto_nombre, region, send_now = true } = body;

    if (!email || !empresa_nombre) {
      return NextResponse.json(
        { error: "El email y el nombre de empresa son requeridos." },
        { status: 400 }
      );
    }

    const invitation = await createInvitation({
      email,
      empresa_nombre,
      contacto_nombre,
      region,
      created_by: user.id,
    });

    const baseUrl = getBaseUrl(request);
    const invitationUrl = `${baseUrl}/invitacion?token=${invitation.token}`;

    let emailSent = false;
    let emailError: string | null = null;

    if (send_now) {
      try {
        const html = renderInvitationCold1({
          empresaNombre: invitation.empresa_nombre,
          contactoNombre: invitation.contacto_nombre ?? undefined,
          invitationUrl,
        });

        const sendResult = await resend.emails.send({
          from: "SoloCasasChile <invitaciones@solocasaschile.com>",
          to: invitation.email,
          subject: `${invitation.empresa_nombre}: tu invitación para publicar gratis en SoloCasasChile`,
          html,
        });

        const resendId = sendResult?.data?.id ?? undefined;
        await markColdStepSent(invitation.id, "cold_1");
        await logCampaignEmail(invitation.id, "cold_1", resendId);
        emailSent = true;
      } catch (sendErr: unknown) {
        emailError = sendErr instanceof Error ? sendErr.message : "Error enviando correo Resend";
        await logCampaignEmail(invitation.id, "cold_1", undefined, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      invitation,
      invitationUrl,
      emailSent,
      emailError,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar invitación";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
