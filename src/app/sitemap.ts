import type { MetadataRoute } from "next";
import { CONSTRUCTORAS, MODELOS } from "@/lib/mock-data";
import { createPublicClient } from "@/lib/supabase/server";

const SITE_URL = "https://solocasaschile.com";
const RELEASE_BASELINE_DATE = new Date("2026-04-13T00:00:00.000Z");

type SitemapModelRow = {
  slug: string | null;
};

type SitemapConstructoraRow = {
  slug: string | null;
};

type SitemapBlogPostRow = {
  slug: string | null;
  created_at: string | null;
};

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/catalogo`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "daily", priority: 0.95 },
  { url: `${SITE_URL}/constructoras`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/blog`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.75 },
  { url: `${SITE_URL}/comparar`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/nosotros`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "monthly", priority: 0.55 },
  { url: `${SITE_URL}/privacidad`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "yearly", priority: 0.2 },
  { url: `${SITE_URL}/terminos`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "yearly", priority: 0.2 },
  { url: `${SITE_URL}/tipos/prefabricada`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.75 },
  { url: `${SITE_URL}/tipos/sip`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.75 },
  { url: `${SITE_URL}/tipos/container`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.65 },
  { url: `${SITE_URL}/tipos/modular`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.65 },
  { url: `${SITE_URL}/tipos/llave-en-mano`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.65 },
  { url: `${SITE_URL}/tipos/steel-framing`, lastModified: RELEASE_BASELINE_DATE, changeFrequency: "weekly", priority: 0.6 },
];

function uniqueUrls(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createPublicClient();

  const [modelosResult, constructorasResult, blogResult] = await Promise.all([
    supabase
      .from("modelos")
      .select("slug")
      .eq("disponible", true)
      .not("slug", "is", null)
      .limit(50000),
    supabase
      .from("constructoras")
      .select("slug")
      .not("slug", "is", null)
      .limit(50000),
    supabase
      .from("blog_posts")
      .select("slug, created_at")
      .eq("is_published", true)
      .not("slug", "is", null)
      .limit(50000),
  ]);

  const dbModelos = (modelosResult.data ?? []) as SitemapModelRow[];
  const dbConstructoras = (constructorasResult.data ?? []) as SitemapConstructoraRow[];
  const dbPosts = (blogResult.data ?? []) as SitemapBlogPostRow[];

  const modelRoutes: MetadataRoute.Sitemap = [
    ...MODELOS.map((modelo) => modelo.slug),
    ...dbModelos.map((modelo) => modelo.slug),
  ]
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${SITE_URL}/modelo/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const constructoraRoutes: MetadataRoute.Sitemap = [
    ...CONSTRUCTORAS.map((constructora) => constructora.slug),
    ...dbConstructoras.map((constructora) => constructora.slug),
  ]
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${SITE_URL}/constructora/${slug}`,
      changeFrequency: "weekly",
      priority: 0.72,
    }));

  const blogRoutes: MetadataRoute.Sitemap = dbPosts
    .filter((post): post is { slug: string; created_at: string | null } => Boolean(post.slug))
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.created_at ? new Date(post.created_at) : RELEASE_BASELINE_DATE,
      changeFrequency: "monthly",
      priority: 0.62,
    }));

  return uniqueUrls([...staticRoutes, ...modelRoutes, ...constructoraRoutes, ...blogRoutes]);
}
