import { createPublicClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Blog | SoloCasasChile - Guía Expertas en Casas Prefabricadas",
  description: "Consejos, comparativas y guías para elegir tu casa prefabricada ideal en Chile.",
};

async function getPosts() {
  const supabase = await createPublicClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (posts as BlogPost[]) || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-6">
          <Badge variant="outline" className="border-brand-teal/30 text-brand-teal uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full bg-white shadow-sm">
            Blog Especializado
          </Badge>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-heading font-black leading-[0.95] tracking-tighter text-brand-indigo">
            Guía para tu <span className="text-brand-teal">Próximo Hogar</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
            Investigaciones diarias para ayudarte a comparar modelos, entender materiales y construir con confianza en Chile.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-brand-teal/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.cover_image_url ? (
                    <Image 
                      src={post.cover_image_url} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-brand-indigo/5 flex items-center justify-center">
                      <Image src="/images/logo-vertical.png" alt="SoloCasas" width={100} height={80} className="opacity-10" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-brand-indigo border-none shadow-sm hover:bg-white">
                      Artículo
                    </Badge>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      {format(new Date(post.created_at), "dd MMM yyyy", { locale: es })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-teal" />
                      Experto
                    </span>
                  </div>

                  <h3 className="text-2xl font-black font-heading tracking-tight leading-tight group-hover:text-brand-teal transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 opacity-80">
                    {post.excerpt}
                  </p>

                  <div className="pt-4 flex items-center text-xs font-black uppercase tracking-[0.2em] text-brand-indigo group-hover:gap-4 transition-all">
                    Leer Más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <h2 className="text-2xl font-bold text-muted-foreground">Próximamente más contenido...</h2>
            <p className="text-muted-foreground">Nuestro equipo de IA está preparando los mejores artículos para ti.</p>
          </div>
        )}
      </div>
    </main>
  );
}
