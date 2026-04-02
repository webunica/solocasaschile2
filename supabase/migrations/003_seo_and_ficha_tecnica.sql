-- ============================================================
-- SOLOCASASCHILE V2 — MIGRACIÓN 003
-- SEO Custom Fields + Ficha Técnica Expandida
-- Fecha: Abril 2026
-- Instrucciones: Ejecutar en SQL Editor de Supabase (es idempotente).
-- ============================================================

-- ============================================================
-- TABLA modelos: campos SEO personalizables
-- ============================================================

ALTER TABLE public.modelos
  ADD COLUMN IF NOT EXISTS seo_title        TEXT,
  ADD COLUMN IF NOT EXISTS seo_description  TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords     TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_og_image     TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url    TEXT;

-- ============================================================
-- TABLA modelos: campos de ficha técnica expandida
-- ============================================================

ALTER TABLE public.modelos
  ADD COLUMN IF NOT EXISTS pisos            INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS codigo_modelo    TEXT,
  ADD COLUMN IF NOT EXISTS uso              TEXT DEFAULT 'vivienda',
  ADD COLUMN IF NOT EXISTS recintos         TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS construccion     JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS aislacion        JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS terminaciones    JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS instalaciones    JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS logistica        JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS soporte          JSONB DEFAULT '{}';

-- ============================================================
-- TABLA constructoras: campos SEO
-- ============================================================

ALTER TABLE public.constructoras
  ADD COLUMN IF NOT EXISTS seo_title        TEXT,
  ADD COLUMN IF NOT EXISTS seo_description  TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords     TEXT[] DEFAULT '{}';

-- ============================================================
-- ÍNDICES para búsqueda
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_modelos_tipo_precio
  ON public.modelos(tipo, precio_desde_uf);

CREATE INDEX IF NOT EXISTS idx_modelos_uso
  ON public.modelos(uso);

-- GIN index para keywords (búsqueda en arrays)
CREATE INDEX IF NOT EXISTS idx_modelos_seo_keywords
  ON public.modelos USING GIN(seo_keywords);

-- ============================================================
-- CONSTRAINT: uso válido
-- ============================================================

ALTER TABLE public.modelos
  DROP CONSTRAINT IF EXISTS modelos_uso_check;

ALTER TABLE public.modelos
  ADD CONSTRAINT modelos_uso_check
  CHECK (uso IN ('vivienda', 'cabana', 'oficina', 'uso-mixto', 'social'));

-- ============================================================
-- COMENTARIOS descriptivos
-- ============================================================

COMMENT ON COLUMN public.modelos.seo_title        IS 'Meta title personalizado para SEO (máx 60 chars). Si está vacío se genera automáticamente.';
COMMENT ON COLUMN public.modelos.seo_description  IS 'Meta description personalizada para SEO (máx 160 chars).';
COMMENT ON COLUMN public.modelos.seo_keywords     IS 'Palabras clave SEO para posicionamiento long-tail.';
COMMENT ON COLUMN public.modelos.seo_og_image     IS 'URL de imagen Open Graph. Sobrescribe la primera imagen del modelo.';
COMMENT ON COLUMN public.modelos.canonical_url    IS 'URL canónica. Opcional, se genera desde el slug si está vacío.';
COMMENT ON COLUMN public.modelos.pisos            IS 'Número de pisos de la vivienda.';
COMMENT ON COLUMN public.modelos.codigo_modelo    IS 'Código interno del modelo asignado por la constructora.';
COMMENT ON COLUMN public.modelos.uso              IS 'Uso principal: vivienda, cabana, oficina, uso-mixto, social.';
COMMENT ON COLUMN public.modelos.recintos         IS 'Lista de recintos incluidos (estar, comedor, lavandería, etc.).';
COMMENT ON COLUMN public.modelos.construccion     IS 'Datos de sistema constructivo, estructura, muros, techumbre, piso interior.';
COMMENT ON COLUMN public.modelos.aislacion        IS 'Datos de aislación térmica, acústica, condensación y zona climática.';
COMMENT ON COLUMN public.modelos.terminaciones    IS 'Terminaciones: ventanas, puertas, cocina, baños, pisos.';
COMMENT ON COLUMN public.modelos.instalaciones    IS 'Instalaciones: eléctrica, sanitaria, gas, climatización.';
COMMENT ON COLUMN public.modelos.logistica        IS 'Logística de compra: transporte, montaje, plazos, incluye/no incluye.';
COMMENT ON COLUMN public.modelos.soporte          IS 'Soporte: garantías desglosadas, certificaciones, normativas.';
