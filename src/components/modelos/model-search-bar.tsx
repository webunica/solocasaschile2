"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Bed, Bath, Square, Home, Trees, X } from "lucide-react";

/* ── Opciones de filtro ─────────────────────────────────────────────────── */

const DORMITORIOS = [
  { label: "1 dorm.", value: 1 },
  { label: "2 dorm.", value: 2 },
  { label: "3 dorm.", value: 3 },
  { label: "4+",      value: 4 },
];

const BANOS = [
  { label: "1 baño",  value: 1 },
  { label: "2 baños", value: 2 },
  { label: "3+",      value: 3 },
];

const SUPERFICIES = [
  { label: "Hasta 80 m²",  min: undefined, max: 80  },
  { label: "80 – 100 m²",  min: 80,        max: 100 },
  { label: "100 – 120 m²", min: 100,       max: 120 },
  { label: "Más de 120 m²",min: 120,       max: undefined },
];

const TIPOS = [
  { label: "Prefabricada",   value: "prefabricada",   icon: "🏠" },
  { label: "Panel SIP",      value: "sip",             icon: "🧱" },
  { label: "Modular",        value: "modular",         icon: "📦" },
  { label: "Steel Framing",  value: "steel-framing",   icon: "⚙️" },
  { label: "Madera",         value: "madera",          icon: "🌲" },
];

const USOS = [
  { label: "Vivienda familiar", value: "vivienda",  icon: <Home className="w-4 h-4" /> },
  { label: "Campo / Parcela",   value: "parcela",   icon: <Trees className="w-4 h-4" /> },
  { label: "Cabaña / Refugio",  value: "cabaña",    icon: "🏕️" },
];

/* ── Tipos ──────────────────────────────────────────────────────────────── */

interface SearchState {
  dormitorios?: number;
  banos?: number;
  superficieMin?: number;
  superficieMax?: number;
  tipo?: string;
  uso?: string;
}

interface Props {
  /** Modo compacto para widget embebido */
  compact?: boolean;
  /** Valores iniciales (para hidratación desde URL) */
  initialValues?: SearchState;
  /** Destino al buscar. Default: /catalogo */
  targetPath?: string;
}

/* ── Pill genérica ──────────────────────────────────────────────────────── */

function Pill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-2xl text-sm font-semibold border transition-all duration-200 cursor-pointer select-none",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.04]"
          : "bg-background/60 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/60",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ── Sección de filtro ──────────────────────────────────────────────────── */

function FilterSection({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────────────── */

export function ModelSearchBar({
  compact = false,
  initialValues = {},
  targetPath = "/buscador",
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<SearchState>(initialValues);

  const hasFilters = Object.values(state).some((v) => v !== undefined);

  const update = <K extends keyof SearchState>(
    key: K,
    value: SearchState[K] | undefined
  ) => {
    setState((prev) => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key]; // toggle off
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const updateSuperficie = (min?: number, max?: number) => {
    const alreadyActive =
      state.superficieMin === min && state.superficieMax === max;
    setState((prev) => ({
      ...prev,
      superficieMin: alreadyActive ? undefined : min,
      superficieMax: alreadyActive ? undefined : max,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (state.dormitorios !== undefined)
      params.set("dormitorios", String(state.dormitorios));
    if (state.banos !== undefined)
      params.set("banos", String(state.banos));
    if (state.superficieMin !== undefined)
      params.set("m2min", String(state.superficieMin));
    if (state.superficieMax !== undefined)
      params.set("m2max", String(state.superficieMax));
    if (state.tipo) params.set("tipo", state.tipo);
    if (state.uso)  params.set("uso",  state.uso);
    router.push(`${targetPath}?${params.toString()}`);
  };

  const handleClear = () => setState({});

  return (
    <div
      className={cn(
        "w-full rounded-[2rem] border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/10",
        compact ? "p-5" : "p-7 md:p-10"
      )}
    >
      <div className={cn("space-y-6", compact && "space-y-4")}>
        {/* Dormitorios */}
        <FilterSection icon={<Bed className="w-4 h-4" />} label="Dormitorios">
          {DORMITORIOS.map((d) => (
            <Pill
              key={d.value}
              active={state.dormitorios === d.value}
              onClick={() => update("dormitorios", d.value)}
            >
              {d.label}
            </Pill>
          ))}
        </FilterSection>

        {/* Baños */}
        <FilterSection icon={<Bath className="w-4 h-4" />} label="Baños">
          {BANOS.map((b) => (
            <Pill
              key={b.value}
              active={state.banos === b.value}
              onClick={() => update("banos", b.value)}
            >
              {b.label}
            </Pill>
          ))}
        </FilterSection>

        {/* Superficie */}
        <FilterSection icon={<Square className="w-4 h-4" />} label="Metros cuadrados">
          {SUPERFICIES.map((s) => (
            <Pill
              key={s.label}
              active={
                state.superficieMin === s.min && state.superficieMax === s.max
              }
              onClick={() => updateSuperficie(s.min, s.max)}
            >
              {s.label}
            </Pill>
          ))}
        </FilterSection>

        {/* Tipo de construcción */}
        {!compact && (
          <FilterSection icon={<span className="text-base">🏗️</span>} label="Tipo de construcción">
            {TIPOS.map((t) => (
              <Pill
                key={t.value}
                active={state.tipo === t.value}
                onClick={() => update("tipo", t.value)}
              >
                <span className="flex items-center gap-1.5">
                  <span>{t.icon}</span>
                  {t.label}
                </span>
              </Pill>
            ))}
          </FilterSection>
        )}

        {/* Uso */}
        {!compact && (
          <FilterSection icon={<Home className="w-4 h-4" />} label="Uso principal">
            {USOS.map((u) => (
              <Pill
                key={u.value}
                active={state.uso === u.value}
                onClick={() => update("uso", u.value)}
              >
                <span className="flex items-center gap-1.5">
                  {typeof u.icon === "string" ? u.icon : u.icon}
                  {u.label}
                </span>
              </Pill>
            ))}
          </FilterSection>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSearch}
            size={compact ? "default" : "lg"}
            className="flex-1 rounded-2xl font-black tracking-wide text-sm uppercase shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar modelos
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size={compact ? "default" : "lg"}
              onClick={handleClear}
              className="rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
