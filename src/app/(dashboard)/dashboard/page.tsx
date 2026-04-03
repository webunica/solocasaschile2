import { getDashboardStats } from "@/lib/supabase/services";
import { 
  Users, Home, Store, ArrowUpRight, 
  MessageSquare, LayoutGrid, BarChart2 
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper for relative dates (simple version for Phase 3)
const formatRelative = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Reciente";
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
};

export default async function DashboardPage() {
  const { 
    companyName, 
    modelsCount, 
    leadsCount, 
    recentLeads, 
    totalViews,
    confidenceScore = 0,
    isVerified = false
  } = await getDashboardStats();

  const STATS = [
    { 
      title: "Vistas Totales", 
      value: String(totalViews || 0), 
      change: "+8.4%", 
      trend: "up" as const, 
      icon: LayoutGrid, 
      color: "text-blue-600 bg-blue-50" 
    },
    { 
      title: "Prospectos (Leads)", 
      value: String(leadsCount), 
      change: leadsCount > 0 ? "+12%" : "Inicio", 
      trend: "up" as const, 
      icon: Users, 
      color: "text-brand-teal bg-brand-teal/5" 
    },
    { 
      title: "Modelos Activos", 
      value: String(modelsCount), 
      change: "Sincronizado", 
      trend: "neutral" as const, 
      icon: Home, 
      color: "text-brand-indigo bg-brand-indigo/5" 
    },
    { 
      title: "Score de Confianza", 
      value: String(confidenceScore),
      change: confidenceScore >= 90 ? "Excelente" : confidenceScore >= 70 ? "Bueno" : "Pendiente", 
      trend: "up" as const, 
      icon: BarChart2, 
      color: "text-emerald-600 bg-emerald-50" 
    },
  ];

  return (
    <div className="space-y-12 py-10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-10">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={cn(
                  "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary",
                  isVerified && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                )}>
                  {isVerified ? "Constructora Verificada" : "Estado: Operativo"}
                </Badge>
                <span className={cn("w-2 h-2 rounded-full animate-pulse", isVerified ? "bg-emerald-500" : "bg-primary")} />
             </div>
             <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground">
                Hola, <span className="gradient-text">{companyName}</span>
             </h1>
             <p className="text-muted-foreground font-medium text-lg italic opacity-80">
                Tu plataforma de comercialización modular está al día.
             </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <Link 
               href="/dashboard/catalog/new"
               className={cn(buttonVariants({ variant: "default" }), "flex-1 md:flex-initial rounded-2xl h-14 px-10 font-bold tracking-widest uppercase bg-brand-indigo shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all text-white hover:text-white")}
             >
               Publicar Nuevo Modelo
             </Link>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <Card key={stat.title} className="group relative rounded-[2.5rem] border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden bg-card/40 backdrop-blur-sm">
              <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div className={cn("p-4 rounded-3xl transition-transform group-hover:scale-110 duration-500", stat.color)}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={cn(
                       "text-[9px] font-black px-3 py-1.5 rounded-full shadow-sm border",
                       stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" : "bg-slate-100/50 text-slate-500 border-border/40"
                    )}>
                       {stat.change}
                    </span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">{stat.title}</p>
                    <div className="text-5xl font-black text-foreground tracking-tighter">{stat.value}</div>
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
       </div>

       <div className="grid lg:grid-cols-3 gap-10">
          {/* Recent Leads */}
          <Card className="lg:col-span-2 rounded-[3.5rem] border-border/40 overflow-hidden shadow-2xl shadow-primary/5 bg-card/30 backdrop-blur-xl">
             <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <CardTitle className="text-2xl font-black tracking-tighter">Últimas Consultas</CardTitle>
                      <CardDescription className="font-medium text-sm">Gestiona interesados calificados para tus modelos.</CardDescription>
                   </div>
                   <Link href="/dashboard/leads" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-8">
                      Ver Todos los Leads
                   </Link>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/20">
                   {recentLeads.length > 0 ? recentLeads.map((lead: any) => (
                      <div key={lead.id} className="flex items-center justify-between p-8 hover:bg-primary/[0.02] transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-muted/40 border border-border/40 flex items-center justify-center text-foreground/40 font-black uppercase text-lg group-hover:bg-brand-indigo group-hover:text-white group-hover:border-transparent transition-all duration-700 shadow-inner">
                               {lead.nombre_cliente.slice(0, 2)}
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{lead.nombre_cliente}</span>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-muted-foreground/60">{lead.email || 'Sin email'}</span>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest px-2 py-0 border-none opacity-80">
                                     {lead.modelo?.nombre || 'General'}
                                  </Badge>
                               </div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-3">
                            <Badge className={cn(
                              "rounded-full px-5 py-1 text-[9px] font-black tracking-widest uppercase border-none shadow-sm",
                              lead.estado === "nuevo" ? "bg-brand-teal text-white" : "bg-muted text-muted-foreground"
                            )}>
                               {lead.estado}
                            </Badge>
                            <span className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 italic">{formatRelative(lead.created_at)}</span>
                         </div>
                      </div>
                   )) : (
                     <div className="p-24 text-center space-y-4">
                        <Users className="w-16 h-16 mx-auto text-muted-foreground opacity-10" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs opacity-50">Esperando el primer prospecto...</p>
                     </div>
                   )}
                </div>
             </CardContent>
          </Card>

          {/* Sidebar Area */}
          <div className="space-y-10">
             {/* CTA Card */}
             <Card className="rounded-[3rem] bg-foreground text-background overflow-hidden relative group shadow-2xl shadow-black/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[60px] group-hover:bg-white/10 transition-colors" />
                <CardHeader className="p-10">
                   <CardTitle className="text-2xl font-black tracking-tighter text-white">Escala a Pro</CardTitle>
                   <CardDescription className="text-white/60 font-medium text-sm leading-relaxed mt-4">
                     Desbloquea modelos ilimitados, analíticas de Vercel y prioridad en el catálogo nacional.
                   </CardDescription>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                   <Link 
                     href="/planes" 
                     className={cn(buttonVariants({ variant: "outline" }), "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/20 text-white hover:bg-white hover:text-foreground transition-all")}
                   >
                     Ver Planes Premium
                   </Link>
                </CardContent>
             </Card>
             
             {/* Help Card */}
             <div className="p-10 rounded-[3rem] bg-muted/10 border border-border/40 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-indigo flex items-center justify-center text-white shadow-lg">
                      <MessageSquare className="w-6 h-6" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Soporte</p>
                      <p className="font-bold text-sm">¿Necesitas ayuda?</p>
                   </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                   Agenda una llamada estratégica hoy para mejorar tu tasa de conversión en la plataforma.
                </p>
                <Link 
                  href="https://wa.me/56964130601" 
                  target="_blank"
                  className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto text-foreground font-bold uppercase tracking-widest hover:text-primary transition-colors")}
                >
                  Agendar Mentoría →
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
}
