import { getDashboardStats } from "@/lib/supabase/services";
import { 
  BarChart3, TrendingUp, Users, Eye, 
  ArrowUpRight, ArrowDownRight, Calendar,
  Download, Filter, Share2, MousePointer2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function ReportesPage() {
  const stats = await getDashboardStats();

  // Mock data for charts (to be replaced with real analytics later)
  const chartData = [
    { day: "Lun", leads: 4, views: 45 },
    { day: "Mar", leads: 7, views: 52 },
    { day: "Mié", leads: 5, views: 48 },
    { day: "Jue", leads: 12, views: 89 },
    { day: "Vie", leads: 8, views: 67 },
    { day: "Sáb", leads: 3, views: 34 },
    { day: "Dom", leads: 6, views: 41 },
  ];

  const maxLeads = Math.max(...chartData.map(d => d.leads));

  return (
    <div className="space-y-10 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter text-foreground">
            Analíticas y <span className="gradient-text">Reportes</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-tight">
            Monitorea el rendimiento de tus modelos y el interés de tus clientes.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold text-[10px] uppercase tracking-widest gap-2 border-border/60">
             <Calendar className="w-4 h-4" /> Últimos 30 días
           </Button>
           <Button className="rounded-2xl h-12 px-8 font-bold uppercase tracking-widest bg-brand-indigo text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
             <Download className="w-4 h-4 mr-2" /> Exportar PDF
           </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Leads", value: stats.leadsCount, sub: "+12.5%", trending: "up", icon: Users, color: "text-brand-teal", bg: "bg-brand-teal/10" },
          { label: "Visitas Perfil", value: "1,284", sub: "+8.2%", trending: "up", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Conversión", value: "4.2%", sub: "-1.5%", trending: "down", icon: MousePointer2, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Engagement", value: "High", sub: "Estable", trending: "up", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <Card key={i} className="rounded-[2.5rem] border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-xl overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <CardContent className="p-8">
               <div className="flex items-center justify-between mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                     <item.icon className={cn("w-6 h-6", item.color)} />
                  </div>
                  <Badge variant="outline" className={cn(
                    "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border-none flex items-center gap-1",
                    item.trending === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {item.trending === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {item.sub}
                  </Badge>
               </div>
               <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">{item.label}</p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter leading-tight">{item.value}</h3>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <Card className="lg:col-span-2 rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-10 border-b border-border/60">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <CardTitle className="text-2xl font-black tracking-tighter">Generación de Leads</CardTitle>
                   <CardDescription className="text-sm font-medium">Frecuencia diaria de cotizaciones recibidas esta semana.</CardDescription>
                </div>
                <div className="flex bg-muted/40 p-1 rounded-xl border border-border/60">
                   <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-widest bg-background shadow-sm">Vista Semanal</Button>
                   <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-widest italic opacity-40">Mensual</Button>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-12">
             <div className="h-[300px] w-full flex items-end justify-between gap-4">
                {chartData.map((d, i: number) => {
                  const height = (d.leads / maxLeads) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                       <div className="relative w-full flex-1 flex flex-col justify-end">
                          {/* Views line representation (Subtle) */}
                          <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 bg-primary/20 rounded-t-lg transition-all duration-700 delay-300" 
                            style={{ height: `${(d.views / 90) * 100}%` }}
                          />
                          {/* Leads bar (Main) */}
                          <div 
                            className="relative w-full bg-brand-indigo rounded-t-2xl transition-all duration-1000 ease-out group-hover:opacity-80" 
                            style={{ height: `${height}%` }}
                          >
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border/60 rounded-lg px-2 py-1 shadow-lg text-[10px] font-black pointer-events-none">
                                {d.leads} leads
                             </div>
                          </div>
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{d.day}</span>
                    </div>
                  );
                })}
             </div>
             <div className="mt-12 flex items-center gap-8 justify-center border-t border-border/40 pt-8">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-brand-indigo" />
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Cotizaciones</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-primary/20" />
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Visitas Totales</span>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Card */}
        <Card className="rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl overflow-hidden flex flex-col">
           <CardHeader className="p-10 border-b border-border/60">
              <CardTitle className="text-2xl font-black tracking-tighter">Actividad Reciente</CardTitle>
              <CardDescription className="text-sm font-medium">Últimas interacciones con tu catálogo.</CardDescription>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border/40">
                 {stats.recentLeads.length > 0 ? stats.recentLeads.map((lead: any, i: number) => (
                   <div key={i} className="p-8 hover:bg-muted/30 transition-all flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-sm font-black tracking-tight leading-none">{lead.nombre}</p>
                         <p className="text-xs text-muted-foreground font-medium italic opacity-70">Cotizó el modelo <span className="text-foreground font-bold not-italic">{lead.modelo?.nombre || 'General'}</span></p>
                         <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-tighter pt-1">Hace {i + 1} horas</p>
                      </div>
                   </div>
                 )) : (
                   <div className="p-12 text-center text-muted-foreground text-sm font-medium italic">
                      No hay actividad reciente.
                   </div>
                 )}
              </div>
           </CardContent>
           <div className="p-6 bg-muted/20 border-t border-border/60 text-center">
              <Button variant="link" className="font-black text-[10px] uppercase tracking-widest text-primary p-0 h-auto">Ver todos los prospectos →</Button>
           </div>
        </Card>
      </div>

      {/* Conversion Banner */}
      <div className="p-12 rounded-[4rem] bg-brand-indigo relative overflow-hidden text-white group cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700">
         <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
               <Badge className="bg-white/20 text-white border-white/30 font-black uppercase tracking-widest text-[10px] px-4 py-1.5">Insight Pro</Badge>
               <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Tu tasa de conversión es 25% <br /> superior al promedio regional.</h3>
               <p className="text-white/70 font-medium">Nuestra IA sugiere que añadir más fotos reales de interior aumentaría tus leads en un 15%.</p>
            </div>
            <Button className="bg-white text-primary rounded-2xl h-14 px-10 font-bold uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all shadow-xl shadow-black/10">
               Optimizar Catálogo <Share2 className="w-4 h-4 ml-3" />
            </Button>
         </div>
      </div>
    </div>
  );
}
