"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Search, Sparkles, BookOpen, Users, Compass, Megaphone, ShieldCheck, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";

interface BlogMegaMenuProps {
  posts: BlogPost[];
  onClose: () => void;
}

export function BlogMegaMenu({ posts, onClose }: BlogMegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 w-full bg-white border border-border/40 shadow-2xl rounded-3xl mt-4 overflow-hidden z-[100] p-6 md:p-12"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-12">
        
        {/* LADO IZQUIERDO: Recursos y Artículos (6 columnas) */}
        <div className="md:col-span-7 space-y-8 text-left">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black font-heading tracking-tight text-brand-indigo italic">Recursos y <span className="text-brand-teal">Artículos</span></h3>
             <Link 
               href="/blog" 
               className="text-xs font-black uppercase tracking-widest text-[#1b0088]/60 hover:text-brand-teal transition-all flex items-center gap-2 group"
               onClick={onClose}
             >
                Ver Todo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="space-y-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group flex gap-6 items-center"
                  onClick={onClose}
                >
                  <div className="relative w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-border/40 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                    {post.cover_image_url ? (
                      <Image 
                        src={post.cover_image_url} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-brand-indigo/5 flex items-center justify-center p-4">
                        <Image src="/images/logo-vertical.png" alt="SoloCasas" width={60} height={40} className="opacity-10" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-brand-indigo/5 text-brand-indigo border-none text-[10px] font-black uppercase tracking-tighter px-3 py-0.5">
                      {post.category || "Educación"}
                    </Badge>
                    <h4 className="text-lg font-black font-heading leading-tight group-hover:text-brand-teal transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 opacity-60">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-border/60">
                <p className="text-sm font-bold text-muted-foreground">Próximamente más guías expertas...</p>
              </div>
            )}
          </div>
        </div>

        {/* LADO DERECHO: Impacto y Recursos (5 columnas) */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8 border-l border-border/10 pl-12 items-start">
          <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-indigo/40 mb-4 px-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-brand-teal" /> Información Corporativa
                  </h4>
                  <div className="space-y-1">
                    {[
                      { name: "Sobre Nosotros", href: "/nosotros", icon: Users },
                      { name: "Seguimiento de Obra", href: "/seguimiento-de-obras", icon: Zap },
                      { name: "Portal Proveedores", href: "/portal-proveedores", icon: Building2 },
                      { name: "¿Cómo verificamos?", href: "/verificacion", icon: ShieldCheck },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 p-4 rounded-2xl hover:bg-brand-indigo/5 transition-all group"
                        onClick={onClose}
                      >
                        <div className="w-8 h-8 rounded-xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-all">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-brand-indigo transition-colors">{item.name}</span>
                      </Link>
                    ))}
                  </div>
          </div>

          <div className="space-y-8">
             <div className="space-y-6">
               <h3 className="text-lg font-black font-heading tracking-tight text-brand-indigo">Ecosistema B2B</h3>
               <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Constru</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 font-medium leading-relaxed italic">
                    Digitaliza tu catálogo y gestiona cotizaciones con cientos de constructoras.
                  </p>
                  <Link 
                    href="/portal-proveedores" 
                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:gap-2 transition-all font-bold"
                    onClick={onClose}
                  >
                    Detalles del Sistema <ChevronRight className="w-3 h-3 shadowed" />
                  </Link>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-teal">¡Nuevo!</span>
                <span className="text-lg">🎉</span>
              </div>
              <Link 
                href="/premium-access"
                className="block w-full py-4 bg-brand-teal text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-indigo hover:shadow-xl hover:-translate-y-0.5 transition-all text-center shadow-lg shadow-brand-teal/20"
                onClick={onClose}
              >
                Análisis de Mercado
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border/10 flex items-center justify-center">
         <p className="text-[10px] text-muted-foreground font-bold tracking-[0.3em] uppercase opacity-40">Guía Definitiva para la Vivienda Industrializada en Chile 2026</p>
      </div>
    </motion.div>
  );
}
