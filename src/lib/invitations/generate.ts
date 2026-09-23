import { createClient } from "@supabase/supabase-js";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type InvitationStatus = "pending" | "accepted" | "expired";
export type ColdStep = "none" | "cold_1" | "cold_2" | "cold_3";

export interface ConstructoraInvitation {
  id: string;
  token: string;
  email: string;
  empresa_nombre: string;
  contacto_nombre: string | null;
  region: string | null;
  status: InvitationStatus;
  cold_step: ColdStep;
  sent_at: string | null;
  cold_2_sent_at: string | null;
  cold_3_sent_at: string | null;
  expires_at: string;
  used_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvitationInput {
  email: string;
  empresa_nombre: string;
  contacto_nombre?: string;
  region?: string;
  created_by?: string;
}

// ── Cliente service-role (server-side only) ──────────────────────────────────

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Funciones principales ────────────────────────────────────────────────────

/**
 * Crea una nueva invitación y la persiste en DB.
 * Devuelve la invitación creada (con token) para enviarlo por email.
 */
export async function createInvitation(
  input: CreateInvitationInput
): Promise<ConstructoraInvitation> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("constructora_invitations")
    .insert({
      email: input.email.toLowerCase().trim(),
      empresa_nombre: input.empresa_nombre.trim(),
      contacto_nombre: input.contacto_nombre?.trim() ?? null,
      region: input.region ?? null,
      created_by: input.created_by ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Error creando invitación: ${error.message}`);
  return data as ConstructoraInvitation;
}

/**
 * Busca una invitación por token. Devuelve null si no existe.
 * NO marca como expirada — eso lo hace el cron. Solo informa el estado.
 */
export async function getInvitationByToken(
  token: string
): Promise<ConstructoraInvitation | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("constructora_invitations")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(`Error buscando invitación: ${error.message}`);
  return data as ConstructoraInvitation | null;
}

/**
 * Marca una invitación como aceptada (usada).
 * Se llama justo después de que la constructora completa el registro.
 */
export async function markInvitationUsed(token: string): Promise<void> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("constructora_invitations")
    .update({ status: "accepted", used_at: new Date().toISOString() })
    .eq("token", token)
    .eq("status", "pending"); // solo si sigue pendiente

  if (error) throw new Error(`Error marcando invitación como usada: ${error.message}`);
}

/**
 * Actualiza el cold_step y el timestamp correspondiente tras enviar un email.
 */
export async function markColdStepSent(
  invitationId: string,
  step: "cold_1" | "cold_2" | "cold_3"
): Promise<void> {
  const supabase = getServiceClient();
  const now = new Date().toISOString();

  const update: Record<string, string> = { cold_step: step };
  if (step === "cold_1") update.sent_at = now;
  if (step === "cold_2") update.cold_2_sent_at = now;
  if (step === "cold_3") update.cold_3_sent_at = now;

  const { error } = await supabase
    .from("constructora_invitations")
    .update(update)
    .eq("id", invitationId);

  if (error) throw new Error(`Error actualizando cold_step: ${error.message}`);
}

/**
 * Registra el envío de un email en el log de campaña.
 */
export async function logCampaignEmail(
  invitationId: string,
  step: "cold_1" | "cold_2" | "cold_3",
  resendId?: string,
  errorMsg?: string
): Promise<void> {
  const supabase = getServiceClient();

  await supabase.from("email_campaign_log").insert({
    invitation_id: invitationId,
    step,
    resend_id: resendId ?? null,
    error: errorMsg ?? null,
  });
}

/**
 * Lista todas las invitaciones para el panel admin.
 */
export async function listInvitations(): Promise<ConstructoraInvitation[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("constructora_invitations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Error listando invitaciones: ${error.message}`);
  return (data ?? []) as ConstructoraInvitation[];
}

/**
 * Devuelve invitaciones pendientes que deben recibir cold_2 (≥3 días desde cold_1)
 * o cold_3 (≥7 días desde cold_1), para el cron de nurturing.
 */
export async function getInvitationsForFollowup(): Promise<{
  cold2: ConstructoraInvitation[];
  cold3: ConstructoraInvitation[];
}> {
  const supabase = getServiceClient();
  const now = new Date();

  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // cold_2: enviaron cold_1 hace ≥3 días, aún en step cold_1
  const { data: cold2Data } = await supabase
    .from("constructora_invitations")
    .select("*")
    .eq("status", "pending")
    .eq("cold_step", "cold_1")
    .lte("sent_at", threeDaysAgo)
    .gt("expires_at", now.toISOString());

  // cold_3: enviaron cold_2 hace ≥4 días (7 días desde cold_1), aún en step cold_2
  const { data: cold3Data } = await supabase
    .from("constructora_invitations")
    .select("*")
    .eq("status", "pending")
    .eq("cold_step", "cold_2")
    .lte("cold_2_sent_at", sevenDaysAgo)
    .gt("expires_at", now.toISOString());

  return {
    cold2: (cold2Data ?? []) as ConstructoraInvitation[],
    cold3: (cold3Data ?? []) as ConstructoraInvitation[],
  };
}

/**
 * Marca como expiradas las invitaciones vencidas.
 */
export async function expireOldInvitations(): Promise<number> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("constructora_invitations")
    .update({ status: "expired" })
    .eq("status", "pending")
    .lt("expires_at", new Date().toISOString())
    .select("id");

  if (error) throw new Error(`Error expirando invitaciones: ${error.message}`);
  return data?.length ?? 0;
}
