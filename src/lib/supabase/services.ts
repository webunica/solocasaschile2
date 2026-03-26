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

export async function getModelosFiltered(filters: {
  tipo?: string
  minUF?: number
  maxUF?: number
  region?: string
  sortBy?: string
}) {
  const supabase = await createClient()
  let query = supabase.from('modelos').select(`*, constructora:constructoras (*)`).eq('disponible', true)
  
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.minUF) query = query.gte('precio_desde_uf', filters.minUF)
  if (filters.maxUF) query = query.lte('precio_desde_uf', filters.maxUF)
  if (filters.region) query = query.contains('constructoras.regiones', [filters.region])

  const { data } = await query

  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2 }
  
  const sorted = ((data as any[]) || []).sort((a, b) => {
    // 1. Business logic: Plan priority is the first criteria UNLESS a specific sort is active (optional choice)
    // Actually, in UX, if I sort by "Price Asc", I expect the cheapest first, regardless of plan.
    // But usually, Premium houses pay to be seen first. I'll maintain plan priority as a primary sort.
    const planA = a.constructora?.plan || 'gratis'
    const planB = b.constructora?.plan || 'gratis'
    const planDiff = (planOrder[planA] ?? 2) - (planOrder[planB] ?? 2)
    
    // If we have a custom sort, we can decide if it overrides plan priority. 
    // Usually, the best UX is for sorting to override priority, but we can keep priority as a tie-breaker.
    
    if (filters.sortBy === 'price_asc') return a.precio_desde_uf - b.precio_desde_uf
    if (filters.sortBy === 'price_desc') return b.precio_desde_uf - a.precio_desde_uf
    if (filters.sortBy === 'm2_desc') return b.superficie_m2 - a.superficie_m2
    if (filters.sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

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
