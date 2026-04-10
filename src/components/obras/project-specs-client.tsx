"use client";

import { ObraProjectSpec } from "@/types/obra";
import { CheckCircle2, CircleDashed, Clock, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ESTADO_ICONS: Record<string, React.ReactNode> = {
  pendiente: <CircleDashed className="w-3.5 h-3.5 text-slate-300" />,
  esperando_materiales: <PackageOpen className="w-3.5 h-3.5 text-amber-500" />,
  en_proceso: <Clock className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />,
  finalizado: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Por iniciar",
  esperando_materiales: "Esperando materiales",
  en_proceso: "En proceso de instalación",
  finalizado: "Instalado"
};

export function ProjectSpecsClient({ specs }: { specs: ObraProjectSpec[] }) {
  if (!specs || specs.length === 0) return null;

  // Agrupar por categoría
  const grouped = specs.reduce((acc, spec) => {
    if (!acc[spec.categoria]) acc[spec.categoria] = [];
    acc[spec.categoria].push(spec);
    return acc;
  }, {} as Record<string, ObraProjectSpec[]>);

  return (
    <div className="p-8 rounded-[2rem] bg-white border border-border/40 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-lg tracking-tight">Especificaciones y Materiales</h2>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Detalle Técnico</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([categoria, items]) => {
          const total = items.length;
          const completados = items.filter(i => i.estado === 'finalizado').length;
          const porcentaje = Math.round((completados / total) * 100);

          return (
            <div key={categoria} className="space-y-4">
              <div className="flex items-end justify-between px-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-indigo/60">{categoria}</p>
                  <p className="text-sm font-bold text-foreground">{porcentaje}% completado</p>
                </div>
                <span className="text-xs font-black text-muted-foreground/40">{completados}/{total}</span>
              </div>
              
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    porcentaje === 100 ? "bg-emerald-500" : "bg-brand-indigo"
                  )} 
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <div className="space-y-2 bg-slate-50/50 rounded-2xl p-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-start gap-3 py-1.5 last:border-0 border-b border-slate-200/30">
                    <div className="mt-0.5 shrink-0">
                      {ESTADO_ICONS[item.estado]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{item.elemento}</p>
                      <p className="text-[10px] font-medium text-slate-500 truncate">{item.valor}</p>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.05em] px-1.5 py-0.5 rounded-md inline-block mt-1",
                        item.estado === 'finalizado' ? "bg-emerald-50 text-emerald-600" :
                        item.estado === 'en_proceso' ? "bg-brand-indigo/5 text-brand-indigo" :
                        item.estado === 'esperando_materiales' ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-400"
                      )}>
                        {ESTADO_LABELS[item.estado]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
