import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { FeaturedClientWrapper } from "./featured-client-wrapper";

export async function FeaturedConstructorsSection() {
  const supabase = await createClient();
  
  // Fetch top 3 constructoras by score
  const { data = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, plan, score_confianza, logo_url")
    .order("score_confianza", { ascending: false })
    .limit(3);

  // Fallback for visual demo if empty
  const featured = data?.length > 0 ? data : [
    { id: "1", nombre: "ModuLar Pro", slug: "modular-pro", plan: "premium", score_confianza: 98, logo_url: null },
    { id: "2", nombre: "EcoSIP Chile", slug: "ecosip-chile", plan: "pro", score_confianza: 94, logo_url: null },
    { id: "3", nombre: "SteelFrame S.A.", slug: "steelframe-sa", plan: "premium", score_confianza: 96, logo_url: null },
  ];

  return (
    <section className="py-40 bg-background relative overflow-hidden border-y border-border/10">
      {/* Impeccable Background Layer */}
      <div className="absolute inset-0 bg-muted/10 opacity-50" />
      <div className="absolute top-0 right-1/2 w-[300px] h-[300px] bg-brand-indigo/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter mb-4">
              Constructoras Destacadas
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Las empresas con mayor <strong className="text-foreground">Score de Confianza</strong>. 
              Evaluadas por sus clientes, certificaciones y calidad de servicio.
            </p>
          </div>
          <Link 
            href="/constructoras" 
            className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex border-primary/20 hover:bg-primary/10 rounded-xl font-bold")}
          >
            Ver todas las constructoras
          </Link>
        </div>

        <FeaturedClientWrapper items={featured || []} />

        <div className="mt-8 md:hidden flex justify-center">
          <Link 
            href="/constructoras" 
            className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl h-12")}
          >
            Ver todas las constructoras
          </Link>
        </div>
      </div>
    </section>
  );
}
