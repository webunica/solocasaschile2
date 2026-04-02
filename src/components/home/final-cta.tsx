import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="py-32 overflow-hidden bg-brand-indigo relative w-full shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=60&w=800')] bg-cover bg-center opacity-15 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FFD1]/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#00FFD1] border border-[#00FFD1]/20">
           <Sparkles className="w-4 h-4" /> Comienza hoy tu proyecto
        </div>
        
        <h2 
          className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none text-white drop-shadow-xl"
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)"}}
        >
          Tu hogar ideal  <br /> a un clic de distancia
        </h2>
        
        <p 
          className="text-xl font-medium max-w-xl mx-auto leading-relaxed text-white drop-shadow-lg"
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.4)"}}
        >
          Únete a las miles de familias que ya encontraron su constructora ideal en SolocasasChile. Sin complicaciones, directo y seguro.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
           <Link
             href="/catalogo"
             className={cn(
               buttonVariants({ variant: "secondary", size: "lg" }),
               "h-16 px-12 group transition-all rounded-3xl"
             )}
           >
             Explorar Catálogo <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
           </Link>
           
           <Link
             href="/planes"
             className={cn(
               buttonVariants({ variant: "outline", size: "lg" }),
               "border-white/40 text-white hover:bg-white/10 rounded-3xl h-16 px-10 transition-all backdrop-blur-sm"
             )}
           >
             Soy una Constructora
           </Link>
        </div>
      </div>
    </section>
  );
}
