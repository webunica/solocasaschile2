import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Target, Heart, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | SolocasasChile",
  description: "Conoce nuestra misión de democratizar el acceso a la vivienda a través de la transparencia y la tecnología.",
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen pt-44 pb-20 bg-background">
      <div className="container max-w-5xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <div className="space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Nuestra Misión
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tighter text-brand-indigo italic leading-none">
            Democratizando el acceso a <br /> <span className="text-brand-teal">Tu Propio Hogar</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
            <strong>SolocasasChile es un comparador independiente de modelos y constructoras. No somos una constructora ni vendemos directamente viviendas.</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
           <div className="space-y-8">
              <div className="space-y-4">
                 <h2 className="text-3xl font-heading font-black tracking-tighter text-brand-indigo italic">¿Por qué existimos?</h2>
                 <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                   Nacimos de la necesidad de transparentar un mercado fragmentado. Buscamos que cada chileno tenga la información técnica y comercial real para tomar la decisión más importante de su vida sin miedos.
                 </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {[
                   { t: "Transparencia", d: "Datos auditados y fichas técnicas estandarizadas.", i: ShieldCheck },
                   { t: "Independencia", d: "No favorecemos a ninguna constructora; favorecemos a tu bolsillo.", i: Target },
                   { t: "Innovación", d: "Tecnología para comparar cientos de modelos en segundos.", i: CheckCircle2 },
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-5 group">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo group-hover:bg-brand-teal group-hover:text-white transition-all">
                         <item.i className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="font-black text-lg tracking-tight text-brand-indigo">{item.t}</h4>
                         <p className="text-muted-foreground font-medium">{item.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000" 
                alt="Nosotros" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/60 to-transparent" />
           </div>
        </div>

        <div className="p-12 md:p-20 rounded-[4rem] bg-brand-indigo text-white text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <h3 className="text-3xl md:text-5xl font-heading font-black tracking-tighter relative z-10 italic">
             Tu camino hacia la casa propia <br /> <span className="text-brand-teal underline decoration-2 underline-offset-8">empieza aquí</span>
           </h3>
           <Link 
             href="/catalogo" 
             className="inline-flex h-16 px-12 items-center justify-center bg-brand-teal text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-brand-indigo transition-all shadow-xl shadow-brand-teal/20 relative z-10"
           >
             Explorar Modelos
           </Link>
        </div>

      </div>
    </main>
  );
}
