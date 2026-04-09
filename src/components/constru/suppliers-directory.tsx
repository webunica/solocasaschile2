"use client";

import { useState } from "react";
import { 
  Search, MapPin, Filter, 
  ArrowRight, Phone, Globe, 
  Star, ExternalLink, Info,
  Package, LayoutGrid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { REGIONES_CHILE } from "@/config/regions";
import { slugifyRegion } from "@/lib/regions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface SuppliersDirectoryProps {
  categories: Category[];
}

export function SuppliersDirectory({ categories }: SuppliersDirectoryProps) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-10">
      {/* Search & Hero Section */}
      <section className="relative py-16 px-8 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fa8823]/20 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fa8823]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge className="bg-[#fa8823]/10 text-[#fa8823] border-[#fa8823]/20 font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            Ecosistema de Suministros
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
            Encuentra Proveedores <br />
            <span className="text-[#fa8823]">Técnicos SIP</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Busca materiales principales, fijaciones y aislantes por región con información verificada de contacto.
          </p>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
              <select 
                className="w-full h-16 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 transition-all appearance-none cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="" className="bg-slate-900">Selecciona Región...</option>
                {REGIONES_CHILE.map(region => (
                  <option key={region} value={slugifyRegion(region)} className="bg-slate-900">
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#fa8823] transition-colors" />
              <select 
                className="w-full h-16 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-4 focus:ring-[#fa8823]/20 transition-all appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" className="bg-slate-900">Todas las categorías...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug} className="bg-slate-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Categorías SIP</h2>
            <p className="text-sm text-slate-500 font-medium">Materiales críticos para tu proyecto</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-white/10">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("w-8 h-8 rounded-lg", viewMode === 'grid' && "bg-slate-100 dark:bg-white/10")}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("w-8 h-8 rounded-lg", viewMode === 'list' && "bg-slate-100 dark:bg-white/10")}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative h-full overflow-hidden border-border/40 hover:border-[#fa8823]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#fa8823]/5 rounded-[2rem] bg-card/60 backdrop-blur-sm">
                <CardContent className="p-8 space-y-4 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-[1rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#fa8823] group-hover:scale-110 group-hover:bg-[#fa8823] group-hover:text-white transition-all duration-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-black text-lg leading-tight group-hover:text-[#fa8823] transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                      {cat.description || "Encuentra los mejores proveedores certificados."}
                    </p>
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-[#fa8823] font-black uppercase tracking-widest text-[10px] items-center gap-2 group/btn"
                  >
                    Ver Proveedores <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Status Placeholder (Until SerpApi is active) */}
      <section className="py-20 text-center space-y-8 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-white/10">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl mx-auto flex items-center justify-center text-slate-300">
           <Search className="w-10 h-10 animate-pulse text-[#fa8823]" />
        </div>
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-2xl font-black tracking-tight">Estamos sincronizando el mercado</h3>
          <p className="text-slate-500 font-medium">
            Selecciona una categoría para ver los proveedores pre-cargados o espera mientras actualizamos los datos de Google Maps para tu región.
          </p>
        </div>
      </section>
    </div>
  );
}
