-- ========== TABLA DE BLOG POSTS ==========
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content_md text NOT NULL,
  category text DEFAULT 'General',
  target_audience text,
  cover_image_url text,
  seo_keywords text[],
  is_published boolean DEFAULT true,
  social_hook_fired boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========== POLÍTICAS DE SEGURIDAD (RLS) ==========
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política lectura: Todos (público) pueden leer blogs publicados
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

-- Política inserción/modificación: Solo usuarios Autenticados o Anon Key puede intentar si es Admin (Por ahora, permitimos todo por ser CRON backend)
-- Para que la API/Cron inserte, usaremos la Service Role Key, que salta el RLS nativamente, así que no requerimos políticas abiertas de INSERT.

-- ========== BUCKET DE IMÁGENES ==========
-- Iniciar bucket si no existe (Requiere entorno Supabase). Si da error ignóralo y créalo a mano desde el dashboard: Storage -> New Bucket "blog_images"
insert into storage.buckets (id, name, public)
values ('blog_images', 'blog_images', true)
on conflict (id) do nothing;

CREATE POLICY "Imagenes publicas"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'blog_images' );

CREATE POLICY "Insertar imagenes"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'blog_images' );
