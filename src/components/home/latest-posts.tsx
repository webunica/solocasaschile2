"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";
import { createClient } from "@/lib/supabase/client";

export function LatestPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (data) setPosts(data as BlogPost[]);
    }
    fetchPosts();
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-brand-sand/30 overflow-hidden">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Badge variant="outline" className="border-brand-teal/30 text-brand-teal uppercase tracking-widest font-black">
              Novedades del Experto
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter text-brand-indigo">
              Último en el <span className="text-brand-teal">Blog</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-brand-indigo/10 flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-brand-indigo/10 flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
            <Link href="/blog" className="ml-4 font-black uppercase tracking-widest text-xs text-brand-indigo hover:text-brand-teal transition-colors flex items-center gap-2">
              Ver Todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-8"
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 32}px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {posts.map((post) => (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="min-w-[100%] md:min-w-[45%] lg:min-w-[31%] group"
              >
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.cover_image_url && (
                      <Image src={post.cover_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-brand-indigo font-bold border-none">
                        {post.category || "General"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-teal" />
                        {format(new Date(post.created_at), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                    <h3 className="text-xl font-black font-heading tracking-tight leading-tight group-hover:text-brand-teal transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2 opacity-80">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
