"use client";

import { useState, useMemo } from "react";
import { Building2, MapPin, Phone, Mail, Globe, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

export function InformativeListClient({ constructoras }: { constructoras: any[] }) {
  const [regionFilter, setRegionFilter] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
     setCurrentPage(newPage);
     // Scroll suave a la parte superior de la sección si es posible
     document.getElementById('directorio-general')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10" id="directorio-general">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-6 p-8 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2rem] shadow-xl shadow-primary/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
          <Input 
            placeholder="Buscar por nombre de constructora..." 
            className="pl-12 h-14 bg-background/50 border-border/40 focus:border-primary/50 text-base rounded-2xl"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
        <Select 
          value={regionFilter} 
          onValueChange={(val) => {
            setRegionFilter(val || "todas");
            setCurrentPage(1); // Reset page on filter
          }}
        >
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

      {/* Vista de Tarjetas (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginated.map((c, index) => (
          <div key={c.id} className="bg-card/40 backdrop-blur-xl border border-border/40 p-6 rounded-[2rem] space-y-4 shadow-lg">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-60">Constructora #{(currentPage-1)*ITEMS_PER_PAGE + index + 1}</div>
                  <h3 className="font-heading font-black text-lg text-foreground leading-tight tracking-tight">{c.nombre}</h3>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/20">
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Región</p>
                  <p className="text-xs font-bold text-foreground truncate">{c.regiones?.[0] || "-"}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Teléfono</p>
                  <p className="text-xs font-bold text-foreground font-mono">{c.telefono || "-"}</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Correo Electrónico</p>
                  <p className="text-xs font-bold text-primary truncate">
                    {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : "-"}
                  </p>
               </div>

               {c.sitio_web && (
                 <a 
                   href={c.sitio_web.startsWith('http') ? c.sitio_web : `https://${c.sitio_web}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-brand-indigo text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                 >
                   <Globe className="w-4 h-4" /> Visitar Sitio Web
                 </a>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla "Estilo PDF" (Desktop) - 20 Lineas */}
      <div className="hidden md:block w-full overflow-hidden border border-border/40 rounded-[2.5rem] bg-card/20 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
            <thead>
              <tr className="bg-primary/10 border-b border-border/40">
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 text-center w-20">N°</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 w-[30%]">Constructora</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 w-[15%]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 opacity-60" /> Región
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 w-[18%]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 opacity-60" /> Teléfono
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 w-[22%]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 opacity-60" /> Correo
                  </div>
                </th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-primary/70 text-right pr-12 w-[15%]">Sitio Web</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 font-medium">
              {paginated.map((c, index) => (
                <tr 
                  key={c.id} 
                  className={cn(
                    "hover:bg-primary/5 transition-colors group",
                    index % 2 === 0 ? "bg-transparent" : "bg-white/5"
                  )}
                >
                  <td className="p-5 text-sm font-black text-muted-foreground/60 text-center">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                         <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-heading font-black text-foreground text-sm xl:text-base tracking-tight truncate">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-lg whitespace-nowrap inline-block max-w-full truncate">
                      {c.regiones && c.regiones.length > 0 ? c.regiones[0] : "-"}
                    </span>
                  </td>
                  <td className="p-5 text-xs xl:text-sm font-bold text-foreground/80 font-mono tracking-tighter truncate">
                    {c.telefono || "-"}
                  </td>
                  <td className="p-5 text-xs xl:text-sm text-muted-foreground truncate">
                    {c.email ? (
                      <a href={`mailto:${c.email}`} className="hover:text-primary transition-colors flex items-center gap-2 truncate">
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
                        className="inline-flex items-center gap-2 text-primary hover:text-white hover:bg-primary font-black text-[9px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20 transition-all shadow-sm whitespace-nowrap"
                      >
                        <Globe className="w-3 h-3" /> Abrir Link
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginated.length === 0 && (
            <div className="text-center py-32 space-y-4">
               <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Search className="w-8 h-8" />
               </div>
               <p className="text-muted-foreground font-black text-lg">No encontramos constructoras que coincidan con tu búsqueda.</p>
               <button onClick={() => { setRegionFilter("todas"); setSearchQuery(""); setCurrentPage(1); }} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Limpiar Filtros</button>
            </div>
          )}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl shadow-xl">
           <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Página {currentPage} de {totalPages} <span className="mx-2">•</span> {filtered.length} empresas encontradas
           </div>
           <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-border/40 h-10 w-10 disabled:opacity-20"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                   // Lógica simple para mostrar 5 páginas alrededor de la actual
                   let pageNum = currentPage;
                   if (totalPages <= 5) pageNum = i + 1;
                   else if (currentPage <= 3) pageNum = i + 1;
                   else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                   else pageNum = currentPage - 2 + i;

                   return (
                     <Button
                       key={pageNum}
                       variant={currentPage === pageNum ? "default" : "outline"}
                       className={cn(
                         "h-10 w-10 rounded-xl font-black text-xs transition-all",
                         currentPage === pageNum ? "bg-brand-indigo text-white border-none shadow-lg shadow-primary/20 scale-110" : "border-border/40 hover:bg-primary/5"
                       )}
                       onClick={() => handlePageChange(pageNum)}
                     >
                       {pageNum}
                     </Button>
                   );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-border/40 h-10 w-10 disabled:opacity-20"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
           </div>
        </div>
      )}
    </div>
  );
}
