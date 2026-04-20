ALTER TABLE public.constructoras
DROP CONSTRAINT IF EXISTS constructoras_plan_cycle_check;

ALTER TABLE public.constructoras
ADD CONSTRAINT constructoras_plan_cycle_check
CHECK (plan_cycle IN ('monthly', 'semiannual', 'yearly'));

COMMENT ON COLUMN public.constructoras.plan_cycle IS 'Ciclo de facturacion: mensual, semestral o anual';
