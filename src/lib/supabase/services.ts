import { cache } from 'react'
import { createClient } from './server'
import { MODELOS } from '@/lib/mock-data'

export type ModelWithConstructora = {
  id: string;
  constructora_id: string;
  nombre: string;
  slug: string;
  tipo: string;
  superficie_m2: number;
  dormitorios: number;
  banos: number;
  precio_desde_uf: number;
  imagenes_urls: string[];
  tiempo_entrega: string;
  descripcion: string;
  disponible: boolean;
  video_url?: string;
  garantia_anos?: number;
  postventa?: boolean;
  especificaciones?: Record<string, string>;
  score?: number;
  visitas?: number;
  // SEO fields
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  seo_og_image?: string | null;
  canonical_url?: string | null;
  // Expanded fields
  pisos?: number | null;
  codigo_modelo?: string | null;
  uso?: string | null;
  recintos?: string[] | null;
  construccion?: any;
  aislacion?: any;
  terminaciones?: any;
  instalaciones?: any;
  logistica?: any;
  soporte?: any;
  constructora: {
    id: string;
    nombre: string;
    slug: string;
    logo_url: string;
    descripcion: string;
    plan: string;
    verificada: boolean;
    score_confianza: number;
    regiones: string[];
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
  };
};

/** Stats del dashboard filtradas por la constructora autenticada */
export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''
  const isSuperAdmin = user?.app_metadata?.is_superadmin === true;

  let modelsQuery = supabase.from('modelos').select('*', { count: 'exact', head: true })
  let leadsQuery = supabase.from('leads').select('*', { count: 'exact', head: true })
  let recentLeadsQuery = supabase.from('leads').select(`*, modelo:modelos (nombre)`).order('created_at', { ascending: false }).limit(10)
  let constructoraQuery = supabase
    .from('constructoras')
    .select('nombre, score_confianza, verificada')
    .eq('id', userId)
    .maybeSingle()

  if (!isSuperAdmin) {
    modelsQuery = modelsQuery.eq('constructora_id', userId)
    leadsQuery = leadsQuery.eq('constructora_id', userId)
    recentLeadsQuery = recentLeadsQuery.eq('constructora_id', userId)
  }

  // async-parallel: run all 4 queries concurrently instead of sequentially
  const [
    { data: constructora },
    { count: modelsCount },
    { count: leadsCount },
    { data: recentLeads },
  ] = await Promise.all([
    constructoraQuery,
    modelsQuery,
    leadsQuery,
    recentLeadsQuery,
  ])

  return {
    companyName: constructora?.nombre || 'Constructora',
    confidenceScore: constructora?.score_confianza || 0,
    isVerified: constructora?.verificada || false,
    modelsCount: modelsCount || 0,
    leadsCount: leadsCount || 0,
    recentLeads: recentLeads || [],
    totalViews: (leadsCount || 0) * 22 + (modelsCount || 0) * 45,
  }
}

export async function getModelById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .eq('id', id)
    .maybeSingle()
  
  if (data && !error) {
    return {
      ...data,
      imagenes_urls: data.imagenes_urls || [],
      precio_desde_uf: data.precio_desde_uf || 0,
      constructora: data.constructora || null
    } as ModelWithConstructora;
  }
  return null;
}

// server-cache-react: deduplicate identical slug lookups within the same RSC request
export const getModelBySlug = cache(async function getModelBySlug(slug: string) {
  const supabase = await createClient()
  
  // 1. Intentar obtener de Supabase
  const { data, error } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .eq('slug', slug)
    .maybeSingle()
  
  if (data && !error) {
    // Asegurar compatibilidad (algunos campos podrían venir null de DB)
    return {
      ...data,
      imagenes_urls: data.imagenes_urls || [],
      precio_desde_uf: data.precio_desde_uf || 0,
      constructora: data.constructora ? {
        ...data.constructora,
        id: data.constructora.id || data.constructora_id,
        score_confianza: data.constructora.score_confianza || 0,
        logo_url: data.constructora.logo_url || '/placeholder.png'
      } : {
        id: 'external',
        nombre: 'Constructora No Asignada',
        plan: 'gratis',
        score_confianza: 0,
        verificada: false,
        slug: 'unknown',
        logo_url: '/placeholder.png',
        regiones: []
      }
    } as ModelWithConstructora;
  }

  // 2. Fallback to Mocks
  const mock = MODELOS.find(m => m.slug === slug);
  if (mock) {
    return {
      id: mock.id,
      constructora_id: mock.constructoraId,
      nombre: mock.nombre,
      slug: mock.slug,
      tipo: mock.tipo,
      superficie_m2: mock.superficieM2,
      dormitorios: mock.dormitorios,
      banos: mock.banos,
      precio_desde_uf: mock.precioDesdeUF,
      imagenes_urls: mock.imagenes || [],
      tiempo_entrega: mock.tiempoEntrega,
      descripcion: mock.descripcion,
      disponible: mock.disponible,
      garantia_anos: mock.garantiaAnos,
      postventa: mock.postventa,
      especificaciones: mock.especificaciones,
      constructora: {
        id: mock.constructoraId,
        nombre: mock.constructoraNombre,
        slug: mock.constructoraSlug,
        plan: mock.constructoraPlan,
        verificada: true,
        score_confianza: 100,
        logo_url: mock.imagenes[0], 
        regiones: ["Metropolitana"],
        descripcion: "Constructora referente de alta eficiencia."
      }
    } as ModelWithConstructora;
  }

  return null;
});

