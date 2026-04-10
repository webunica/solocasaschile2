// ============================================================
// Tipos TypeScript para el módulo de Seguimiento de Obra
// Desacoplados: listos para reutilizarse en subdominio futuro
// ============================================================

export type ObraProjectEstado =
  | 'planificacion'
  | 'en_curso'
  | 'pausado'
  | 'completado'
  | 'cancelado';

export type ObraProjectPrioridad = 'baja' | 'normal' | 'alta' | 'urgente';

export type ObraProjectSalud = 'verde' | 'amarillo' | 'rojo';

export type ObraStageEstado =
  | 'pendiente'
  | 'en_preparacion'
  | 'en_curso'
  | 'pausada'
  | 'retrasada'
  | 'completada'
  | 'cancelada';

export type ObraFileTipo =
  | 'foto'
  | 'video'
  | 'pdf'
  | 'plano'
  | 'contrato'
  | 'certificado'
  | 'manual'
  | 'acta'
  | 'otro';

export type ObraIncidentTipo =
  | 'clima'
  | 'cambio_cliente'
  | 'retraso_proveedor'
  | 'tecnico'
  | 'diseno'
  | 'otro';

// ── Entidades principales ──────────────────────────────────

export interface ObraProject {
  id: string;
  constructora_id: string;
  client_user_id: string | null;
  modelo_id: string | null;
  nombre: string;
  codigo_interno: string | null;
  tipo_construccion: string | null;
  region: string | null;
  comuna: string | null;
  direccion_referencia: string | null;
  fecha_inicio_estimada: string | null;    // ISO date string
  fecha_termino_estimada: string | null;
  fecha_termino_real: string | null;
  estado: ObraProjectEstado;
  porcentaje_avance: number;
  prioridad: ObraProjectPrioridad;
  salud: ObraProjectSalud;
  observaciones_generales: string | null;
  ejecutivo_responsable: string | null;
  supervisor_id: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  // Joins opcionales (cuando se consultan con select expandido)
  constructora?: { nombre: string; logo_url: string | null };
  stages?: ObraStage[];
  files?: ObraStageFile[];
}

export interface ObraStage {
  id: string;
  project_id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  fecha_inicio_estimada: string | null;
  fecha_termino_estimada: string | null;
  fecha_inicio_real: string | null;
  fecha_termino_real: string | null;
  estado: ObraStageEstado;
  porcentaje_avance: number;
  responsable: string | null;
  observaciones: string | null;
  tiene_retraso: boolean;
  motivo_retraso: string | null;
  visible_cliente: boolean;
  created_at: string;
  updated_at: string;
  // Joins opcionales
  files?: ObraStageFile[];
}

export interface ObraStageFile {
  id: string;
  project_id: string;
  stage_id: string | null;
  nombre: string;
  tipo: ObraFileTipo;
  storage_path: string;
  visible_cliente: boolean;
  subido_por: string | null;
  created_at: string;
  // URL pre-firmada de Supabase Storage (derivada en cliente)
  url?: string;
}

export interface ObraIncident {
  id: string;
  project_id: string;
  stage_id: string | null;
  tipo: ObraIncidentTipo;
  fecha: string;
  impacto: string | null;
  descripcion: string;
  visible_cliente: boolean;
  registrado_por: string | null;
  created_at: string;
}

export interface ObraNotification {
  id: string;
  project_id: string;
  destinatario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  canal: string;
  created_at: string;
}

export interface ObraComment {
  id: string;
  project_id: string;
  stage_id: string | null;
  autor_id: string;
  contenido: string;
  visible_cliente: boolean;
  created_at: string;
}

export interface ObraStageTemplateItem {
  orden: number;
  nombre: string;
  descripcion: string;
  dias_estimados: number;
}

export interface ObraStageTemplate {
  id: string;
  nombre: string;
  descripcion: string | null;
  constructora_id: string | null;
  etapas: ObraStageTemplateItem[];
  is_default: boolean;
  created_at: string;
}

// ── DTOs para formularios ──────────────────────────────────

export interface CreateObraProjectDTO {
  nombre: string;
  codigo_interno?: string;
  tipo_construccion?: string;
  region?: string;
  comuna?: string;
  direccion_referencia?: string;
  fecha_inicio_estimada?: string;
  fecha_termino_estimada?: string;
  ejecutivo_responsable?: string;
  observaciones_generales?: string;
  prioridad?: ObraProjectPrioridad;
  template_id?: string; // ID de plantilla de etapas a aplicar
}

export interface UpdateObraStageDTO {
  estado?: ObraStageEstado;
  porcentaje_avance?: number;
  fecha_inicio_real?: string;
  fecha_termino_real?: string;
  responsable?: string;
  observaciones?: string;
  tiene_retraso?: boolean;
  motivo_retraso?: string;
}

// ── Vistas calculadas ──────────────────────────────────────

export interface ObraProjectSummary extends ObraProject {
  stages_count: number;
  completed_stages: number;
  next_stage: ObraStage | null;
  last_photo: ObraStageFile | null;
  dias_restantes: number | null;
  esta_atrasado: boolean;
}

// KPIs para el panel de constructora
export interface ObraKPIs {
  total_activos: number;
  total_completados: number;
  total_atrasados: number;
  promedio_cumplimiento: number; // 0-100
  proximos_a_vencer: number;    // proyectos que vencen en <= 14 días
}
