import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, CheckCircle2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectLiveCardProps {
  project: {
    id: string;
    nombre: string;
    region: string;
    comuna: string;
    estado: string;
    porcentaje_avance: number;
    thumbnail_url: string | null;
    tipo_construccion: string | null;
  };
}

export function ProjectLiveCard({ project }: ProjectLiveCardProps) {
  const isCompleted = project.estado === 'completado' || project.porcentaje_avance === 100;
  
  const statusColors: Record<string, string> = {
    planificacion: "bg-blue-500",
    en_curso: "bg-amber-500",
    pausado: "bg-slate-400",
    completado: "bg-emerald-500",
    cancelado: "bg-red-500",
  };

  const statusLabels: Record<string, string> = {
    planificacion: "En Planificación",
    en_curso: "En Ejecución",
    pausado: "Obra Pausada",
    completado: "Obra Terminada",
    cancelado: "Cancelado",
  };

  return (
    <Link 
      href={`/seguimiento/${project.id}`} 
      className="group relative bg-card border border-border/40 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image / Thumbnail Container */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {project.thumbnail_url ? (
          <Image 
            src={project.thumbnail_url} 
            alt={project.nombre} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 gap-2">
            <Home className="w-10 h-10" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin registro visual</span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge className={cn(
            "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-lg",
            statusColors[project.estado] || "bg-primary"
          )}>
            {statusLabels[project.estado] || project.estado}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-1">
             <MapPin className="w-3.5 h-3.5 text-primary" /> {project.comuna}, {project.region}
          </div>
          <h3 className="text-white font-black text-lg leading-tight tracking-tight line-clamp-1">
            {project.nombre}
          </h3>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Avance de Obra</span>
            <span className={cn(isCompleted ? "text-emerald-500" : "text-primary")}>
              {project.porcentaje_avance}%
            </span>
          </div>
          <Progress 
            value={project.porcentaje_avance} 
            className="h-2 rounded-full bg-muted shadow-inner" 
            indicatorClassName={cn(isCompleted ? "bg-emerald-500" : "bg-primary")}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
           <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isCompleted ? "bg-emerald-500" : "bg-primary animate-pulse"
              )} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                {isCompleted ? "Proyecto Entregado" : "Actualizado hoy"}
              </span>
           </div>
           {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
      </div>
    </Link>
  );
}
