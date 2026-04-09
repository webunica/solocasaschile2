"use client";

import { useState, useEffect } from "react";
import { 
  Search, MapPin, Package, ArrowRight, 
  Phone, Globe, Star, ExternalLink,
  LayoutGrid, List, Loader2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { REGIONES_CHILE } from "@/config/regions";
import { slugifyRegion } from "@/lib/regions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Supplier {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  google_rating?: number;
  region_slug: string;
  category_id: string;
}

interface SuppliersDirectoryProps {
  categories: Category[];
  totalSuppliers: number;
  initialFavoriteIds: string[];
  userId: string;
}

export function SuppliersDirectory({ 
  categories, 
  totalSuppliers, 
  initialFavoriteIds = [],
  userId 
}: SuppliersDirectoryProps) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [favoriteSuppliers, setFavoriteSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds));
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch suppliers when filter changes
  useEffect(() => {
    if (!selectedRegion || !selectedCategory || showFavorites) return;
    const fetchSuppliers = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('material_suppliers')
        .select('*')
        .eq('region_slug', selectedRegion)
        .eq('category_id', selectedCategory.id)
        .order('google_rating', { ascending: false });
      setSuppliers(data || []);
      setLoading(false);
    };
    fetchSuppliers();
  }, [selectedRegion, selectedCategory, showFavorites]);

  // Fetch all favorites when tab is opened
  useEffect(() => {
    if (!showFavorites) return;
    const fetchFavorites = async () => {
      setLoading(true);
      const { data: favRows } = await supabase
        .from('supplier_favorites')
        .select('supplier_id')
        .eq('user_id', userId);
      
      if (!favRows?.length) { setFavoriteSuppliers([]); setLoading(false); return; }

      const ids = favRows.map((f: any) => f.supplier_id);
      const { data } = await supabase
        .from('material_suppliers')
        .select('*')
        .in('id', ids)
        .order('name');
      setFavoriteSuppliers(data || []);
      setLoading(false);
    };
    fetchFavorites();
  }, [showFavorites]);

  const toggleFavorite = async (supplier: Supplier) => {
    setTogglingId(supplier.id);
    const isFav = favoriteIds.has(supplier.id);
    try {
      if (isFav) {
        await supabase.from('supplier_favorites').delete()
          .eq('user_id', userId).eq('supplier_id', supplier.id);
        setFavoriteIds(prev => { const n = new Set(prev); n.delete(supplier.id); return n; });
        setFavoriteSuppliers(prev => prev.filter(s => s.id !== supplier.id));
        toast.success("Eliminado de favoritos");
      } else {
        await supabase.from('supplier_favorites').insert({ user_id: userId, supplier_id: supplier.id });
        setFavoriteIds(prev => new Set([...prev, supplier.id]));
        toast.success("Guardado en favoritos ❤️");
      }
    } catch {
      toast.error("Error al actualizar favoritos");
    } finally {
      setTogglingId(null);
    }
  };

  const displayedSuppliers = showFavorites ? favoriteSuppliers : suppliers;

  return (
    <div className="space-y-10">
      {/* Stats Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-[#fa8823]" />
            </div>
            <div>
              <p className="text-4xl font-black tracking-tighter leading-none text-slate-900">
                {totalSuppliers.toLocaleString('es-CL')}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Proveedores en DB</p>
            </div>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-4xl font-black tracking-tighter leading-none text-slate-900">
                {favoriteIds.size}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Favoritos</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => { setShowFavorites(!showFavorites); setSelectedCategory(null); }}
          className={cn(
            "h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 transition-all",
            showFavorites 
              ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20" 
              : "bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", showFavorites && "fill-white")} />
          {showFavorites ? "Ver Directorio" : `Mis Favoritos (${favoriteIds.size})`}
        </Button>
      </div>

      {/* Hero Search */}
      {!showFavorites && (
        <section className="relative py-12 px-8 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fa8823]/20 via-transparent to-transparent opacity-50" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fa8823]/10 rounded-full blur-[100px]" />
          <div className="relative z-10 max-w-4xl space-y-4">
            <Badge className="bg-[#fa8823]/10 text-[#fa8823] border-[#fa8823]/20 font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              Ecosistema de Suministros SIP
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              Encuentra Proveedores <span className="text-[#fa8823]">Técnicos</span>
            </h1>
            <p className="text-slate-400 font-medium">Selecciona tu región y categoría para ver los proveedores disponibles.</p>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <div className="flex-1 relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
                <select className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 appearance-none cursor-pointer"
                  value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                  <option value="" className="bg-slate-900">Selecciona Región...</option>
                  {REGIONES_CHILE.map(r => <option key={r} value={slugifyRegion(r)} className="bg-slate-900">{r}</option>)}
                </select>
              </div>
              <div className="flex-1 relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
                <select className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 appearance-none cursor-pointer"
                  value={selectedCategory?.slug || ""} onChange={(e) => setSelectedCategory(categories.find(c => c.slug === e.target.value) || null)}>
                  <option value="" className="bg-slate-900">Selecciona Categoría...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.slug} className="bg-slate-900">{cat.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="space-y-6">
        {/* Favorites view title */}
        {showFavorites && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Heart className="w-7 h-7 text-red-400 fill-red-300" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Mis Favoritos</h2>
              <p className="text-slate-500 font-medium text-sm">{favoriteIds.size} proveedores guardados</p>
            </div>
          </div>
        )}

        {/* Category pills */}
        {!showFavorites && !selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-black tracking-tight">Categorías SIP</h2>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-lg", viewMode==='grid' && "bg-slate-100")} onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-lg", viewMode==='list' && "bg-slate-100")} onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedCategory(cat)}
                  className="group text-left bg-white border border-border/40 rounded-[1.5rem] p-5 hover:border-[#fa8823]/40 hover:shadow-xl hover:shadow-[#fa8823]/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#fa8823] group-hover:bg-[#fa8823] group-hover:text-white transition-all mb-3">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="font-black text-sm leading-tight group-hover:text-[#fa8823] transition-colors">{cat.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Supplier List (directory or favorites) */}
        {(selectedCategory || showFavorites) && (
          <div className="space-y-6">
            {!showFavorites && (
              <div className="flex items-center justify-between px-1">
                <div>
                  <button onClick={() => { setSelectedCategory(null); setSuppliers([]); }} className="text-xs text-[#fa8823] font-black uppercase tracking-widest hover:underline mb-1 block">← Volver a Categorías</button>
                  <h2 className="text-2xl font-black tracking-tight">{selectedCategory?.name}</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    {loading ? "Cargando..." : `${suppliers.length} proveedores`}
                    {selectedRegion && ` · ${REGIONES_CHILE.find(r => slugifyRegion(r) === selectedRegion) || selectedRegion}`}
                  </p>
                </div>
              </div>
            )}

            {loading && <div className="py-24 flex flex-col items-center gap-4 text-slate-400"><Loader2 className="w-10 h-10 animate-spin text-[#fa8823]" /><p className="font-bold">Cargando...</p></div>}

            {!loading && !selectedRegion && !showFavorites && (
              <div className="py-16 text-center space-y-3 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-black text-slate-400">Selecciona una región para ver proveedores</p>
              </div>
            )}

            {!loading && displayedSuppliers.length === 0 && (selectedRegion || showFavorites) && (
              <div className="py-16 text-center space-y-3 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                {showFavorites ? <Heart className="w-10 h-10 text-slate-300 mx-auto" /> : <Search className="w-10 h-10 text-slate-300 mx-auto" />}
                <p className="font-black text-slate-400">{showFavorites ? "Aún no has guardado ningún favorito" : "Sin proveedores para esta combinación"}</p>
              </div>
            )}

            {!loading && displayedSuppliers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {displayedSuppliers.map((supplier, i) => (
                    <motion.div key={supplier.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="group bg-white border border-border/40 rounded-[2rem] p-7 hover:border-[#fa8823]/30 hover:shadow-2xl hover:shadow-[#fa8823]/5 transition-all duration-300 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#fa8823] group-hover:bg-[#fa8823] group-hover:text-white transition-all shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-base leading-tight group-hover:text-[#fa8823] transition-colors truncate">{supplier.name}</h3>
                            {supplier.address && <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{supplier.address}</p>}
                          </div>
                        </div>
                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavorite(supplier)}
                          disabled={togglingId === supplier.id}
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all border",
                            favoriteIds.has(supplier.id)
                              ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                              : "bg-slate-50 border-slate-200 text-slate-300 hover:text-red-400 hover:border-red-200"
                          )}
                        >
                          {togglingId === supplier.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Heart className={cn("w-4 h-4 transition-all", favoriteIds.has(supplier.id) && "fill-red-400")} />
                          }
                        </button>
                      </div>

                      {supplier.google_rating && (
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full w-fit">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs font-black text-amber-700">{supplier.google_rating} Google</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        {supplier.phone && (
                          <a href={`tel:${supplier.phone}`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                            <Phone className="w-3.5 h-3.5" /> Llamar
                          </a>
                        )}
                        {supplier.website && (
                          <a href={supplier.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                            <Globe className="w-3.5 h-3.5" /> Web
                          </a>
                        )}
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(supplier.name + ' ' + (supplier.address || ''))}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all ml-auto">
                          <ExternalLink className="w-3.5 h-3.5" /> Mapa
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
