import { createClient } from "@/lib/supabase/server";

// Mapa de categorías internas a términos de búsqueda reales en Google Maps
const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  'paneles-sip':               'Proveedor paneles SIP construcción',
  'estructura-complementaria': 'Proveedor madera estructural construcción',
  'sellos-hermeticidad':       'Sellantes y espumas construcción',
  'control-humedad':           'Membranas impermeabilización construcción',
  'fijaciones-anclajes':       'Ferretería tornillos estructurales',
  'revestimientos-exteriores': 'Siding fibrocemento revestimiento exterior',
  'revestimientos-interiores': 'Proveedor yeso cartón volcanita plancas',
  'cubiertas-techos':          'Proveedor techumbre planchas zinc teja',
  'ventanas-puertas':          'Proveedor ventanas termopanel puertas',
  'instalaciones':             'Proveedor materiales eléctricos sanitarios',
  'fundaciones':               'Proveedor hormigón radier construcción',
  'materiales-premium':        'Materiales construcción premium alta eficiencia',
};

interface SerpApiCoordinates {
  latitude?: number;
  longitude?: number;
}

interface SerpApiLocalResult {
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number | string;
  place_id?: string;
  gps_coordinates?: SerpApiCoordinates;
  [key: string]: unknown;
}

interface SerpApiMapsResponse {
  error?: string;
  local_results?: SerpApiLocalResult[];
}

export async function searchSuppliersInGoogle(query: string) {
  // Aceptar ambos nombres posibles de la variable
  const apiKey = process.env.SERPAPI_KEY || process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    throw new Error('SerpApi key no encontrada. Verifica que la variable se llame SERPAPI_KEY o SERPAPI_API_KEY en Vercel.');
  }

  const searchUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&api_key=${apiKey}&hl=es&gl=cl`;
  console.log('[SerpApi] Searching:', query);

  const response = await fetch(searchUrl);
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`SerpApi HTTP ${response.status}: ${errorBody}`);
  }
  
  const data = (await response.json()) as SerpApiMapsResponse;

  if (data.error) {
    throw new Error(`SerpApi Error: ${data.error}`);
  }

  const results = data.local_results || [];
  console.log(`[SerpApi] Found ${results.length} results for: ${query}`);
  return results;
}

export async function syncSuppliersForCategory(
  categoryId: string,
  categorySlug: string,
  categoryName: string,
  regionName: string,
  regionSlug: string
) {
  const supabase = await createClient();

  // Usar el término de búsqueda optimizado o el nombre de categoría como fallback
  const searchTerm = CATEGORY_SEARCH_TERMS[categorySlug] || categoryName;
  const query = `${searchTerm} en ${regionName}, Chile`;
  
  const results = await searchSuppliersInGoogle(query);
  
  if (!results.length) return { count: 0, query };

  const suppliersToInsert = results.map((res) => ({
    name: res.title ?? "Proveedor sin nombre",
    category_id: categoryId,
    region_slug: regionSlug,
    address: res.address || null,
    phone: res.phone || null,
    website: res.website || null,
    google_rating:
      typeof res.rating === "number"
        ? res.rating
        : typeof res.rating === "string"
          ? parseFloat(res.rating)
          : null,
    google_place_id: res.place_id || null,
    latitude: res.gps_coordinates?.latitude || null,
    longitude: res.gps_coordinates?.longitude || null,
    raw_data: res,
  }));

  const { error } = await supabase
    .from('material_suppliers')
    .upsert(suppliersToInsert, { onConflict: 'google_place_id', ignoreDuplicates: false });

  if (error) {
    console.error('[Supabase] Upsert error:', error);
    throw new Error(`Error guardando en DB: ${error.message}`);
  }

  return { count: suppliersToInsert.length, query };
}
