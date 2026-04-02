import { createClient } from "@/lib/supabase/server";
import { CONSTRUCTORAS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PremiumCarousel } from "@/components/constructoras/premium-carousel";

export async function FeaturedConstructorsSection() {
  const supabase = await createClient();
  
  // Fetch top 3 constructoras by score
  const { data } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, plan, score_confianza, logo_url, verificada, descripcion, user_id")
    .not("user_id", "is", null) // Solo aquellas con cuenta/afiliadas
    .order("score_confianza", { ascending: false })
    .limit(12);

  // Hybrid Fallback: Use real data + top mocks if DB is empty
  const featured = data && data.length > 0 ? data : CONSTRUCTORAS.slice(0, 3).map(c => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug,
    plan: c.plan,
    score_confianza: c.scoreConfianza,
    logo_url: c.logo,
    verificada: c.verificada
  }));

  return (
    <section className="py-40 bg-muted/10 relative overflow-hidden border-y border-border/10">
      {/* Impeccable Background Layer */}
      <div className="absolute top-0 right-1/2 w-[300px] h-[300px] bg-brand-indigo/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl space-y-4">
             <Badge variant="outline" className="border-primary/20 text-primary uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
                Socios Industriales
             </Badge>
             <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none">
               Constructoras de <span className="text-brand-teal">Alto Desempeño</span>
             </h2>
             <p className="text-muted-foreground text-xl font-medium max-w-xl">
               Entidades auditadas por nuestro sistema de verificación técnica para garantizar proyectos seguros y eficientes.
             </p>
          </div>
          <Link 
            href="/constructoras" 
            className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/10 transition-all px-8 py-6")}
          >
            Ver Directorio de Empresas
            <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        </div>

        <PremiumCarousel constructoras={featured || []} />
      </div>
    </section>
  );
}
