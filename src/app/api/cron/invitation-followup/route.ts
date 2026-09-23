import { NextResponse } from "next/server";
import {
  getInvitationsForFollowup,
  expireOldInvitations,
  markColdStepSent,
  logCampaignEmail,
} from "@/lib/invitations/generate";
import { renderInvitationCold2 } from "@/emails/invitation-cold-2";
import { renderInvitationCold3 } from "@/emails/invitation-cold-3";
import { resend } from "@/lib/resend";
import { getRequestId, logError, logInfo, logWarn } from "@/lib/observability-logger";

export const dynamic = "force-dynamic";

function getBaseUrl(req: Request) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "solocasaschile.com";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function GET(req: Request) {
  const route = "/api/cron/invitation-followup";
  const requestId = getRequestId(req);
  const authHeader = req.headers.get("authorization");

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logError("cron_invitation_followup_missing_secret", route, requestId, new Error("missing_cron_secret"));
    return NextResponse.json({ success: false, error: "CRON_SECRET no está configurado" }, { status: 500 });
  }

  const isAuthorized = authHeader === `Bearer ${cronSecret}`;
  if (!isAuthorized) {
    logWarn("cron_invitation_followup_unauthorized", route, requestId, {});
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const baseUrl = getBaseUrl(req);
  let processedCold2 = 0;
  let processedCold3 = 0;
  const errors: string[] = [];

  try {
    // 1. Marcar invitaciones expiradas
    const expiredCount = await expireOldInvitations();

    // 2. Obtener invitaciones candidatas para cold_2 y cold_3
    const { cold2, cold3 } = await getInvitationsForFollowup();

    // 3. Procesar envíos Cold #2 (seguimiento)
    for (const item of cold2) {
      try {
        const invitationUrl = `${baseUrl}/invitacion?token=${item.token}`;
        const html = renderInvitationCold2({
          empresaNombre: item.empresa_nombre,
          contactoNombre: item.contacto_nombre ?? undefined,
          invitationUrl,
        });

        const sendResult = await resend.emails.send({
          from: "SoloCasasChile <invitaciones@solocasaschile.com>",
          to: item.email,
          subject: `¿Aún no publicas en SoloCasasChile, ${item.empresa_nombre}?`,
          html,
        });

        const resendId = sendResult?.data?.id ?? undefined;
        await markColdStepSent(item.id, "cold_2");
        await logCampaignEmail(item.id, "cold_2", resendId);
        processedCold2++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error enviando cold_2";
        errors.push(`Cold2 [${item.email}]: ${msg}`);
        await logCampaignEmail(item.id, "cold_2", undefined, msg);
      }
    }

    // 4. Procesar envíos Cold #3 (último aviso)
    for (const item of cold3) {
      try {
        const invitationUrl = `${baseUrl}/invitacion?token=${item.token}`;
        const html = renderInvitationCold3({
          empresaNombre: item.empresa_nombre,
          contactoNombre: item.contacto_nombre ?? undefined,
          invitationUrl,
        });

        const sendResult = await resend.emails.send({
          from: "SoloCasasChile <invitaciones@solocasaschile.com>",
          to: item.email,
          subject: `Último aviso: Tu invitación para publicar en SoloCasasChile vence pronto`,
          html,
        });

        const resendId = sendResult?.data?.id ?? undefined;
        await markColdStepSent(item.id, "cold_3");
        await logCampaignEmail(item.id, "cold_3", resendId);
        processedCold3++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error enviando cold_3";
        errors.push(`Cold3 [${item.email}]: ${msg}`);
        await logCampaignEmail(item.id, "cold_3", undefined, msg);
      }
    }

    logInfo("cron_invitation_followup_completed", route, requestId, {
      processedCold2,
      processedCold3,
      expiredCount,
      errorsCount: errors.length,
    });

    return NextResponse.json({
      success: true,
      processedCold2,
      processedCold3,
      expiredCount,
      errors,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error inesperado en cron";
    logError("cron_invitation_followup_failure", route, requestId, err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
