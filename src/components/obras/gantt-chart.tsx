import type { ObraStage } from "@/types/obra";
import { getStageColor } from "./stage-status-badge";
import { cn } from "@/lib/utils";

interface GanttChartProps {
  stages: ObraStage[];
  className?: string;
}

function getDateRange(stages: ObraStage[]) {
  const dates = stages
    .flatMap(s => [
      s.fecha_inicio_estimada,
      s.fecha_termino_estimada,
      s.fecha_inicio_real,
      s.fecha_termino_real,
    ])
    .filter(Boolean)
    .map(d => new Date(d!).getTime());

  if (!dates.length) return { min: new Date(), range: 90 };
  const min = new Date(Math.min(...dates));
  const max = new Date(Math.max(...dates));
  const range = Math.max(
    Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)) + 14,
    30
  );
  return { min, range };
}

function pct(date: string | null, min: Date, range: number): number {
  if (!date) return 0;
  const d = new Date(date);
  return Math.max(0, Math.min(100,
    ((d.getTime() - min.getTime()) / (1000 * 60 * 60 * 24 * range)) * 100
  ));
}

function width(start: string | null, end: string | null, min: Date, range: number): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.max(1, ((e - s) / (1000 * 60 * 60 * 24 * range)) * 100);
}

export function GanttChart({ stages, className }: GanttChartProps) {
  if (!stages.length) return null;

  const { min, range } = getDateRange(stages);
  const today = new Date();
  const todayPct = pct(today.toISOString().split('T')[0], min, range);

  // Construir ticks de encabezado mensual
  const headerTicks: { label: string; left: number }[] = [];
  const cursor = new Date(min);
  cursor.setDate(1);
  while (cursor.getTime() < min.getTime() + range * 24 * 60 * 60 * 1000) {
    const left = pct(cursor.toISOString().split('T')[0], min, range);
    if (left >= 0 && left <= 100) {
      headerTicks.push({
        label: cursor.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' }),
        left,
      });
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="min-w-[700px]">
        {/* Header de meses */}
        <div className="relative h-8 mb-2 border-b border-border/40">
          {headerTicks.map((t, i) => (
            <span
              key={i}
              className="absolute text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60"
              style={{ left: `${t.left}%` }}
            >
              {t.label}
            </span>
          ))}
          {/* Línea de hoy */}
          {todayPct > 0 && todayPct < 100 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-red-400/80 z-10"
              style={{ left: `${todayPct}%` }}
            />
          )}
        </div>

        {/* Filas de etapas */}
        <div className="space-y-2">
          {stages.map((stage, i) => {
            const estLeft  = pct(stage.fecha_inicio_estimada, min, range);
            const estWidth = width(stage.fecha_inicio_estimada, stage.fecha_termino_estimada, min, range);
            const realLeft  = pct(stage.fecha_inicio_real, min, range);
            const realWidth = width(stage.fecha_inicio_real, stage.fecha_termino_real, min, range);
            const barColor  = getStageColor(stage.estado);

            return (
              <div key={stage.id} className="flex items-center gap-3 group">
                {/* Nombre */}
                <div className="w-36 shrink-0 text-right">
                  <span className="text-[11px] font-bold text-foreground leading-tight line-clamp-1 group-hover:text-brand-indigo transition-colors">
                    {i + 1}. {stage.nombre}
                  </span>
                </div>

                {/* Barra */}
                <div className="relative flex-1 h-7 bg-slate-100 rounded-full overflow-visible">
                  {/* Barra estimada (fondo traslúcido) */}
                  {estWidth > 0 && (
                    <div
                      className="absolute top-1 h-5 rounded-full bg-slate-300/60 border border-slate-300"
                      style={{ left: `${estLeft}%`, width: `${estWidth}%` }}
                    />
                  )}
                  {/* Barra real / avance */}
                  {realWidth > 0 ? (
                    <div
                      className={cn("absolute top-0 h-7 rounded-full opacity-90 transition-all", barColor)}
                      style={{ left: `${realLeft}%`, width: `${realWidth}%` }}
                      title={`${stage.nombre}: ${stage.porcentaje_avance}% completado`}
                    />
                  ) : stage.porcentaje_avance > 0 ? (
                    <div
                      className={cn("absolute top-0 h-7 rounded-full opacity-80 transition-all", barColor)}
                      style={{ left: `${estLeft}%`, width: `${estLeft + (estWidth * stage.porcentaje_avance / 100)}%` }}
                    />
                  ) : null}
                  {/* Línea de hoy */}
                  {todayPct > 0 && todayPct < 100 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-400/60 z-10"
                      style={{ left: `${todayPct}%` }}
                    />
                  )}
                </div>

                {/* % avance */}
                <div className="w-10 text-right shrink-0">
                  <span className="text-[11px] font-black text-muted-foreground">
                    {stage.porcentaje_avance}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/20">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
            <div className="w-4 h-2 rounded bg-slate-300/60 border border-slate-300" />
            Planificado
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
            <div className="w-4 h-2 rounded bg-brand-teal" />
            Real
          </div>
          <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold">
            <div className="w-px h-4 bg-red-400" />
            Hoy
          </div>
        </div>
      </div>
    </div>
  );
}
