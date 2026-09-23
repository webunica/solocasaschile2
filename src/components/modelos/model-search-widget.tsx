"use client";

/**
 * ModelSearchWidget
 * ------------------
 * Widget compacto embebible en cualquier página (homepage, catálogo, etc.).
 * Muestra solo los filtros clave (dormitorios, baños, m²) y redirige
 * al destino con los parámetros seleccionados.
 *
 * Responsivo:
 *   - Mobile: chips apilados por fila
 *   - Tablet (sm): filas horizontales
 *   - Desktop (md+): todo en una sola fila si cabe
 *
 * Uso:
 *   <ModelSearchWidget />
 *   <ModelSearchWidget title="¿Cuántos dormitorios necesitas?" targetPath="/catalogo" />
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Bed, Bath, Square, ArrowRight } from "lucide-react";

const DORMITORIOS = [
  { label: "1",   value: 1 },
  { label: "2",   value: 2 },
  { label: "3",   value: 3 },
  { label: "4+",  value: 4 },
];

const BANOS = [
  { label: "1",  value: 1 },
  { label: "2",  value: 2 },
  { label: "3+", value: 3 },
];

const SUPERFICIES = [
  { label: "–80 m²",      min: undefined, max: 80  },
  { label: "80–100 m²",   min: 80,        max: 100 },
  { label: "100–120 m²",  min: 100,       max: 120 },
  { label: "+120 m²",     min: 120,       max: undefined },
];

interface WidgetState {
  dormitorios?: number;
  banos?: number;
  superficieMin?: number;
  superficieMax?: number;
}

interface Props {
  title?: string;
  subtitle?: string;
  targetPath?: string;
  className?: string;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // base: touch-friendly, no overflow
        "px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-150",
        "cursor-pointer select-none whitespace-nowrap min-w-[44px] text-center",
        // responsive sizing
        "sm:px-3.5 sm:py-2",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.05]"
          : "bg-background border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // Mobile: columna apilada. sm+: fila con label a la izq y chips a la der
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {/* Label con ícono — ancho fijo en sm+ para alinear columnas */}
      <div className="flex items-center gap-1.5 shrink-0 sm:w-28">
        <span className="text-primary/70 shrink-0">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">
          {label}
        </span>
      </div>
      {/* Chips: scroll horizontal en mobile muy estrecho, wrap normal en sm+ */}
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function ModelSearchWidget({
  title = "Encuentra tu casa ideal",
  subtitle = "Filtra por las características que necesitas",
  targetPath = "/buscador",
  className,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<WidgetState>({});

  const toggle = <K extends keyof WidgetState>(key: K, value: WidgetState[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const toggleSuperficie = (min?: number, max?: number) => {
    const isActive = state.superficieMin === min && state.superficieMax === max;
    setState((prev) => ({
      ...prev,
      superficieMin: isActive ? undefined : min,
      superficieMax: isActive ? undefined : max,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (state.dormitorios)    params.set("dormitorios", String(state.dormitorios));
    if (state.banos)          params.set("banos",       String(state.banos));
    if (state.superficieMin !== undefined)  params.set("m2min", String(state.superficieMin));
    if (state.superficieMax !== undefined)  params.set("m2max", String(state.superficieMax));
    router.push(`${targetPath}?${params.toString()}`);
  };

  const hasFilters = Object.values(state).some((v) => v !== undefined);

  return (
    <div
      className={cn(
        "w-full rounded-[1.75rem] border border-border/50",
        "bg-card/90 backdrop-blur-xl shadow-xl shadow-black/8",
        // padding responsivo
        "p-5 sm:p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-5">
        <h3 className="font-heading font-black text-lg sm:text-xl tracking-tight text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary shrink-0" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
      </div>

      {/* Grupos de filtros — separados con divisor en sm+ */}
      <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-border/30">
        <div className="sm:pb-3">
          <FilterGroup icon={<Bed className="w-3.5 h-3.5" />} label="Dormitorios">
            {DORMITORIOS.map((d) => (
              <Chip
                key={d.value}
                active={state.dormitorios === d.value}
                onClick={() => toggle("dormitorios", d.value)}
              >
                {d.label}
              </Chip>
            ))}
          </FilterGroup>
        </div>

        <div className="sm:py-3">
          <FilterGroup icon={<Bath className="w-3.5 h-3.5" />} label="Baños">
            {BANOS.map((b) => (
              <Chip
                key={b.value}
                active={state.banos === b.value}
                onClick={() => toggle("banos", b.value)}
              >
                {b.label}
              </Chip>
            ))}
          </FilterGroup>
        </div>

        <div className="sm:pt-3">
          <FilterGroup icon={<Square className="w-3.5 h-3.5" />} label="Superficie">
            {SUPERFICIES.map((s) => (
              <Chip
                key={s.label}
                active={state.superficieMin === s.min && state.superficieMax === s.max}
                onClick={() => toggleSuperficie(s.min, s.max)}
              >
                {s.label}
              </Chip>
            ))}
          </FilterGroup>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 sm:mt-5">
        <Button
          onClick={handleSearch}
          // full-width en mobile, auto en sm+
          className={cn(
            "w-full sm:w-auto rounded-2xl font-black text-xs uppercase tracking-widest",
            "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all",
            "min-h-[44px] px-6"
          )}
        >
          {hasFilters ? (
            <>
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Buscar modelos
            </>
          ) : (
            <>
              Ver todos los modelos
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
