import { ProjectLiveCard } from "./project-live-card";
import type { PublicConstructoraProject } from "@/lib/supabase/services";

type ProjectShowcaseGridProps = {
  projects: PublicConstructoraProject[];
  constructoraNombre: string;
};

export function ProjectShowcaseGrid({
  projects,
  constructoraNombre,
}: ProjectShowcaseGridProps) {
  if (!projects.length) return null;

  const activeProjects = projects.filter((project) => project.estado !== "completado");
  const finishedProjects = projects.filter((project) => project.estado === "completado");

  return (
    <section className="space-y-12" aria-labelledby="project-showcase-heading">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Obra viva
          </p>
          <h2
            id="project-showcase-heading"
            className="font-heading text-3xl font-black italic tracking-tighter md:text-4xl"
          >
            Proyectos recientes
          </h2>
          <p className="font-medium text-muted-foreground">
            Conoce avances reales de obras ejecutadas por {constructoraNombre}.
          </p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {activeProjects.length} en curso
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {finishedProjects.length} finalizadas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectLiveCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
