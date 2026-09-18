"use client";

import { useState, useMemo } from "react";
import { 
  TrendingUp, Search, X, CheckCircle2, 
  Building2, ArrowUpDown 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  type ConstructoraUnificada, 
  type TipoCasaConstructora,
  TIPOS_CASA_CONSTRUCTORA,
  getTiposCasaConstructora
} from "@/lib/constructoras-data";
import { RegionConstructoraCard } from "./region-constructora-card";

interface Props {
  constructoras: ConstructoraUnificada[];
  regionNombre: string;
}

export function RegionConstructorasClient({ constructoras, regionNombre }: Props) {
  const [selectedTipo, setSelectedTipo] = useState<TipoCasaConstructora>("todas");
  const [search, setSearch] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"ranking" | "rating" | "name">("ranking");

  // Mapear cada constructora con sus tipologías detectadas (para filtrar súper rápido)
  const itemsWithTypes = useMemo(() => {
    return constructoras.map((c) => ({
      constructora: c,
      tipos: getTiposCasaConstructora(c),
    }));
  }, [constructoras]);

  // Conteo en vivo de empresas por tipología en esta región
  const countsByTipo = useMemo(() => {
    const counts: Record<string, number> = {
      todas: constructoras.length,
      prefabricadas: 0,
      sip: 0,
      modulares: 0,
      containers: 0,
      "tiny-house": 0,
    };

    for (const item of itemsWithTypes) {
      for (const t of item.tipos) {
        if (counts[t] !== undefined) {
          counts[t]++;
        }
      }
    }

    return counts;
  }, [constructoras.length, itemsWithTypes]);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return itemsWithTypes.filter(({ constructora: c, tipos }) => {
      // Filtro por tipo de casa
      if (selectedTipo !== "todas" && !tipos.includes(selectedTipo)) {
        return false;
      }

      // Filtro por verificación
      if (onlyVerified && !c.verificada) {
        return false;
      }

      // Filtro por búsqueda de texto
      if (q) {
        const matchName = c.nombre.toLowerCase().includes(q);
        const matchDesc = c.descripcion?.toLowerCase().includes(q);
        const matchDir = c.direccion?.toLowerCase().includes(q);
        const matchPhone = c.telefono?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDir && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [itemsWithTypes, selectedTipo, onlyVerified, search]);

  // Ordenación
  const sorted = useMemo(() => {
    const list = [...filtered];

    if (sortBy === "rating") {
      list.sort((a, b) => (b.constructora.rating ?? 0) - (a.constructora.rating ?? 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.constructora.nombre.localeCompare(b.constructora.nombre));
    } else {
      // default: ranking original ya ordenado por plan y rating
    }

    return list;
  }, [filtered, sortBy]);

  const hasActiveFilters = selectedTipo !== "todas" || onlyVerified || search.trim() !== "" || sortBy !== "ranking";

  const handleResetFilters = () => {
    setSelectedTipo("todas");
    setOnlyVerified(false);
    setSearch("");
    setSortBy("ranking");
  };

  return (
    <div className="space-y-8">
      {/* ─── Encabezado de la sección de Ranking ────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0"
            aria-hidden
          >
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black tracking-tight">
              Ranking de Constructoras — {regionNombre}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Ordenadas por rating Google Maps, tipología constructiva y nivel de verificación
            </p>
          </div>
        </div>

        {/* Buscador rápido */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar en ${regionNombre}...`}
            className="pl-10 pr-9 h-11 bg-card/80 border-border/60 rounded-2xl text-xs shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Filtros por Tipo de Casa (Pills) ─────────────────────────── */}
      <div className="bg-card/70 border border-border/50 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Pills de tipología */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1.5 shrink-0">
              Tipo de casa:
            </span>
            {TIPOS_CASA_CONSTRUCTORA.map((tipo) => {
              const count = countsByTipo[tipo.id] ?? 0;
              const isSelected = selectedTipo === tipo.id;

              return (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setSelectedTipo(tipo.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border",
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border-border/40"
                  )}
                >
                  <span>{tipo.emoji}</span>
                  <span>{tipo.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-black",
                      isSelected
                        ? "bg-white/20 dark:bg-black/20 text-inherit"
                        : "bg-background/80 text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Opciones secundarias: Solo verificadas + Orden */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border",
                onlyVerified
                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                  : "bg-muted/40 text-muted-foreground border-border/40 hover:text-foreground"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Solo Verificadas</span>
            </button>

            <div className="flex items-center gap-1.5 bg-muted/40 border border-border/40 rounded-xl px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "ranking" | "rating" | "name")}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="ranking">Ranking oficial</option>
                <option value="rating">Mejor rating ★</option>
                <option value="name">Alfabético (A-Z)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-xl"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Resumen de conteo */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
          <p>
            Mostrando <strong className="text-foreground">{sorted.length}</strong> de{" "}
            <strong>{constructoras.length}</strong> empresas en {regionNombre}
            {selectedTipo !== "todas" && (
              <>
                {" "}especializadas en{" "}
                <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0 ml-1">
                  {TIPOS_CASA_CONSTRUCTORA.find((t) => t.id === selectedTipo)?.label}
                </Badge>
              </>
            )}
          </p>
        </div>
      </div>

      {/* ─── Grid de Constructoras ───────────────────────────────────── */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(({ constructora }, i) => (
            <RegionConstructoraCard
              key={constructora.slug}
              constructora={constructora}
              rank={i + 1}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 border-2 border-dashed border-border/40 rounded-3xl bg-card/30 p-8">
          <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto" />
          <h3 className="text-xl font-heading font-black text-foreground">
            No encontramos constructoras para este filtro en {regionNombre}
          </h3>
          <p className="text-muted-foreground text-xs max-w-md mx-auto">
            Prueba seleccionando otra tipología de casa o limpiando los términos de búsqueda.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="rounded-xl text-xs font-bold mt-2"
          >
            Ver todas las tipologías ({constructoras.length})
          </Button>
        </div>
      )}
    </div>
  );
}
