-- Migración: Agregar Razon Social a constructoras
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS razon_social TEXT;
