-- Migración: Agregar RUT a constructoras
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE public.constructoras 
ADD COLUMN IF NOT EXISTS rut TEXT;
