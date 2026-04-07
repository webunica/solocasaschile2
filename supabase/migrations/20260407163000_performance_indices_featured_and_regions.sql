-- Migration: Performance Indices for Featured Slider and Regional Filtering
-- Description: Adds GIN index for regional searches and indices for the newly added featured fields.

-- 1. Index for regional filtering (constructoras table)
-- Using GIN for the 'regiones' text array or JSONB column (it's text[] based on services.ts)
CREATE INDEX IF NOT EXISTS idx_constructoras_regiones_gin 
ON constructoras USING GIN (regiones);

-- 2. Indices for models catalog and featured slider
-- Filtering by is_featured is a hot path now
CREATE INDEX IF NOT EXISTS idx_modelos_featured 
ON modelos (is_featured, featured_order) 
WHERE disponible = true;

-- 3. Index for constructora plan (used in featured logic)
-- Covering is_featured and plan filtering
CREATE INDEX IF NOT EXISTS idx_constructoras_plan_status 
ON constructoras (plan, verificada) 
WHERE plan != 'gratis';

COMMENT ON INDEX idx_constructoras_regiones_gin IS 'Fast regional filtering for constructors using array inclusion';
COMMENT ON INDEX idx_modelos_featured IS 'Optimizes featured slider query and sorting';
COMMENT ON INDEX idx_constructoras_plan_status IS 'Optimizes queries that filter by premium/pro plans';
