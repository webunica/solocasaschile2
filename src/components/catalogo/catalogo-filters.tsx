"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CONSTRUCTION_SYSTEMS } from "@/config/construction-systems";
import type { TipoModelo } from "@/lib/mock-data";
import { slugifyRegion } from "@/lib/regions";

const TIPOS = CONSTRUCTION_SYSTEMS.map(s => ({
  value: s.id as TipoModelo,
  label: s.title,
  icon: s.icon
}));

const REGIONES = [
  "Metropolitana", "Valparaíso", "Biobío", "La Araucanía",
  "Los Lagos", "Coquimbo", "Atacama", "Aysén", "Magallanes",
];

const PRECIO_RANGOS = [
  { label: "Hasta 500 UF", max: 500 },
  { label: "500 – 1.000 UF", min: 500, max: 1000 },
  { label: "1.000 – 1.500 UF", min: 1000, max: 1500 },
  { label: "Más de 1.500 UF", min: 1500 },
];

const DORMITORIOS_OPTS = [
  { label: "1 dorm.",  value: 1 },
  { label: "2 dorm.",  value: 2 },
  { label: "3 dorm.",  value: 3 },
  { label: "4+",       value: 4 },
];

const BANOS_OPTS = [
  { label: "1 baño",   value: 1 },
  { label: "2 baños",  value: 2 },
  { label: "3+",       value: 3 },
];

interface Props {
  currentTipo?: TipoModelo;
  currentRegion?: string;
  currentMin?: number;
  currentMax?: number;
  currentDormitorios?: number;
  currentBanos?: number;
}

export function CatalogoFilters({
  currentTipo,
  currentRegion,
  currentMin,
  currentMax,
  currentDormitorios,
  currentBanos,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/catalogo?${params.toString()}`);
  };

  const clearAll = () => router.push("/catalogo");
  const hasFilters =
    currentTipo || currentRegion || currentMin || currentMax ||
    currentDormitorios || currentBanos;

  return (
    <div className="space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">
          Filtros
        </h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs h-7 px-2 text-destructive hover:text-destructive"
          >
            <X className="w-3 h-3 mr-1" /> Limpiar
          </Button>
        )}
      </div>

      {/* Dormitorios */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Dormitorios
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {DORMITORIOS_OPTS.map((d) => {
            const isActive = currentDormitorios === d.value;
            return (
              <button
                key={d.value}
                onClick={() =>
                  updateFilter("dormitorios", isActive ? undefined : String(d.value))
                }
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/30 font-bold"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent hover:border-border/50"
                }`}
              >
                {d.label}
                {isActive && <X className="w-2.5 h-2.5 ml-1 inline opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Baños */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Baños
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {BANOS_OPTS.map((b) => {
            const isActive = currentBanos === b.value;
            return (
              <button
                key={b.value}
                onClick={() =>
                  updateFilter("banos", isActive ? undefined : String(b.value))
                }
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/30 font-bold"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent hover:border-border/50"
                }`}
              >
                {b.label}
                {isActive && <X className="w-2.5 h-2.5 ml-1 inline opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipo */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Tipo de Construcción
        </Label>
        <div className="flex flex-col gap-1.5">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() =>
                updateFilter("tipo", currentTipo === t.value ? undefined : t.value)
              }
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-all ${
                currentTipo === t.value
                  ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {t.icon}
              {t.label}
              {currentTipo === t.value && (
                <X className="w-3 h-3 ml-auto opacity-60" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Rango de Precio (UF)
        </Label>
        <div className="flex flex-col gap-1.5">
          {PRECIO_RANGOS.map((r) => {
            const isActive =
              (r.min ?? undefined) === currentMin &&
              (r.max ?? undefined) === currentMax;
            return (
              <button
                key={r.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (isActive) {
                    params.delete("min");
                    params.delete("max");
                  } else {
                    if (r.min) params.set("min", String(r.min));
                    else params.delete("min");
                    if (r.max) params.set("max", String(r.max));
                    else params.delete("max");
                  }
                  router.push(`/catalogo?${params.toString()}`);
                }}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {r.label}
                {isActive && <X className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Región */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Región
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {REGIONES.map((r) => {
            const slug = slugifyRegion(r);
            const isActive = currentRegion === slug;
            return (
              <Badge
                key={r}
                variant={isActive ? "default" : "secondary"}
                className={`cursor-pointer transition-all text-xs ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={() =>
                  updateFilter("region", isActive ? undefined : slug)
                }
              >
                {r}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
