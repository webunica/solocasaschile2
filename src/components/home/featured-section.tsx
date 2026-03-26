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
  const { data: featured = [] } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, plan, score_confianza, verfied_reviews:leads(count), logo_url")
    .order("score_confianza", { ascending: false })
    .limit(3);

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border/50">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
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