export async function getModelosFiltered(filters: {
  tipo?: string
  minUF?: number
  maxUF?: number
  region?: string
  sortBy?: string
}) {
  const supabase = await createClient()
  
  // 1. Fetch real data from Supabase
  // Narrow constructora columns to avoid fetching unused data (server-serialization)
  let query = supabase
    .from('modelos')
    .select(`*, constructora:constructoras (id, nombre, slug, logo_url, plan, verificada, score_confianza, regiones, descripcion, seo_title, seo_description, seo_keywords)`)
    .eq('disponible', true)
  
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.minUF) query = query.gte('precio_desde_uf', filters.minUF)
  if (filters.maxUF) query = query.lte('precio_desde_uf', filters.maxUF)
  if (filters.region) query = query.contains('constructoras.regiones', [filters.region])

  const { data: dbData } = await query

  // 2. Map DB data to ensure it matches ModelWithConstructora perfectly
  const mappedDbData = (dbData as any[] || []).map(m => ({
    ...m,
    imagenes_urls: m.imagenes_urls || [],
    precio_desde_uf: m.precio_desde_uf || 0,
    constructora: m.constructora ? {
      ...m.constructora,
      logo_url: m.constructora.logo_url || '/placeholder.png', // Corregido: antes puse logo
      score_confianza: m.constructora.score_confianza || 0
    } : null
  })) as ModelWithConstructora[]

  // 3. Merge with Showcase Mock Data (Austral SIP example)
  // We map mock data to match the ModelWithConstructora (snake_case)
  const showcaseData = MODELOS.map(m => ({
    id: m.id,
    constructora_id: m.constructoraId,
    nombre: m.nombre,
    slug: m.slug,
    tipo: m.tipo,
    superficie_m2: m.superficieM2,
    dormitorios: m.dormitorios,
    banos: m.banos,
    precio_desde_uf: m.precioDesdeUF,
    imagenes_urls: m.imagenes || [],
    tiempo_entrega: m.tiempoEntrega,
    descripcion: m.descripcion,
    disponible: m.disponible,
    garantia_anos: m.garantiaAnos,
    postventa: m.postventa,
    constructora: {
      id: m.constructoraId,
      nombre: m.constructoraNombre,
      slug: m.constructoraSlug,
      plan: m.constructoraPlan,
      verificada: true,
      score_confianza: 100,
      logo_url: m.imagenes[0], 
      regiones: ["Metropolitana", "Valparaíso", "Biobío", "Los Lagos"],
      descripcion: "Expertos en construcción modular SIP de alta eficiencia."
    }
  })) as ModelWithConstructora[]

  const filteredMocks = showcaseData.filter(m => {
    if (filters.tipo && m.tipo !== filters.tipo) return false
    if (filters.minUF && m.precio_desde_uf < filters.minUF) return false
    if (filters.maxUF && m.precio_desde_uf > filters.maxUF) return false
    return true
  })

  // 3. Keep DB models first and filter out Mocks that share the same slug (Priority to DB/User content)
  const dbSlugs = new Set(mappedDbData.map(m => m.slug))
  const uniqueMocks = filteredMocks.filter(m => !dbSlugs.has(m.slug))
  
  const allData = [...mappedDbData, ...uniqueMocks]

  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2 }
  
  const sorted = allData.sort((a, b) => {
    // Priority 0: Specific ID (Showcase first)
    if (a.id === 'm0') return -1
    if (b.id === 'm0') return 1

    const planA = a.constructora?.plan || 'gratis'
    const planB = b.constructora?.plan || 'gratis'
    const planDiff = (planOrder[planA] ?? 2) - (planOrder[planB] ?? 2)
    
    if (filters.sortBy === 'price_asc') return a.precio_desde_uf - b.precio_desde_uf
    if (filters.sortBy === 'price_desc') return b.precio_desde_uf - a.precio_desde_uf
    if (filters.sortBy === 'm2_desc') return b.superficie_m2 - a.superficie_m2

    // Default: Plan Priority > Price Asc
    if (planDiff !== 0) return planDiff
    return a.precio_desde_uf - b.precio_desde_uf
  })

  return sorted
}

