import { getDashboardStats } from "@/lib/supabase/services";
import { motion } from "framer-motion";
import { 
  Users, Home, Store, ArrowUpRight, 
  MessageSquare, LayoutGrid, BarChart2 
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
  const { modelsCount, leadsCount, recentLeads, totalViews } = await getDashboardStats();

  const STATS = [
    { 
      title: "Vistas Totales", 
      value: "—", 
      change: "Próximamente", 
      trend: "neutral", 
      icon: LayoutGrid, 
      color: "text-blue-600 bg-blue-50" 
    },
    { 
      title: "Prospectos (Leads)", 
      value: String(leadsCount), 
      change: "+18.2%", 
      trend: "up", 
      icon: Users, 
      color: "text-brand-teal bg-brand-teal/5" 
    },
    { 
      title: "Modelos Activos", 
      value: String(modelsCount), 
      change: "Sin cambios", 
      trend: "neutral", 
      icon: Home, 
      color: "text-brand-indigo bg-brand-indigo/5" 
    },
    { 
      title: "Tasa de Conversión", 
      value: modelsCount > 0 ? ((leadsCount / modelsCount)).toFixed(1) + " lead/mod" : "—",
      change: "+0.8%", 
      trend: "up", 
      icon: BarChart2, 
      color: "text-emerald-600 bg-emerald-50" 
    },
  ];

  return (
    <div className="space-y-12 py-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
             <h1 className="text-4xl font-heading font-black tracking-tighter text-foreground">Panel de <span className="gradient-text">Control</span></h1>
             <p className="text-muted-foreground font-medium text-lg italic opacity-80">Rendimiento estratégico de tu catálogo digital.</p>
          </div>
          <div className="flex gap-4">
             <Link 
               href="/dashboard/reportes"
               className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl h-12 px-6 font-black text-[10px] tracking-widest uppercase border-border/60 hover:bg-muted/50")}
             >
               Exportar Reporte
             </Link>
             <Link 
               href="/dashboard/catalog/new"
               className={cn(buttonVariants({ variant: "default" }), "rounded-2xl h-12 px-8 font-black text-[10px] tracking-widest uppercase brand-gradient shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white hover:text-white")}
             >
               Agregar Modelo
             </Link>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <Card key={stat.title} className="rounded-[2.5rem] border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">{stat.title}</span>
                <div className={cn("p-2.5 rounded-2xl scale-95 transition-transform group-hover:scale-110", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-foreground tracking-tighter mb-4">{stat.value}</div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm",
                    stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-100 text-slate-600 border border-border"
                  )}>
                    {stat.change} {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">Tendencia mensual</span>
                </div>
              </CardContent>
            </Card>
          ))}
       </div>

       <div className="grid lg:grid-cols-3 gap-12">
          {/* Recent Analytics List */}
          <Card className="lg:col-span-2 rounded-[3.5rem] border-border/40 overflow-hidden shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl">
             <CardHeader className="p-10 border-b border-border/60 bg-muted/20">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <CardTitle className="text-2xl font-black tracking-tighter">Prospectos Recientes</CardTitle>
                      <CardDescription className="font-medium text-sm">Gestiona tus consultas enviadas desde el catálogo.</CardDescription>
                   </div>
                   <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 group">
                      Ver histórico <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </Button>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                   {recentLeads.length > 0 ? recentLeads.map((lead: any) => (
                      <div key={lead.id} className="flex items-center justify-between p-8 hover:bg-muted/30 transition-all group cursor-pointer">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-[1.25rem] border-2 border-primary/20 bg-primary/5 flex items-center justify-center text-primary font-black uppercase text-sm shadow-inner group-hover:brand-gradient group-hover:text-white transition-all duration-500">
                               {lead.nombre_cliente.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{lead.nombre_cliente}</span>
                               <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/80 px-2 py-0.5 opacity-60">
                                     Consultó por: {lead.modelo?.nombre || 'Detalles Generales'}
                                  </Badge>
                               </div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-3">
                            <Badge className={cn(
                              "rounded-full px-5 py-1 text-[10px] font-black tracking-widest uppercase border-none",
                              lead.estado === "nuevo" ? "bg-brand-teal/90 text-white shadow-lg shadow-brand-teal/20" : "bg-muted text-muted-foreground"
                            )}>
                               {lead.estado}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 italic">{formatRelative(lead.created_at)}</span>
                         </div>
                      </div>
                   )) : (
                     <div className="p-20 text-center space-y-4">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs opacity-60">Sin prospectos registrados aún</p>
                     </div>
                   )}
                </div>
             </CardContent>
          </Card>

          {/* Integration & Strategic Focus */}
          <div className="space-y-8">
             <Card className="rounded-[3rem] border-brand-indigo/10 bg-brand-indigo/[0.03] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-10">
                   <div className="w-16 h-16 rounded-[1.5rem] brand-gradient flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-700">
                      <MessageSquare className="w-8 h-8" />
                   </div>
                   <CardTitle className="text-2xl font-black tracking-tighter">Soporte Estratégico</CardTitle>
                   <CardDescription className="font-medium text-sm leading-relaxed mt-2">
                     Analizamos de forma proactiva la tasa de conversión de tus modelos premium.
                   </CardDescription>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                   <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-indigo-200 text-brand-indigo hover:bg-brand-indigo hover:text-white shadow-lg transition-all">Contactar Consultor</Button>
                </CardContent>
             </Card>
             
             <div className="p-8 rounded-[2.5rem] bg-muted/20 border-2 border-dashed border-border/60 flex flex-col items-center text-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                   <Store className="w-5 h-5 text-muted-foreground opacity-60" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 leading-relaxed px-4">
                  Tu catálogo está optimizado para 16 regiones del país.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
