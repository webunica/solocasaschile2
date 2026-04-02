/**
 * FichaExpandida
 * Renderiza las secciones opcionales de la ficha técnica completa del modelo.
 * Cada sección aparece SOLO si tiene datos en la DB.
 */

interface FichaExpandidaProps {
  modelo: any;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5 pt-6 border-t border-border/20">
      <h2 className="text-xl md:text-2xl font-heading font-black tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function SpecGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-muted/10 border border-border/30 rounded-2xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
          <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function hasData(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some(v => v !== null && v !== undefined && v !== '');
}

export function FichaExpandida({ modelo }: FichaExpandidaProps) {
  const con = modelo.construccion;
  const ais = modelo.aislacion;
  const ter = modelo.terminaciones;
  const ins = modelo.instalaciones;
  const log = modelo.logistica;
  const sop = modelo.soporte;

  const labelMap = {
    construccion: { sistema_constructivo: 'Sistema', estructura: 'Estructura', muros_exteriores: 'Muros exteriores', muros_interiores: 'Muros interiores', techumbre: 'Techumbre', piso_interior: 'Piso plataforma', fundacion: 'Fundaciones' } as Record<string, string>,
    aislacion: { termica: 'Aislación Térmica', acustica: 'Aislación Acústica', condensacion: 'Condensación', zona_climatica: 'Zona Climática' } as Record<string, string>,
    terminaciones: { ventanas: 'Ventanas', puertas_exteriores: 'Puerta Exterior', puertas_interiores: 'Puertas Interiores', cocina: 'Cocina', bano_principal: 'Baño Principal', bano_servicio: 'Baño Servicio', pisos: 'Pisos', cielos: 'Cielos', paredes: 'Paredes' } as Record<string, string>,
    instalaciones: { electrica: 'Eléctrica', sanitaria: 'Sanitaria', agua_caliente: 'Agua Caliente', gas: 'Gas', climatizacion: 'Climatización', ventilacion: 'Ventilación', internet_tv: 'Internet y TV' } as Record<string, string>,
  };

  function toItems(obj: Record<string, string>, map: Record<string, string>, skip: string[] = ['notas']): { label: string; value: string }[] {
    return Object.entries(obj).filter(([k, v]) => !skip.includes(k) && v).map(([k, v]) => ({ label: map[k] || k, value: v }));
  }

  return (
    <>
      {/* Distribución y Uso */}
      {(modelo.recintos?.length > 0 || modelo.uso || modelo.pisos > 1 || modelo.codigo_modelo) && (
        <Section title="Distribución y Uso">
          <div className="flex flex-wrap gap-2">
            {modelo.uso && (
              <span className="px-4 py-2 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-black uppercase tracking-widest rounded-full">
                {modelo.uso === 'cabana' ? 'Cabaña' : modelo.uso === 'uso-mixto' ? 'Uso Mixto' : modelo.uso === 'social' ? 'Vivienda Social' : modelo.uso === 'oficina' ? 'Oficina' : 'Vivienda'}
              </span>
            )}
            {modelo.pisos > 1 && (
              <span className="px-4 py-2 bg-muted/30 border border-border/40 text-foreground text-xs font-black uppercase tracking-widest rounded-full">
                {modelo.pisos} Pisos
              </span>
            )}
            {modelo.codigo_modelo && (
              <span className="px-4 py-2 bg-muted/30 border border-border/40 text-muted-foreground text-xs font-bold rounded-full">
                Cód: {modelo.codigo_modelo}
              </span>
            )}
          </div>
          {modelo.recintos?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {modelo.recintos.map((r: string) => (
                <span key={r} className="px-3 py-1.5 bg-muted/20 border border-border/30 text-foreground/70 text-xs font-medium rounded-xl">
                  {r}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Construcción y Estructura */}
      {hasData(con) && (
        <Section title="🏗 Construcción y Estructura">
          <SpecGrid items={toItems(con, labelMap.construccion)} />
          {con.notas && <p className="text-sm text-muted-foreground italic border-l-4 border-border/30 pl-4">{con.notas}</p>}
        </Section>
      )}

      {/* Aislación y Eficiencia */}
      {hasData(ais) && (
        <Section title="🌡 Aislación y Eficiencia Energética">
          {ais.calificacion_energetica && (
            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-2xl font-black">
                {ais.calificacion_energetica}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Calificación Energética</p>
                <p className="text-sm font-bold text-emerald-700">Clase {ais.calificacion_energetica} de eficiencia energética</p>
              </div>
            </div>
          )}
          <SpecGrid items={toItems(ais, labelMap.aislacion, ['notas', 'calificacion_energetica'])} />
        </Section>
      )}

      {/* Terminaciones */}
      {hasData(ter) && (
        <Section title="🎨 Terminaciones y Equipamiento">
          <SpecGrid items={toItems(ter, labelMap.terminaciones)} />
        </Section>
      )}

      {/* Instalaciones */}
      {hasData(ins) && (
        <Section title="⚡ Instalaciones">
          <SpecGrid items={toItems(ins, labelMap.instalaciones)} />
        </Section>
      )}

      {/* Logística de Compra */}
      {hasData(log) && (
        <Section title="🚚 Logística de Compra">
          <div className="grid md:grid-cols-2 gap-4">
            {log.que_incluye && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">✅ Incluye</p>
                <p className="text-sm font-medium leading-relaxed">{log.que_incluye}</p>
              </div>
            )}
            {log.que_no_incluye && (
              <div className="bg-muted/10 border border-border/30 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">❌ No incluye</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{log.que_no_incluye}</p>
              </div>
            )}
            {(['transporte', 'montaje', 'plazo_fabricacion', 'plazo_montaje'] as const).filter(k => log[k]).map(k => {
              const labels = { transporte: '🚛 Transporte', montaje: '🔧 Montaje', plazo_fabricacion: '🏭 Fabricación', plazo_montaje: '📅 Montaje en terreno' };
              return (
                <div key={k} className="bg-muted/10 border border-border/30 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{labels[k]}</p>
                  <p className="text-sm font-semibold">{log[k]}</p>
                </div>
              );
            })}
          </div>
          {log.personalizacion && (
            <div className="bg-brand-indigo/5 border border-brand-indigo/20 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-indigo mb-2">✏️ Personalización</p>
              <p className="text-sm font-medium leading-relaxed">{log.personalizacion}</p>
            </div>
          )}
        </Section>
      )}

      {/* Soporte y Garantías */}
      {hasData(sop) && (
        <Section title="🛡 Soporte y Garantías">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['garantia_estructura', 'garantia_impermeabilizacion', 'garantia_terminaciones', 'garantia_instalaciones'] as const).filter(k => sop[k]).map(k => {
              const labels = { garantia_estructura: 'Estructura', garantia_impermeabilizacion: 'Impermeab.', garantia_terminaciones: 'Terminaciones', garantia_instalaciones: 'Instalaciones' };
              return (
                <div key={k} className="bg-background border-2 border-border/40 rounded-2xl p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{labels[k]}</p>
                  <p className="text-2xl font-black text-brand-indigo">{sop[k]}</p>
                </div>
              );
            })}
          </div>
          {sop.postventa_descripcion && (
            <div className="bg-muted/10 border border-border/30 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">🔄 Postventa</p>
              <p className="text-sm font-medium">{sop.postventa_descripcion}</p>
            </div>
          )}
          {sop.normativa && (
            <div className="bg-muted/10 border border-border/30 rounded-2xl p-5">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">📋 Normativa</p>
              <p className="text-sm font-medium">{sop.normativa}</p>
            </div>
          )}
          {sop.certificaciones && (
            <div className="flex flex-wrap gap-2">
              {String(sop.certificaciones).split(',').filter(Boolean).map((c: string) => (
                <span key={c} className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-black uppercase tracking-widest rounded-full">
                  ✓ {c.trim()}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
}
