import { MetadataRoute } from 'next'
import { getModelosFiltered } from '@/lib/supabase/services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://solocasaschile.cl'

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

  // Dynamic model routes from Supabase
  let modelRoutes: MetadataRoute.Sitemap = []
  try {
    const modelos = await getModelosFiltered({})
    modelRoutes = modelos.map((m: any) => ({
      url: `${baseUrl}/modelo/${m.slug}`,
      lastModified: new Date(m.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Graceful fallback if DB not available
  }

  return [...staticRoutes, ...modelRoutes]
}
