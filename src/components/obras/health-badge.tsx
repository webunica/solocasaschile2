import { cn } from "@/lib/utils";
import type { ObraProjectSalud } from "@/types/obra";

const CONFIG: Record<ObraProjectSalud, { label: string; dot: string; bg: string; text: string }> = {
  verde:    { label: "En tiempo",       dot: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-700" },
  amarillo: { label: "Leve desviación", dot: "bg-amber-400",   bg: "bg-amber-400/10",   text: "text-amber-700"   },
  rojo:     { label: "Retraso crítico", dot: "bg-red-500",     bg: "bg-red-500/10",     text: "text-red-700"     },
};

export function ProjectHealthBadge({
  salud,
  size = "md",
}: {
  salud: ObraProjectSalud;
  size?: "sm" | "md";
}) {
  const c = CONFIG[salud];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest",
        c.bg, c.text,
        size === "sm" ? "px-2.5 py-1 text-[8px]" : "px-3 py-1.5 text-[10px]"
      )}
    >
      <span className={cn("rounded-full shrink-0 animate-pulse", c.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {c.label}
    </div>
  );
}
