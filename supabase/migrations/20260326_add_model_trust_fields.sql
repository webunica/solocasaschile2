-- Migración: Añadir Garantía y Postventa a Modelos
-- Ejecutar en SQL Editor de Supabase

ALTER TABLE public.modelos 
ADD COLUMN IF NOT EXISTS garantia_anos INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS postventa BOOLEAN DEFAULT false;
