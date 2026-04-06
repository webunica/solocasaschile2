import { ShieldCheck, Zap, Image, Building2, Clock, Calendar, CheckCircle2, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Sello {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  tipo: "automatico" | "manual";
  icono_url?: string | null;
}

interface SellosGridProps {
  /** Lista de sellos aprobados ya enriquecidos con el catálogo */
  sellos: { sello: Sello | null }[];
  /** Muestra todos los sellos o solo los primeros 3 (para tarjetas) */
  compact?: boolean;
  className?: string;
}

// Mapa: slug → ícono y color con alto contraste
const SELLO_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "perfil-completo": {
    icon: <Building2 className="w-4 h-4" />,
    color: "text-indigo-800 dark:text-indigo-300",
    bg: "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700/50",
  },
  "empresa-activa": {
    icon: <Zap className="w-4 h-4" />,
    color: "text-teal-800 dark:text-teal-300",
    bg: "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700/50",
  },
  "especialidad-definida": {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-emerald-800 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700/50",
  },
  "fotos-reales": {
    icon: <Image className="w-4 h-4" />,
    color: "text-sky-800 dark:text-sky-300",
    bg: "bg-sky-100 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700/50",
  },
  "experiencia-10-anos": {
    icon: <Clock className="w-4 h-4" />,
    color: "text-amber-800 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50",
  },
  "fechas-obra": {
    icon: <Calendar className="w-4 h-4" />,
    color: "text-violet-800 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700/50",
  },
  "empresa-verificada": {
    icon: <BadgeCheck className="w-4 h-4" />,
    color: "text-indigo-800 dark:text-indigo-300",
    bg: "bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700/50",
  },
  "info-comercial-validada": {
    icon: <ShieldCheck className="w-4 h-4" />,
    color: "text-teal-800 dark:text-teal-300",
    bg: "bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700/50",
  },
};

const DEFAULT_META = {
  icon: <ShieldCheck className="w-4 h-4" />,
  color: "text-muted-foreground",
  bg: "bg-muted/30 border-border/60",
};

export function SellosGrid({ sellos, compact = false, className }: SellosGridProps) {
  const validSellos = sellos.filter(s => !!s.sello).map(s => s.sello as Sello);

  // Primero los manuales (más confiables), luego automáticos
  const sorted = [
    ...validSellos.filter(s => s.tipo === "manual"),
    ...validSellos.filter(s => s.tipo === "automatico"),
  ];

  const displayed = compact ? sorted.slice(0, 3) : sorted;
  const extraCount = compact && sorted.length > 3 ? sorted.length - 3 : 0;

  if (displayed.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayed.map(sello => {
        const meta = SELLO_META[sello.slug] ?? DEFAULT_META;
        const isManual = sello.tipo === "manual";

        return (
          <div
            key={sello.id}
            title={sello.descripcion}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black tracking-wide transition-all hover:scale-105 cursor-default select-none",
              meta.bg,
              meta.color,
              // verified seals get a subtle ring
              isManual && "ring-1 ring-inset ring-current/20"
            )}
          >
            <span className="shrink-0">{meta.icon}</span>
            <span>{sello.nombre}</span>
            {isManual && (
              <BadgeCheck className="w-3 h-3 ml-0.5 opacity-70" />
            )}
          </div>
        );
      })}

      {extraCount > 0 && (
        <div className="flex items-center px-3 py-1.5 rounded-full border border-border/40 bg-muted/20 text-[10px] font-black text-muted-foreground">
          +{extraCount} más
        </div>
      )}
    </div>
  );
}
