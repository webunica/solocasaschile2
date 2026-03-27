-- Migración: Expandir perfil de constructoras
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS telefono TEXT,
ADD COLUMN IF NOT EXISTS sitio_web TEXT,
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;
