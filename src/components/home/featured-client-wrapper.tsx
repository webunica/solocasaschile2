"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ShieldCheck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  items: any[];
}

export function FeaturedClientWrapper({ items }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 items-stretch py-12">
      {items.map((builder, i) => {
        const isFeatured = i === 0;
        
        return (
          <motion.div
            key={builder.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 30 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className={cn(
              "relative group transition-all duration-700",
              isFeatured ? "lg:flex-[2.2]" : "lg:flex-[1.2]"
            )}
          >
            <div className={cn(
              "h-full rounded-[3.5rem] border border-border/40 overflow-hidden bg-card/40 backdrop-blur-xl flex flex-col",
              "hover:shadow-[0_48px_100px_-24px_rgba(27,0,136,0.12)] hover:-translate-y-2",
              isFeatured ? "p-4" : "p-2"
            )}>
              {/* Media Section */}
              <div className={cn(
                "relative overflow-hidden shrink-0 rounded-[2.5rem] bg-muted",
                isFeatured ? "h-96 md:h-[450px]" : "h-64"
              )}>
                {builder.logo_url ? (
                  <Image
                    src={builder.logo_url}
                    alt={builder.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                     <span className="text-6xl font-black text-primary/10 tracking-tighter uppercase">{builder.nombre[0]}</span>
                  </div>
                )}
                
                {/* Visual Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex items-end">
                   <div className="space-y-2">
                       {builder.plan === 'premium' && (
                         <Badge className="bg-amber-500/90 text-white border-none shadow-xl font-black text-[9px] uppercase tracking-widest px-4 py-1.5 backdrop-blur-md">
                           <Star className="w-3 h-3 mr-1.5 fill-current" /> Constructora VIP
                         </Badge>
                       )}
                       <h3 className={cn(
                         "font-black text-white tracking-tighter leading-tight drop-shadow-xl",
                         isFeatured ? "text-4xl md:text-5xl" : "text-2xl"
                       )}>
                          {builder.nombre}
                       </h3>
                   </div>
                </div>
              </div>

              {/* Content Section */}
              <div className={cn(
                "p-8 lg:p-12 flex-1 flex flex-col justify-between gap-10",
                !isFeatured && "lg:p-8"
              )}>
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">Score de Confianza</p>
                      <div className="flex items-baseline gap-2">
                         <span className={cn(
                           "font-black text-brand-indigo",
                           isFeatured ? "text-5xl" : "text-4xl"
                         )}>{builder.score_confianza}</span>
                         <span className="text-xs font-bold opacity-30 tracking-widest">/100</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      {builder.verificada && (
                         <div className="w-14 h-14 rounded-3xl bg-brand-teal/10 text-brand-teal flex items-center justify-center border border-brand-teal/20">
                            <ShieldCheck className="w-7 h-7" />
                         </div>
                      )}
                   </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border/40 pt-10">
                   <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-border/60 text-muted-foreground font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full group-hover:border-primary group-hover:text-primary transition-colors">
                        <CheckCircle2 className="w-3 h-3 mr-2" /> Certificada
                      </Badge>
                      {(builder.plan === 'premium' || builder.plan === 'pro') && (
                        <Badge variant="outline" className="border-border/60 text-muted-foreground font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                           <Clock className="w-3 h-3 mr-2" /> Respuesta Rápida
                        </Badge>
                      )}
                   </div>
                   
                   <Link 
                     href={`/constructora/${builder.slug}`} 
                     className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-2xl font-bold tracking-widest uppercase bg-muted/20 hover:bg-primary hover:text-white transition-all group-hover:px-10 duration-500")}
                   >
                     Analizar Perfil <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
