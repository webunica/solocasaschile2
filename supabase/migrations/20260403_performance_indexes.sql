-- =============================================================================
-- Migration: Performance Indexes
-- Date: 2026-04-03
-- Skill: supabase-postgres-best-practices (query-missing-indexes)
-- Description: Adds indexes for the most frequent query patterns in
--              SolocasasChile to avoid sequential scans on hot tables.
-- =============================================================================

-- ─── modelos ─────────────────────────────────────────────────────────────────

-- Catalog page: filter by disponible + tipo, order by precio_desde_uf
-- Covers: getModelosFiltered(tipo, disponible), sitemap
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_modelos_disponible_tipo
  ON modelos (disponible, tipo)
  WHERE disponible = true;

-- Individual model lookups by slug (getModelBySlug)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_modelos_slug
  ON modelos (slug);

-- Sort by price (catalog default sort)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_modelos_precio_asc
  ON modelos (precio_desde_uf ASC)
  WHERE disponible = true;

-- Filter by constructora (dashboard + constructora page)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_modelos_constructora_id
  ON modelos (constructora_id)
  WHERE disponible = true;

-- Price range filters (minUF / maxUF)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_modelos_precio_range
  ON modelos (precio_desde_uf, tipo)
  WHERE disponible = true;

-- ─── constructoras ───────────────────────────────────────────────────────────

-- Individual constructora lookups by slug (getConstructoraBySlug)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_constructoras_slug
  ON constructoras (slug);

-- Ranking / directory listing
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_constructoras_score_plan
  ON constructoras (score_confianza DESC, plan);

-- ─── leads ───────────────────────────────────────────────────────────────────

-- Dashboard stats: count by constructora_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_constructora_id
  ON leads (constructora_id, created_at DESC);

-- ─── Cleanup: drop old redundant full-table scan patterns ────────────────────
-- (No indexes to drop initially — running fresh.)

COMMENT ON INDEX idx_modelos_disponible_tipo   IS 'Covers catalog tipo filter + disponible flag';
COMMENT ON INDEX idx_modelos_slug              IS 'Fast model detail page lookups';
COMMENT ON INDEX idx_modelos_precio_asc        IS 'Default catalog sort by price';
COMMENT ON INDEX idx_modelos_constructora_id   IS 'Dashboard + constructora page model list';
COMMENT ON INDEX idx_constructoras_slug        IS 'Fast constructora detail page lookups';
COMMENT ON INDEX idx_constructoras_score_plan  IS 'Directory listing ranking';
COMMENT ON INDEX idx_leads_constructora_id     IS 'Dashboard lead count queries';
