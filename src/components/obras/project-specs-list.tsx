"use client";

import { useState } from "react";
import { ObraProjectSpec } from "@/types/obra";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, CircleDashed, Clock, PackageOpen, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ESTADO_ICONS: Record<string, React.ReactNode> = {
  pendiente: <CircleDashed className="w-3.5 h-3.5 text-slate-400" />,
  esperando_materiales: <PackageOpen className="w-3.5 h-3.5 text-amber-500" />,
  en_proceso: <Clock className="w-3.5 h-3.5 text-brand-indigo" />,
  finalizado: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  esperando_materiales: "Esperando mat.",
  en_proceso: "En Proceso",
  finalizado: "Finalizado"
};

export function ProjectSpecsList({ initialSpecs, projectId }: { initialSpecs: ObraProjectSpec[], projectId: string }) {
  const [specs, setSpecs] = useState<ObraProjectSpec[]>(initialSpecs);
  const supabase = createClient();

  const handleUpdateEstado = async (id: string, newEstado: string) => {
    // Optimistic update
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, estado: newEstado as any } : s));

    const { error } = await supabase
      .from('obra_project_specs')
      .update({ estado: newEstado })
      .eq('id', id);

    if (error) {
      console.error("Error updating spec status:", error);
      // Revert op
      setSpecs(initialSpecs);
    }
  };

  // Agrupar por categoría
  const grouped = specs.reduce((acc, spec) => {
    if (!acc[spec.categoria]) acc[spec.categoria] = [];
    acc[spec.categoria].push(spec);
    return acc;
  }, {} as Record<string, ObraProjectSpec[]>);

  if (specs.length === 0) {
    return <p className="text-sm text-center text-muted-foreground py-4">No hay especificaciones listadas.</p>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([categoria, items]) => {
        // Calcular completitud de la categoría
        const total = items.length;
        const completados = items.filter(i => i.estado === 'finalizado').length;
        const porcentaje = Math.round((completados / total) * 100);

        return (
          <div key={categoria} className="border border-border/40 rounded-3xl overflow-hidden bg-white shadow-sm">
            {/* Cabecera Categoría */}
            <div className="bg-slate-50/80 px-5 py-3 border-b border-border/40 flex items-center justify-between">
              <h4 className="font-heading font-black text-sm text-foreground tracking-tight">{categoria}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  {completados}/{total}
                </span>
                <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      porcentaje === 100 ? "bg-emerald-500" : "bg-brand-indigo"
                    )} 
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Elementos */}
            <div className="divide-y divide-border/20">
              {items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 gap-3 hover:bg-slate-50/50 transition-colors">
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {ESTADO_ICONS[item.estado]}
                      <span>{item.elemento}</span>
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 ml-5 truncate">
                      {item.valor}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 ml-5 sm:ml-0">
                    <Select value={item.estado} onValueChange={(val) => handleUpdateEstado(item.id, val)}>
                      <SelectTrigger className={cn(
                        "h-8 rounded-lg text-xs font-bold border-0 font-sans shadow-none pl-2.5 bg-transparent",
                        item.estado === 'pendiente' ? "text-slate-500" :
                        item.estado === 'esperando_materiales' ? "text-amber-600 bg-amber-50" :
                        item.estado === 'en_proceso' ? "text-brand-indigo bg-brand-indigo/5" :
                        "text-emerald-600 bg-emerald-50"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ESTADO_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="text-xs font-medium">
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
