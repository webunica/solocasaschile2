"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  Search, MapPin, Package, ArrowRight, 
  Phone, Globe, Star, ExternalLink,
  LayoutGrid, List, Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { REGIONES_CHILE } from "@/config/regions";
import { slugifyRegion } from "@/lib/regions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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

export function SuppliersDirectory({ categories }: { categories: Category[] }) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Fetch suppliers when region or category changes
  useEffect(() => {
    if (!selectedRegion || !selectedCategory) {
      setSuppliers([]);
      return;
    }

    const fetchSuppliers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('material_suppliers')
        .select('*')
        .eq('region_slug', selectedRegion)
        .eq('category_id', selectedCategory.id)
        .order('google_rating', { ascending: false });
      
      if (!error && data) setSuppliers(data);
      setLoading(false);
    };

    fetchSuppliers();
  }, [selectedRegion, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Hero Search */}
      <section className="relative py-14 px-8 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fa8823]/20 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fa8823]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <Badge className="bg-[#fa8823]/10 text-[#fa8823] border-[#fa8823]/20 font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            Ecosistema de Suministros SIP
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
            Encuentra Proveedores <span className="text-[#fa8823]">Técnicos</span>
          </h1>
          <p className="text-slate-400 font-medium">
            Selecciona tu región y categoría para ver los proveedores disponibles.
          </p>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            {/* Region filter */}
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
              <select 
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 appearance-none cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="" className="bg-slate-900">Selecciona Región...</option>
                {REGIONES_CHILE.map(r => (
                  <option key={r} value={slugifyRegion(r)} className="bg-slate-900">{r}</option>
                ))}
              </select>
            </div>
            {/* Category filter */}
            <div className="flex-1 relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
              <select 
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 appearance-none cursor-pointer"
                value={selectedCategory?.slug || ""}
                onChange={(e) => {
                  const cat = categories.find(c => c.slug === e.target.value) || null;
                  setSelectedCategory(cat);
                }}
              >
                <option value="" className="bg-slate-900">Selecciona Categoría...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug} className="bg-slate-900">{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results area */}
      <section className="space-y-6">
        
        {/* Category pills (shortcuts) */}
        {!selectedCategory && (
          <div className="space-y-4">
            <h2 className="text-xl font-black tracking-tight px-2">Categorías SIP</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedCategory(cat)}
                  className="group text-left bg-white border border-border/40 rounded-[1.5rem] p-5 hover:border-[#fa8823]/40 hover:shadow-xl hover:shadow-[#fa8823]/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#fa8823] group-hover:bg-[#fa8823] group-hover:text-white transition-all mb-3">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="font-black text-sm leading-tight group-hover:text-[#fa8823] transition-colors">{cat.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Supplier results */}
        {selectedCategory && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-1">
              <div className="space-y-1">
                <button 
                  onClick={() => { setSelectedCategory(null); setSuppliers([]); }}
                  className="text-xs text-[#fa8823] font-black uppercase tracking-widest hover:underline mb-2 block"
                >
                  ← Volver a Categorías
                </button>
                <h2 className="text-2xl font-black tracking-tight">{selectedCategory.name}</h2>
                {selectedRegion && (
                  <p className="text-sm text-slate-500 font-medium">
                    {loading ? "Buscando proveedores..." : `${suppliers.length} proveedores encontrados`}
                    {selectedRegion && ` · ${REGIONES_CHILE.find(r => slugifyRegion(r) === selectedRegion) || selectedRegion}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-lg", viewMode==='grid' && "bg-slate-100")} onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-lg", viewMode==='list' && "bg-slate-100")} onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-[#fa8823]" />
                <p className="font-bold">Cargando proveedores...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !selectedRegion && (
              <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-black text-slate-400">Selecciona una región para ver proveedores</p>
              </div>
            )}

            {!loading && selectedRegion && suppliers.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Search className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
                <p className="font-black text-slate-400">Sin proveedores aún para esta combinación</p>
                <p className="text-sm text-slate-400">Usa el panel de Admin → Gestión Constru para sincronizar esta categoría</p>
              </div>
            )}

            {/* Grid */}
            {!loading && suppliers.length > 0 && (
              <div className={cn(
                "gap-5",
                viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"
              )}>
                <AnimatePresence>
                  {suppliers.map((supplier, i) => (
                    <motion.div
                      key={supplier.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group bg-white border border-border/40 rounded-[2rem] p-7 hover:border-[#fa8823]/30 hover:shadow-2xl hover:shadow-[#fa8823]/5 transition-all duration-300 flex flex-col gap-4"
                    >
                      {/* Name + Rating */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-[#fa8823] group-hover:bg-[#fa8823] group-hover:text-white transition-all shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        {supplier.google_rating && (
                          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-amber-700">{supplier.google_rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <h3 className="font-black text-lg leading-tight group-hover:text-[#fa8823] transition-colors">
                          {supplier.name}
                        </h3>
                        {supplier.address && (
                          <p className="text-xs text-slate-500 font-medium flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" /> {supplier.address}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        {supplier.phone && (
                          <a 
                            href={`tel:${supplier.phone}`}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" /> Llamar
                          </a>
                        )}
                        {supplier.website && (
                          <a 
                            href={supplier.website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <Globe className="w-3.5 h-3.5" /> Web
                          </a>
                        )}
                        <a 
                          href={`https://www.google.com/maps/search/${encodeURIComponent(supplier.name + ' ' + (supplier.address || ''))}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all ml-auto"
                        >
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
