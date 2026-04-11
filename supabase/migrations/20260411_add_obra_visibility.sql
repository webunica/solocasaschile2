-- Adición de campos para visibilidad pública de proyectos en el perfil de constructora
ALTER TABLE obra_projects ADD COLUMN IF NOT EXISTS visible_en_perfil BOOLEAN DEFAULT false;
ALTER TABLE obra_projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Permisos para que el público vea los proyectos destacados
CREATE POLICY "Lectura pública de proyectos destacados" ON obra_projects
  FOR SELECT USING (visible_en_perfil = true);

-- Comentario para documentación
COMMENT ON COLUMN obra_projects.visible_en_perfil IS 'Si es true, el proyecto se muestra en el perfil público de la constructora.';
COMMENT ON COLUMN obra_projects.thumbnail_url IS 'Imagen destacada para mostrar en el portafolio (usualmente la última foto de la obra).';
