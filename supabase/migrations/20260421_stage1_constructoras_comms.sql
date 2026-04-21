-- Etapa 1 Comunicaciones: base unica en constructoras + historial de eventos

ALTER TABLE public.constructoras
  ADD COLUMN IF NOT EXISTS comms_segmento TEXT NOT NULL DEFAULT 'frio'
    CHECK (comms_segmento IN ('frio', 'interesado', 'embudo', 'cliente')),
  ADD COLUMN IF NOT EXISTS comms_step TEXT,
  ADD COLUMN IF NOT EXISTS comms_opt_out BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS comms_notes TEXT,
  ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS owner_admin_id UUID REFERENCES public.constructoras(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_constructoras_comms_segmento
  ON public.constructoras (comms_segmento, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_constructoras_email
  ON public.constructoras (email);

CREATE TABLE IF NOT EXISTS public.constructora_comms_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('email', 'segment_change', 'note', 'manual_add')),
  campaign_step TEXT,
  subject TEXT,
  message TEXT,
  content_mode TEXT DEFAULT 'text' CHECK (content_mode IN ('text', 'html')),
  sent_by UUID REFERENCES public.constructoras(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_constructora_comms_events_constructora
  ON public.constructora_comms_events (constructora_id, created_at DESC);

ALTER TABLE public.constructora_comms_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_constructora_comms_events" ON public.constructora_comms_events;
DROP POLICY IF EXISTS "admin_insert_constructora_comms_events" ON public.constructora_comms_events;
DROP POLICY IF EXISTS "admin_update_constructora_comms_events" ON public.constructora_comms_events;
DROP POLICY IF EXISTS "admin_delete_constructora_comms_events" ON public.constructora_comms_events;

CREATE POLICY "admin_read_constructora_comms_events"
ON public.constructora_comms_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_insert_constructora_comms_events"
ON public.constructora_comms_events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_update_constructora_comms_events"
ON public.constructora_comms_events
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_delete_constructora_comms_events"
ON public.constructora_comms_events
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);
