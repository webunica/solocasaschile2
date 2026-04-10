import { cn } from "@/lib/utils";
import type { ObraStageEstado } from "@/types/obra";

const CONFIG: Record<ObraStageEstado, { label: string; bg: string; text: string; border: string }> = {
  pendiente:      { label: "Pendiente",       bg: "bg-slate-100",    text: "text-slate-600",   border: "border-slate-200"   },
  en_preparacion: { label: "En preparación",  bg: "bg-blue-50",      text: "text-blue-600",    border: "border-blue-200"    },
  en_curso:       { label: "En curso",        bg: "bg-brand-teal/10",text: "text-brand-teal",  border: "border-brand-teal/30"},
  pausada:        { label: "Pausada",         bg: "bg-amber-50",     text: "text-amber-600",   border: "border-amber-200"   },
  retrasada:      { label: "Retrasada",       bg: "bg-red-50",       text: "text-red-600",     border: "border-red-200"     },
  completada:     { label: "Completada",      bg: "bg-emerald-50",   text: "text-emerald-700", border: "border-emerald-200" },
  cancelada:      { label: "Cancelada",       bg: "bg-slate-50",     text: "text-slate-400",   border: "border-slate-200"   },
};

export function StageStatusBadge({ estado }: { estado: ObraStageEstado }) {
  const c = CONFIG[estado];
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
      c.bg, c.text, c.border
    )}>
      {c.label}
    </span>
  );
}

export function getStageColor(estado: ObraStageEstado): string {
  const barColors: Record<ObraStageEstado, string> = {
    pendiente:      "bg-slate-200",
    en_preparacion: "bg-blue-300",
    en_curso:       "bg-brand-teal",
    pausada:        "bg-amber-400",
    retrasada:      "bg-red-400",
    completada:     "bg-emerald-500",
    cancelada:      "bg-slate-300",
  };
  return barColors[estado];
}
