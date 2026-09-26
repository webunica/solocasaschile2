import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createClient, createPublicClient } from './server'
import { MODELOS } from '@/lib/mock-data'
import { MODELOS_MASTER, CONSTRUCTORA_MASTER_DATA } from '@/data/catalogo-modelos-master'
import { getRegionDisplayName } from '@/lib/regions'

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
  construccion?: Record<string, unknown> | null;
  aislacion?: Record<string, unknown> | null;
  terminaciones?: Record<string, unknown> | null;
  instalaciones?: Record<string, unknown> | null;
  logistica?: Record<string, unknown> | null;
  soporte?: Record<string, unknown> | null;
  is_featured?: boolean;
  featured_order?: number;
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
    testimonios?: Array<Record<string, unknown>> | null;
  };
};

type LeadInsertDTO = {
  constructora_id?: string;
  modelo_id?: string;
  nombre_cliente?: string;
  email_cliente?: string;
  telefono_cliente?: string;
  region_cliente?: string;
  mensaje?: string;
  estado?: string;
  [key: string]: unknown;
};

type RawConstructoraRow = Partial<ModelWithConstructora["constructora"]> & {
  id?: string;
  logo_url?: string | null;
  score_confianza?: number | null;
  regiones?: string[];
};

type RawModelRow = Partial<ModelWithConstructora> & {
  constructora?: RawConstructoraRow | null;
  constructora_id?: string;
  imagenes_urls?: string[];
  precio_desde_uf?: number;
};

export type PublicConstructoraProject = {
  id: string;
  nombre: string;
  region: string | null;
  comuna: string | null;
  estado: string;
  porcentaje_avance: number;
  thumbnail_url: string | null;
  tipo_construccion: string | null;
  created_at: string;
};

/** Obtiene los últimos posts para el mega menu (con caché) */
export async function getLatestBlogPosts(limit = 2) {
  return unstable_cache(
    async (limit: number) => {
      try {
        const supabase = await createPublicClient()
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Error fetching latest blog posts:", error)
        return []
      }
    },
    ['latest-blog-posts', limit.toString()],
    { revalidate: 3600, tags: ['blog'] }
  )(limit)
}

/** Stats del dashboard filtradas por la constructora autenticada */
export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''
  
  // 1. Fetch profile to check role and subscription
  const { data: profile } = await supabase
    .from('constructoras')
    .select('role, nombre, score_confianza, verificada, plan, plan_cycle, plan_status, next_billing_date')
    .eq('id', userId)
    .maybeSingle();
    
  const isSuperAdmin = profile?.role === 'superadmin' || user?.app_metadata?.is_superadmin === true;
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
  const isVendedor = profile?.role === 'vendedor';
  const canViewAllLeads = isSuperAdmin || isAdmin || isVendedor;

  let modelsQuery = supabase.from('modelos').select('*', { count: 'exact', head: true })
  let leadsQuery = supabase.from('leads').select('*', { count: 'exact', head: true })
  let recentLeadsQuery = supabase.from('leads').select(`*, modelo:modelos (nombre)`).order('created_at', { ascending: false }).limit(10)
  
  if (!isSuperAdmin && !isAdmin) {
    modelsQuery = modelsQuery.eq('constructora_id', userId)
  }

  if (!canViewAllLeads) {
    leadsQuery = leadsQuery.eq('constructora_id', userId)
    recentLeadsQuery = recentLeadsQuery.eq('constructora_id', userId)
  }

  // async-parallel: run all queries concurrently
  const [
    { count: modelsCount },
    { count: leadsCount },
    { data: recentLeads },
  ] = await Promise.all([
    modelsQuery,
    leadsQuery,
    recentLeadsQuery,
  ])

  return {
    companyName: profile?.nombre || 'Constructora',
    confidenceScore: profile?.score_confianza || 0,
    isVerified: profile?.verificada || false,
    plan: profile?.plan || 'gratis',
    planCycle: profile?.plan_cycle || 'monthly',
    planStatus: profile?.plan_status || 'active',
    nextBillingDate: profile?.next_billing_date,
    modelsCount: modelsCount || 0,
    leadsCount: leadsCount || 0,
    recentLeads: recentLeads || [],
    totalViews: (leadsCount || 0) * 22 + (modelsCount || 0) * 45,
    generatedAtMs: Date.now(),
  }
}


