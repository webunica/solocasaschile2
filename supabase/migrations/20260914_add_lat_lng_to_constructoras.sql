-- Migración: Agregar coordenadas geográficas (lat, lng) a constructoras
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
