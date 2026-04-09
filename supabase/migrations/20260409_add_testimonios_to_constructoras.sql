-- Añade campo de testimonios a la tabla de constructoras
ALTER TABLE constructoras ADD COLUMN IF NOT EXISTS testimonios JSONB DEFAULT '[]'::jsonb;
