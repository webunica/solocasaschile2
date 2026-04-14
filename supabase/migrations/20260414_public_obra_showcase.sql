-- Public constructora project showcase.
-- Exposes only projects that the constructora explicitly marks as visible.

ALTER TABLE public.obra_projects
ADD COLUMN IF NOT EXISTS visible_en_perfil boolean DEFAULT false;

ALTER TABLE public.obra_projects
ADD COLUMN IF NOT EXISTS thumbnail_url text;

CREATE INDEX IF NOT EXISTS idx_obra_projects_public_profile
ON public.obra_projects (constructora_id, created_at DESC)
WHERE visible_en_perfil = true;

DROP POLICY IF EXISTS "public_read_visible_profile_projects" ON public.obra_projects;

CREATE POLICY "public_read_visible_profile_projects"
ON public.obra_projects
FOR SELECT
TO anon, authenticated
USING (visible_en_perfil = true);

COMMENT ON COLUMN public.obra_projects.visible_en_perfil
IS 'Controls whether a project appears in the public constructora profile showcase.';

COMMENT ON COLUMN public.obra_projects.thumbnail_url
IS 'Public image URL used as the featured thumbnail in constructora profile showcases.';
