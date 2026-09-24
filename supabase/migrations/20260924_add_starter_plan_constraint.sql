-- Migración: Actualizar check constraint de planes para incluir 'starter' y sincronizar constructoras invitadas
ALTER TABLE public.constructoras DROP CONSTRAINT IF EXISTS constructoras_plan_check;
ALTER TABLE public.constructoras 
  ADD CONSTRAINT constructoras_plan_check 
  CHECK (plan IN ('starter', 'gratis', 'basic', 'crece', 'avanza', 'pro', 'premium', 'pro_plus', 'prueba', 'informativo'));

-- Si alguna constructora creada vía invitación quedó con 'gratis', migrarla a 'starter'
UPDATE public.constructoras c
SET plan = 'starter'
FROM public.constructora_invitations ci
WHERE ci.status = 'accepted'
  AND ci.email = c.email
  AND c.plan = 'gratis';
