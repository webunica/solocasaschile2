"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Star, Minus, Info } from "lucide-react";
import type { ModelWithConstructora } from "@/lib/supabase/services";

interface Props {
  modelos: ModelWithConstructora[];
}

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  "modular": "Modular",
  "steel-framing": "Steel Framing",
};

type Row = {
  label: string;
  key: keyof ModelWithConstructora | string;
  render?: (m: ModelWithConstructora) => React.ReactNode;
  highlight?: "low" | "high";
};

const ROWS: Row[] = [
  {
    label: "Precio Base (Desde)",
    key: "precio_desde_uf",
    render: (m) => (
      <span className="text-foreground font-black text-2xl tracking-tighter">
        {m.precio_desde_uf.toLocaleString("es-CL")} <span className="text-sm font-bold opacity-60">UF</span>
      </span>
    ),
    highlight: "low",
  },
  {
    label: "Superficie Total",
    key: "superficie_m2",
    highlight: "high",
  },
  {
    label: "Valor Metro Cuadrado",
    key: "uf_m2",
    render: (m) => (
      <div className="flex flex-col items-center">
        <span className="font-black text-xl text-primary">
          {(m.precio_desde_uf / (m.superficie_m2 || 1)).toFixed(2)}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">UF/m²</span>
      </div>
    ),
    highlight: "low",
  },
  { label: "Dormitorios", key: "dormitorios", render: (m) => <span className="font-bold">{m.dormitorios}</span>, highlight: "high" },
  { label: "Baños Completos", key: "banos", render: (m) => <span className="font-bold">{m.banos}</span>, highlight: "high" },
  { 
    label: "Sistema Constructivo", 
    key: "tipo", 
    render: (m) => (
      <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-muted/50">
         {TIPO_LABELS[m.tipo] || m.tipo}
      </Badge>
    ) 
  },
  {
    label: "Constructora Oficial",
    key: "constructora.nombre",
    render: (m) => (
      <div className="flex flex-col items-center gap-2">
         <Link
           href={`/constructora/${m.constructora?.slug}`}
           className="text-primary font-black hover:opacity-80 transition-opacity tracking-tight"
         >
           {m.constructora?.nombre}
         </Link>
         {m.constructora?.plan === "premium" ? (
           <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] uppercase tracking-widest px-2 py-0 border-none">
             <Star className="w-2.5 h-2.5 mr-1 fill-current" /> Premium
           </Badge>
         ) : m.constructora?.plan === "pro" ? (
           <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] uppercase tracking-widest px-2 py-0">
             Pro
           </Badge>
         ) : (
           <Badge variant="secondary" className="text-[9px] uppercase tracking-widest px-2 py-0">Verificada</Badge>
         )}
      </div>
    ),
  },
  {
    label: "Score Confianza (S/C)",
    key: "constructora.score_confianza",
    render: (m) => {
      const c = m.constructora;
      if (!c) return <Minus className="w-4 h-4 text-muted-foreground mx-auto" />;
      return (
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-end gap-1">
             <span className="font-black tracking-tighter text-3xl leading-none text-foreground">{c.score_confianza}</span>
             <span className="font-bold text-[10px] text-muted-foreground mb-1 uppercase tracking-widest opacity-60">/100</span>
          </div>
          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1 opacity-80">
            <Info className="w-3 h-3 text-brand-indigo" /> Analizado
          </p>
        </div>
      );
    },
    highlight: "high",
  },
  {
    label: "Garantía Estructural",
    key: "garantia_anos",
    render: (m) => (
      <div className="flex flex-col items-center">
        <span className="font-black text-xl text-foreground">
          {m.garantia_anos || 1} <span className="text-sm font-bold opacity-60 uppercase">Años</span>
        </span>
      </div>
    ),
    highlight: "high",
  },
  {
    label: "Servicio Postventa",
    key: "postventa",
    render: (m) => (
      <div className="flex justify-center">
        {m.postventa ? (
           <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3 mr-2" /> Incluido
           </Badge>
        ) : (
           <Badge variant="outline" className="text-muted-foreground opacity-40 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
              No Disponible
           </Badge>
        )}
      </div>
    ),
  },
];

export function ComparadorTable({ modelos }: Props) {
  // Find best value per numeric row
  const getBestIndex = (row: Row, highlight: "low" | "high") => {
    const vals = modelos.map((m) => {
      // Valor UF/m2 (Special Case)
      if (row.key === "uf_m2") {
        return m.precio_desde_uf / (m.superficie_m2 || 1);
      }
      // Support nested keys like "constructora.score_confianza"
      if (typeof row.key === 'string' && row.key.includes('.')) {
         const keys = row.key.split('.');
         let val: any = m;
         for (const k of keys) {
            val = val?.[k as keyof typeof val];
         }
         return typeof val === "number" ? val : undefined;
      }
      const v = m[row.key as keyof ModelWithConstructora];
      return typeof v === "number" ? v : undefined;
    });
    
    if (vals.every((v) => v === undefined)) return -1;
    const valid = vals.filter((v) => v !== undefined) as number[];
    const best = highlight === "low" ? Math.min(...valid) : Math.max(...valid);
    const idx = vals.findIndex((v) => v === best);
    // Only highlight if values differ
    return new Set(valid).size > 1 ? idx : -1;
  };

  return (
    <div className="overflow-x-auto rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b border-border/60">
            <th className="text-left p-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-48 bg-muted/20 opacity-60">
              Criterio
            </th>
            {modelos.map((m) => (
              <th
                key={m.id}
                className="p-8 text-center bg-muted/5 min-w-[250px] border-l border-border/20 relative group"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full h-40 relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                    <Image
                      src={m.imagenes_urls[0] || 'https://via.placeholder.com/300'}
                      alt={m.nombre}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-heading font-black text-xl tracking-tight text-foreground line-clamp-2">
                       {m.nombre}
                    </p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => {
            const bestIdx = row.highlight ? getBestIndex(row, row.highlight) : -1;
            return (
              <tr
                key={row.label}
                className={`border-b border-border/30 transition-colors hover:bg-muted/10 ${ri % 2 === 0 ? "bg-background/20" : "bg-muted/5"}`}
              >
                <td className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  {row.label}
                </td>
                {modelos.map((m, mi) => {
                  const isBest = bestIdx === mi;
                  return (
                    <td
                      key={m.id}
                      className={`px-8 py-5 text-center text-sm border-l border-border/20 relative transition-all ${
                        isBest ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      {isBest && (
                         <div className="absolute top-2 right-4 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20 text-[9px] font-black uppercase tracking-widest shadow-sm">
                            <CheckCircle2 className="w-3 h-3" /> Mejor Opción
                         </div>
                      )}
                      {row.render ? (
                        <div className="mt-2">{row.render(m)}</div>
                      ) : (
                        <span className={cn("text-lg", isBest && "font-black text-foreground")}>
                          {String(m[row.key as keyof ModelWithConstructora] ?? "—")}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* CTA row */}
          <tr className="bg-muted/30">
            <td className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Avance
            </td>
            {modelos.map((m) => (
              <td key={m.id} className="px-8 py-8 text-center border-l border-border/20">
                <Link
                  href={`/modelo/${m.slug}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full max-w-[200px] rounded-2xl font-bold uppercase tracking-widest bg-brand-indigo shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white hover:text-white")}
                >
                  Continuar
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
