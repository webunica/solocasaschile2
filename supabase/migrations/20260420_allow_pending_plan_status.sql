ALTER TABLE public.constructoras
DROP CONSTRAINT IF EXISTS constructoras_plan_status_check;

ALTER TABLE public.constructoras
ADD CONSTRAINT constructoras_plan_status_check
CHECK (plan_status IN ('pending', 'active', 'expired', 'canceled', 'cancelled', 'past_due'));

COMMENT ON COLUMN public.constructoras.plan_status IS 'Estado actual de la suscripcion: pendiente, activo, vencido, cancelado o pago atrasado';
