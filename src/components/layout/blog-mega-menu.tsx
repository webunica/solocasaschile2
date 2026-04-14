"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/blog";

type BlogMegaMenuProps = {
  posts: BlogPost[];
  onClose?: () => void;
};

const CORPORATE_LINKS = [
  { name: "Sobre Nosotros", href: "/nosotros", icon: Users },
  { name: "Seguimiento de Obra", href: "/seguimiento-de-obras", icon: Zap },
  { name: "Portal Proveedores", href: "/portal-proveedores", icon: Building2 },
  { name: "Como verificamos", href: "/verificacion", icon: ShieldCheck },
];

export function BlogMegaMenu({ posts, onClose }: BlogMegaMenuProps) {
  const featuredPosts = posts.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mt-4 w-full overflow-hidden rounded-3xl border border-border/40 bg-white/95 p-6 shadow-2xl backdrop-blur-3xl md:p-12"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        <div className="space-y-8 text-left md:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-2xl font-black italic tracking-tight text-brand-indigo">
              Recursos y <span className="text-brand-teal">Articulos</span>
            </h3>
            <Link
              href="/blog"
              onClick={onClose}
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-indigo/60 transition-all hover:text-brand-teal"
            >
              Ver Todo
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="space-y-8">
            {featuredPosts.length ? (
              featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-6"
                >
                  <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border border-border/40 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-32 sm:w-48">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 10rem, 12rem"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-indigo/5 p-4">
                        <Image
                          src="/images/logo-vertical.png"
                          alt=""
                          width={60}
                          height={40}
                          className="opacity-10"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <Badge
                      variant="secondary"
                      className="h-auto rounded-full border-none bg-brand-indigo/5 px-3 py-0.5 text-[10px] font-black uppercase tracking-normal text-brand-indigo"
                    >
                      {post.category || "Educacion"}
                    </Badge>
                    <h4 className="line-clamp-2 font-heading text-lg font-black leading-tight transition-colors group-hover:text-brand-teal">
                      {post.title}
                    </h4>
                    <p className="line-clamp-2 text-xs font-medium text-muted-foreground opacity-70">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-slate-50 py-10 text-center">
                <p className="text-sm font-bold text-muted-foreground">
                  Proximamente mas guias expertas.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 border-border/10 md:col-span-5 md:grid-cols-2 md:border-l md:pl-12">
          <div className="space-y-6">
            <h4 className="mb-4 flex items-center gap-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-indigo/40">
              <Sparkles className="h-3 w-3 text-brand-teal" />
              Informacion Corporativa
            </h4>
            <div className="space-y-1">
              {CORPORATE_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-2xl p-4 transition-all hover:bg-brand-indigo/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo/5 text-brand-indigo transition-all group-hover:bg-brand-indigo group-hover:text-white">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 transition-colors group-hover:text-brand-indigo">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-heading text-lg font-black tracking-tight text-brand-indigo">
                Ecosistema B2B
              </h3>
              <div className="space-y-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                    Constru
                  </span>
                </div>
                <p className="text-[10px] font-medium italic leading-relaxed text-emerald-800">
                  Digitaliza tu catalogo y gestiona cotizaciones con cientos de constructoras.
                </p>
                <Link
                  href="/portal-proveedores"
                  onClick={onClose}
                  className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-700 transition-all hover:gap-2"
                >
                  Detalles del sistema <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-black text-brand-teal">Nuevo</span>
              <Link
                href="/premium-access"
                onClick={onClose}
                className="block w-full rounded-2xl bg-brand-teal py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-teal/20 transition-all hover:-translate-y-0.5 hover:bg-brand-indigo hover:shadow-xl"
              >
                Analisis de Mercado
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center border-t border-border/10 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-40">
          Guia definitiva para la vivienda industrializada en Chile 2026
        </p>
      </div>
    </motion.div>
  );
}
