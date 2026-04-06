// ============================================================
// Tipos para la Ficha Técnica Expandida y SEO del Modelo
// ============================================================

export type UsoModelo = 'vivienda' | 'cabana' | 'oficina' | 'uso-mixto' | 'social';

export const USO_LABELS: Record<UsoModelo, string> = {
  vivienda: 'Vivienda',
  cabana: 'Cabaña',
  oficina: 'Oficina / Estudio',
  'uso-mixto': 'Uso Mixto',
  social: 'Vivienda Social',
};

/** Recintos predefinidos disponibles para selección */
export const RECINTOS_PREDEFINIDOS = [
  'Estar',
  'Comedor',
  'Cocina',
  'Dormitorio principal',
  'Dormitorio 2',
  'Dormitorio 3',
  'Baño principal',
  'Baño de servicio',
  'Lavandería',
  'Bodega',
  'Estacionamiento',
  'Terraza',
  'Quincho',
  'Jardín',
  'Patio',
  'Hall de entrada',
  'Pasillo',
  'Estudio / Oficina',
  'Vestidor',
  'Sala de juegos',
] as const;

// ---------------------------------------------------------------
// Secciones JSONB de ficha técnica
// ---------------------------------------------------------------

export interface ConstruccionData {
  sistema_constructivo?: string;  // "Panel SIP 162mm", "Steel Framing", etc.
  estructura?: string;            // "Madera laminada encolada", "Acero galvanizado"
  muros_exteriores?: string;      // "SIP 162mm + stucco"
  muros_interiores?: string;      // "Placa de yeso cartón 12mm"
  techumbre?: string;             // "Zinc-aluminio inclinado", "EPDM plana"
  piso_interior?: string;         // "Piso flotante HDF", "Porcelanato 60x60"
  fundacion?: string;             // "Radier hormigón", "Pilotes de madera"
  plano_url?: string;             // URL a imagen del plano
  notas?: string;
}

export interface AislacionData {
  termica?: string;               // "EPS 100mm en muros y techo"
  acustica?: string;              // "Lana mineral 50mm"
  condensacion?: string;          // "Barrera de vapor incluida"
  zona_climatica?: string;        // "Zonas 3 a 6 (Sur)", "Todas las zonas"
  calificacion_energetica?: string; // "A, B, C..."
  notas?: string;
}

export interface TerminacionesData {
  ventanas?: string;              // "PVC doble vidrio termopanel"
  puertas_exteriores?: string;    // "Puerta blindada de acero"
  puertas_interiores?: string;    // "MDF laqueado"
  cocina?: string;                // "Muebles de melamina, mesón granito"
  bano_principal?: string;        // "Cerámica 30x60, grifería cromada"
  bano_servicio?: string;         // "Porcelanato básico"
  pisos?: string;                 // "Piso flotante y porcelanato"
  cielos?: string;                // "Yeso cartón pintado"
  paredes?: string;               // "Pintura látex mate blanco"
  notas?: string;
}

export interface InstalacionesData {
  electrica?: string;             // "Trifásica 220V, 15 circuitos"
  sanitaria?: string;             // "PVC presión, calefont a gas"
  agua_caliente?: string;         // "Calefont gas 13L/min"
  gas?: string;                   // "Centralizado / cilindros exterior"
  climatizacion?: string;         // "Losa radiante + bomba de calor"
  ventilacion?: string;           // "Natural / mecánica forzada"
  internet_tv?: string;           // "Ductos para fibra óptica"
  notas?: string;
}

export interface LogisticaData {
  transporte?: string;            // "Incluido en radio 500 km de RM"
  montaje?: string;               // "Equipo especializado incluido"
  plazo_fabricacion?: string;     // "45 a 60 días hábiles en planta"
  plazo_montaje?: string;         // "10 a 15 días en terreno"
  que_incluye?: string;           // "Estructura, instalaciones, terminaciones"
  que_no_incluye?: string;        // "Terreno, fundaciones, permisos"
  precio_metro_extra?: string;    // "3.5 UF/m² adicional"
  personalizacion?: string;       // "Modificaciones de distribución posibles"
  notas?: string;
}

export interface SoporteData {
  garantia_estructura?: string;   // "5 años"
  garantia_impermeabilizacion?: string; // "3 años"
  garantia_terminaciones?: string; // "1 año"
  garantia_instalaciones?: string; // "2 años"
  postventa_descripcion?: string;  // "Visita técnica a los 30, 90 y 365 días"
  certificaciones?: string[];      // ["INN", "MINVU", "PassivHaus"]
  normativa?: string;              // "Cumple NCh 1198 (Madera) y DS47"
  planos_disponibles?: boolean;
  memoria_tecnica?: boolean;
  notas?: string;
}

// ---------------------------------------------------------------
// Campos SEO del modelo
// ---------------------------------------------------------------

export interface ModeloSEO {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  seo_og_image?: string | null;
  canonical_url?: string | null;
}

// ---------------------------------------------------------------
// Tipo completo del modelo extendido
// ---------------------------------------------------------------

export interface ModeloExtendido extends ModeloSEO {
  // Identidad
  id: string;
  constructora_id: string;
  nombre: string;
  slug: string;
  tipo: string;
  codigo_modelo?: string | null;
  uso?: UsoModelo | null;
  disponible: boolean;

  // Medidas y distribución
  superficie_m2: number;
  pisos?: number | null;
  dormitorios: number;
  banos: number;
  recintos?: string[] | null;

  // Precio y logística básica
  precio_desde_uf: number;
  tiempo_entrega?: string | null;
  garantia_anos?: number | null;
  postventa?: boolean | null;

  // Media
  imagenes_urls: string[];
  video_url?: string | null;
  descripcion?: string | null;

  // Ficha expandida
  construccion?: ConstruccionData | null;
  aislacion?: AislacionData | null;
  terminaciones?: TerminacionesData | null;
  instalaciones?: InstalacionesData | null;
  logistica?: LogisticaData | null;
  soporte?: SoporteData | null;

  // Legacy (especificaciones libres)
  especificaciones?: Record<string, string> | null;
  plano_url?: string | null;

  // Metadata
  created_at?: string;
  total_views?: number;
}
