import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getObraProjectForClient } from "@/lib/supabase/obra-services";
import { ProjectTimeline } from "@/components/obras/project-timeline";
import { ProjectHealthBadge } from "@/components/obras/health-badge";
import { cn } from "@/lib/utils";
import {
  Calendar, MapPin, CheckCircle2, Clock, FileText,
  Image as ImageIcon, ChevronRight, HardHat, ArrowLeft
} from "lucide-react";
import type { ObraStage, ObraStageFile } from "@/types/obra";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getObraProjectForClient(id);
  return {
    title: project ? `${project.nombre} | Portal de Seguimiento` : "Portal de Seguimiento",
    description: "Sigue el avance de tu proyecto de construcción en tiempo real.",
  };
}

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const project = await getObraProjectForClient(id);
  if (!project) notFound();

  const stages = (project.stages ?? []) as ObraStage[];
  const allFiles = stages.flatMap(s => (s.files ?? []) as ObraStageFile[]);
  const recentPhotos = allFiles.filter(f => f.tipo === 'foto').slice(0, 6);
  const docs = allFiles.filter(f => f.tipo !== 'foto');

  const nextStage = stages.find(s => s.estado !== 'completada' && s.estado !== 'cancelada');
  const completedCount = stages.filter(s => s.estado === 'completada').length;

  const diasRestantes = project.fecha_termino_estimada
    ? Math.ceil((new Date(project.fecha_termino_estimada).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-indigo/3">
      {/* Header del portal */}
      <div className="bg-brand-indigo text-white">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Portal de Seguimiento</p>
                <p className="text-sm font-bold text-white/80">
                  {project.constructora?.nombre ?? "SolocasasChile"}
                </p>
              </div>
            </div>
            <Link href="/dashboard/obras" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight leading-tight">
                {project.nombre}
              </h1>
              <ProjectHealthBadge salud={project.salud} />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60 font-medium">
              {project.region && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {project.region}{project.comuna ? `, ${project.comuna}` : ''}
                </span>
              )}
              {project.fecha_termino_estimada && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Entrega estimada: {new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Barra de avance principal */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-end">
              <p className="text-sm font-black text-white/60 uppercase tracking-widest">Avance Total</p>
              <span className="text-4xl font-black text-white">{project.porcentaje_avance}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-teal to-white/80 transition-all duration-1000"
                style={{ width: `${project.porcentaje_avance}%` }}
              />
            </div>
            <p className="text-xs text-white/40 font-bold">
              {completedCount} de {stages.length} etapas completadas
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Próximo hito destacado */}
        {nextStage && (
          <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-lg shadow-brand-indigo/5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-brand-teal" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/60">Próximo Hito</p>
              <p className="text-lg font-heading font-black text-foreground mt-0.5">{nextStage.nombre}</p>
              {nextStage.fecha_termino_estimada && (
                <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 opacity-50" />
                  Fecha estimada: {new Date(nextStage.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
              {nextStage.responsable && (
                <p className="text-xs text-muted-foreground font-medium mt-0.5 opacity-60">Responsable: {nextStage.responsable}</p>
              )}
            </div>
            {diasRestantes !== null && diasRestantes > 0 && (
              <div className="text-center shrink-0">
                <p className="text-3xl font-black text-brand-indigo">{diasRestantes}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">días restantes</p>
              </div>
            )}
          </div>
        )}

        {/* Grid: Timeline + info */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Timeline */}
          <div className="md:col-span-3 p-8 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-6">
            <h2 className="font-heading font-black text-lg tracking-tight">Línea de Tiempo</h2>
            {stages.length > 0 ? (
              <ProjectTimeline stages={stages} />
            ) : (
              <p className="text-sm text-muted-foreground font-medium py-6 text-center">Sin etapas registradas aún.</p>
            )}
          </div>

          {/* Resumen lateral */}
          <div className="md:col-span-2 space-y-5">
            {/* Stats */}
            <div className="p-6 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-sm tracking-tight">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/20">
                  <span className="text-xs text-muted-foreground font-medium">Etapas completadas</span>
                  <span className="font-black text-emerald-600">{completedCount}/{stages.length}</span>
                </div>
                {project.tipo_construccion && (
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-xs text-muted-foreground font-medium">Tipo</span>
                    <span className="font-black text-sm capitalize">{project.tipo_construccion}</span>
                  </div>
                )}
                {project.ejecutivo_responsable && (
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-xs text-muted-foreground font-medium">Responsable</span>
                    <span className="font-black text-sm">{project.ejecutivo_responsable}</span>
                  </div>
                )}
                {project.fecha_termino_estimada && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-muted-foreground font-medium">Entrega est.</span>
                    <span className="font-black text-sm">
                      {new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Etapas completadas mini-list */}
            {completedCount > 0 && (
              <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 space-y-3">
                <h3 className="font-heading font-black text-sm tracking-tight text-emerald-700">✓ Completadas</h3>
                <div className="space-y-2">
                  {stages.filter(s => s.estado === 'completada').map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {s.nombre}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Galería de fotos */}
        {recentPhotos.length > 0 && (
          <div className="p-8 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-5">
            <h2 className="font-heading font-black text-lg tracking-tight">Fotos del Proyecto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentPhotos.map(f => (
                <div key={f.id} className="aspect-video rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-border/20 group hover:shadow-md transition-shadow">
                  <ImageIcon className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentos */}
        {docs.length > 0 && (
          <div className="p-8 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-5">
            <h2 className="font-heading font-black text-lg tracking-tight">Documentos Disponibles</h2>
            <div className="divide-y divide-border/20">
              {docs.map(f => (
                <div key={f.id} className="py-4 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/5 flex items-center justify-center shrink-0 group-hover:bg-brand-indigo/10 transition-colors">
                    <FileText className="w-5 h-5 text-brand-indigo" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground truncate">{f.nombre}</p>
                    <p className="text-[10px] text-muted-foreground font-medium capitalize">{f.tipo}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-brand-indigo transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer del portal */}
        <div className="text-center py-8 space-y-2">
          <p className="text-xs text-muted-foreground/50 font-bold uppercase tracking-widest">
            Portal de Seguimiento de Obra · SolocasasChile
          </p>
          <p className="text-[10px] text-muted-foreground/30 font-medium">
            SolocasasChile es un comparador independiente de constructoras. No somos una constructora ni vendemos directamente viviendas.
          </p>
        </div>
      </div>
    </div>
  );
}
