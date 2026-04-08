export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  category: string | null;
  target_audience: string | null;
  cover_image_url: string | null;
  seo_keywords: string[] | null;
  is_published: boolean;
  social_hook_fired: boolean;
  created_at: string;
}
