import { createClient } from '@/lib/supabase/server';

const SLUGS_AUTOMATICOS = [
  'perfil-completo',
  'empresa-activa',
  'especialidad-definida',
  'fotos-reales',
  'experiencia-10-anos',
  'fechas-obra'
];

/**
 * Recalcula y otorga/remueve los sellos automáticos basado en el estado
 * actual del perfil de la constructora y sus modelos.
 */
export async function recalcularSellosAutomaticos(constructoraId: string) {
  const supabase = await createClient();

  // 1. Obtener datos de la constructora
  const { data: constructora, error: errC } = await supabase
    .from('constructoras')
    .select('nombre, descripcion, logo_url, direccion, telefono, anio_inicio, especialidad_principal')
    .eq('id', constructoraId)
    .single();

  if (errC || !constructora) {
    console.error(`[Sellos] Falló obtención constructora_id ${constructoraId}`, errC);
    return;
  }

  // 2. Obtener datos de modelos
  const { data: modelos } = await supabase
    .from('modelos')
    .select('id, imagenes_urls, tiempo_entrega, disponible')
    .eq('constructora_id', constructoraId)
    .eq('disponible', true);

  const activeModels = modelos || [];

  // 3. Evaluar Reglas de Sellos Automáticos
  
  // a) Perfil Completo
  const tienePerfilCompleto = !!(
    constructora.nombre && 
    constructora.descripcion && 
    constructora.logo_url && 
    constructora.direccion && 
    constructora.telefono
  );

  // b) Empresa Activa
  const esEmpresaActiva = activeModels.length > 0;

  // c) Especialidad Definida
  const tieneEspecialidad = !!constructora.especialidad_principal;

  // d) Fotos Reales: Al menos un modelo con >= 3 fotos
  const tieneFotosReales = activeModels.some((m: any) => Array.isArray(m.imagenes_urls) && m.imagenes_urls.length >= 3);

  // e) 10+ Años Experiencia
  const currentYear = new Date().getFullYear();
  const tiene10Anos = constructora.anio_inicio ? ((currentYear - constructora.anio_inicio) >= 10) : false;

  // f) Fechas Obra Definidas
  const tieneFechas = activeModels.some((m: any) => !!m.tiempo_entrega);

  const statusMap = {
    'perfil-completo': tienePerfilCompleto,
    'empresa-activa': esEmpresaActiva,
    'especialidad-definida': tieneEspecialidad,
    'fotos-reales': tieneFotosReales,
    'experiencia-10-anos': tiene10Anos,
    'fechas-obra': tieneFechas,
  };

  // 4. Calcular porcentaje de completitud base
  const fieldsToCheck = [
    constructora.nombre, 
    constructora.descripcion, 
    constructora.logo_url, 
    constructora.direccion, 
    constructora.telefono, 
    constructora.anio_inicio, 
    constructora.especialidad_principal
  ];
  const filledCount = fieldsToCheck.filter(Boolean).length;
  const porcentajeCompletitud = Math.round((filledCount / fieldsToCheck.length) * 100);

  // 5. Aplicar cambios a la BD
  // Cargar catálogo para obtener los IDs
  const { data: catalog } = await supabase
    .from('sellos_catalogo')
    .select('id, slug')
    .in('slug', SLUGS_AUTOMATICOS);
    
  if (!catalog) return;

  const sellosARemover = [];
  const sellosAMantener = []; // Valid IDs that it should have

  for (const item of catalog) {
    if (statusMap[item.slug as keyof typeof statusMap]) {
       sellosAMantener.push(item.id);
    } else {
       sellosARemover.push(item.id);
    }
  }

  // Borramos los que ya no cumple
  if (sellosARemover.length > 0) {
    await supabase.from('constructora_sellos')
      .delete()
      .eq('constructora_id', constructoraId)
      .in('sello_id', sellosARemover);
  }

  // Para los que SÍ cumple, usamos upsert para no afectar los que ya existen
  if (sellosAMantener.length > 0) {
    const toUpsert = sellosAMantener.map(sId => ({
      constructora_id: constructoraId,
      sello_id: sId,
      estado: 'aprobado',
      otorgado_at: new Date().toISOString()
    }));
    
    // onConflict se basa en la restriccion UNIQUE (constructora_id, sello_id)
    await supabase.from('constructora_sellos')
      .upsert(toUpsert, { onConflict: 'constructora_id, sello_id', ignoreDuplicates: true });
  }

  // 6. Actualizar constructora (Completitud)
  await supabase.from('constructoras')
    .update({ porcentaje_completitud: porcentajeCompletitud })
    .eq('id', constructoraId);
}
