import { createClient } from './server'

export async function getDashboardStats() {
  const supabase = await createClient()

  // 1. Get total models
  const { count: modelsCount } = await supabase
    .from('modelos')
    .select('*', { count: 'exact', head: true })

  // 2. Get total leads
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // 3. Get recent leads with their models
  const { data: recentLeads } = await supabase
    .from('leads')
    .select(`
      *,
      modelo:modelos (nombre)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // 4. Get views (mocking this as we don't have a views table yet, or using metadata if available)
  // Let's assume we have a simple views counter or just mock it for Phase 3 visual progress.
  const totalViews = 12842 // Placeholder for real analytics integration

  return {
    modelsCount: modelsCount || 0,
    leadsCount: leadsCount || 0,
    recentLeads: recentLeads || [],
    totalViews
  }
}

export async function getModelBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modelos')
    .select(`
      *,
      constructora:constructoras (*)
    `)
    .eq('slug', slug)
    .single()
  return data
}

export async function getModelosFiltered(filters: {
  tipo?: string
  minUF?: number
  maxUF?: number
  region?: string
}) {
  const supabase = await createClient()
  let query = supabase.from('modelos').select(`*, constructora:constructoras (*)`).eq('disponible', true)
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.minUF) query = query.gte('precio_desde_uf', filters.minUF)
  if (filters.maxUF) query = query.lte('precio_desde_uf', filters.maxUF)
  if (filters.region) query = query.contains('constructoras.regiones', [filters.region])
  const { data, error } = await query.order('created_at', { ascending: false })
  const planOrder: Record<string, number> = { premium: 0, pro: 1, gratis: 2 }
  return ((data as any[]) || []).sort((a, b) => {
    const planA = a.constructora?.plan || 'gratis'
    const planB = b.constructora?.plan || 'gratis'
    const planDiff = (planOrder[planA] ?? 2) - (planOrder[planB] ?? 2)
    if (planDiff !== 0) return planDiff
    return a.precio_desde_uf - b.precio_desde_uf
  })
}

export async function createLead(leadData: any) {
  const supabase = await createClient()
  return await supabase.from('leads').insert([leadData]).select()
}

export async function getModelsByIds(ids: string[]) {
  if (!ids.length) return [];
  const supabase = await createClient()
  const { data } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .in('id', ids)
  return data || []
}
