"use client";

import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CatalogoEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border text-center px-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-black font-heading mb-2">No se encontraron modelos</h3>
      <p className="text-muted-foreground max-w-sm font-medium mb-8">
        No hay resultados para tus criterios de búsqueda actuales. Prueba ajustando los filtros.
      </p>
      <Button 
        variant="outline" 
        className="rounded-xl h-12 px-8 font-bold border-border" 
        onClick={() => router.push('/catalogo')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Limpiar todos los filtros
      </Button>
    </div>
  );
}
