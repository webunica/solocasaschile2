import React from 'react';
import { Bed, TrendingUp, Building2, Zap, Package, ChevronRight } from "lucide-react";

interface FichaExpandidaProps {
  modelo: any;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8 py-12 border-t border-border/20 first:border-t-0">
      <div className="space-y-2">
         <h2 className="text-3xl font-heading font-black tracking-tight">{title}</h2>
         <p className="text-muted-foreground text-sm font-medium">Información detallada sobre este modelo.</p>
      </div>
      {children}
    </div>
  );
}

export function FichaExpandida({ modelo }: FichaExpandidaProps) {
  const con = modelo.construccion || {};
  const ais = modelo.aislacion || {};
  const ter = modelo.terminaciones || {};
  
  const labelMap = {
    construccion: { sistema_constructivo: 'Sistema', estructura: 'Estructura', muros_exteriores: 'Muros exteriores', muros_interiores: 'Muros interiores', techumbre: 'Techumbre', piso_interior: 'Piso plataforma', fundacion: 'Fundaciones' } as Record<string, string>,
    aislacion: { termica: 'Aislación Térmica', acustica: 'Aislación Acústica', condensacion: 'Condensación', zona_climatica: 'Zona Climática' } as Record<string, string>,
    terminaciones: { ventanas: 'Ventanas', puertas_exteriores: 'Puerta Exterior', puertas_interiores: 'Puertas Interiores', cocina: 'Cocina', bano_principal: 'Baño Principal', bano_servicio: 'Baño Servicio', pisos: 'Pisos', cielos: 'Cielos', paredes: 'Paredes' } as Record<string, string>,
  };

  function toItems(obj: Record<string, string>, map: Record<string, string>, skip: string[] = ['notas']): { label: string; value: string }[] {
    return Object.entries(obj).filter(([k, v]) => !skip.includes(k) && v).map(([k, v]) => ({ label: map[k] || k, value: v }));
  }

  const itemsConstruccion = toItems(con, labelMap.construccion, ['notas', 'plano_url']);
  const itemsAislacion = toItems(ais, labelMap.aislacion).slice(0, 2);
  const itemsTerminaciones = toItems(ter, labelMap.terminaciones).slice(0, 3);

  const allItems = [...itemsConstruccion, ...itemsAislacion, ...itemsTerminaciones];
  
  if (modelo.uso) allItems.push({ label: 'Uso sugerido', value: modelo.uso.replace(/-/g, ' ') });
  if (modelo.pisos > 1) allItems.push({ label: 'Niveles', value: `${modelo.pisos} Plantas` });

  return (
    <div className="space-y-24">

      {/* Ficha Técnica Detallada (The 3-column grid from reference) */}
      <div id="ficha-tecnica" className="space-y-10 scroll-mt-40">
         <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-brand-indigo">Ficha técnica detallada</h2>
            <p className="text-muted-foreground text-sm font-medium">Especificaciones principales del modelo {modelo.nombre}.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {allItems.map((item, i) => (
              <div key={i} className="flex items-start gap-5 group">
                 <div className="w-14 h-14 bg-card border border-border/40 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-indigo group-hover:text-white transition-all transform duration-500 shadow-sm">
                    {i % 3 === 0 ? <Building2 className="w-6 h-6" /> : i % 3 === 1 ? <Zap className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                 </div>
                 <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground opacity-60 leading-none block">{item.label}</span>
                    <p className="text-[14px] font-black leading-tight tracking-tight text-foreground/90">{item.value}</p>
                 </div>
              </div>
            ))}
         </div>

         <div className="pt-8 text-center md:text-left flex items-center gap-6 border-t border-border/10">
            <button className="text-brand-indigo font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2">
               Ver memorias técnicas completas <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
}
