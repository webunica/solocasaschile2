// ============================================================
// Servicios de Seguimiento de Obra — Capa de acceso a datos
// Desacoplada: independiente del layout del dashboard,
// lista para reutilizarse en subdominio avance.solocasaschile.com
// ============================================================
import { unstable_cache } from 'next/cache';
import { createClient, createPublicClient } from './server';
import type {
  ObraProject,
  ObraStage,
  ObraStageFile,
  ObraIncident,
  ObraStageTemplate,
  ObraKPIs,
  ObraProjectSummary,
  CreateObraProjectDTO,
  UpdateObraStageDTO,
  ObraStageTemplateItem,
} from '@/types/obra';

// ──────────────────────────────────────────────
// HELPERS INTERNOS
// ──────────────────────────────────────────────

function diffDays(dateStr: string | null, from: Date = new Date()): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function calcularSalud(
  project: Pick<ObraProject, 'fecha_termino_estimada'>,
  stages: Pick<ObraStage, 'fecha_termino_estimada' | 'estado'>[]
): 'verde' | 'amarillo' | 'rojo' {
  const hoy = new Date();
  const etapasVencidas = stages.filter(s =>
    s.fecha_termino_estimada &&
    new Date(s.fecha_termino_estimada) < hoy &&
    s.estado !== 'completada'
  );
  const diasRestantes = diffDays(project.fecha_termino_estimada, hoy);

  if (etapasVencidas.length > 2 || (diasRestantes !== null && diasRestantes < 0)) return 'rojo';
  if (etapasVencidas.length > 0 || (diasRestantes !== null && diasRestantes < 14)) return 'amarillo';
  return 'verde';
}

export function calcularPorcentajeGlobal(stages: Pick<ObraStage, 'porcentaje_avance'>[]): number {
  if (!stages.length) return 0;
  const total = stages.reduce((acc, s) => acc + s.porcentaje_avance, 0);
  return Math.round(total / stages.length);
}

// ──────────────────────────────────────────────
// LECTURA — PROYECTOS
// ──────────────────────────────────────────────

/** Lista de proyectos de la constructora autenticada */
export async function getObraProjects(): Promise<ObraProject[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('obra_projects')
    .select(`
      *,
      constructora:constructoras(nombre, logo_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[obra-services] getObraProjects:', error.message);
    return [];
  }
  return (data ?? []) as ObraProject[];
}

/** Proyecto individual con etapas y archivos */
export async function getObraProject(id: string): Promise<ObraProject | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('obra_projects')
    .select(`
      *,
      constructora:constructoras(nombre, logo_url),
      stages:obra_stages(* , files:obra_stage_files(*))
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[obra-services] getObraProject:', error.message);
    return null;
  }

  if (!data) return null;

  // Ordenar etapas por orden
  if (data.stages) {
    data.stages = (data.stages as ObraStage[]).sort((a, b) => a.orden - b.orden);
  }

  return data as ObraProject;
}

