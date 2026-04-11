import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileCheck, Search, Users, MapPin, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cómo verificamos constructoras? | SolocasasChile",
  description: "Conoce el riguroso proceso de auditoría y los criterios de confianza para las constructoras en Chile.",
};

export default function VerificacionPage() {
  const criteria = [
    { title: "Identidad Legal", icon: FileCheck, desc: "Validación de RUT de empresa, constitución de sociedad y vigencia ante el SII." },
    { title: "Años de Operación", icon: Users, desc: "Evaluamos la trayectoria y experiencia demostrable en el mercado de la construcción." },
    { title: "Contacto Verificable", icon: CheckCircle2, desc: "Comprobamos la existencia de oficinas físicas, teléfonos activos y correos corporativos." },
    { title: "Cobertura Regional", icon: MapPin, desc: "Confirmamos la capacidad logística en las regiones donde la empresa declara operar." },
    { title: "Certificaciones", icon: Award, desc: "Revisamos sellos de calidad, membresías en asociaciones gremiales y certificaciones técnicas." },
    { title: "Historial Documental", icon: Search, desc: "Análisis de antecedentes comerciales y comportamiento de cumplimiento en proyectos previos." }
  ];

  const statuses = [
    { 
      label: "Verificada documentalmente", 
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      desc: "Nivel Máximo: Empresa con toda su documentación auditada y excelente historial comercial." 
    },
    { 
      label: "Información básica validada", 
      color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      desc: "Nivel Estándar: Datos de contacto y RUT verificados, en proceso de recopilación de antecedentes adicionales." 
    },
    { 
      label: "Perfil en revisión", 
      color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      desc: "Nivel Inicial: Empresa nueva en la plataforma con proceso de auditoría en curso." 
    },
    { 
      label: "No verificada", 
      color: "bg-slate-500/10 text-slate-500 border-slate-500/30",
      desc: "Empresa con información pública que aún no ha iniciado nuestro proceso formal de validación." 
    }
  ];

  return (
    <main className="min-h-screen pt-44 pb-20 bg-background">
      <div className="container max-w-5xl mx-auto px-6">
        
        <Link href="/constructoras" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Directorio de Constructoras
        </Link>
        
        <div className="space-y-6 mb-20 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-indigo/5 border border-brand-indigo/10 text-brand-indigo text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Auditoría Técnica Independiente
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tighter text-brand-indigo italic leading-none">
            ¿Cómo <span className="text-brand-teal">Verificamos</span> a las Constructoras?
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
            SolocasasChile no es una constructora. Somos una entidad independiente que audita a las empresas para que tú puedas elegir con seguridad.
          </p>
        </div>

        {/* Sectores de Verificación — Mensaje de Transparencia */}
        <section className="mb-24">
           <div className="p-12 md:p-20 rounded-[3.5rem] bg-white border border-border/40 shadow-sm text-center space-y-6 relative overflow-hidden">
             {/* Decoración de fondo */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
             
             <div className="max-w-3xl mx-auto space-y-6">
               <div className="w-16 h-16 rounded-3xl bg-brand-indigo/5 flex items-center justify-center mx-auto text-brand-indigo">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h2 className="text-2xl md:text-3xl font-heading font-black text-brand-indigo tracking-tight">
                 Transparencia en <span className="text-brand-teal">Evolución</span>
               </h2>
               <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                 Estamos trabajando con las constructoras para realizar este proceso más transparente y con más opciones de verificación. Muy pronto podrás ver un desglose detallado de cada criterio de auditoría directamente en los perfiles.
               </p>
             </div>
           </div>
        </section>

        {/* Estados de Confianza */}
        <section className="bg-brand-indigo rounded-[3.5rem] p-10 md:p-20 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-teal/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 space-y-12">
             <div className="space-y-4 text-center">
                <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter">Estados de <span className="text-brand-teal">Confianza</span></h2>
                <p className="text-white/60 font-medium text-lg max-w-2xl mx-auto">Identifica el nivel de auditoría de cada perfil mediante nuestros sellos visibles.</p>
             </div>

             <div className="grid gap-6">
                {statuses.map((s, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                    <div className={cn("px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest border shrink-0 text-center", s.color)}>
                      {s.label}
                    </div>
                    <p className="text-white/80 font-medium group-hover:text-white transition-colors">{s.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        </section>

        <div className="mt-24 space-y-10">
           <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/20">
              <AlertCircle className="w-10 h-10 text-amber-500 shrink-0" />
              <div className="space-y-2">
                 <h4 className="text-xl font-black font-heading text-brand-indigo">Nota sobre Independencia</h4>
                 <p className="text-muted-foreground font-medium leading-relaxed">
                   <strong>SolocasasChile es un comparador independiente.</strong> No somos una constructora ni vendemos directamente viviendas. Nuestra misión es transparentar el mercado, permitiendo a los usuarios comparar modelos y contactar directamente a las empresas validadas.
                 </p>
              </div>
           </div>
        </div>

        <p className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 italic">
          Metodología de Verificación · SolocasasChile v2.4 (2024)
        </p>

      </div>
    </main>
  );
}
