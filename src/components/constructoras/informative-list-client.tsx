"use client";

import { useState, useMemo } from "react";
import { Building2, MapPin, Phone, Mail, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function InformativeListClient({ constructoras }: { constructoras: any[] }) {
  const [regionFilter, setRegionFilter] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");

  const regionesUnicas = useMemo(() => {
    const rSet = new Set<string>();
    constructoras.forEach(c => {
      if (c.regiones && Array.isArray(c.regiones)) {
        c.regiones.forEach((r: string) => r && r.trim() && rSet.add(r));
      }
    });
    return Array.from(rSet).sort();
  }, [constructoras]);

  const filtered = useMemo(() => {
    return constructoras
      .filter(c => {
        const matchRegion = regionFilter === "todas" || (c.regiones && c.regiones.includes(regionFilter));
        const matchSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRegion && matchSearch;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [constructoras, regionFilter, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-6 p-8 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2rem] shadow-xl shadow-primary/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
          <Input 
            placeholder="Buscar por nombre de constructora..." 
            className="pl-12 h-14 bg-background/50 border-border/40 focus:border-primary/50 text-base rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={regionFilter} onValueChange={(val) => setRegionFilter(val || "todas")}>
          <SelectTrigger className="w-full sm:w-[320px] h-14 bg-background/50 border-border/40 text-base rounded-2xl">
            <SelectValue placeholder="Todas las Regiones" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-2xl rounded-2xl">
            <SelectItem value="todas">Todas las Regiones</SelectItem>
            {regionesUnicas.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla "Estilo PDF" */}
      <div className="w-full overflow-hidden border border-border/40 rounded-[2.5rem] bg-card/20 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-primary/10 border-b border-border/40">
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 text-center w-20">N°</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 min-w-[250px]">Constructora</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 opacity-60" /> Región
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 opacity-60" /> Teléfono
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 opacity-60" /> Correo
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 text-right pr-12">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map((c, index) => (
                <tr 
                  key={c.id} 
                  className={cn(
                    "hover:bg-primary/5 transition-colors group",
                    index % 2 === 0 ? "bg-transparent" : "bg-white/5"
                  )}
                >
                  <td className="p-5 text-sm font-black text-muted-foreground/60 text-center">
                    {index + 1}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                         <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-heading font-black text-foreground text-base tracking-tight">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      {c.regiones && c.regiones.length > 0 ? c.regiones[0] : "-"}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-bold text-foreground/80 font-mono tracking-tighter">
                    {c.telefono || "-"}
                  </td>
                  <td className="p-5 text-sm font-medium text-muted-foreground">
                    {c.email ? (
                      <a href={`mailto:${c.email}`} className="hover:text-primary hover:underline transition-colors flex items-center gap-2">
                         {c.email}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="p-5 text-right pr-8">
                    {c.sitio_web ? (
                      <a 
                        href={c.sitio_web.startsWith('http') ? c.sitio_web : `https://${c.sitio_web}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-primary hover:text-white hover:bg-primary font-black text-[10px] uppercase tracking-[0.15em] px-6 py-2.5 rounded-xl bg-primary/5 border border-primary/20 transition-all shadow-sm"
                      >
                        <Globe className="w-3.5 h-3.5" /> Visitar
                      </a>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 pr-6">Sin sitio</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="text-center py-32 space-y-4">
               <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Search className="w-8 h-8" />
               </div>
               <p className="text-muted-foreground font-black text-lg">No encontramos constructoras que coincidan con tu búsqueda.</p>
               <button onClick={() => { setRegionFilter("todas"); setSearchQuery(""); }} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Limpiar Filtros</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
