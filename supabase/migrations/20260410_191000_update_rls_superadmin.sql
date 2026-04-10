-- Actualizar politicas para permitir a superadmin (usando is_superadmin)

-- obra_projects
DROP POLICY IF EXISTS "constructora_own_projects" ON obra_projects;
CREATE POLICY "constructora_own_projects" ON obra_projects
  FOR ALL USING (
    constructora_id = auth.uid()
    OR client_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM constructoras c
      WHERE c.id = obra_projects.constructora_id
      AND c.id = auth.uid()
    )
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
    OR (SELECT raw_app_meta_data->>'is_superadmin'::text FROM auth.users WHERE id = auth.uid()) = 'true'
  );

-- obra_stages
DROP POLICY IF EXISTS "stages_via_project" ON obra_stages;
CREATE POLICY "stages_via_project" ON obra_stages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_stages.project_id
      AND (
        p.constructora_id = auth.uid()
        OR p.client_user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
        OR (SELECT raw_app_meta_data->>'is_superadmin'::text FROM auth.users WHERE id = auth.uid()) = 'true'
      )
    )
  );

-- obra_project_specs
DROP POLICY IF EXISTS "specs_via_project" ON obra_project_specs;
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
        OR (SELECT raw_app_meta_data->>'is_superadmin'::text FROM auth.users WHERE id = auth.uid()) = 'true'
      )
    )
  );

-- obra_stage_templates (globales y superadmin)
DROP POLICY IF EXISTS "templates_own_or_global" ON obra_stage_templates;
CREATE POLICY "templates_own_or_global" ON obra_stage_templates
  FOR SELECT USING (
    constructora_id IS NULL
    OR constructora_id = auth.uid()
    OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = obra_stage_templates.constructora_id AND c.id = auth.uid())
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
    OR (SELECT raw_app_meta_data->>'is_superadmin'::text FROM auth.users WHERE id = auth.uid()) = 'true'
  );

DROP POLICY IF EXISTS "templates_insert_own" ON obra_stage_templates;
CREATE POLICY "templates_insert_own" ON obra_stage_templates
  FOR INSERT WITH CHECK (
    constructora_id = auth.uid()
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
    OR (SELECT raw_app_meta_data->>'is_superadmin'::text FROM auth.users WHERE id = auth.uid()) = 'true'
  );
