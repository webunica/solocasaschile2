-- ============================================================
-- Sistema de invitaciones por email a constructoras externas
-- ============================================================

-- Tabla principal de invitaciones
CREATE TABLE IF NOT EXISTS public.constructora_invitations (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token          UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  email          TEXT        NOT NULL,
  empresa_nombre TEXT        NOT NULL,
  contacto_nombre TEXT,
  region         TEXT,
  -- Estado del ciclo de vida
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'accepted', 'expired')),
  -- Secuencia de emails enviados
  cold_step      TEXT        NOT NULL DEFAULT 'none'
                             CHECK (cold_step IN ('none', 'cold_1', 'cold_2', 'cold_3')),
  -- Timestamps
  sent_at        TIMESTAMPTZ,
  cold_2_sent_at TIMESTAMPTZ,
  cold_3_sent_at TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  used_at        TIMESTAMPTZ,
  -- Auditoría
  created_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_constructora_invitations_token
  ON public.constructora_invitations(token);

CREATE INDEX IF NOT EXISTS idx_constructora_invitations_status
  ON public.constructora_invitations(status, cold_step, sent_at);

CREATE INDEX IF NOT EXISTS idx_constructora_invitations_email
  ON public.constructora_invitations(email);

-- Tabla de log de emails de campaña
CREATE TABLE IF NOT EXISTS public.email_campaign_log (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID        NOT NULL REFERENCES public.constructora_invitations(id) ON DELETE CASCADE,
  step          TEXT        NOT NULL CHECK (step IN ('cold_1', 'cold_2', 'cold_3')),
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  resend_id     TEXT,                             -- ID del mensaje en Resend
  error         TEXT                              -- Si falló, motivo
);

CREATE INDEX IF NOT EXISTS idx_email_campaign_log_invitation
  ON public.email_campaign_log(invitation_id, step);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_constructora_invitations_updated_at
  ON public.constructora_invitations;

CREATE TRIGGER tr_constructora_invitations_updated_at
BEFORE UPDATE ON public.constructora_invitations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.constructora_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_log       ENABLE ROW LEVEL SECURITY;

-- Helper reutilizable para verificar rol admin
-- (mismo patrón que el resto del proyecto)

-- constructora_invitations: solo admins pueden operar
DROP POLICY IF EXISTS "admin_select_invitations"  ON public.constructora_invitations;
DROP POLICY IF EXISTS "admin_insert_invitations"  ON public.constructora_invitations;
DROP POLICY IF EXISTS "admin_update_invitations"  ON public.constructora_invitations;
DROP POLICY IF EXISTS "admin_delete_invitations"  ON public.constructora_invitations;
DROP POLICY IF EXISTS "public_read_invitation_by_token" ON public.constructora_invitations;

CREATE POLICY "admin_select_invitations"
ON public.constructora_invitations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_insert_invitations"
ON public.constructora_invitations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_update_invitations"
ON public.constructora_invitations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_delete_invitations"
ON public.constructora_invitations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

-- Las lecturas públicas del token se hacen desde el servidor con service role,
-- por lo que NO se necesita policy pública de SELECT aquí.

-- email_campaign_log: solo admins leen; inserciones solo desde service role (sin RLS lock)
DROP POLICY IF EXISTS "admin_select_campaign_log" ON public.email_campaign_log;
DROP POLICY IF EXISTS "service_insert_campaign_log" ON public.email_campaign_log;

CREATE POLICY "admin_select_campaign_log"
ON public.email_campaign_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

-- Inserciones via service_role (cron y API) se saltan RLS automáticamente.
-- Dejamos permiso explícito para autenticados admin también:
CREATE POLICY "service_insert_campaign_log"
ON public.email_campaign_log FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);
