-- Harden leads insert path:
-- 1) remove public anonymous insert
-- 2) keep insert for authenticated users
-- Public website leads should go through backend endpoint with service role.

DROP POLICY IF EXISTS "public_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "public_create_leads" ON public.leads;
DROP POLICY IF EXISTS "authenticated_insert_leads" ON public.leads;

CREATE POLICY "authenticated_insert_leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);
