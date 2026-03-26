import { CONSTRUCTORAS } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  ShieldCheck, Star, Building2, MapPin, 
  ArrowRight, CheckCircle2, Search, Briefcase
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directorio de Constructoras | SolocasasChile",
  description: "Encuentra las mejores empresas constructoras de casas prefabricadas, SIP y modulares en Chile. Revisa su score de confianza.",
};

export default function ConstructorasPage() {
  // Sort premium first
  const sortedConstructoras = [...CONSTRUCTORAS].sort((a, b) => {
    const planOrder = { premium: 0, pro: 1, gratis: 2 };
    const planA = (a.plan as keyof typeof planOrder) || "gratis";
    const planB = (b.plan as keyof typeof planOrder) || "gratis";
    return planOrder[planA] - planOrder[planB];
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
           <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">Directorio de Constructoras</h1>
              <p className="text-lg text-muted-foreground">
                Compara empresas certificadas por su Score de Confianza, años de experiencia y calidad de sus proyectos realizados.
              </p>
           </div>
           
           <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Buscar constructora (ej: TecnoFast)" className="pl-10 h-12 bg-background border-border/60" />
              </div>
              <Button size="lg" className="h-12 px-8 font-semibold">Buscar</Button>
           </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
         <div className="grid gap-6">
            {sortedConstructoras.map((c) => (
              <div key={c.id} className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-xl">
                 <div className="flex flex-col lg:flex-row">
                    {/* Image/Map preview placeholder */}
                    <div className="relative w-full lg:w-72 h-48 lg:h-auto overflow-hidden">
                       <Image src={c.image} alt={c.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </div>

                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start">
                       <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0 bg-white">
                         <Image src={c.logo} alt={c.nombre} fill className="object-cover p-2" />
                       </div>

                       <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                             <Link href={`/constructora/${c.slug}`} className="text-xl font-bold font-heading hover:text-primary transition-colors">
                               {c.nombre}
                             </Link>
                             {c.verificada && <Badge className="bg-primary/10 text-primary border-primary/20"><ShieldCheck className="w-3 h-3 mr-1" /> Verificada</Badge>}
                             {c.plan === "premium" && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Premium</Badge>}
                          </div>
                          
                          <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">
                             {c.descripcion}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                             <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-primary/60" /> {c.anioFundacion}</span>
                             <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary/60" /> {c.proyectosCompletados}+ Proyectos</span>
                             <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary/60" /> {c.regiones.length} Regiones</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                             {c.tiposConstruccion.map(tipo => (
                               <Badge key={tipo} variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter opacity-70">
                                 {tipo.replace('-', ' ')}
                               </Badge>
                             ))}
                          </div>
                       </div>

                       <div className="w-full md:w-48 space-y-4 pt-4 md:pt-0">
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
                             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Score de Confianza</p>
                             <div className="text-3xl font-bold text-primary">{c.scoreConfianza}</div>
                             <p className="text-xs text-muted-foreground mt-1">Súper confiable</p>
                          </div>
                          <Link href={`/constructora/${c.slug}`} className={buttonVariants({ variant: "outline", className: "w-full border-primary/20 hover:bg-primary/5 text-primary" })}>
                             Ver Perfil <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
