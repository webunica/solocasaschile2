-- P2 data governance support.
-- Adds low-risk indexes and metadata comments for SEO/release-critical flows.

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created_at
ON public.blog_posts (created_at DESC)
WHERE is_published = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_published_slug
ON public.blog_posts (slug)
WHERE is_published = true;

COMMENT ON INDEX public.idx_blog_posts_published_created_at
IS 'Supports blog listing and sitemap lastModified ordering for published posts.';

COMMENT ON INDEX public.idx_blog_posts_published_slug
IS 'Ensures canonical blog post slugs remain unique for published content.';

COMMENT ON TABLE public.modelos
IS 'Public catalog models. slug + disponible control canonical public model URLs and sitemap inclusion.';

COMMENT ON TABLE public.constructoras
IS 'Builder profiles. slug controls canonical public constructora URLs; plan/verificada/score_confianza drive directory ranking.';

COMMENT ON TABLE public.blog_posts
IS 'Editorial content. is_published + slug control public visibility and sitemap inclusion.';

COMMENT ON TABLE public.leads
IS 'Lead capture records. Public inserts must go through the server-side leads API and hardened RLS policy.';
