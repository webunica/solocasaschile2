"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, Mail, MapPin, Search, 
  Globe, CheckCircle2, MoreVertical, X,
  Filter, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConstructoraAdminControls } from "./constructora-controls";

export type ConstructoraAdminItem = {
  id: string;
  slug: string;
  nombre: string;
  logo_url: string | null;
  plan: string;
  verificada: boolean;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  sitio_web: string | null;
  score_confianza: number;
  regiones?: string[] | null;
  created_at?: string | null;
};

interface Props {
  initialConstructoras: ConstructoraAdminItem[];
}

const ITEMS_PER_PAGE = 25;

export function AdminConstructorasClient({ initialConstructoras }: Props) {
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "score" | "name">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Cerrar autocomplete al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extraer lista única de regiones disponibles
  const availableRegions = useMemo(() => {
    const regionSet = new Set<string>();
    for (const c of initialConstructoras) {
      if (Array.isArray(c.regiones)) {
        for (const r of c.regiones) {
          if (r && r.trim()) regionSet.add(r.trim());
        }
      }
    }
    return Array.from(regionSet).sort((a, b) => a.localeCompare(b));
  }, [initialConstructoras]);

  // Conteos rápidos por plan
  const planCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialConstructoras.length };
    for (const c of initialConstructoras) {
      const p = (c.plan || "gratis").toLowerCase();
      counts[p] = (counts[p] || 0) + 1;
    }
    return counts;
  }, [initialConstructoras]);

  // Sugerencias para el autocomplete (top 8 coincidencias)
  const autocompleteSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query || query.length < 2) return [];

    return initialConstructoras
      .filter((c) => {
        const matchName = c.nombre?.toLowerCase().includes(query);
        const matchSlug = c.slug?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        const matchDir = c.direccion?.toLowerCase().includes(query);
        return matchName || matchSlug || matchEmail || matchDir;
      })
      .slice(0, 8);
  }, [initialConstructoras, search]);

  // Filtrado general de constructoras
  const filteredConstructoras = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialConstructoras.filter((c) => {
      // 1. Búsqueda por texto libre
      if (query) {
        const matchName = c.nombre?.toLowerCase().includes(query);
        const matchSlug = c.slug?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        const matchDir = c.direccion?.toLowerCase().includes(query);
        const matchPhone = c.telefono?.toLowerCase().includes(query);
        const matchWeb = c.sitio_web?.toLowerCase().includes(query);
        if (!matchName && !matchSlug && !matchEmail && !matchDir && !matchPhone && !matchWeb) {
          return false;
        }
      }

      // 2. Filtro por plan
      if (selectedPlan !== "all") {
        const p = (c.plan || "gratis").toLowerCase();
        if (selectedPlan === "informativo" && p !== "informativo") return false;
        if (selectedPlan === "gratis" && p !== "gratis" && p !== "basic") return false;
        if (selectedPlan === "pro" && p !== "pro") return false;
        if (selectedPlan === "premium" && p !== "premium" && p !== "pro_plus") return false;
        if (selectedPlan === "avanza" && p !== "avanza" && p !== "crece") return false;
      }

      // 3. Filtro por verificación
      if (selectedVerification === "verified" && !c.verificada) return false;
      if (selectedVerification === "unverified" && c.verificada) return false;

      // 4. Filtro por región
      if (selectedRegion !== "all") {
        const hasRegion = Array.isArray(c.regiones) && c.regiones.some((r) => r.toLowerCase().includes(selectedRegion.toLowerCase()));
        const inAddress = c.direccion?.toLowerCase().includes(selectedRegion.toLowerCase());
        if (!hasRegion && !inAddress) return false;
      }

      return true;
    });
  }, [initialConstructoras, search, selectedPlan, selectedVerification, selectedRegion]);

  // Ordenación de resultados
  const sortedConstructoras = useMemo(() => {
    const list = [...filteredConstructoras];
    if (sortBy === "score") {
      list.sort((a, b) => (b.score_confianza || 0) - (a.score_confianza || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      // recent: preservar orden de Supabase (created_at desc)
    }
    return list;
  }, [filteredConstructoras, sortBy]);

  // Paginación
  const totalPages = Math.ceil(sortedConstructoras.length / ITEMS_PER_PAGE) || 1;
  const paginatedConstructoras = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedConstructoras.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedConstructoras, currentPage]);

  const handleSelectSuggestion = (name: string) => {
    setSearch(name);
    setShowAutocomplete(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedPlan("all");
    setSelectedVerification("all");
    setSelectedRegion("all");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || selectedPlan !== "all" || selectedVerification !== "all" || selectedRegion !== "all" || sortBy !== "recent";

  return (
    <div className="space-y-6">
      {/* ── Barra Superior: Buscador con Autocomplete + Orden ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Buscador con dropdown de autocompletado */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowAutocomplete(true);
                setCurrentPage(1);
              }}
              onFocus={() => {
                if (search.trim().length >= 2) setShowAutocomplete(true);
              }}
              placeholder="Buscar por nombre, comuna, email o teléfono..."
              className="pl-10 pr-9 h-12 bg-card border-border/60 rounded-2xl shadow-sm text-sm focus-visible:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setShowAutocomplete(false);
                  setCurrentPage(1);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Menú flotante de Autocomplete */}
          {showAutocomplete && autocompleteSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border/80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3">
                Sugerencias automáticas ({autocompleteSuggestions.length})
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-border/20">
                {autocompleteSuggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(item.nombre)}
                      className="w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {item.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.direccion || item.regiones?.[0] || item.email || "Sin ubicación"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold">
                          {item.plan || "gratis"}
                        </Badge>
                        {item.verificada && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-card border border-border/60 rounded-2xl px-3 py-1.5 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "recent" | "score" | "name");
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="score">Mayor Score de Confianza</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Filtros por Pills / Categorías ── */}
      <div className="bg-card/60 border border-border/50 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Pills por Plan */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Plan:
            </span>
            {[
              { id: "all", label: "Todos", count: planCounts.all },
              { id: "informativo", label: "Informativo", count: planCounts.informativo || 0 },
              { id: "gratis", label: "Basic / Gratis", count: (planCounts.gratis || 0) + (planCounts.basic || 0) },
              { id: "avanza", label: "Crece", count: (planCounts.avanza || 0) + (planCounts.crece || 0) },
              { id: "pro", label: "Pro", count: planCounts.pro || 0 },
              { id: "premium", label: "Pro+ / Premium", count: (planCounts.premium || 0) + (planCounts.pro_plus || 0) },
            ].map((p) => {
              const active = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlan(p.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span>{p.label}</span>
                  {p.count !== undefined && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      active ? "bg-white/20 dark:bg-black/20 text-inherit" : "bg-background/80 text-muted-foreground"
                    )}>
                      {p.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filtro por Verificación */}
          <div className="flex items-center gap-2">
            <select
              value={selectedVerification}
              onChange={(e) => {
                setSelectedVerification(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-muted/60 border border-border/40 text-xs font-bold rounded-xl px-3 py-1.5 text-foreground cursor-pointer focus:outline-none"
            >
              <option value="all">Todas las verificaciones</option>
              <option value="verified">Solo Verificadas ✓</option>
              <option value="unverified">Sin Verificar</option>
            </select>

            {/* Filtro por Región */}
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-muted/60 border border-border/40 text-xs font-bold rounded-xl px-3 py-1.5 text-foreground cursor-pointer focus:outline-none max-w-[200px]"
            >
              <option value="all">Todas las regiones</option>
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-xl"
              >
                <X className="w-3.5 h-3.5 mr-1" /> Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
          <p>
            Mostrando <strong className="text-foreground">{sortedConstructoras.length}</strong> de{" "}
            <strong>{initialConstructoras.length}</strong> constructoras
            {hasActiveFilters && " (con filtros activos)"}
          </p>
          {totalPages > 1 && (
            <p>
              Página <strong className="text-foreground">{currentPage}</strong> de <strong>{totalPages}</strong>
            </p>
          )}
        </div>
      </div>

      {/* ── Lista de Constructoras ── */}
      <div className="grid gap-4">
        {paginatedConstructoras.map((cons) => (
          <div
            key={cons.id}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all group p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/10 flex items-center justify-center p-3 overflow-hidden relative group-hover:scale-105 transition-transform shrink-0">
              {cons.logo_url ? (
                <Image src={cons.logo_url} alt={cons.nombre} fill className="object-contain p-2" />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground opacity-30" />
              )}
            </div>

            <div className="flex-1 space-y-1.5 min-w-0 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link href={`/constructora/${cons.slug}`} target="_blank" className="hover:underline">
                  <h3 className="text-lg font-black tracking-tight truncate max-w-[280px]">
                    {cons.nombre}
                  </h3>
                </Link>
                <div className="flex gap-1.5 items-center">
                  <Badge
                    className={cn(
                      "text-[9px] uppercase tracking-wider font-bold",
                      cons.plan === "premium" || cons.plan === "pro_plus"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : cons.plan === "pro"
                        ? "bg-brand-teal/10 text-brand-teal border-brand-teal/20"
                        : cons.plan === "crece" || cons.plan === "avanza"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-muted/60 text-muted-foreground border-border/50"
                    )}
                  >
                    {(cons.plan || "informativo").toUpperCase()}
                  </Badge>
                  {cons.verificada && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verificada
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                {cons.email && (
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {cons.email}
                  </span>
                )}
                {cons.telefono && (
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Phone className="w-3.5 h-3.5 shrink-0" /> {cons.telefono}
                  </span>
                )}
                {cons.direccion && (
                  <span className="flex items-center gap-1.5 opacity-80 max-w-md truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {cons.direccion}
                  </span>
                )}
                {cons.sitio_web && (
                  <span className="flex items-center gap-1.5 opacity-80">
                    <Globe className="w-3.5 h-3.5 shrink-0" /> {cons.sitio_web.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 pt-4 md:pt-0 shrink-0">
              <ConstructoraAdminControls
                constructora={{
                  id: cons.id,
                  verificada: cons.verificada,
                  plan: (cons.plan || "gratis") as "gratis" | "pro" | "premium",
                  score_confianza: cons.score_confianza,
                }}
              />
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center shrink-0">
              <Link
                href={`/dashboard/admin/constructoras/${cons.id}/edit`}
                title="Editar constructora"
                className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {sortedConstructoras.length === 0 && (
          <div className="py-20 text-center space-y-4 border-2 border-dashed border-border/40 rounded-3xl bg-card/30">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto opacity-30">
              <Building2 className="w-8 h-8" />
            </div>
            <p className="text-foreground font-black tracking-tight text-base">
              No se encontraron constructoras con los filtros actuales.
            </p>
            <p className="text-muted-foreground text-xs">
              Intenta buscar con otro término o limpia los filtros activos.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="rounded-xl text-xs font-bold"
              >
                Limpiar todos los filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedConstructoras.length)} de{" "}
            {sortedConstructoras.length} empresas
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl text-xs font-bold h-9 px-3 gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = Math.min(totalPages - 4 + i, Math.max(1, currentPage - 2 + i));
                }
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-black transition-all",
                      isCurrent
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl text-xs font-bold h-9 px-3 gap-1"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