/** Modelos pertenecientes a la constructora autenticada (dashboard privado) */
export async function getModelosByConstructora() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();
  const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

  let query = supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .order('created_at', { ascending: false })
  
  if (!isSuperAdmin) {
    query = query.eq('constructora_id', user.id)
  }

  const { data, error } = await query
  
  if (error) {
    console.error("DEBUG: Error al obtener modelos:", error);
    return [];
  }

  return (data as ModelWithConstructora[]) || []
}

export async function createLead(leadData: any) {
  const supabase = await createClient()
  return await supabase.from('leads').insert([leadData]).select()
}

export async function getModelsByIds(ids: string[]) {
  if (!ids.length) return []
  const supabase = await createClient()
  const dbIds = ids.filter(id => /^[0-9a-f-]{36}$/i.test(id));
  const { data: dbData } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .in('id', dbIds)

  const mappedDbData = (dbData as any[] || []).map(m => ({
    ...m,
    imagenes_urls: m.imagenes_urls || [],
    precio_desde_uf: m.precio_desde_uf || 0,
    constructora: m.constructora ? {
      ...m.constructora,
      id: m.constructora.id || m.constructora_id,
      score_confianza: m.constructora.score_confianza || 0,
      logo_url: m.constructora.logo_url || '/placeholder.png'
    } : null
  })) as ModelWithConstructora[]
  
  const mocks = MODELOS.filter(m => ids.includes(m.id)).map(mock => ({
      id: mock.id,
      constructora_id: mock.constructoraId,
      nombre: mock.nombre,
      slug: mock.slug,
      tipo: mock.tipo,
      superficie_m2: mock.superficieM2,
      dormitorios: mock.dormitorios,
      banos: mock.banos,
      precio_desde_uf: mock.precioDesdeUF,
      imagenes_urls: mock.imagenes || [],
      tiempo_entrega: mock.tiempoEntrega,
      descripcion: mock.descripcion,
      disponible: mock.disponible,
      garantia_anos: mock.garantiaAnos,
      postventa: mock.postventa,
      especificaciones: mock.especificaciones,
      constructora: {
        id: mock.constructoraId,
        nombre: mock.constructoraNombre,
        slug: mock.constructoraSlug,
        plan: mock.constructoraPlan,
        verificada: true,
        score_confianza: 100,
        logo_url: mock.imagenes[0] || '/placeholder.png', 
      }
  })) as ModelWithConstructora[];

  return [...mocks, ...mappedDbData]
}


// server-cache-react: deduplicate per-request slug lookups
export const getConstructoraBySlug = cache(async function getConstructoraBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('constructoras')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  
  if (data && !error) return data;
  
  // Fallback to mocks
  const { CONSTRUCTORAS } = await import('@/lib/mock-data');
  const mock = CONSTRUCTORAS.find(c => c.slug === slug);
  if (mock) {
    return {
      ...mock,
      logo_url: mock.logo,
      score_confianza: mock.scoreConfianza,
      verificada: mock.verificada,
      regiones: mock.regiones,
    };
  }
  
  return null;
});

export async function getModelsByConstructoraId(id: string) {
  const supabase = await createClient()

  // Narrow columns — avoid select(*) which pulls all JSON fields
  const { data, error } = await supabase
    .from('modelos')
    .select('id, nombre, slug, tipo, superficie_m2, dormitorios, banos, precio_desde_uf, imagenes_urls, tiempo_entrega, disponible')
    .eq('constructora_id', id)
    .eq('disponible', true)
    .order('precio_desde_uf', { ascending: true });

  if (error) return [];

  // Mocks: use static import (already loaded at module level) — avoid dynamic import overhead
  const mocks = MODELOS.filter(m => m.constructoraId === id);
  const mappedMocks = mocks.map(m => ({
    id: m.id,
    nombre: m.nombre,
    precio_desde_uf: m.precioDesdeUF,
    superficie_m2: m.superficieM2,
    dormitorios: m.dormitorios,
    banos: m.banos,
    imagenes_urls: m.imagenes,
    slug: m.slug,
    tipo: m.tipo,
    disponible: m.disponible,
    tiempo_entrega: m.tiempoEntrega,
  }));

  return [...(data || []), ...mappedMocks];
}
