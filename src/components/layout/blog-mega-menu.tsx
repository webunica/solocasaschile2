"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";

type BlogMegaMenuProps = {
  posts: BlogPost[];
  onClose?: () => void;
};

export function BlogMegaMenu({ posts, onClose }: BlogMegaMenuProps) {
  const featured = posts.slice(0, 2);

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="mt-4 w-full rounded-3xl border border-border/40 bg-background p-6 shadow-2xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {featured.length ? (
          featured.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-border/40 p-4 transition-colors hover:bg-muted/30"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Recurso
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {post.title}
              </p>
            </Link>
          ))
        ) : (
          <Link
            href="/blog"
            className="rounded-2xl border border-border/40 p-4 transition-colors hover:bg-muted/30"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Recursos
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              Ver articulos y guias
            </p>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
