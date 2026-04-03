-- Migración para seguimiento de suscripciones y pagos
ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS plan_cycle TEXT DEFAULT 'monthly' CHECK (plan_cycle IN ('monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'past_due', 'cancelled')),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE;

-- Comentario para documentación
COMMENT ON COLUMN public.constructoras.plan_cycle IS 'Ciclo de facturación: mensual o anual';
COMMENT ON COLUMN public.constructoras.plan_status IS 'Estado de la suscripción (activo, pago atrasado, cancelado)';
