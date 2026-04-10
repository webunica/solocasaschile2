-- ============================================================
-- Módulo: Seguimiento de Obra (Portal de Proyecto)
-- Fecha: 2026-04-10
-- Descripción: Tablas para gestión de proyectos de construcción
--              con visibilidad multi-rol (admin, constructora,
--              supervisor, cliente comprador)
-- ============================================================

-- 1. PROYECTOS
CREATE TABLE IF NOT EXISTS obra_projects (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constructora_id          UUID REFERENCES constructoras(id) ON DELETE CASCADE,
  client_user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  modelo_id                UUID REFERENCES modelos(id) ON DELETE SET NULL,
  nombre                   TEXT NOT NULL,
  codigo_interno           TEXT,
  tipo_construccion        TEXT,
  region                   TEXT,
  comuna                   TEXT,
  direccion_referencia     TEXT,
  fecha_inicio_estimada    DATE,
  fecha_termino_estimada   DATE,
  fecha_termino_real       DATE,
  estado                   TEXT NOT NULL DEFAULT 'planificacion',
  -- planificacion | en_curso | pausado | completado | cancelado
  porcentaje_avance        INTEGER NOT NULL DEFAULT 0 CHECK (porcentaje_avance BETWEEN 0 AND 100),
  prioridad                TEXT NOT NULL DEFAULT 'normal',
  -- baja | normal | alta | urgente
  salud                    TEXT NOT NULL DEFAULT 'verde',
  -- verde | amarillo | rojo
  observaciones_generales  TEXT,
  ejecutivo_responsable    TEXT,
  supervisor_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_demo                  BOOLEAN NOT NULL DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ETAPAS DE PROYECTO
CREATE TABLE IF NOT EXISTS obra_stages (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id               UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  nombre                   TEXT NOT NULL,
  descripcion              TEXT,
  orden                    INTEGER NOT NULL,
  fecha_inicio_estimada    DATE,
  fecha_termino_estimada   DATE,
  fecha_inicio_real        DATE,
  fecha_termino_real       DATE,
  estado                   TEXT NOT NULL DEFAULT 'pendiente',
  -- pendiente | en_preparacion | en_curso | pausada | retrasada | completada | cancelada
  porcentaje_avance        INTEGER NOT NULL DEFAULT 0 CHECK (porcentaje_avance BETWEEN 0 AND 100),
  responsable              TEXT,
  observaciones            TEXT,
  tiene_retraso            BOOLEAN NOT NULL DEFAULT false,
  motivo_retraso           TEXT,
  visible_cliente          BOOLEAN NOT NULL DEFAULT true,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARCHIVOS POR ETAPA
CREATE TABLE IF NOT EXISTS obra_stage_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  stage_id          UUID REFERENCES obra_stages(id) ON DELETE SET NULL,
  nombre            TEXT NOT NULL,
  tipo              TEXT NOT NULL DEFAULT 'foto',
  -- foto | video | pdf | plano | contrato | certificado | manual | acta | otro
  storage_path      TEXT NOT NULL,
  visible_cliente   BOOLEAN NOT NULL DEFAULT true,
  subido_por        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INCIDENCIAS
CREATE TABLE IF NOT EXISTS obra_incidents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  stage_id          UUID REFERENCES obra_stages(id) ON DELETE SET NULL,
  tipo              TEXT NOT NULL,
  -- clima | cambio_cliente | retraso_proveedor | tecnico | diseno | otro
  fecha             DATE NOT NULL DEFAULT CURRENT_DATE,
  impacto           TEXT,
  descripcion       TEXT NOT NULL,
  visible_cliente   BOOLEAN NOT NULL DEFAULT false,
  registrado_por    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. NOTIFICACIONES
CREATE TABLE IF NOT EXISTS obra_notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  destinatario_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo              TEXT NOT NULL,
  titulo            TEXT NOT NULL,
  mensaje           TEXT NOT NULL,
  leida             BOOLEAN NOT NULL DEFAULT false,
  canal             TEXT NOT NULL DEFAULT 'interna',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. COMENTARIOS
CREATE TABLE IF NOT EXISTS obra_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  stage_id        UUID REFERENCES obra_stages(id) ON DELETE SET NULL,
  autor_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenido       TEXT NOT NULL,
  visible_cliente BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PLANTILLAS DE ETAPAS
CREATE TABLE IF NOT EXISTS obra_stage_templates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT NOT NULL,
  descripcion      TEXT,
  constructora_id  UUID REFERENCES constructoras(id) ON DELETE CASCADE,
  -- NULL = plantilla global de la plataforma
  etapas           JSONB NOT NULL DEFAULT '[]',
  is_default       BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. HISTORIAL DE SALUD
CREATE TABLE IF NOT EXISTS obra_health_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES obra_projects(id) ON DELETE CASCADE,
  salud       TEXT NOT NULL,
  razon       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================
-- ÍNDICES DE RENDIMIENTO
-- =====================
CREATE INDEX IF NOT EXISTS idx_obra_projects_constructora ON obra_projects(constructora_id);
CREATE INDEX IF NOT EXISTS idx_obra_projects_client      ON obra_projects(client_user_id);
CREATE INDEX IF NOT EXISTS idx_obra_projects_estado      ON obra_projects(estado);
CREATE INDEX IF NOT EXISTS idx_obra_stages_project       ON obra_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_obra_stages_orden         ON obra_stages(project_id, orden);
CREATE INDEX IF NOT EXISTS idx_obra_files_project        ON obra_stage_files(project_id);
CREATE INDEX IF NOT EXISTS idx_obra_notifications_dest   ON obra_notifications(destinatario_id, leida);

-- =====================
-- FUNCIÓN AUTO-UPDATE updated_at
-- =====================
CREATE OR REPLACE FUNCTION update_obra_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_obra_projects_updated_at
  BEFORE UPDATE ON obra_projects
  FOR EACH ROW EXECUTE FUNCTION update_obra_updated_at();

CREATE TRIGGER trg_obra_stages_updated_at
  BEFORE UPDATE ON obra_stages
  FOR EACH ROW EXECUTE FUNCTION update_obra_updated_at();

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE obra_projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_stages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_stage_files     ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_incidents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_stage_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_health_logs     ENABLE ROW LEVEL SECURITY;

-- obra_projects: Constructora ve sus proyectos. Cliente ve el suyo.
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
  );

-- obra_stages: misma lógica heredada del proyecto
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
      )
    )
  );

