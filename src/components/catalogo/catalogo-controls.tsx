"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";
import { CatalogoFilters } from "./catalogo-filters";
import type { TipoModelo } from "@/lib/mock-data";

interface Props {
  tipo?: TipoModelo;
  region?: string;
  min?: number;
  max?: number;
  sort?: string;
}

export function CatalogoControls({ tipo, region, min, max, sort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) params.set("sort", newSort);
    else params.delete("sort");
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
       {/* Custom Select for Sorting */}
       <div className="relative group/select">
          <select 
            value={sort || ""} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none rounded-2xl h-12 pl-12 pr-10 font-bold border border-border/40 bg-background/50 focus:ring-2 focus:ring-primary outline-none text-[11px] uppercase tracking-widest transition-all cursor-pointer hover:bg-muted/50"
          >
            <option value="">Recomendaciones</option>
            <option value="recent">Más Recientes</option>
            <option value="price_asc">Menor Precio</option>
            <option value="price_desc">Mayor Precio</option>
            <option value="m2_desc">Mayor Superficie</option>
          </select>
          <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-hover/select:opacity-100 transition-opacity pointer-events-none" />
       </div>

       {/* Mobile Filter Sheet */}
       <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" className="lg:hidden rounded-2xl h-12 px-6 font-black tracking-widest text-[10px] uppercase bg-brand-indigo border-none shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
               <Filter className="w-4 h-4 mr-2" />
               Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] rounded-r-[3rem] border-r border-border/40 p-10 overflow-y-auto bg-background/95 backdrop-blur-3xl">
            <SheetHeader className="mb-10">
              <SheetTitle className="text-4xl font-black font-heading tracking-tighter text-foreground">
                Filtros<br /><span className="text-muted-foreground opacity-30">PRO</span>
              </SheetTitle>
            </SheetHeader>
            <CatalogoFilters
              currentTipo={tipo}
              currentRegion={region}
              currentMin={min}
              currentMax={max}
            />
          </SheetContent>
       </Sheet>
    </div>
  );
}
