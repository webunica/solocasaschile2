-- Script de carga automática para constructoras scrapeadas de Google Maps
-- Ejecutar en Supabase Dashboard: SQL Editor -> New query -> Run

-- 1. Asegurar columnas de coordenadas
ALTER TABLE public.constructoras ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.constructoras ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- 2. Insertar / Actualizar constructoras
INSERT INTO public.constructoras (
  nombre,
  slug,
  descripcion,
  direccion,
  telefono,
  sitio_web,
  lat,
  lng,
  plan,
  verificada,
  score_confianza,
  regiones
) VALUES

ON CONFLICT (slug) DO UPDATE SET
  direccion = COALESCE(EXCLUDED.direccion, constructoras.direccion),
  telefono = COALESCE(EXCLUDED.telefono, constructoras.telefono),
  sitio_web = COALESCE(EXCLUDED.sitio_web, constructoras.sitio_web),
  lat = COALESCE(EXCLUDED.lat, constructoras.lat),
  lng = COALESCE(EXCLUDED.lng, constructoras.lng),
  score_confianza = GREATEST(EXCLUDED.score_confianza, constructoras.score_confianza);
