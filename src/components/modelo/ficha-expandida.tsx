import { Building2, Zap, Package, ChevronRight } from "lucide-react";

interface FichaExpandidaProps {
  modelo: {
    nombre: string;
    uso?: string | null;
    pisos?: number | null;
    construccion?: Record<string, unknown> | null;
    aislacion?: Record<string, unknown> | null;
    terminaciones?: Record<string, unknown> | null;
  };
}

export function FichaExpandida({ modelo }: FichaExpandidaProps) {
  const con = modelo.construccion || {};
  const ais = modelo.aislacion || {};
  const ter = modelo.terminaciones || {};

  const labelMap = {
    construccion: { 
      sistema_constructivo: "Sistema Constructivo", 
      estructura: "Estructura Principal", 
      muros_exteriores: "Muros Exteriores", 
      muros_interiores: "Muros Interiores", 
      techumbre: "Techumbre y Cubierta", 
      piso_interior: "Piso Plataforma", 
      fundacion: "Fundaciones",
      dimensiones: "Dimensiones Exteriores",
      estilo: "Estilo Arquitectónico"
    } as Record<string, string>,
    aislacion: { 
      termica: "Aislación Térmica", 
      acustica: "Aislación Acústica", 
      condensacion: "Control Humedad y Vapor", 
      zona_climatica: "Zona Climática Apta" 
    } as Record<string, string>,
    terminaciones: { 
      ventanas: "Ventanas y Vidrios", 
      puertas_exteriores: "Puerta Exterior", 
      puertas_interiores: "Puertas Interiores", 
      cocina: "Equipamiento Cocina", 
      bano_principal: "Baño Principal", 
      bano_servicio: "Baño Secundario", 
      pisos: "Revestimiento Pisos", 
      cielos: "Cielos", 
      paredes: "Paredes" 
    } as Record<string, string>,
  };

  function toItems(obj: Record<string, unknown>, map: Record<string, string>, skip: string[] = ["notas"]): { label: string; value: string }[] {
    return Object.entries(obj)
      .filter((entry): entry is [string, string | number | boolean] => {
        const [key, value] = entry;
        return !skip.includes(key) && ["string", "number", "boolean"].includes(typeof value) && String(value).length > 0;
      })
      .map(([key, value]) => ({ label: map[key] || key, value: String(value) }));
  }

  const itemsConstruccion = toItems(con, labelMap.construccion, ["notas", "plano_url", "pdf_url"]);
  const itemsAislacion = toItems(ais, labelMap.aislacion);
  const itemsTerminaciones = toItems(ter, labelMap.terminaciones);

  const allItems = [...itemsConstruccion, ...itemsAislacion, ...itemsTerminaciones];

  if (modelo.uso) allItems.push({ label: "Uso sugerido", value: modelo.uso.replace(/-/g, " ") });
  if ((modelo.pisos ?? 0) > 1) allItems.push({ label: "Niveles", value: `${modelo.pisos} Plantas` });

  return (
    <div className="space-y-24">
      <div id="ficha-tecnica" className="space-y-10 scroll-mt-40">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-brand-indigo">Ficha técnica detallada</h2>
          <p className="text-muted-foreground text-sm font-medium">Especificaciones principales del modelo {modelo.nombre}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {allItems.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-start gap-5 group">
              <div className="w-14 h-14 bg-card border border-border/40 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-indigo group-hover:text-white transition-all transform duration-500 shadow-sm">
                {index % 3 === 0 ? <Building2 className="w-6 h-6" /> : index % 3 === 1 ? <Zap className="w-6 h-6" /> : <Package className="w-6 h-6" />}
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
