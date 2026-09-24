-- ============================================================
-- Lista de espera para Plan Starter (solicitudes de invitación)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.invitation_waitlist (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Datos de la constructora solicitante
  empresa_nombre  TEXT        NOT NULL,
  contacto_nombre TEXT,
  email           TEXT        NOT NULL,
  telefono        TEXT,
  region          TEXT,
  mensaje         TEXT,                             -- Mensaje opcional del solicitante
  -- Estado del procesamiento
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'invited', 'rejected', 'duplicate')),
  -- Referencia a la invitación creada (si se invitó)
  invitation_id   UUID        REFERENCES public.constructora_invitations(id) ON DELETE SET NULL,
  -- Timestamps
  invited_at      TIMESTAMPTZ,                      -- Cuando el admin la invitó
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitation_waitlist_email
  ON public.invitation_waitlist(email);

CREATE INDEX IF NOT EXISTS idx_invitation_waitlist_status
  ON public.invitation_waitlist(status, created_at DESC);

-- Trigger updated_at (reutiliza la función ya existente del migration anterior)
DROP TRIGGER IF EXISTS tr_invitation_waitlist_updated_at
  ON public.invitation_waitlist;

CREATE TRIGGER tr_invitation_waitlist_updated_at
BEFORE UPDATE ON public.invitation_waitlist
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.invitation_waitlist ENABLE ROW LEVEL SECURITY;

-- El público puede insertar (solicitar unirse a la lista)
DROP POLICY IF EXISTS "public_insert_waitlist" ON public.invitation_waitlist;
CREATE POLICY "public_insert_waitlist"
ON public.invitation_waitlist FOR INSERT
WITH CHECK (true);

-- Solo admins pueden leer y gestionar
DROP POLICY IF EXISTS "admin_select_waitlist" ON public.invitation_waitlist;
CREATE POLICY "admin_select_waitlist"
ON public.invitation_waitlist FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

DROP POLICY IF EXISTS "admin_update_waitlist" ON public.invitation_waitlist;
CREATE POLICY "admin_update_waitlist"
ON public.invitation_waitlist FOR UPDATE
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

DROP POLICY IF EXISTS "admin_delete_waitlist" ON public.invitation_waitlist;
CREATE POLICY "admin_delete_waitlist"
ON public.invitation_waitlist FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);