-- Archivos: cliente solo ve visible_cliente = true
CREATE POLICY "files_via_project" ON obra_stage_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_stage_files.project_id
      AND (
        p.constructora_id = auth.uid()
        OR (p.client_user_id = auth.uid() AND obra_stage_files.visible_cliente = true)
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
      )
    )
  );

-- Incidencias: cliente solo ve visible_cliente = true
CREATE POLICY "incidents_via_project" ON obra_incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_incidents.project_id
      AND (
        p.constructora_id = auth.uid()
        OR (p.client_user_id = auth.uid() AND obra_incidents.visible_cliente = true)
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
      )
    )
  );

-- Notificaciones: solo el destinatario
CREATE POLICY "notifications_own" ON obra_notifications
  FOR ALL USING (destinatario_id = auth.uid());

-- Comentarios: cliente ve visible_cliente = true
CREATE POLICY "comments_via_project" ON obra_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_comments.project_id
      AND (
        p.constructora_id = auth.uid()
        OR (p.client_user_id = auth.uid() AND obra_comments.visible_cliente = true)
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
      )
    )
  );

-- Plantillas: propias o globales
CREATE POLICY "templates_own_or_global" ON obra_stage_templates
  FOR SELECT USING (
    constructora_id IS NULL
    OR constructora_id = auth.uid()
    OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = obra_stage_templates.constructora_id AND c.id = auth.uid())
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
  );

CREATE POLICY "templates_insert_own" ON obra_stage_templates
  FOR INSERT WITH CHECK (
    constructora_id = auth.uid()
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
  );

-- Health logs: solo admins y constructora
CREATE POLICY "health_logs_via_project" ON obra_health_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM obra_projects p
      WHERE p.id = obra_health_logs.project_id
      AND (
        p.constructora_id = auth.uid()
        OR EXISTS (SELECT 1 FROM constructoras c WHERE c.id = p.constructora_id AND c.id = auth.uid())
        OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('superadmin', 'admin')
      )
    )
  );

-- =====================
-- PLANTILLA BASE DE ETAPAS (Datos iniciales)
-- =====================
INSERT INTO obra_stage_templates (nombre, descripcion, constructora_id, is_default, etapas)
VALUES (
  'Plantilla Estándar SolocasasChile',
  'Etapas base recomendadas para proyectos de casas prefabricadas, SIP, modulares y container.',
  NULL,
  true,
  '[
    {"orden":1,"nombre":"Reserva y Firma","descripcion":"Firma de contrato y pago de reserva","dias_estimados":7},
    {"orden":2,"nombre":"Diseño y Ajustes","descripcion":"Ajuste de planos y especificaciones técnicas","dias_estimados":14},
    {"orden":3,"nombre":"Revisión Técnica","descripcion":"Revisión estructural y técnica del proyecto","dias_estimados":7},
    {"orden":4,"nombre":"Permisos Municipales","descripcion":"Tramitación de permisos de edificación","dias_estimados":30},
    {"orden":5,"nombre":"Fabricación","descripcion":"Fabricación en planta de los módulos o estructura","dias_estimados":45},
    {"orden":6,"nombre":"Transporte y Logística","descripcion":"Traslado de materiales y componentes al terreno","dias_estimados":7},
    {"orden":7,"nombre":"Preparación del Terreno","descripcion":"Movimiento de tierra, cimientos y fundaciones","dias_estimados":10},
    {"orden":8,"nombre":"Montaje","descripcion":"Ensamblaje e instalación en terreno","dias_estimados":14},
    {"orden":9,"nombre":"Instalaciones","descripcion":"Sistemas eléctricos, sanitarios y climatización","dias_estimados":10},
    {"orden":10,"nombre":"Terminaciones","descripcion":"Pintura, revestimientos, pavimentos y detalles finales","dias_estimados":14},
    {"orden":11,"nombre":"Inspección Final","descripcion":"Inspección técnica y recepción municipal","dias_estimados":3},
    {"orden":12,"nombre":"Entrega al Cliente","descripcion":"Acta de entrega y cierre oficial del proyecto","dias_estimados":1}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;
