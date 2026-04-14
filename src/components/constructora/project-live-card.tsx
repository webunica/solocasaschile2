import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Home, MapPin } from "lucide-react";
import type { PublicConstructoraProject } from "@/lib/supabase/services";

type ProjectLiveCardProps = {
  project: PublicConstructoraProject;
};

const STATUS_STYLES: Record<string, string> = {
  planificacion: "bg-blue-500",
  en_curso: "bg-amber-500",
  pausado: "bg-slate-400",
  completado: "bg-emerald-500",
  cancelado: "bg-red-500",
};

const STATUS_LABELS: Record<string, string> = {
  planificacion: "En planificacion",
  en_curso: "En ejecucion",
  pausado: "Obra pausada",
  completado: "Obra terminada",
  cancelado: "Cancelado",
};

export function ProjectLiveCard({ project }: ProjectLiveCardProps) {
  const progress = Math.max(0, Math.min(100, project.porcentaje_avance ?? 0));
  const isCompleted = project.estado === "completado" || progress === 100;
  const location = [project.comuna, project.region].filter(Boolean).join(", ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/40 bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
            <Home className="h-10 w-10" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Sin registro visual
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4">
          <Badge
            className={cn(
              "rounded-full border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg",
              STATUS_STYLES[project.estado] || "bg-primary",
            )}
          >
            {STATUS_LABELS[project.estado] || project.estado}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          {location && (
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/90">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {location}
            </div>
          )}
          <h3 className="line-clamp-1 text-lg font-black leading-tight tracking-tight text-white">
            {project.nombre}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Avance de obra</span>
            <span className={cn(isCompleted ? "text-emerald-500" : "text-primary")}>
              {progress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted shadow-inner">
            <div
              className={cn("h-full rounded-full", isCompleted ? "bg-emerald-500" : "bg-primary")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                isCompleted ? "bg-emerald-500" : "animate-pulse bg-primary",
              )}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              {isCompleted ? "Proyecto entregado" : "Obra en seguimiento"}
            </span>
          </div>
          {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        </div>
      </div>
    </article>
  );
}
