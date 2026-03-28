"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Building2, MapPin, Phone, Mail, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    return constructoras.filter(c => {
      const matchRegion = regionFilter === "todas" || (c.regiones && c.regiones.includes(regionFilter));
      const matchSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [constructoras, regionFilter, searchQuery]);

  // Agrupación por región
  const groupedByRegion = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(c => {
      const regionKey = (c.regiones && c.regiones.length > 0) ? c.regiones[0] : "Sin región específicada";
      if (!groups[regionKey]) groups[regionKey] = [];
      groups[regionKey].push(c);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar constructora..." 
            className="pl-9 bg-card/50 backdrop-blur-xl border-border/40 focus:border-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={regionFilter} onValueChange={(val) => setRegionFilter(val || "todas")}>
          <SelectTrigger className="w-full sm:w-[280px] bg-card/50 backdrop-blur-xl border-border/40">
            <SelectValue placeholder="Filtrar por Región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las Regiones</SelectItem>
            {regionesUnicas.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-12">
        {groupedByRegion.map(([region, items]) => (
          <div key={region} className="space-y-6">
            <h3 className="font-heading font-black text-2xl flex items-center gap-3 pb-3 border-b border-border/40">
              <MapPin className="text-primary w-6 h-6" /> {region}
              <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">{items.length}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map(c => (
                <div key={c.id} className="bg-card/30 backdrop-blur-sm border border-border/40 p-6 rounded-3xl hover:border-primary/30 transition-colors flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-lg tracking-tight leading-tight">{c.nombre}</h4>
                  </div>
                  
                  <div className="space-y-2 mt-auto text-sm text-muted-foreground font-medium">
                    {c.telefono && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 opacity-70" /> {c.telefono}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 opacity-70" /> {c.email}
                      </div>
                    )}
                    {c.sitio_web && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-primary opacity-70" /> 
                        <a href={c.sitio_web.startsWith('http') ? c.sitio_web : `https://${c.sitio_web}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold truncate">
                          {c.sitio_web.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-medium">
            No se encontraron constructoras informativas con esos criterios.
          </div>
        )}
      </div>
    </div>
  );
}
