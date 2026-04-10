CREATE TABLE IF NOT EXISTS obra_project_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL,
  elemento TEXT NOT NULL,
  valor TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | esperando_materiales | en_proceso | finalizado
  fecha_estimada DATE,
  fecha_real DATE,
  observaciones TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_obra_specs_project ON obra_project_specs(project_id);

ALTER TABLE obra_project_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "specs_via_project" ON obra_project_specs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_project_specs.project_id
      AND (
        p.constructora_id = auth.uid()
        OR p.client_user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
      )
    )
  );

-- Trigger para updated_at
CREATE TRIGGER trg_obra_specs_updated_at
  BEFORE UPDATE ON obra_project_specs
  FOR EACH ROW EXECUTE FUNCTION update_obra_updated_at();

-- Añadir campos extra a obra_projects
ALTER TABLE obra_projects ADD COLUMN IF NOT EXISTS superficie_m2 NUMERIC;
ALTER TABLE obra_projects ADD COLUMN IF NOT EXISTS dormitorios INTEGER;
ALTER TABLE obra_projects ADD COLUMN IF NOT EXISTS banos NUMERIC;

