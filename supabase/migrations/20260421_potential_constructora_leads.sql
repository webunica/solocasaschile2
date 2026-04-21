-- Prospeccion de constructoras potenciales (admin CRM)

CREATE TABLE IF NOT EXISTS public.potential_constructora_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_nombre TEXT NOT NULL,
  contacto_nombre TEXT,
  email TEXT NOT NULL,
  telefono TEXT,
  region TEXT,
  fuente TEXT NOT NULL DEFAULT 'manual_admin',
  etapa TEXT NOT NULL DEFAULT 'nuevo' CHECK (
    etapa IN (
      'nuevo',
      'contactado',
      'calificado',
      'diagnostico',
      'cotizacion_enviada',
      'negociacion',
      'cerrado_ganado',
      'cerrado_perdido',
      'postventa'
    )
  ),
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'ganado', 'perdido')),
  notas TEXT,
  ultimo_contacto_at TIMESTAMPTZ,
  proximo_seguimiento_at TIMESTAMPTZ,
  last_email_subject TEXT,
  last_email_sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.constructoras(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES public.constructoras(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_potential_constructora_leads_etapa
  ON public.potential_constructora_leads(etapa, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_potential_constructora_leads_email
  ON public.potential_constructora_leads(email);

CREATE TABLE IF NOT EXISTS public.potential_constructora_lead_touches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.potential_constructora_leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('email', 'whatsapp', 'llamada', 'nota', 'estado')),
  asunto TEXT,
  mensaje TEXT,
  etapa TEXT,
  resultado TEXT,
  created_by UUID REFERENCES public.constructoras(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_potential_constructora_lead_touches_lead
  ON public.potential_constructora_lead_touches(lead_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_touch_potential_constructora_leads_updated_at
  ON public.potential_constructora_leads;

CREATE TRIGGER tr_touch_potential_constructora_leads_updated_at
BEFORE UPDATE ON public.potential_constructora_leads
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.potential_constructora_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potential_constructora_lead_touches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_potential_constructora_leads" ON public.potential_constructora_leads;
DROP POLICY IF EXISTS "admin_insert_potential_constructora_leads" ON public.potential_constructora_leads;
DROP POLICY IF EXISTS "admin_update_potential_constructora_leads" ON public.potential_constructora_leads;
DROP POLICY IF EXISTS "admin_delete_potential_constructora_leads" ON public.potential_constructora_leads;

CREATE POLICY "admin_read_potential_constructora_leads"
ON public.potential_constructora_leads
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_insert_potential_constructora_leads"
ON public.potential_constructora_leads
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_update_potential_constructora_leads"
ON public.potential_constructora_leads
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

CREATE POLICY "admin_delete_potential_constructora_leads"
ON public.potential_constructora_leads
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

DROP POLICY IF EXISTS "admin_read_potential_constructora_lead_touches" ON public.potential_constructora_lead_touches;
DROP POLICY IF EXISTS "admin_insert_potential_constructora_lead_touches" ON public.potential_constructora_lead_touches;
DROP POLICY IF EXISTS "admin_update_potential_constructora_lead_touches" ON public.potential_constructora_lead_touches;
DROP POLICY IF EXISTS "admin_delete_potential_constructora_lead_touches" ON public.potential_constructora_lead_touches;

CREATE POLICY "admin_read_potential_constructora_lead_touches"
ON public.potential_constructora_lead_touches
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_insert_potential_constructora_lead_touches"
ON public.potential_constructora_lead_touches
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "admin_update_potential_constructora_lead_touches"
ON public.potential_constructora_lead_touches
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

CREATE POLICY "admin_delete_potential_constructora_lead_touches"
ON public.potential_constructora_lead_touches
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.constructoras c
    WHERE c.id = auth.uid()
      AND c.role IN ('admin', 'superadmin')
  )
);
