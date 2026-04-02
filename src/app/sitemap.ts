import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://solocasaschile.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/constructoras`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/comparar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tipos/prefabricada`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tipos/sip`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tipos/container`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tipos/llave-en-mano`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const supabase = await createClient()

  // Dynamic model routes from Supabase
  let modelRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: modelos } = await supabase
      .from('modelos')
      .select('slug, created_at')
      .eq('disponible', true)
    modelRoutes = (modelos || []).map((m: { slug: string; created_at: string }) => ({
      url: `${baseUrl}/modelo/${m.slug}`,
      lastModified: new Date(m.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Graceful fallback if DB not available
  }

  // Dynamic constructora routes from Supabase
  let constructoraRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: constructoras } = await supabase
      .from('constructoras')
      .select('slug, created_at')
    constructoraRoutes = (constructoras || []).map((c: { slug: string; created_at: string }) => ({
      url: `${baseUrl}/constructora/${c.slug}`,
      lastModified: new Date(c.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // Graceful fallback
  }

  return [...staticRoutes, ...modelRoutes, ...constructoraRoutes]
}
