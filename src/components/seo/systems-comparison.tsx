"use client";

import { Check, X, Info } from "lucide-react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const COMPARISON_DATA = [
  {
    sistema: "Panel SIP",
    precio: "15-25 UF/m²",
    tiempo: "60-120 días",
    aislacion: "Excelente (A+)",
    durabilidad: "60+ años",
    recomendado: true,
  },
  {
    sistema: "Madera / Prefabricada",
    precio: "8-18 UF/m²",
    tiempo: "90-150 días",
    aislacion: "Media (C-B)",
    durabilidad: "50+ años",
    recomendado: false,
  },
  {
    sistema: "Steel Framing (Metalcom)",
    precio: "12-22 UF/m²",
    tiempo: "70-130 días",
    aislacion: "Media-Alta (B)",
    durabilidad: "70+ años",
    recomendado: false,
  },
  {
    sistema: "Hormigón Celular",
    precio: "25-35 UF/m²",
    tiempo: "180-300 días",
    aislacion: "Media-Baja (D)",
    durabilidad: "100+ años",
    recomendado: false,
  },
  {
      sistema: "Containers",
      precio: "12-20 UF/m²",
      tiempo: "30-60 días",
      aislacion: "Depende (C-A)",
      durabilidad: "Indestructible",
      recomendado: false,
  }
];

export function SystemsComparison() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-heading font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
          Comparativa de Sistemas Constructivos 2026
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black">Chile</Badge>
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
          Analizamos los factores críticos para que elijas la mejor opción según tu presupuesto y zona climática.
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-border/40 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 px-6 text-slate-500 dark:text-slate-400 w-[30%]">Sistema</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 text-slate-500 dark:text-slate-400">Precio m² (UF)</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 text-slate-500 dark:text-slate-400">Tiempo de Obra</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 text-slate-500 dark:text-slate-400">Aislación Térmica</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-6 text-slate-500 dark:text-slate-400">Vida Útil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPARISON_DATA.map((row) => (
              <TableRow key={row.sistema} className="border-border/40 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <TableCell className="font-bold py-6 px-6 text-slate-900 dark:text-slate-100">
                  <div className="flex items-center gap-3">
                    {row.sistema}
                    {row.recomendado && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20" title="Alta eficiencia recomendada">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-bold text-slate-700 dark:text-slate-300">{row.precio}</TableCell>
                <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">{row.tiempo}</TableCell>
                <TableCell className="text-sm font-medium">
                    <span className={cn(
                        "px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-tighter",
                        row.aislacion.includes('Excelente') 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}>
                        {row.aislacion}
                    </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">{row.durabilidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-start gap-4 p-8 bg-slate-50 dark:bg-slate-900/50 border border-border/40 rounded-[2rem]">
         <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm hidden sm:block">
            <Info className="w-5 h-5" />
         </div>
         <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            <span className="text-primary font-black uppercase tracking-widest text-[10px] block mb-1">Nota Expertos SolocasasChile</span> 
            Los precios son referenciales para 2026 y no incluyen el costo del terreno ni las fundaciones especiales si el suelo es arcilloso o con pendiente extrema (común en precordillera de Santiago o Valparaíso).
         </p>
      </div>
    </div>
  );
}
