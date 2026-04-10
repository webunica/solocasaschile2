import { CheckCircle2, Circle, Clock, AlertCircle, XCircle, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ObraStage, ObraStageEstado } from "@/types/obra";

const ESTADO_CONFIG: Record<ObraStageEstado, {
  icon: React.ElementType;
  iconClass: string;
  lineClass: string;
  dot: string;
}> = {
  completada:     { icon: CheckCircle2, iconClass: "text-emerald-500",  lineClass: "bg-emerald-400",   dot: "bg-emerald-500 ring-emerald-200" },
  en_curso:       { icon: Clock,        iconClass: "text-brand-teal",   lineClass: "bg-brand-teal/40", dot: "bg-brand-teal ring-brand-teal/30 animate-pulse" },
  en_preparacion: { icon: Clock,        iconClass: "text-blue-500",     lineClass: "bg-slate-200",     dot: "bg-blue-400 ring-blue-100" },
  retrasada:      { icon: AlertCircle,  iconClass: "text-red-500",      lineClass: "bg-red-200",       dot: "bg-red-500 ring-red-200" },
  pausada:        { icon: PauseCircle,  iconClass: "text-amber-500",    lineClass: "bg-amber-200",     dot: "bg-amber-400 ring-amber-100" },
  cancelada:      { icon: XCircle,      iconClass: "text-slate-400",    lineClass: "bg-slate-100",     dot: "bg-slate-300 ring-slate-100" },
  pendiente:      { icon: Circle,       iconClass: "text-slate-300",    lineClass: "bg-slate-100",     dot: "bg-slate-200 ring-slate-100" },
};

export function ProjectTimeline({ stages }: { stages: ObraStage[] }) {
  const visible = stages.filter(s => s.visible_cliente).sort((a, b) => a.orden - b.orden);

  return (
    <div className="space-y-0">
      {visible.map((stage, i) => {
        const cfg = ESTADO_CONFIG[stage.estado];
        const Icon = cfg.icon;
        const isLast = i === visible.length - 1;

        return (
          <div key={stage.id} className="flex gap-4 group">
            {/* Left: icon + vertical line */}
            <div className="flex flex-col items-center shrink-0">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center ring-4 shrink-0 transition-all",
                cfg.dot
              )}>
                <Icon className={cn("w-4 h-4 text-white shrink-0")} />
              </div>
              {!isLast && (
                <div className={cn("w-0.5 flex-1 mt-1 mb-1 min-h-[32px]", cfg.lineClass)} />
              )}
            </div>

            {/* Right: content */}
            <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn(
                      "text-sm font-black leading-tight",
                      stage.estado === 'completada' ? "text-foreground" : 
                      stage.estado === 'en_curso'   ? "text-brand-indigo" : "text-muted-foreground"
                    )}>
                      {stage.nombre}
                    </p>
                    {stage.descripcion && (
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5 line-clamp-2 opacity-70">
                        {stage.descripcion}
                      </p>
                    )}
                  </div>
                  {/* Fecha */}
                  <div className="text-right shrink-0">
                    {stage.fecha_termino_real ? (
                      <p className="text-[10px] font-black text-emerald-600">
                        ✓ {new Date(stage.fecha_termino_real).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                      </p>
                    ) : stage.fecha_termino_estimada ? (
                      <p className="text-[10px] font-bold text-muted-foreground opacity-60">
                        ~{new Date(stage.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Progress bar inline (solo si está en curso) */}
                {(stage.estado === 'en_curso' || stage.estado === 'en_preparacion') && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-teal rounded-full transition-all duration-700"
                        style={{ width: `${stage.porcentaje_avance}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-brand-teal tabular-nums">
                      {stage.porcentaje_avance}%
                    </span>
                  </div>
                )}

                {/* Observaciones */}
                {stage.observaciones && (
                  <p className="text-[11px] text-muted-foreground italic border-l-2 border-brand-teal/30 pl-2 mt-1 opacity-80">
                    {stage.observaciones}
                  </p>
                )}

                {/* Retraso */}
                {stage.tiene_retraso && stage.motivo_retraso && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    ⚠ {stage.motivo_retraso}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
