import { ProjectLiveCard } from "./project-live-card";
import { Building2, Plus } from "lucide-react";

interface ProjectShowcaseGridProps {
  projects: any[];
  constructoraNombre: string;
}

export function ProjectShowcaseGrid({ projects, constructoraNombre }: ProjectShowcaseGridProps) {
  const activeProjects = projects.filter(p => p.estado !== 'completado');
  const finishedProjects = projects.filter(p => p.estado === 'completado');

  if (projects.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Obra Viva</p>
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter italic">Proyectos Recientes</h2>
          <p className="text-muted-foreground font-medium">Conoce el avance real de las obras ejecutadas por {constructoraNombre}</p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> {activeProjects.length} En Curso
           </div>
           <div className="flex items-center gap-2 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {finishedProjects.length} Finalizadas
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectLiveCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
