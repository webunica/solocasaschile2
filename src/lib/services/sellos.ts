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
  // Función deshabilitada: Todas las validaciones de sellos pasan a ser estrictamente manuales
  // por parte de la administración. Ya no se otorgan sellos basados en el perfil.
  return;
}