/** Proyecto para portal del cliente (solo visible_cliente = true) */
export async function getObraProjectForClient(id: string): Promise<ObraProject | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('obra_projects')
    .select(`
      *,
      constructora:constructoras(nombre, logo_url),
      stages:obra_stages!inner(
        id, nombre, descripcion, orden, estado, porcentaje_avance,
        fecha_inicio_estimada, fecha_termino_estimada,
        fecha_inicio_real, fecha_termino_real,
        responsable, observaciones, visible_cliente,
        files:obra_stage_files(*)
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  // Filtrar stages y files visibles
  if (data.stages) {
    data.stages = (data.stages as ObraStage[])
      .filter(s => s.visible_cliente)
      .sort((a, b) => a.orden - b.orden)
      .map(s => ({
        ...s,
        files: (s.files ?? []).filter((f: ObraStageFile) => f.visible_cliente),
      }));
  }

  return data as ObraProject;
}

/** KPIs del panel de constructora */
export async function getObraKPIs(): Promise<ObraKPIs> {
  const projects = await getObraProjects();
  const hoy = new Date();

  const activos = projects.filter(p => p.estado === 'en_curso').length;
  const completados = projects.filter(p => p.estado === 'completado').length;
  const atrasados = projects.filter(p => p.salud === 'rojo').length;
  const proximos = projects.filter(p => {
    const dias = diffDays(p.fecha_termino_estimada, hoy);
    return dias !== null && dias >= 0 && dias <= 14 && p.estado !== 'completado';
  }).length;

  // Promedio: de proyectos completados
  const completedProjects = projects.filter(p => p.estado === 'completado');
  const promedio = completedProjects.length > 0
    ? Math.round(completedProjects.reduce((acc, p) => acc + p.porcentaje_avance, 0) / completedProjects.length)
    : 0;

  return {
    total_activos: activos,
    total_completados: completados,
    total_atrasados: atrasados,
    promedio_cumplimiento: promedio,
    proximos_a_vencer: proximos,
  };
}

// ──────────────────────────────────────────────
// LECTURA — ETAPAS Y ARCHIVOS
// ──────────────────────────────────────────────

export async function getObraStages(projectId: string): Promise<ObraStage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('obra_stages')
    .select('*, files:obra_stage_files(*)')
    .eq('project_id', projectId)
    .order('orden', { ascending: true });

  if (error) {
    console.error('[obra-services] getObraStages:', error.message);
    return [];
  }
  return (data ?? []) as ObraStage[];
}

export async function getObraFiles(projectId: string): Promise<ObraStageFile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('obra_stage_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ObraStageFile[];
}

/** URL firmada de Supabase Storage para un archivo */
export async function getSignedFileUrl(storagePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from('obra-files')
    .createSignedUrl(storagePath, 60 * 60); // 1 hora
  return data?.signedUrl ?? null;
}

// ──────────────────────────────────────────────
// LECTURA — INCIDENCIAS
// ──────────────────────────────────────────────

export async function getObraIncidents(projectId: string): Promise<ObraIncident[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('obra_incidents')
    .select('*')
    .eq('project_id', projectId)
    .order('fecha', { ascending: false });

  if (error) return [];
  return (data ?? []) as ObraIncident[];
}

// ──────────────────────────────────────────────
// PLANTILLAS
// ──────────────────────────────────────────────

export async function getObraTemplates(): Promise<ObraStageTemplate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('obra_stage_templates')
    .select('*')
    .order('is_default', { ascending: false });
  return (data ?? []) as ObraStageTemplate[];
}

// ──────────────────────────────────────────────
// SERVER ACTIONS — PROYECTOS
// ──────────────────────────────────────────────

export async function createObraProject(dto: CreateObraProjectDTO): Promise<ObraProject | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Obtener constructora_id del usuario y su rol
  const { data: constructora } = await supabase
    .from('constructoras')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!constructora) return null;

  let finalConstructoraId = constructora.id;
  const isSuperAdmin = constructora.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

  let modelData: any = null;
  if (dto.modelo_id) {
    const { data: mData } = await supabase.from('modelos').select('*').eq('id', dto.modelo_id).maybeSingle();
    modelData = mData;
  }

  // Si es superadmin y seleccionó un modelo de otra constructora, asignamos a la dueña del modelo
  if (isSuperAdmin && modelData?.constructora_id) {
    finalConstructoraId = modelData.constructora_id;
  }

  // Crear proyecto
  const { data: project, error } = await supabase
    .from('obra_projects')
    .insert({
      constructora_id: finalConstructoraId,
      nombre: dto.nombre,
      codigo_interno: dto.codigo_interno,
      tipo_construccion: dto.tipo_construccion,
      region: dto.region,
      comuna: dto.comuna,
      direccion_referencia: dto.direccion_referencia,
      fecha_inicio_estimada: dto.fecha_inicio_estimada,
      fecha_termino_estimada: dto.fecha_termino_estimada,
      ejecutivo_responsable: dto.ejecutivo_responsable,
      observaciones_generales: dto.observaciones_generales,
      prioridad: dto.prioridad ?? 'normal',
      modelo_id: dto.modelo_id,
      superficie_m2: modelData?.superficie_m2 ?? null,
      dormitorios: modelData?.dormitorios ?? null,
      banos: modelData?.banos ?? null,
    })
    .select()
    .single();

  if (error || !project) {
    console.error('[obra-services] createObraProject:', error?.message);
    return null;
  }

  // Si trae metadata del modelo, generar las especificaciones (checklist)
  if (modelData) {
    const specsToInsert: any[] = [];
    const pushCategory = (catName: string, catData: any) => {
      if (!catData) return;
      Object.entries(catData).forEach(([key, value]) => {
        if (key !== 'notas' && value && String(value).trim() !== '') {
          specsToInsert.push({
            project_id: project.id,
            categoria: catName,
            elemento: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            valor: String(value),
            estado: 'pendiente',
            orden: specsToInsert.length,
          });
        }
      });
    };

    pushCategory('Construcción', modelData.construccion);
    pushCategory('Aislación', modelData.aislacion);
    pushCategory('Terminaciones', modelData.terminaciones);
    pushCategory('Instalaciones', modelData.instalaciones);

    if (specsToInsert.length > 0) {
      const { error: specError } = await supabase.from('obra_project_specs').insert(specsToInsert);
      if (specError) console.error('[obra-services] createObraProject (specs):', specError.message);
    }
  }

  // Aplicar plantilla de etapas si se seleccionó
  if (dto.template_id) {
    await applyStageTemplate(project.id, dto.template_id, dto.fecha_inicio_estimada);
  } else {
    // Aplicar plantilla por defecto automáticamente
    const { data: defaultTemplate } = await supabase
      .from('obra_stage_templates')
      .select('id')
      .eq('is_default', true)
      .maybeSingle();

    if (defaultTemplate) {
      await applyStageTemplate(project.id, defaultTemplate.id, dto.fecha_inicio_estimada);
    }
  }

  return project as ObraProject;
}

export async function updateObraProject(
  id: string,
  updates: Partial<Omit<ObraProject, 'id' | 'constructora_id' | 'created_at'>>
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('obra_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('[obra-services] updateObraProject:', error.message);
    return false;
  }
  return true;
}

// ──────────────────────────────────────────────
// SERVER ACTIONS — ETAPAS
// ──────────────────────────────────────────────

export async function updateObraStage(
  stageId: string,
  dto: UpdateObraStageDTO
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('obra_stages')
    .update({ ...dto, updated_at: new Date().toISOString() })
    .eq('id', stageId);

  if (error) {
    console.error('[obra-services] updateObraStage:', error.message);
    return false;
  }

  // Recalcular porcentaje global del proyecto tras actualizar la etapa
  const { data: stage } = await supabase
    .from('obra_stages')
    .select('project_id')
    .eq('id', stageId)
    .maybeSingle();

  if (stage) {
    await recalcProjectProgress(stage.project_id);
  }

  return true;
}

/** Recalcula el porcentaje global y actualiza el proyecto */
async function recalcProjectProgress(projectId: string) {
  const supabase = await createClient();
  const { data: stages } = await supabase
    .from('obra_stages')
    .select('porcentaje_avance, fecha_termino_estimada, estado')
    .eq('project_id', projectId);

  if (!stages?.length) return;

  const { data: projectData } = await supabase
    .from('obra_projects')
    .select('fecha_termino_estimada')
    .eq('id', projectId)
    .maybeSingle();

  const porcentaje = calcularPorcentajeGlobal(stages);
  const salud = calcularSalud(
    { fecha_termino_estimada: projectData?.fecha_termino_estimada ?? null },
    stages
  );

  await supabase
    .from('obra_projects')
    .update({ porcentaje_avance: porcentaje, salud, updated_at: new Date().toISOString() })
    .eq('id', projectId);
}

// ──────────────────────────────────────────────
// SERVER ACTIONS — PLANTILLAS
// ──────────────────────────────────────────────

async function applyStageTemplate(
  projectId: string,
  templateId: string,
  startDate?: string
): Promise<void> {
  const supabase = await createClient();

  const { data: template } = await supabase
    .from('obra_stage_templates')
    .select('etapas')
    .eq('id', templateId)
    .maybeSingle();

  if (!template) return;

  const etapas = template.etapas as ObraStageTemplateItem[];
  let currentDate = startDate ? new Date(startDate) : new Date();

  const stagesToInsert = etapas.map(e => {
    const startEst = new Date(currentDate);
    const endEst = new Date(currentDate);
    endEst.setDate(endEst.getDate() + e.dias_estimados);

    const stage = {
      project_id: projectId,
      nombre: e.nombre,
      descripcion: e.descripcion,
      orden: e.orden,
      fecha_inicio_estimada: startEst.toISOString().split('T')[0],
      fecha_termino_estimada: endEst.toISOString().split('T')[0],
      estado: 'pendiente',
      porcentaje_avance: 0,
    };

    currentDate = new Date(endEst);
    currentDate.setDate(currentDate.getDate() + 1);
    return stage;
  });

  await supabase.from('obra_stages').insert(stagesToInsert);
}

// ──────────────────────────────────────────────
// SERVER ACTIONS — ARCHIVOS  
// ──────────────────────────────────────────────

export async function uploadObraFile(
  projectId: string,
  stageId: string | null,
  file: File,
  tipo: string,
  visibleCliente: boolean = true
): Promise<ObraStageFile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const ext = file.name.split('.').pop();
  const path = `${projectId}/${stageId ?? 'general'}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('obra-files')
    .upload(path, file);

  if (uploadError) {
    console.error('[obra-services] uploadObraFile:', uploadError.message);
    return null;
  }

  const { data, error } = await supabase
    .from('obra_stage_files')
    .insert({
      project_id: projectId,
      stage_id: stageId,
      nombre: file.name,
      tipo,
      storage_path: path,
      visible_cliente: visibleCliente,
      subido_por: user.id,
    })
    .select()
    .single();

  if (error) return null;
  return data as ObraStageFile;
}
