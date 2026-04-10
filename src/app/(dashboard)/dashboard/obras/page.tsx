import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getObraProjects } from "@/lib/supabase/obra-services";
import { ProjectKPICards } from "@/components/obras/project-kpi-cards";
import { ProjectHealthBadge } from "@/components/obras/health-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HardHat, Plus, ArrowRight, Calendar, MapPin, AlertTriangle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seguimiento de Obra | SolocasasChile",
  description: "Gestiona el avance de tus proyectos de construcción y mantén informados a tus clientes.",
};

const ESTADO_LABELS: Record<string, string> = {
  planificacion: "Planificación",
  en_curso:      "En Curso",
  pausado:       "Pausado",
  completado:    "Completado",
  cancelado:     "Cancelado",
};

export default async function ObrasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const projects = await getObraProjects();
  const atrasados = projects.filter(p => p.salud === 'rojo');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-brand-indigo" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black tracking-tight text-foreground">
                Seguimiento de Obra
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Gestiona el avance real de tus proyectos
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/obras/nuevo"
          className={cn(buttonVariants(), "rounded-2xl font-black uppercase tracking-wider gap-2 bg-brand-indigo shadow-xl shadow-brand-indigo/20 hover:bg-brand-indigo/90 text-white")}
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Link>
      </div>

      {/* KPIs */}
      <ProjectKPICards />

      {/* Alerta de proyectos con retraso */}
      {atrasados.length > 0 && (
        <div className="flex items-start gap-4 p-5 rounded-3xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-red-700">
              {atrasados.length} proyecto{atrasados.length > 1 ? 's' : ''} con retraso crítico
            </p>
            <p className="text-xs text-red-600/70 font-medium mt-0.5">
              {atrasados.map(p => p.nombre).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Listado de proyectos */}
      {projects.length === 0 ? (
        <div className="text-center py-32 space-y-6">
          <div className="w-20 h-20 rounded-[2rem] bg-brand-indigo/5 flex items-center justify-center mx-auto">
            <HardHat className="w-10 h-10 text-brand-indigo/30" />
          </div>
          <div>
            <p className="text-xl font-black text-foreground mb-2">Sin proyectos aún</p>
            <p className="text-muted-foreground font-medium">Crea tu primer proyecto de obra y empieza a gestionar el avance.</p>
          </div>
          <Link
            href="/dashboard/obras/nuevo"
            className={cn(buttonVariants({ size: "lg" }), "rounded-2xl font-black uppercase tracking-wide bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Primer Proyecto
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/dashboard/obras/${project.id}`}
              className="group flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white rounded-[2rem] border border-border/40 shadow-sm hover:shadow-xl hover:border-brand-indigo/20 hover:-translate-y-0.5 transition-all"
            >
              {/* Info principal */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-start gap-3 flex-wrap">
                  <h2 className="font-heading font-black text-lg tracking-tight text-foreground group-hover:text-brand-indigo transition-colors line-clamp-1">
                    {project.nombre}
                  </h2>
                  {project.codigo_interno && (
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 border-border/60 shrink-0">
                      {project.codigo_interno}
                    </Badge>
                  )}
                  <ProjectHealthBadge salud={project.salud} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-medium">
                  {project.region && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 opacity-50" />
                      {project.region}{project.comuna ? `, ${project.comuna}` : ''}
                    </span>
                  )}
                  {project.fecha_termino_estimada && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 opacity-50" />
                      Entrega est.: {new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Estado + avance */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-center">
                  <Badge
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      project.estado === 'en_curso'   ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20" :
                      project.estado === 'completado' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      project.estado === 'pausado'    ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                        "bg-slate-50 text-slate-500 border-slate-200"
                    )}
                  >
                    {ESTADO_LABELS[project.estado] ?? project.estado}
                  </Badge>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={project.salud === 'verde' ? '#00c9a7' : project.salud === 'amarillo' ? '#f59e0b' : '#ef4444'}
                        strokeWidth="2.5"
                        strokeDasharray={`${project.porcentaje_avance} ${100 - project.porcentaje_avance}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-foreground">{project.porcentaje_avance}%</span>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-brand-indigo group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
