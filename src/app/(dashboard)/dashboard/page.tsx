import { getDashboardStats } from "@/lib/supabase/services";
import { 
  Users, Home,
  MessageSquare, LayoutGrid, BarChart2, AlertCircle,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardLead = {
  id: string;
  nombre_cliente: string;
  email_cliente?: string | null;
  estado: string;
  created_at: string;
  modelo?: {
    nombre?: string | null;
  } | null;
};

// Helper for relative dates (simple version for Phase 3)
const formatRelative = (dateStr: string, nowMs: number) => {
  const date = new Date(dateStr);
  const diff = nowMs - date.getTime();
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
    isVerified = false,
    plan = 'gratis',
    planStatus = 'active',
    nextBillingDate,
    generatedAtMs
  } = await getDashboardStats();
  const nextBillingDaysRemaining = nextBillingDate
    ? Math.ceil((new Date(nextBillingDate).getTime() - generatedAtMs) / (1000 * 60 * 60 * 24))
    : null;

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
      change: plan === 'gratis' ? `${modelsCount}/3` : "Ilimitados", 
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
       {/* Subscription Alerts */}
       {planStatus === 'past_due' && (
         <div className="bg-red-500/5 border border-red-200/50 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/20">
              <AlertCircle className="w-7 h-7" />
           </div>
           <div className="flex-1 space-y-1 text-center md:text-left">
              <p className="text-red-600 font-black text-sm uppercase tracking-widest">Atención: Suscripción Pendiente</p>
              <p className="text-slate-500 text-sm font-medium">No pudimos procesar tu último cobro. Tu catálogo pasará a modo gratuito pronto si no se resuelve.</p>
           </div>
           <Link 
             href="/planes" 
             className={cn(buttonVariants({ variant: "destructive" }), "rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]")}
           >
             Regularizar Ahora
           </Link>
         </div>
       )}

       {planStatus === 'canceled' && (
         <div className="bg-slate-100 border border-slate-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
           <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
              <AlertCircle className="w-7 h-7" />
           </div>
           <div className="flex-1 space-y-1 text-center md:text-left">
              <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Suscripción Cancelada</p>
              <p className="text-slate-500 text-sm font-medium">Tu plan ha finalizado. Vuelve a suscribirte para recuperar los beneficios premium.</p>
           </div>
           <Link 
             href="/planes" 
             className={cn(buttonVariants({ variant: "outline" }), "rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]")}
           >
             Ver Planes
           </Link>
         </div>
       )}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-10">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={cn(
                  "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary",
                  isVerified && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                )}>
                  {isVerified ? "Constructora Verificada" : "Estado: Operativo"}
                </Badge>
                <Badge className={cn(
                  "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                  plan === 'premium' ? "bg-amber-500 text-white" : 
                  plan === 'avanza' || plan === 'pro' ? "bg-brand-indigo text-white" : "bg-slate-200 text-slate-600"
                )}>
                  Plan {plan}
                </Badge>
                <span className={cn("w-2 h-2 rounded-full animate-pulse", isVerified ? "bg-emerald-500" : "bg-primary")} />
             </div>
             <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground">
                Hola, <span className="gradient-text">{companyName}</span>
             </h1>
             <p className="text-muted-foreground font-medium text-lg italic opacity-80">
                {plan === 'gratis' 
                  ? "Estás usando la versión gratuita de SoloCasasChile." 
                  : `Tu plan ${plan} está ${planStatus === 'active' ? 'activo' : 'pendiente'}.`
                }
                {nextBillingDate && ` Vence el ${new Date(nextBillingDate).toLocaleDateString('es-CL')}.`}
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
          {STATS.map((stat) => (
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
                   {recentLeads.length > 0 ? (recentLeads as DashboardLead[]).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-8 hover:bg-primary/[0.02] transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-muted/40 border border-border/40 flex items-center justify-center text-foreground/40 font-black uppercase text-lg group-hover:bg-brand-indigo group-hover:text-white group-hover:border-transparent transition-all duration-700 shadow-inner">
                               {lead.nombre_cliente.slice(0, 2)}
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{lead.nombre_cliente}</span>
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-muted-foreground/60">{lead.email_cliente || 'Sin email'}</span>
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
                             <span className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-40 italic">{formatRelative(lead.created_at, generatedAtMs)}</span>
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
             {/* CTA Card - CONDITIONAL */}
             {plan === 'gratis' ? (
                <Card className="rounded-[3rem] bg-[#0047AB] text-white overflow-hidden relative group shadow-2xl shadow-blue-900/40 border-none">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
                   <CardHeader className="p-10 pb-6 relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <Badge className="bg-white/20 text-white border-none font-black tracking-widest text-[8px] uppercase px-3">Plan Gratuito</Badge>
                         {nextBillingDaysRemaining !== null && (
                           <Badge variant="outline" className="text-white border-white/40 font-black tracking-widest text-[8px] uppercase px-3 bg-white/10 backdrop-blur-md italic animate-pulse">
                              {nextBillingDaysRemaining} días restantes
                           </Badge>
                         )}
                      </div>
                      <CardTitle className="text-4xl font-black tracking-tighter text-white leading-[0.95] italic">Escala tu Constructora</CardTitle>
                      <CardDescription className="text-white/70 font-medium text-sm mt-4 leading-relaxed">
                        Tu acceso gratuito vence el <span className="text-white font-black">{nextBillingDate ? new Date(nextBillingDate).toLocaleDateString('es-CL') : 'pronto'}</span>. 
                        No pierdas la oportunidad de destacar tus modelos ante miles de clientes.
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="px-10 pb-10 space-y-6 relative z-10">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center group-hover:bg-white/10 transition-colors">
                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">PRO</p>
                            <div className="flex items-baseline gap-1">
                               <p className="font-black text-xl text-white">0.6</p>
                               <span className="text-[10px] font-bold text-white/60">UF</span>
                            </div>
                         </div>
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center group-hover:bg-white/10 transition-colors">
                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">PREMIUM</p>
                            <div className="flex items-baseline gap-1">
                               <p className="font-black text-xl text-white">2.9</p>
                               <span className="text-[10px] font-bold text-white/60">UF</span>
                            </div>
                         </div>
                      </div>
                      <Link 
                        href="/planes" 
                        className={cn(buttonVariants({ variant: "default" }), "w-full h-16 rounded-3xl font-black text-xs uppercase tracking-widest bg-white text-[#0047AB] hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20")}
                      >
                        Actualizar Plan Ahora
                      </Link>
                      <p className="text-[8px] text-center font-black uppercase tracking-widest text-white/40">Sin contratos forzosos. Cancela cuando quieras.</p>
                   </CardContent>
                </Card>
             ) : (
                <Card className="rounded-[3rem] bg-brand-indigo text-white overflow-hidden relative group shadow-2xl shadow-brand-indigo/20">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
                   <CardHeader className="p-10 text-center">
                      <Badge className="w-fit mx-auto bg-white/20 text-white border-none mb-4 font-black tracking-widest text-[8px] uppercase">Plan Seleccionado</Badge>
                      <CardTitle className="text-3xl font-black tracking-tighter text-white">Plan {plan.toUpperCase()}</CardTitle>
                      <CardDescription className="text-white/70 font-medium text-sm mt-2">
                        {planStatus === 'active' ? 'Tu suscripción está activa.' : 'Estamos verificando tu pago.'}
                      </CardDescription>
                   </CardHeader>
                   <CardContent className="px-10 pb-10 space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10">
                         <Calendar className="w-5 h-5 text-white/60" />
                         <div>
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-widest leading-none mb-1">Próxima Renovación</p>
                            <p className="font-black text-white text-sm">
                               {nextBillingDate ? new Date(nextBillingDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pendiente'}
                            </p>
                         </div>
                      </div>
                      <Link 
                        href="/dashboard/settings/facturacion" 
                        className={cn(buttonVariants({ variant: "outline" }), "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/20 text-white hover:bg-white hover:text-brand-indigo transition-all")}
                      >
                        Ver Facturación y Plan
                      </Link>
                   </CardContent>
                </Card>
             )}
             
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
