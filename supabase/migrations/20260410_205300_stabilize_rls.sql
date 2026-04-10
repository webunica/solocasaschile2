-- 1. Asegurar lectura de plantillas para todos
DROP POLICY IF EXISTS "templates_read_all" ON obra_stage_templates;
CREATE POLICY "templates_read_all" ON obra_stage_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Política Maestra para Proyectos (Superadmin + Dueño)
DROP POLICY IF EXISTS "projects_admin_policy" ON obra_projects;
CREATE POLICY "projects_admin_policy" ON obra_projects
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_superadmin')::boolean = true
    OR constructora_id = auth.uid()
    OR client_user_id = auth.uid()
  );

-- 3. Política Maestra para Etapas
DROP POLICY IF EXISTS "stages_admin_policy" ON obra_stages;
CREATE POLICY "stages_admin_policy" ON obra_stages
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_superadmin')::boolean = true
    OR EXISTS (
      SELECT 1 FROM obra_projects p 
      WHERE p.id = obra_stages.project_id 
      AND (p.constructora_id = auth.uid() OR p.client_user_id = auth.uid())
    )
  );

-- 4. Política Maestra para Especificaciones
DROP POLICY IF EXISTS "specs_admin_policy" ON obra_project_specs;
CREATE POLICY "specs_admin_policy" ON obra_project_specs
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_superadmin')::boolean = true
    OR EXISTS (
      SELECT 1 FROM obra_projects p 
      WHERE p.id = obra_project_specs.project_id 
      AND (p.constructora_id = auth.uid() OR p.client_user_id = auth.uid())
    )
  );

-- 5. Limpiar y Re-insertar Plantilla Estándar
DELETE FROM obra_stage_templates WHERE is_default = true;
INSERT INTO obra_stage_templates (nombre, descripcion, is_default, etapas)
VALUES (
  'Construcción Estándar Chile',
  'Línea de tiempo base para proyectos habitacionales.',
  true,
  '[
    {"orden": 1, "nombre": "Instalación de Faenas", "dias_estimados": 5},
    {"orden": 2, "nombre": "Fundaciones y Radier", "dias_estimados": 10},
    {"orden": 3, "nombre": "Obra Gruesa", "dias_estimados": 25},
    {"orden": 4, "nombre": "Techumbre", "dias_estimados": 10},
    {"orden": 5, "nombre": "Instalaciones de Redes", "dias_estimados": 12},
    {"orden": 6, "nombre": "Revestimientos y Aislación", "dias_estimados": 12},
    {"orden": 7, "nombre": "Terminaciones", "dias_estimados": 15},
    {"orden": 8, "nombre": "Entrega y Aseo Final", "dias_estimados": 5}
  ]'::jsonb
);
