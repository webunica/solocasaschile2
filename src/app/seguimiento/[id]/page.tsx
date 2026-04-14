import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HardHat,
  Image as ImageIcon,
  Info,
  MapPin,
  User,
} from "lucide-react";

import { ProjectHealthBadge } from "@/components/obras/health-badge";
import { ProjectSpecsClient } from "@/components/obras/project-specs-client";
import { ProjectTimeline } from "@/components/obras/project-timeline";
import { getObraProjectForClient } from "@/lib/supabase/obra-services";
import { cn } from "@/lib/utils";
import type { ObraStage, ObraStageFile } from "@/types/obra";

type SeguimientoPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!date) return null;
  return new Intl.DateTimeFormat("es-CL", options).format(new Date(date));
}

function getRemainingDays(date: string | null) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export const metadata: Metadata = {
  title: "Portal de seguimiento | SolocasasChile",
  description: "Revisa el avance, hitos y evidencias visibles de tu proyecto.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ClientPortalPage({ params }: SeguimientoPageProps) {
  const { id } = await params;
  const project = await getObraProjectForClient(id);

  if (!project) notFound();

  const stages = (project.stages ?? []) as ObraStage[];
  const allFiles = stages.flatMap(stage => (stage.files ?? []) as ObraStageFile[]);
  const recentPhotos = allFiles
    .filter(file => file.tipo === "foto" && file.url)
    .reverse()
    .slice(0, 8);
  const docs = allFiles.filter(file => file.tipo !== "foto" && file.url);
  const nextStage = stages.find(stage => stage.estado !== "completada" && stage.estado !== "cancelada");
  const completedCount = stages.filter(stage => stage.estado === "completada").length;
  const remainingDays = getRemainingDays(project.fecha_termino_estimada);
  const deliveryDate = formatDate(project.fecha_termino_estimada, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50/50">
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-indigo/10 to-transparent" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-teal/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <HardHat className="h-6 w-6 text-brand-teal" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  Portal de seguimiento
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-white/90">
                    {project.constructora?.nombre ?? "SolocasasChile"}
                  </p>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">
                    Acceso protegido
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/seguimiento-de-obras"
                aria-label="Volver a seguimiento de obras"
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid items-end gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
                  {project.nombre}
                </h1>
                <ProjectHealthBadge salud={project.salud} />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/50">
                {project.region && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-teal/70" />
                    {project.region}
                    {project.comuna ? `, ${project.comuna}` : ""}
                  </span>
                )}
                {deliveryDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-teal/70" />
                    Entrega est.: {deliveryDate}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Avance del proyecto
                  </p>
                  <span className="text-4xl font-black text-white">{project.porcentaje_avance}%</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-teal">
                    {completedCount}/{stages.length}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-tighter text-white/30">
                    Etapas completadas
                  </p>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-indigo transition-all duration-1000 ease-out"
                  style={{ width: `${project.porcentaje_avance}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
        <section className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-6 rounded-[2.5rem] border border-border/40 bg-white p-8 text-center shadow-sm shadow-brand-indigo/5 sm:flex-row sm:text-left md:col-span-2">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-brand-teal/10">
              <Clock className="h-8 w-8 text-brand-teal" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Estado actual: {nextStage?.nombre ?? "Finalizado"}
              </p>
              <h2 className="mt-1 font-heading text-xl font-black text-brand-indigo">
                {nextStage ? `Trabajando en: ${nextStage.nombre}` : "Obra terminada"}
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {nextStage?.descripcion ?? "Todas las etapas visibles del proyecto se encuentran completadas."}
              </p>
            </div>
            {remainingDays !== null && remainingDays > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-center">
                <p className="text-2xl font-black text-brand-indigo">{remainingDays}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                  dias para entrega
                </p>
              </div>
            )}
          </div>

          <div className="group flex items-center justify-between rounded-[2.5rem] bg-brand-indigo p-8 text-white transition-colors hover:bg-brand-indigo/90">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 underline transition-all group-hover:text-white">
                Presupuesto y pagos
              </p>
              <p className="text-lg font-bold">Proximamente disponible</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-heading text-2xl font-black tracking-tight">Cronograma de obra</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completada
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo">
                  <Clock className="h-3.5 w-3.5" />
                  En curso
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-white p-10 shadow-sm">
              <HardHat className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 -rotate-12 text-slate-50" />
              <div className="relative z-10">
                {stages.length > 0 ? (
                  <ProjectTimeline stages={stages} />
                ) : (
                  <div className="space-y-4 py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                      <Clock className="h-8 w-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      La constructora todavia no ha publicado etapas visibles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ProjectSpecsClient specs={project.specs ?? []} />
          </div>
        </section>

        <section>
          <div className="mb-8 px-2">
            <h2 className="font-heading text-2xl font-black tracking-tight">Evidencia fotografica</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Registro visual del avance directo en terreno.
            </p>
          </div>

          {recentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {recentPhotos.map((file, index) => (
                <div
                  key={file.id}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-[2rem] border border-border/20 bg-slate-100",
                    index === 0 && "md:col-span-2 md:row-span-2 md:aspect-auto",
                  )}
                >
                  <Image
                    src={file.url ?? ""}
                    alt={file.nombre || "Foto de obra"}
                    fill
                    sizes={index === 0 ? "(min-width: 768px) 50vw, 50vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      {file.nombre}
                    </p>
                    <p className="text-xs font-bold text-white">{formatDate(file.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <ImageIcon className="h-8 w-8 text-slate-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Todavia no hay fotos publicadas</p>
                <p className="text-xs font-medium text-slate-400">
                  Tu constructora subira fotos del avance pronto.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-[2.5rem] border border-border/40 bg-white p-10 shadow-sm">
            <h2 className="flex items-center gap-3 font-heading text-xl font-black tracking-tight">
              <FileText className="h-6 w-6 text-brand-indigo" />
              Documentacion
            </h2>
            {docs.length > 0 ? (
              <div className="divide-y divide-border/10">
                {docs.map(file => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 transition-colors group-hover:bg-brand-indigo/5">
                      <FileText className="h-5 w-5 text-slate-400 transition-colors group-hover:text-brand-indigo" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{file.nombre}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">
                        {formatDate(file.created_at)}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground/30 transition-colors group-hover:text-brand-indigo" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium italic text-muted-foreground">
                No se han compartido documentos tecnicos todavia.
              </p>
            )}
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-brand-teal/20 bg-brand-teal/5 p-10">
            <h2 className="flex items-center gap-3 font-heading text-xl font-black tracking-tight text-brand-teal-dark">
              <Info className="h-6 w-6" />
              Ayuda y soporte
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-medium leading-relaxed text-brand-teal-dark/70">
                Para dudas sobre tiempos, materiales o hitos, contacta directamente al encargado asignado por tu constructora.
              </p>
              <div className="space-y-3 rounded-3xl border border-brand-teal/10 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{project.ejecutivo_responsable ?? "Encargado de obra"}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal">
                      Responsable asignado
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-500">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  La informacion visible depende de lo publicado por la constructora en tu portal.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="space-y-4 border-t border-border/10 py-12 text-center">
          <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
            <HardHat className="h-5 w-5" />
            <p className="font-heading text-xs font-black uppercase tracking-[0.3em]">SolocasasChile</p>
          </div>
          <p className="mx-auto max-w-xl text-[10px] font-medium leading-relaxed text-muted-foreground/40">
            Este portal es una herramienta de transparencia para mejorar la confianza entre constructoras y clientes finales. La informacion presentada es responsabilidad directa de la constructora ejecutante.
          </p>
        </footer>
      </div>
    </main>
  );
}