export async function getModelById(id: string) {
  const supabase = await createPublicClient()
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

// server-cache: shared cache for models detail
export const getModelBySlug = cache(async (slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      // 1. Check authoritative architectural models of Constructora Master
      const masterModel = MODELOS_MASTER.find(m => m.slug === slug);
      if (masterModel) {
        return masterModel;
      }

      const supabase = await createPublicClient()
      const { data, error } = await supabase
        .from('modelos')
        .select(`*, constructora:constructoras (*)`)
        .eq('slug', slug)
        .maybeSingle()
      
      if (data && !error) {
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

      return null;
    },
    ['model-detail', slug],
    { revalidate: 3600, tags: ['modelos', `model-${slug}`] }
  )(slug)
})

// getRegionDisplayName se movió a @/lib/regions

/** Modelos filtrados del catálogo público (con caché) */
export async function getModelosFiltered(filters: {
  tipo?: string
  minUF?: number
  maxUF?: number
  region?: string
  sortBy?: string
  dormitorios?: number
  banosMin?: number
  superficieMin?: number
  superficieMax?: number
  uso?: string
}) {
  return unstable_cache(
    async (filters) => {
      const regionDisp = getRegionDisplayName(filters.region);

      // Modelos autorizados del catálogo oficial (Constructora Master)
      let models = [...MODELOS_MASTER];

      if (filters.tipo) {
        models = models.filter(m => m.tipo === filters.tipo);
      }

      if (regionDisp) {
        models = models.filter(m => {
          const regiones: string[] = m.constructora?.regiones || [];
          return regiones.includes(regionDisp);
        });
      }

      if (filters.minUF !== undefined && filters.minUF > 0) {
        models = models.filter(m => (m.precio_desde_uf || 0) >= filters.minUF!);
      }

      if (filters.maxUF !== undefined) {
        models = models.filter(m => (m.precio_desde_uf || 0) <= filters.maxUF!);
      }

      // Filtros de características de vivienda
      if (filters.dormitorios !== undefined) {
        if (filters.dormitorios >= 4) {
          models = models.filter(m => m.dormitorios >= 4);
        } else {
          models = models.filter(m => m.dormitorios === filters.dormitorios);
        }
      }

      if (filters.banosMin !== undefined) {
        models = models.filter(m => m.banos >= filters.banosMin!);
      }

      if (filters.superficieMin !== undefined) {
        models = models.filter(m => m.superficie_m2 >= filters.superficieMin!);
      }

      if (filters.superficieMax !== undefined) {
        models = models.filter(m => m.superficie_m2 <= filters.superficieMax!);
      }

      if (filters.uso) {
        const usoLower = filters.uso.toLowerCase();
        models = models.filter(m =>
          m.uso?.toLowerCase().includes(usoLower) ||
          m.descripcion?.toLowerCase().includes(usoLower)
        );
      }

      const sorted = models.sort((a, b) => {
        if (filters.sortBy === 'm2_desc') return b.superficie_m2 - a.superficie_m2;
        if (filters.sortBy === 'm2_asc') return a.superficie_m2 - b.superficie_m2;
        return (a.featured_order || 0) - (b.featured_order || 0);
      });

      return sorted;
    },
    ['catalog-filtered', JSON.stringify(filters)],
    { revalidate: 1800, tags: ['modelos', 'catalog'] }
  )(filters)
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
    .select(`*, constructora:constructoras (*), is_featured, featured_order`)
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

export async function createLead(leadData: LeadInsertDTO) {
  const supabase = await createPublicClient()
  return await supabase.from('leads').insert([leadData]).select()
}

export async function getModelsByIds(ids: string[]) {
  if (!ids.length) return []
  const masterMatches = MODELOS_MASTER.filter(m => ids.includes(m.id));
  if (masterMatches.length > 0) {
    return masterMatches;
  }

  const supabase = await createPublicClient()
  const dbIds = ids.filter(id => /^[0-9a-f-]{36}$/i.test(id));
  const { data: dbData } = await supabase
    .from('modelos')
    .select(`*, constructora:constructoras (*)`)
    .in('id', dbIds)

  const mappedDbData = (dbData ?? []).map((m: RawModelRow) => ({
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
  
  return mappedDbData;
}


// server-cache-react: deduplicate per-request slug lookups
export const getConstructoraBySlug = cache(async function getConstructoraBySlug(slug: string) {
  const supabase = await createPublicClient()

  if (slug === 'constructora-master' || slug === 'javier-cb85b919') {
    const { data: dbMaster } = await supabase
      .from('constructoras')
      .select('*')
      .or('slug.eq.constructora-master,slug.eq.javier-cb85b919,id.eq.cb85b919-4008-46bc-bbb8-b3211152280c')
      .maybeSingle()
    if (dbMaster) return dbMaster;
    const { CONSTRUCTORAS } = await import('@/lib/mock-data');
    const masterMock = CONSTRUCTORAS.find(c => c.nombre.includes("Master") || c.slug === "javier-cb85b919") || CONSTRUCTORAS[0];
    return {
      ...masterMock,
      logo_url: masterMock.logo,
      score_confianza: masterMock.scoreConfianza,
      verificada: masterMock.verificada,
      regiones: masterMock.regiones,
    };
  }

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
  if (id === CONSTRUCTORA_MASTER_DATA.id || id === 'master' || id === 'javier-cb85b919') {
    return MODELOS_MASTER.map(m => ({
      id: m.id,
      nombre: m.nombre,
      precio_desde_uf: m.precio_desde_uf,
      superficie_m2: m.superficie_m2,
      dormitorios: m.dormitorios,
      banos: m.banos,
      imagenes_urls: m.imagenes_urls,
      slug: m.slug,
      tipo: m.tipo,
      disponible: m.disponible,
      tiempo_entrega: m.tiempo_entrega,
    }));
  }

  const supabase = await createPublicClient()

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

/**
 * Obtiene los sellos aprobados de una constructora, enriquecidos con el catálogo.
 * Retorna vacío si las tablas aún no existen (graceful fallback).
 */
export async function getSellosDeConstructora(constructoraId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('constructora_sellos')
      .select(`
        id,
        estado,
        otorgado_at,
        sello:sello_id (
          id,
          slug,
          nombre,
          descripcion,
          tipo,
          icono_url
        )
      `)
      .eq('constructora_id', constructoraId)
      .eq('estado', 'aprobado')
      .order('otorgado_at', { ascending: true });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

/** Obtiene la configuración de publicidad del Mega Menú */
export async function getMegaMenuAds() {
  try {
    const supabase = await createPublicClient();
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'mega_menu_ads')
      .maybeSingle();

    if (!setting?.value) return null;

    const { featuredConstructoraId, featuredModeloId } = setting.value;

    const [constructora, modelo] = await Promise.all([
      featuredConstructoraId ? getConstructoraById(featuredConstructoraId) : null,
      featuredModeloId ? getModelById(featuredModeloId) : null
    ]);

    return {
      constructora,
      modelo
    };
  } catch (error) {
    console.error("Error fetching mega menu ads:", error);
    return null;
  }
}

/** Obtiene modelos destacados filtrados por region (con caché) */
export async function getFeaturedModelsByRegion(regionSlug?: string) {
  return unstable_cache(
    async (regionSlug?: string) => {
      try {
        const regionDisp = getRegionDisplayName(regionSlug);
        let models = [...MODELOS_MASTER];

        if (regionDisp) {
          models = models.filter(m => {
            const regiones: string[] = m.constructora?.regiones || [];
            return regiones.includes(regionDisp);
          });
        }

        return models.sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0)).slice(0, 10);
      } catch (error) {
        console.error("Error fetching featured models:", error);
        return [];
      }
    },
    ['featured-models', regionSlug || 'all'],
    { revalidate: 1800, tags: ['modelos', 'featured'] }
  )(regionSlug)
}

async function getConstructoraById(id: string) {
  const supabase = await createPublicClient();
  const { data } = await supabase
    .from('constructoras')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data;
}

/** Proyectos publicos marcados para mostrarse en el perfil de una constructora. */
export async function getPublicProjectsByConstructoraId(
  constructoraId: string,
): Promise<PublicConstructoraProject[]> {
  try {
    const supabase = await createPublicClient();
    const { data, error } = await supabase
      .from('obra_projects')
      .select('id, nombre, region, comuna, estado, porcentaje_avance, thumbnail_url, tipo_construccion, created_at')
      .eq('constructora_id', constructoraId)
      .eq('visible_en_perfil', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching public constructora projects:", error);
      return [];
    }

    return (data ?? []) as PublicConstructoraProject[];
  } catch (error) {
    console.error("Unexpected error fetching public constructora projects:", error);
    return [];
  }
}
