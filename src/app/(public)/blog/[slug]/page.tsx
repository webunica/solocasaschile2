import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  return post as BlogPost | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post no encontrado" };

  return {
    title: `${post.title} | Blog SoloCasasChile`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="min-h-screen pt-32 pb-20 bg-white">
      {/* Header Info */}
      <div className="container px-6 max-w-4xl mx-auto space-y-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Blog
        </Link>
        
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
             <Badge className="bg-brand-teal/10 text-brand-teal border-none font-bold uppercase tracking-wider px-3">
               Experticia
             </Badge>
             {post.seo_keywords?.slice(0, 2).map(kw => (
               <Badge key={kw} variant="outline" className="border-slate-200 text-muted-foreground uppercase text-[10px] font-bold">
                 #{kw}
               </Badge>
             ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter text-brand-indigo leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 pt-4 border-b border-slate-100 pb-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                   <User className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest">Experto SoloCasas</p>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-0.5">Autor Especializado</p>
                </div>
             </div>
             <div className="h-8 w-px bg-slate-200 hidden sm:block" />
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-brand-teal" />
                {format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
             </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="container px-6 max-w-5xl mx-auto my-12">
         <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-indigo/10">
            {post.cover_image_url ? (
              <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 bg-slate-100" />
            )}
         </div>
      </div>

      {/* Content */}
      <div className="container px-6 max-w-3xl mx-auto">
        <div className="prose prose-slate prose-lg lg:prose-xl max-w-none 
          prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-brand-indigo
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
          prose-strong:text-brand-indigo prose-strong:font-black
          prose-a:text-brand-teal prose-a:font-black prose-a:no-underline hover:prose-a:underline
          prose-li:text-slate-600 prose-li:font-medium">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_md}
          </ReactMarkdown>
        </div>

        {/* CTA Box */}
        <div className="mt-20 p-10 md:p-14 bg-gradient-to-br from-brand-indigo to-[#002866] rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 space-y-6">
              <Badge className="bg-brand-teal text-brand-indigo font-black uppercase border-none px-4 py-1">
                 ¿Buscas Casas?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter leading-tight">
                No construyas a ciegas.<br/>
                Te ayudamos a cotizar sin errores.
              </h2>
              <p className="text-white/70 font-medium text-lg max-w-xl">
                 Compara cientos de modelos de las mejores constructoras de Chile en un solo lugar. Obtén asesoría técnica para tu proyecto hoy.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                 <Link href="/catalogo">
                    <Button size="lg" className="bg-brand-teal text-brand-indigo font-black rounded-2xl h-14 px-8 shadow-xl hover:scale-105 transition-transform w-full sm:w-auto">
                       Ver Catálogo Completo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
                 <Link href="/#asesoria">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-2xl h-14 px-8 font-bold w-full sm:w-auto">
                       Solicitar Asesoría
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </article>
  );
}
