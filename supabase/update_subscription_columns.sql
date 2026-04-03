-- ============================================================
-- ADD SUBSCRIPTION COLUMNS TO CONSTRUCTORAS TABLE
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Añadir nuevas columnas para el sistema de suscripción
ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS plan_cycle TEXT DEFAULT 'monthly' CHECK (plan_cycle IN ('monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'expired', 'canceled', 'past_due')),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE;

-- Actualizar el valor predeterminado de 'verificada' según el plan (opcional)
-- Por ahora lo manejamos desde el webhook.

COMMENT ON COLUMN public.constructoras.plan_cycle IS 'Ciclo de facturación: mensual o anual';
COMMENT ON COLUMN public.constructoras.plan_status IS 'Estado actual de la suscripción';
COMMENT ON COLUMN public.constructoras.next_billing_date IS 'Fecha en la que vence el periodo pagado';
