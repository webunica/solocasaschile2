import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Clock, 
  Camera, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Lock,
  Search,
  HardHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Seguimiento de Obra en Tiempo Real: Transparencia y Control | SolocasasChile",
  description: "Monitorea el avance de tu casa prefabricada desde cualquier lugar. Fotos reales, bitácora técnica y cumplimiento de plazos garantizado por SolocasasChile.",
  keywords: ["seguimiento de obra", "avance de construcción", "transparencia construcción", "casas prefabricadas chile", "control de obra online", "bitácora de obra digital"],
  openGraph: {
    title: "Seguimiento de Obra: Transparencia Total en tu Construcción",
    description: "Conoce el estado real de tu casa prefabricada con nuestra plataforma de seguimiento digital.",
    images: ["/og-image.jpg"],
  }
};

export default function SeguimientoObrasPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-6 relative mb-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <Badge variant="outline" className="border-brand-teal/30 text-brand-teal bg-brand-teal/5 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
               Estándar ConTech 2026
            </Badge>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-heading font-black leading-[0.9] tracking-tighter text-brand-indigo">
              Tu casa, bajo <span className="text-brand-teal italic">Control</span> <br /> 
              total y Real.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Eliminamos la incertidumbre en la construcción. Nuestra plataforma permite monitorear cada hito, visualizar evidencias y certificar la calidad de tu proyecto desde la palma de tu mano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-indigo text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-brand-indigo/20">
                PROBAR PORTAL DEMO
              </Button>
              <Button size="lg" variant="outline" className="border-border rounded-2xl h-14 px-8 font-bold">
                VER CONSTRUCTORAS VALIDADAS
              </Button>
            </div>
          </div>

          <div className="relative group">
             {/* Mock de Pantalla / Dashboard */}
             <div className="relative z-10 rounded-[3rem] border-8 border-brand-indigo shadow-[0_50px_100px_-20px_rgba(27,0,136,0.15)] overflow-hidden bg-slate-950 aspect-[4/3] transform group-hover:-rotate-1 transition-transform duration-700">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/40 via-transparent to-brand-teal/20" />
               {/* Placeholder for actual image 1 */}
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white/20">
                 <Search className="w-20 h-20 mb-4 opacity-10" />
                 <p className="text-xs font-black uppercase tracking-[0.4em]">Visualización de Dashboard</p>
               </div>
               {/* Decorative UI elements */}
               <div className="absolute top-8 left-8 w-1/3 h-4 bg-white/10 rounded-full" />
               <div className="absolute top-16 left-8 w-1/4 h-3 bg-white/10 rounded-full" />
               <div className="absolute bottom-8 right-8 w-24 h-24 bg-brand-teal/20 rounded-3xl blur-2xl" />
             </div>
             
             {/* Floating Mobile Card */}
             <div className="absolute -bottom-10 -left-10 z-20 w-56 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white p-6 space-y-4 transform rotate-6 group-hover:rotate-0 transition-all duration-500">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                   <Clock className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etapa Actual</span>
               </div>
               <p className="font-heading font-black text-brand-indigo text-lg leading-tight">Montaje estructural finalizado</p>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-[85%] h-full bg-emerald-500" />
               </div>
               <p className="text-[9px] font-bold text-emerald-600 uppercase">85% completado</p>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-slate-50 py-32">
        <div className="container max-w-7xl mx-auto px-6 text-center space-y-20">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-brand-indigo leading-tight">
              ¿Por qué exigir el <span className="text-brand-teal">Sello de Seguimiento</span>?
            </h2>
            <p className="text-muted-foreground font-medium">
              Garantizamos que lo que cotizas es lo que se construye, paso a paso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Camera, 
                title: "Evidencia Visual", 
                desc: "Recibe fotos reales de cada hito (fundaciones, kit, montaje) sin tener que viajar a la obra.",
                color: "bg-blue-500/10 text-blue-600"
              },
              { 
                icon: Clock, 
                title: "Control de Plazos", 
                desc: "Visualiza una línea de tiempo interactiva con fechas reales vs estimadas de entrega.",
                color: "bg-amber-500/10 text-amber-600"
              },
              { 
                icon: FileText, 
                title: "Central de Archivos", 
                desc: "Descarga planos, carpetas municipales y certificados de calidad en una bitácora digital.",
                color: "bg-emerald-500/10 text-emerald-600"
              },
              { 
                icon: ShieldCheck, 
                title: "Cero Incertidumbre", 
                desc: "Recibe notificaciones automáticas ante cualquier cambio o retraso justificado.",
                color: "bg-purple-500/10 text-purple-600"
              }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-border/40 shadow-sm hover:shadow-xl transition-all space-y-6 group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black font-heading text-brand-indigo">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Details Section */}
      <section className="py-32 container max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative h-[500px] rounded-[3rem] bg-brand-indigo overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo via-transparent to-transparent opacity-60" />
             {/* Placeholder for image 2 */}
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <Smartphone className="w-32 h-32 text-white" />
             </div>
             <div className="absolute bottom-10 left-10 right-10 p-8 glassmorphism rounded-[2rem] border-white/10 text-white space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Portal del Cliente</p>
                <h4 className="text-xl font-bold">Bitácora Técnica Digital</h4>
                <p className="text-xs text-white/70 font-medium">Acceso seguro y transparente para el propietario y la constructora.</p>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1] text-brand-indigo">
              Un paso adelante en <br /> 
              <span className="text-brand-teal">Tecnología ConTech</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: "Dashboard para Constructoras", desc: "Permite a las empresas gestionar múltiples obras, subir reportes y fidelizar clientes." },
                { title: "Verificación SolocasasChile", desc: "Validamos que la constructora mantenga el sistema actualizado periódicamente." },
                { title: "Historial de Salud (KPIs)", desc: "Métricas automáticas de cumplimiento que alimentan el scoring de la empresa." },
              ].map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-brand-indigo">{point.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full sm:w-auto bg-brand-teal text-brand-indigo font-black rounded-2xl h-14 px-8 mt-4">
               SOLICITAR DEMO DEL SISTEMA
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl mx-auto px-6 mb-20">
         <div className="p-12 md:p-24 rounded-[4rem] bg-brand-indigo text-white text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-[150px] pointer-events-none" />
            <h2 className="text-3xl md:text-6xl font-heading font-black tracking-tighter leading-none relative z-10">
              ¿Listo para construir con <br /> 
              <span className="text-brand-teal">Tranquilidad?</span>
            </h2>
            <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto relative z-10 font-bold">
              Busca el sello de "Seguimiento Online" en las fichas técnicas de nuestras constructoras asociadas.
            </p>
            <Link href="/constructoras" className="inline-flex items-center gap-2 bg-white text-brand-indigo font-black px-10 py-5 rounded-[2rem] text-lg relative z-10 hover:scale-105 transition-transform active:scale-95">
              EXPLORAR CONSTRUCTORAS <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>
    </main>
  );
}
