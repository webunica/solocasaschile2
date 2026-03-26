import { createClient } from './server'

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
  score?: number;
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
  };
};

/** Stats del dashboard filtradas por la constructora autenticada */
export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''

  const { count: modelsCount } = await supabase
    .from('modelos')
    .select('*', { count: 'exact', head: true })
    .eq('constructora_id', userId)

  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('constructora_id', userId)

  const { data: recentLeads } = await supabase
    .from('leads')
    .select(`*, modelo:modelos (nombre)`)
    .eq('constructora_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    modelsCount: modelsCount || 0,
    leadsCount: leadsCount || 0,
    recentLeads: recentLeads || [],
    totalViews: null, // Pendiente integración con Vercel Analytics
  }
}

export async function getModelBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .eq('slug', slug)
    .single()
  return data
}

import { MODELOS } from '@/lib/mock-data'

export async function getModelosFiltered(filters: {
  tipo?: string
  minUF?: number
  maxUF?: number
  region?: string
  sortBy?: string
}) {
  const supabase = await createClient()
  
  // 1. Fetch real data from Supabase
  let query = supabase.from('modelos').select(`*, constructora:constructoras (*)`).eq('disponible', true)
  
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.minUF) query = query.gte('precio_desde_uf', filters.minUF)
  if (filters.maxUF) query = query.lte('precio_desde_uf', filters.maxUF)
  if (filters.region) query = query.contains('constructoras.regiones', [filters.region])

  const { data: dbData } = await query

  // 2. Map DB data (snake_case) to standard UI format (camelCase) if needed
  // Note: Most of our UI components are actually using camelCase from mock-data
  // but the DB returns snake_case. Let's ensure consistency.
  const mappedDbData = (dbData as any[] || []).map(m => ({
    id: m.id,
    nombre: m.nombre,
    slug: m.slug,
    tipo: m.tipo,
    superficieM2: m.superficie_m2,
    dormitorios: m.dormitorios,
    banos: m.banos,
    precioDesdeUF: m.precio_desde_uf,
    imagenes: m.imagenes_urls || [],
    tiempoEntrega: m.tiempo_entrega,
    descripcion: m.descripcion,
    disponible: m.disponible,
    constructora: m.constructora ? {
      id: m.constructora.id,
      nombre: m.constructora.nombre,
      slug: m.constructora.slug,
      logo: m.constructora.logo_url,
      descripcion: m.constructora.descripcion,
      plan: m.constructora.plan,
      verificada: m.constructora.verificada,
      scoreConfianza: m.constructora.score_confianza,
      regiones: m.constructora.regiones,
    } : null
  }))

  // 3. Merge with Showcase Mock Data (Austral SIP example)
  // We map mock data to match the merged structure
  const showcaseData = MODELOS.map(m => ({
    id: m.id,
    nombre: m.nombre,
    slug: m.slug,
    tipo: m.tipo,
    superficieM2: m.superficieM2,
    dormitorios: m.dormitorios,
    banos: m.banos,
    precioDesdeUF: m.precioDesdeUF,
    imagenes: m.imagenes || [],
    tiempoEntrega: m.tiempoEntrega,
    descripcion: m.descripcion,
    disponible: m.disponible,
    constructora: {
      id: m.constructoraId,
      nombre: m.constructoraNombre,
      slug: m.constructoraSlug,
      plan: m.constructoraPlan,
      verificada: true,
      scoreConfianza: 100,
      logo: m.imagenes[0], // Fallback if no logo
    }
  }))

  const filteredMocks = showcaseData.filter(m => {
    if (filters.tipo && m.tipo !== filters.tipo) return false
    if (filters.minUF && m.precioDesdeUF < filters.minUF) return false
    if (filters.maxUF && m.precioDesdeUF > filters.maxUF) return false
    return true
  })

  const allData = [...filteredMocks, ...mappedDbData]

  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2 }
  
  const sorted = allData.sort((a, b) => {
    // Priority 0: Specific ID (Showcase first)
    if (a.id === 'm0') return -1
    if (b.id === 'm0') return 1

    const planA = (a.constructora as any)?.plan || 'gratis'
    const planB = (b.constructora as any)?.plan || 'gratis'
    const planDiff = (planOrder[planA] ?? 2) - (planOrder[planB] ?? 2)
    
    if (filters.sortBy === 'price_asc') return a.precioDesdeUF - b.precioDesdeUF
    if (filters.sortBy === 'price_desc') return b.precioDesdeUF - a.precioDesdeUF
    if (filters.sortBy === 'm2_desc') return b.superficieM2 - a.superficieM2

    // Default: Plan Priority > Price Asc
    if (planDiff !== 0) return planDiff
    return a.precioDesdeUF - b.precioDesdeUF
  })

  return sorted
}

/** Modelos pertenecientes a la constructora autenticada (dashboard privado) */
export async function getModelosByConstructora() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .eq('constructora_id', user.id)
    .order('created_at', { ascending: false })
  return (data as ModelWithConstructora[]) || []
}

export async function createLead(leadData: any) {
  const supabase = await createClient()
  return await supabase.from('leads').insert([leadData]).select()
}

export async function getModelsByIds(ids: string[]) {
  if (!ids.length) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .in('id', ids)
  return data || []
}

/** Elimina un modelo asegurando que pertenece al usuario autenticado */
export async function deleteModelo(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { error } = await supabase
    .from('modelos')
    .delete()
    .eq('id', id)
    .eq('constructora_id', user.id)
  if (error) throw error
}
