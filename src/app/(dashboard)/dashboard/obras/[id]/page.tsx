import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getObraProject } from "@/lib/supabase/obra-services";
import { ProjectHealthBadge } from "@/components/obras/health-badge";
import { GanttChart } from "@/components/obras/gantt-chart";
import { ProjectTimeline } from "@/components/obras/project-timeline";
import { StageStatusBadge } from "@/components/obras/stage-status-badge";
import { ProjectSpecsList } from "@/components/obras/project-specs-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Calendar, MapPin, HardHat, User, FileText,
  Image as ImageIcon, Settings, ChevronRight, Clock, CheckSquare
} from "lucide-react";
import type { ObraStage } from "@/types/obra";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getObraProject(id);
  return {
    title: project ? `${project.nombre} | Seguimiento de Obra` : "Proyecto | SolocasasChile",
  };
}

const ESTADO_LABELS: Record<string, string> = {
  planificacion: "Planificación",
  en_curso:      "En Curso",
  pausado:       "Pausado",
  completado:    "Completado",
  cancelado:     "Cancelado",
};

export default async function ObraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const project = await getObraProject(id);
  if (!project) notFound();

  const stages = (project.stages ?? []) as ObraStage[];
  const nextStage = stages.find(s => s.estado !== 'completada' && s.estado !== 'cancelada');
  const recentFiles = (project.files ?? []).filter((f: any) => f.tipo === 'foto').slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Breadcrumb + header */}
      <div className="space-y-4">
        <Link href="/dashboard/obras" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand-indigo transition-colors">
          <ArrowLeft className="w-4 h-4" /> Todos los Proyectos
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-heading font-black tracking-tight">{project.nombre}</h1>
              {project.codigo_interno && (
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                  {project.codigo_interno}
                </Badge>
              )}
              <ProjectHealthBadge salud={project.salud} />
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground font-medium">
              <Badge className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                project.estado === 'en_curso'   ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20" :
                project.estado === 'completado' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                project.estado === 'pausado'    ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                  "bg-slate-50 text-slate-500 border-slate-200"
              )}>
                {ESTADO_LABELS[project.estado] ?? project.estado}
              </Badge>
              {project.region && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-50" />
                  {project.region}{project.comuna ? `, ${project.comuna}` : ''}
                </span>
              )}
              {project.fecha_termino_estimada && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-50" />
                  Entrega est.: {new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              {project.ejecutivo_responsable && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 opacity-50" />
                  {project.ejecutivo_responsable}
                </span>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/dashboard/obras/${id}/etapas`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-black text-[10px] uppercase tracking-wider")}
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" /> Editar Etapas
            </Link>
            <Link
              href={`/dashboard/obras/${id}/archivos`}
              className={cn(buttonVariants({ size: "sm" }), "rounded-xl font-black text-[10px] uppercase tracking-wider bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20")}
            >
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Subir Evidencia
            </Link>
          </div>
        </div>
      </div>

      {/* Avance global */}
      <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Avance Global</p>
          <span className="text-3xl font-black text-brand-indigo">{project.porcentaje_avance}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-teal transition-all duration-1000"
            style={{ width: `${project.porcentaje_avance}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
          <span>{stages.filter(s => s.estado === 'completada').length} etapas completadas</span>
          <span>{stages.length} etapas totales</span>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Gantt + Timeline */}
        <div className="lg:col-span-2 space-y-8">

          {/* Gantt */}
          <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base tracking-tight">Cronograma</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Vista Gantt</span>
            </div>
            {stages.length > 0 ? (
              <GanttChart stages={stages} />
            ) : (
              <p className="text-sm text-muted-foreground font-medium py-6 text-center">
                Sin etapas registradas. <Link href={`/dashboard/obras/${id}/etapas`} className="text-brand-indigo underline">Agregar etapas</Link>
              </p>
            )}
          </div>

          {/* Etapas resumen */}
          <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-base tracking-tight">Etapas del Proyecto</h3>
              <Link href={`/dashboard/obras/${id}/etapas`} className="text-[10px] font-black uppercase tracking-widest text-brand-indigo hover:text-brand-indigo/70 flex items-center gap-1">
                Gestionar <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border/20">
              {stages.map(stage => (
                <div key={stage.id} className="py-4 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-black text-muted-foreground">
                    {stage.orden}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground leading-tight">{stage.nombre}</p>
                    {stage.responsable && <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stage.responsable}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-brand-teal rounded-full" style={{ width: `${stage.porcentaje_avance}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground w-8 text-right">{stage.porcentaje_avance}%</span>
                    <StageStatusBadge estado={stage.estado} />
                  </div>
                </div>
              ))}
              {stages.length === 0 && (
                <p className="py-8 text-sm text-muted-foreground font-medium text-center">
                  Sin etapas. <Link href={`/dashboard/obras/${id}/etapas`} className="text-brand-indigo underline">Crear etapas</Link>
                </p>
              )}
            </div>
          </div>

          {/* Especificaciones / Checklists de Materiales */}
          {((project as any).specs?.length > 0) && (
            <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base tracking-tight leading-tight">Especificaciones y Materiales</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Estado de instalación</p>
                </div>
              </div>
              
              <ProjectSpecsList initialSpecs={(project as any).specs} projectId={id} />
            </div>
          )}

        </div>

        {/* Columna derecha: info lateral */}
        <div className="space-y-6">
          {/* Próxima etapa */}
          {nextStage && (
            <div className="p-6 rounded-[2rem] bg-brand-indigo text-white space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Próxima Etapa</p>
              <div className="space-y-2">
                <p className="font-heading font-black text-lg leading-tight">{nextStage.nombre}</p>
                {nextStage.fecha_termino_estimada && (
                  <p className="text-white/60 text-xs font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Est.: {new Date(nextStage.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                  </p>
                )}
              </div>
              <StageStatusBadge estado={nextStage.estado} />
            </div>
          )}

          {/* Timeline simplificada */}
          <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
            <h3 className="font-heading font-black text-sm tracking-tight">Línea de Tiempo</h3>
            <ProjectTimeline stages={stages} />
          </div>

          {/* Fotos recientes */}
          {recentFiles.length > 0 && (
            <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-sm tracking-tight">Fotos Recientes</h3>
                <Link href={`/dashboard/obras/${id}/archivos`} className="text-[10px] font-black uppercase tracking-widest text-brand-indigo hover:text-brand-indigo/70 flex items-center gap-1">
                  Ver todas <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recentFiles.map((f: any) => (
                  <div key={f.id} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info rápida */}
          <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
            <h3 className="font-heading font-black text-sm tracking-tight">Información</h3>
            <div className="space-y-3 text-sm">
              {project.tipo_construccion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tipo</span>
                  <span className="font-black">{project.tipo_construccion}</span>
                </div>
              )}
              {project.prioridad && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Prioridad</span>
                  <span className="font-black capitalize">{project.prioridad}</span>
                </div>
              )}
              {project.fecha_inicio_estimada && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Inicio</span>
                  <span className="font-black">{new Date(project.fecha_inicio_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                </div>
              )}
              {project.fecha_termino_estimada && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Entrega est.</span>
                  <span className="font-black">{new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Link portal cliente */}
          <div className="p-5 rounded-[2rem] bg-brand-teal/5 border border-brand-teal/20 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal/70">Portal del Cliente</p>
            <p className="text-xs text-muted-foreground font-medium">Comparte este enlace con tu cliente para que vea el avance de su proyecto.</p>
            <Link
              href={`/seguimiento/${id}`}
              target="_blank"
              className="flex items-center gap-2 text-xs font-black text-brand-teal hover:underline"
            >
              Ver portal de cliente <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
