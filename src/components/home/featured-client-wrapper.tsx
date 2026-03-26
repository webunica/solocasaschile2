"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ShieldCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  items: any[];
}

export function FeaturedClientWrapper({ items }: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((builder, i) => (
        <motion.div
          key={builder.id}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Card className="group overflow-hidden border-border/40 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 bg-card/50 backdrop-blur-xl h-full flex flex-col rounded-[2.5rem]">
            <div className="relative h-48 overflow-hidden shrink-0">
              {builder.logo_url ? (
                <Image
                  src={builder.logo_url}
                  alt={builder.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                   <span className="text-4xl font-black text-primary/20">{builder.nombre[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
              
              {builder.plan === 'premium' && (
                <div className="absolute top-4 right-4 translate-y-0 group-hover:-translate-y-1 transition-transform">
                  <Badge className="bg-amber-500 text-white border-none shadow-xl font-black text-[9px] uppercase tracking-widest px-3 py-1">
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" /> Premium
                  </Badge>
                </div>
              )}

              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-2xl font-black text-white tracking-tighter leading-tight drop-shadow-md">
                   {builder.nombre}
                </h3>
              </div>
            </div>

            <CardContent className="p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Score Confianza</p>
                       <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black leading-none text-brand-indigo">{builder.score_confianza}</span>
                          <span className="text-xs font-bold opacity-40">/100</span>
                       </div>
                    </div>
                    {builder.verificada && (
                       <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                          <ShieldCheck className="w-5 h-5" />
                       </div>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-brand-indigo/5 text-primary border-brand-indigo/10 font-bold text-[9px] uppercase tracking-widest px-3">
                       <CheckCircle2 className="w-3 h-3 mr-1" /> Verificada
                    </Badge>
                    {(builder.plan === 'premium' || builder.plan === 'pro') && (
                       <Badge variant="secondary" className="bg-amber-500/5 text-amber-600 border-amber-500/10 font-bold text-[9px] uppercase tracking-widest px-3">
                          <Clock className="w-3 h-3 mr-1" /> Respuesta Rápida
                       </Badge>
                    )}
                 </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-auto">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  RANKING TOP 3
                </p>
                <Link 
                  href={`/constructora/${builder.slug}`} 
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-primary hover:text-white transition-all -mr-2")}
                >
                  Ver Perfil <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
