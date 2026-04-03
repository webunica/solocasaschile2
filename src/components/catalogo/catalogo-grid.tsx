"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Star, Bed, Bath, Square, ArrowRight, Plus, SearchX, ArrowLeftRight
} from "lucide-react";
import type { ModelWithConstructora } from "@/lib/supabase/services";

const TIPO_LABELS: Record<string, string> = {
  prefabricada: "Prefabricada",
  sip: "Panel SIP",
  container: "Container",
  "llave-en-mano": "Llave en Mano",
  "modular": "Modular",
  "steel-framing": "Steel Framing",
};

const TIPO_COLORS: Record<string, string> = {
  prefabricada: "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-500/20",
  sip: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-500/20",
  container: "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-500/20",
  "llave-en-mano": "bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-500/20",
  "modular": "bg-teal-500/10 text-teal-600 border-teal-200 dark:text-teal-400 dark:border-teal-500/20",
  "steel-framing": "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-500/20",
};

interface Props {
  modelos: ModelWithConstructora[];
}

export function CatalogoGrid({ modelos }: Props) {
  const [comparar, setComparar] = useState<string[]>([]);

  const toggleComparar = (id: string) => {
    setComparar((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  return (
    <section className="space-y-12">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {modelos.map((modelo, i) => (
          <motion.article
            key={modelo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="group overflow-hidden border-border/40 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm h-full flex flex-col rounded-[2.5rem]">
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <Image
                  src={modelo.imagenes_urls?.[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000'}
                  alt={modelo.nombre}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Status/Plan Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   <Badge className={cn("border-none backdrop-blur-md px-3 py-1 font-bold tracking-widest uppercase", TIPO_COLORS[modelo.tipo])}>
                     {TIPO_LABELS[modelo.tipo] || modelo.tipo}
                   </Badge>
                </div>

                {modelo.constructora?.plan === "premium" && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-xl animate-pulse">
                      <Star className="w-3 h-3 fill-current" />
                      Premium
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="absolute bottom-4 left-6">
                   <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-0.5">Desde</p>
                   <p className="text-white text-2xl font-black tracking-tighter">
                     {modelo.precio_desde_uf.toLocaleString("es-CL")} <span className="text-sm font-medium ml-1 opacity-80">UF</span>
                   </p>
                </div>
              </div>

              <CardContent className="p-8 flex flex-col flex-1">
                {/* Constructora Info */}
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full border border-border bg-muted overflow-hidden relative">
                      <Image 
                        src={modelo.constructora?.logo_url || 'https://via.placeholder.com/32'} 
                        alt={modelo.constructora?.nombre}
                        fill
                        className="object-contain p-1"
                      />
                   </div>
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
                     {modelo.constructora?.nombre}
                   </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-black tracking-tight text-foreground line-clamp-2 mb-6 group-hover:text-primary transition-colors">
                  {modelo.nombre}
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                     <Square className="w-4 h-4 text-brand-teal opacity-60" />
                     <span className="text-sm font-black tracking-tight">{modelo.superficie_m2}</span>
                     <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">m² Totales</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <Bed className="w-4 h-4 text-brand-indigo opacity-60" />
                     <span className="text-sm font-black tracking-tight">{modelo.dormitorios}</span>
                     <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Dorms</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <Bath className="w-4 h-4 text-primary opacity-60" />
                     <span className="text-sm font-black tracking-tight">{modelo.banos}</span>
                     <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Baños</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-border/40">
                  <Link
                    href={`/modelo/${modelo.slug}`}
                    className={cn(buttonVariants({ size: "lg" }), "flex-1 rounded-2xl font-black text-xs bg-brand-indigo shadow-lg shadow-primary/20")}
                  >
                    Ver Detalles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleComparar(modelo.id);
                    }}
                    title={comparar.includes(modelo.id) ? "Quitar del comparador" : "Comparar este modelo"}
                    aria-label={comparar.includes(modelo.id) ? `Quitar ${modelo.nombre} del comparador` : `Añadir ${modelo.nombre} al comparador`}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 group/btn",
                      comparar.includes(modelo.id)
                        ? "bg-brand-teal/20 border-brand-teal text-brand-teal shadow-lg shadow-brand-teal/10"
                        : "border-border hover:border-brand-teal/40 hover:bg-brand-teal/5 text-muted-foreground hover:text-brand-teal"
                    )}
                  >
                    <ArrowLeftRight className={cn("w-5 h-5 transition-transform group-hover/btn:scale-110", comparar.includes(modelo.id) && "animate-pulse")} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.article>
        ))}
      </div>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {comparar.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 50, opacity: 0, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-foreground text-background rounded-3xl p-4 flex items-center justify-between shadow-2xl shadow-black/20 ring-1 ring-white/10">
               <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center text-white">
                     <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-black tracking-tight leading-none">{comparar.length} Modelos</span>
                     <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none mt-1">Comparando</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setComparar([])}
                    className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Limpiar
                  </button>
                  <Link 
                    href={`/comparar?ids=${comparar.join(',')}`}
                    className="h-10 px-6 rounded-xl bg-brand-teal text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-teal/90 transition-colors"
                  >
                    Comparar <ArrowRight className="w-3 h-3" />
                  </Link>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
