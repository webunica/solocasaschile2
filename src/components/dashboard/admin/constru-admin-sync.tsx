"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Info, RefreshCw, MapPin, Package, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { REGIONES_CHILE } from "@/config/regions";
import { slugifyRegion } from "@/lib/regions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ConstruAdminSync({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [syncResults, setSyncResults] = useState<string[]>([]);
  const [allSyncSummary, setAllSyncSummary] = useState<{ total: number; errors: number } | null>(null);

  const handleSyncAll = async () => {
    if (!selectedRegion) { toast.error("Por favor selecciona una región primero"); return; }
    const regionName = REGIONES_CHILE.find(r => slugifyRegion(r) === selectedRegion);
    setSyncingAll(true);
    setAllSyncSummary(null);
    try {
      const response = await fetch("/api/admin/sync-region", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionName, regionSlug: selectedRegion })
      });
      const data = await response.json();
      if (data.success) {
        setAllSyncSummary({ total: data.totalSynced, errors: data.errors });
        // Marcar todas las categorías como sincronizadas
        const allKeys = categories.map(c => `${c.id}-${selectedRegion}`);
        setSyncResults(prev => [...new Set([...prev, ...allKeys])]);
        toast.success(`✅ ${data.totalSynced} proveedores sincronizados en ${regionName}`);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error(`Error: ${message}`);
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSync = async (category: Category) => {
    if (!selectedRegion) {
      toast.error("Por favor selecciona una región primero");
      return;
    }

    const regionName = REGIONES_CHILE.find(r => slugifyRegion(r) === selectedRegion);
    const loadingKey = `${category.id}-${selectedRegion}`;
    setLoading(loadingKey);

    try {
      const response = await fetch("/api/admin/sync-suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: category.id,
          categorySlug: category.slug,
          categoryName: category.name,
          regionName,
          regionSlug: selectedRegion
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSyncResults(prev => [...prev, loadingKey]);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-border/40 rounded-[2.5rem] overflow-hidden shadow-xl">
        <CardHeader className="bg-slate-900 border-b border-white/5 p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black text-white tracking-tighter">Motor de Sincronización Constru</CardTitle>
              <CardDescription className="text-slate-400 font-medium text-lg">
                Usa SerpApi para extraer proveedores reales de Google Maps por región.
              </CardDescription>
            </div>
            
            <div className="w-full md:w-72 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
              <select 
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 transition-all cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="" className="bg-slate-900">Elegir Región para Sincronizar...</option>
                {REGIONES_CHILE.map(r => (
                  <option key={r} value={slugifyRegion(r)} className="bg-slate-900">{r}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        
        {/* Sync All Banner */}
        <div className="px-10 py-5 border-b border-border/40 bg-[#fa8823]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="font-black text-sm">Sincronización masiva</p>
            <p className="text-xs text-muted-foreground font-medium">
              Sincroniza las {categories.length} categorías de una sola vez para la región seleccionada.{" "}
              <span className="text-[#fa8823] font-black">~{categories.length} créditos SerpApi</span>
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {allSyncSummary && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-black">
                <CheckCircle2 className="w-4 h-4" />
                {allSyncSummary.total} proveedores · {allSyncSummary.errors > 0 ? `${allSyncSummary.errors} errores` : 'Sin errores'}
              </div>
            )}
            <Button
              onClick={handleSyncAll}
              disabled={syncingAll || !!loading || !selectedRegion}
              className="h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-[#fa8823] text-white hover:bg-[#e07720] shadow-lg shadow-[#fa8823]/20 transition-all active:scale-95 whitespace-nowrap"
            >
              {syncingAll ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sincronizando...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Sincronizar Toda la Región</>
              )}
            </Button>
          </div>
        </div>
        
        <CardContent className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const loadingKey = `${cat.id}-${selectedRegion}`;
              const isSyncing = loading === loadingKey;
              const isDone = syncResults.includes(loadingKey);

              return (
                <div 
                  key={cat.id}
                  className="group relative bg-muted/30 border border-border/40 p-6 rounded-[2rem] hover:bg-white hover:border-[#fa8823]/30 hover:shadow-2xl hover:shadow-[#fa8823]/10 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isDone ? "bg-emerald-500 text-white" : "bg-white text-slate-400 group-hover:bg-[#fa8823] group-hover:text-white"
                    )}>
                      {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                    </div>
                    {isSyncing && <Loader2 className="w-5 h-5 animate-spin text-[#fa8823]" />}
                  </div>

                  <h3 className="font-black text-lg mb-2 tracking-tight line-clamp-2">{cat.name}</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">
                    {isDone ? "Actualizado recientemente" : "Pendiente de Sincronización"}
                  </p>

                  <Button
                    onClick={() => handleSync(cat)}
                    disabled={!!loading || !selectedRegion}
                    className={cn(
                      "w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-transform active:scale-95",
                      isDone ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-slate-900 text-white hover:bg-[#fa8823]"
                    )}
                  >
                    {isSyncing ? "Buscando en Google..." : "Sincronizar Región"}
                    <RefreshCw className={cn("w-3 h-3 ml-3", isSyncing && "animate-spin")} />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="p-10 rounded-[2.5rem] bg-brand-indigo/5 border border-brand-indigo/10 flex items-start gap-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-indigo flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-black tracking-tight leading-none">Consejo de Optimización</h4>
          <p className="text-muted-foreground font-medium leading-relaxed">
            La sincronización consume créditos de SerpApi. Recomendamos sincronizar primero las regiones con mayor volumen de construcción (Metropolitana, Valparaíso, Biobío) y luego expandir.
          </p>
        </div>
      </div>
    </div>
  );
}
