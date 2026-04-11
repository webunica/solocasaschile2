import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  ShoppingCart, 
  Target, 
  Zap, 
  ArrowRight, 
  FileText, 
  Users, 
  BarChart3,
  Globe,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portal de Proveedores: Expande tu Mercado B2B | SolocasasChile",
  description: "Conecta con cientos de constructoras activas. Publica tu catálogo, recibe solicitudes de cotización y digitaliza tu venta técnica.",
  keywords: ["proveedores construccion", "marketplace B2B chile", "materiales de construccion", "cotizaciones materiales", "vendedores insumos construccion"],
};

export default function PortalProveedoresPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-6 relative mb-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-indigo/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <Badge variant="outline" className="border-brand-indigo/30 text-brand-indigo bg-brand-indigo/5 uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-full">
               Ecosistema B2B SolocasasChile
            </Badge>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-heading font-black leading-[0.9] tracking-tighter text-brand-indigo">
              Llega directamente a las <br />
              <span className="text-brand-teal italic">Constructoras</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Transformamos la forma en que los proveedores de materiales e insumos conectan con la industria. Digitaliza tu catálogo y empieza a recibir órdenes de cotización calificadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://constru.solocasaschile.com" target="_blank">
                <Button size="lg" className="bg-brand-indigo text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-brand-indigo/20">
                  ACCEDER AL PORTAL CONSTRU
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border rounded-2xl h-14 px-8 font-bold">
                VER PLANES PROVEEDORES
              </Button>
            </div>
          </div>

          <div className="relative">
             {/* Imagen Real Constru */}
             <div className="relative z-10 rounded-[3rem] border-8 border-white shadow-[0_50px_100px_-20px_rgba(27,0,136,0.15)] overflow-hidden bg-slate-100 aspect-video">
               <Image 
                 src="/images/constru.png"
                 alt="Dashboard Constru de SolocasasChile"
                 fill
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/10 via-transparent to-brand-teal/5" />
             </div>
             
             {/* Floating UI Elements */}
             <div className="absolute -top-10 -right-10 z-20 w-48 rounded-[2rem] border-4 border-white shadow-2xl bg-white p-6 space-y-3">
               <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                 <ShoppingCart className="w-5 h-5" />
               </div>
               <p className="font-heading font-black text-brand-indigo text-base leading-tight">Nueva Cotización</p>
               <p className="text-[10px] text-muted-foreground font-medium">Constructora Biobío SPA solicita 120m² de SIP</p>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-slate-50 py-32">
        <div className="container max-w-7xl mx-auto px-6 text-center space-y-20">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-brand-indigo leading-tight">
              ¿Por qué ser parte del <br /> <span className="text-brand-teal">Catálogo de Proveedores</span>?
            </h2>
            <p className="text-muted-foreground font-medium">
              Conectamos tu inventario con la demanda real de proyectos en ejecución.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Globe, 
                title: "Exposición Directa", 
                desc: "Tu catálogo visible para cientos de constructoras que buscan materiales específicos para sus proyectos activos.",
                color: "bg-blue-500/10 text-blue-600"
              },
              { 
                icon: FileText, 
                title: "Gestión de Cotizaciones", 
                desc: "Recibe y responde solicitudes de presupuesto estandarizadas, reduciendo tiempos de gestión comercial.",
                color: "bg-amber-500/10 text-amber-600"
              },
              { 
                icon: BarChart3, 
                title: "Analítica de Mercado", 
                desc: "Conoce qué materiales se están demandando más en cada región y ajusta tu oferta comercial.",
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

      {/* Portal Constru Features */}
      <section className="py-32 container max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1] text-brand-indigo">
              Potencia tu <span className="text-brand-teal">Venta Técnica</span> <br /> con el Portal Constru
            </h2>
            <div className="space-y-8">
              {[
                { 
                  title: "Catálogo Digital Dinámico", 
                  desc: "Carga tus productos, fichas técnicas y certificaciones en un formato visual atractivo para profesionales.",
                  icon: Zap
                },
                { 
                  title: "Dashboard de Prospectos", 
                  desc: "Mide el rendimiento de tus publicaciones: quién vio tus productos y cuántas cotizaciones generaste.",
                  icon: Users
                },
                { 
                  title: "Logística y Despacho", 
                  desc: "Informa tus zonas de cobertura y tiempos de entrega para mejorar la conversión con constructoras regionales.",
                  icon: Truck
                },
              ].map((point, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-indigo/5 flex items-center justify-center shrink-0">
                    <point.icon className="w-6 h-6 text-brand-indigo" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl text-brand-indigo">{point.title}</h4>
                    <p className="text-muted-foreground font-medium leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
             <div className="absolute inset-0 bg-brand-teal/20 rounded-[4rem] blur-[100px] opacity-20 scale-90 group-hover:scale-100 transition-transform" />
             <div className="relative bg-brand-indigo rounded-[3.5rem] p-8 md:p-12 overflow-hidden text-white space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-brand-teal" />
                  </div>
                  <h3 className="text-2xl font-heading font-black tracking-tight">Segmentación Precisa</h3>
               </div>
               <p className="text-lg text-white/70 font-medium leading-relaxed">
                 A diferencia de los marketplaces genéricos, en SolocasasChile tu marca llega a quienes están decidiendo qué materiales comprar en este preciso momento.
               </p>
               <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Conexión en tiempo real</span>
                  </div>
                  <ul className="space-y-3">
                    {["Constructoras Industriales", "Arquitectos Proyectistas", "Gestores Inmobiliarios"].map(tag => (
                      <li key={tag} className="flex items-center gap-3 text-sm font-bold opacity-80">
                        <ArrowRight className="w-4 h-4 text-brand-teal" /> {tag}
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container max-w-7xl mx-auto px-6">
         <div className="p-12 md:p-24 rounded-[4rem] bg-slate-900 text-white text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/40 via-transparent to-brand-teal/20" />
            <h2 className="text-3xl md:text-6xl font-heading font-black tracking-tighter relative z-10 leading-none">
              Impulsa tu canal <span className="text-brand-teal italic">B2B</span> <br /> hoy mismo.
            </h2>
            <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto relative z-10">
              Forma parte de la red de suministros más eficiente de la industria de la construcción en Chile.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10 pt-4">
               <Link href="https://constru.solocasaschile.com" target="_blank">
                 <Button size="lg" className="bg-brand-teal text-brand-indigo font-black rounded-2xl h-16 px-12 text-lg hover:scale-105 transition-transform">
                   IR AL PORTAL DE PROVEEDORES
                 </Button>
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
