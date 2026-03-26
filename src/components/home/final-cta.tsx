import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="py-32 px-6 overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        <div className="brand-gradient rounded-[4rem] p-20 text-center text-white space-y-10 relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=60&w=800')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
               <Sparkles className="w-4 h-4" /> Comienza hoy tu proyecto
            </div>
            
            <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
              Tu hogar ideal  <br /> a un clic de distancia
            </h2>
            
            <p className="text-xl text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
              Únete a las miles de familias que ya encontraron su constructora ideal en SolocasasChile. Sin complicaciones, directo y seguro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link
                 href="/catalogo"
                 className={cn(
                   buttonVariants({ size: "lg" }),
                   "bg-white text-brand-indigo hover:bg-white/95 font-black text-sm uppercase tracking-widest rounded-3xl h-16 px-12 group transition-all"
                 )}
               >
                 Explorar Catálogo <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
               
               <Link
                 href="/planes"
                 className={cn(
                   buttonVariants({ variant: "outline", size: "lg" }),
                   "border-white/40 text-white hover:bg-white/10 font-black text-sm uppercase tracking-widest rounded-3xl h-16 px-10 transition-all"
                 )}
               >
                 Soy una Constructora
               </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 mt-12">
           Todos los derechos reservados © 2026 · SolocasasChile V2 Performance
        </p>
      </div>
    </section>
  );
}
