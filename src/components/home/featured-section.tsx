"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const FEATURED = [
  {
    id: "tecnofast-home",
    name: "TecnoFast Home",
    plan: "premium",
    score: 98,
    reviews: 124,
    modelsCount: 45,
    badges: ["Verificada", "Top Rated"],
    image: "/hero.png", // reusing hero placeholder
  },
  {
    id: "casas-imperio",
    name: "Casas Imperio",
    plan: "premium",
    score: 95,
    reviews: 89,
    modelsCount: 32,
    badges: ["Verificada", "Respuesta Rápida"],
    image: "/hero2.png",
  },
  {
    id: "metalkit",
    name: "Metalkit",
    plan: "pro",
    score: 92,
    reviews: 56,
    modelsCount: 18,
    badges: ["Top Rated", "Certificada"],
    image: "/hero.png",
  }
];

export function FeaturedConstructorsSection() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border/50">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              Constructoras Destacadas
            </h2>
            <p className="text-muted-foreground text-lg">
              Las empresas con mayor <strong className="text-foreground">Score de Confianza</strong>. 
              Evaluadas por sus clientes, certificaciones y calidad de servicio.
            </p>
          </div>
          <Link 
            href="/catalogo" 
            className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex border-primary/20 hover:bg-primary/10")}
          >
            Ver todas las constructoras
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED.map((builder, i) => (
            <motion.div
              key={builder.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-xl bg-card">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={builder.image}
                    alt={builder.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {builder.plan === 'premium' && (
                    <div className="absolute top-4 right-4 animate-in fade-in">
                      <Badge className="bg-amber-500/90 text-amber-50 hover:bg-amber-500 border-none shadow-lg backdrop-blur-md">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Premium
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 font-heading">{builder.name}</h3>
                      <div className="flex items-center text-primary-foreground/80 text-sm gap-2">
                        <span className="flex items-center text-amber-400">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="font-bold text-white mr-1">{builder.score/20}</span>
                        </span>
                        <span className="text-white/60">({builder.reviews} reseñas)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {builder.badges.map(badge => (
                      <Badge key={badge} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {badge === 'Verificada' && <ShieldCheck className="w-3 h-3 mr-1" />}
                        {badge === 'Top Rated' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {badge === 'Respuesta Rápida' && <Clock className="w-3 h-3 mr-1" />}
                        {badge === 'Certificada' && <ShieldCheck className="w-3 h-3 mr-1" />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                    <span className="text-sm font-medium text-muted-foreground">
                      <strong className="text-foreground">{builder.modelsCount}</strong> modelos publicados
                    </span>
                    <Link 
                      href={`/constructora/${builder.id}`} 
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hover:text-primary hover:bg-primary/10 -mr-2")}
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 md:hidden flex justify-center">
          <Link 
            href="/catalogo" 
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Ver todas las constructoras
          </Link>
        </div>
      </div>
    </section>
  );
}
