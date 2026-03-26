import { getDashboardStats } from "@/lib/supabase/services";
import { 
  Users, Search, Filter, Mail, Phone, 
  MapPin, MessageSquare, ExternalLink, 
  CheckCircle2, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatRelative = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Reciente";
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
};

export default async function LeadsManagementPage() {
  const { recentLeads } = await getDashboardStats();

  return (
    <div className="space-y-12 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-black tracking-tighter text-foreground">Gestión de <span className="gradient-text">Prospectos</span></h1>
           <p className="text-muted-foreground font-medium text-lg italic opacity-80 leading-snug">Convierte tus consultas web en ventas reales con el CRM integrado.</p>
        </div>
        <Link 
          href="/dashboard/leads?export=csv"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest border-border hover:bg-muted/50 transition-all flex items-center gap-2")}
        >
           <Download className="w-5 h-5" /> Exportar CSV
        </Link>
      </div>

      <Card className="rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="p-10 border-b border-border/60 bg-muted/20">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="relative flex-1 max-w-lg">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
                 <Input 
                   placeholder="Buscar por nombre, email o modelo..." 
                   className="pl-12 h-14 bg-background/50 border-border/60 rounded-2xl focus:bg-background transition-all"
                 />
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/60">
                    <Button variant="ghost" className="h-10 px-6 rounded-xl bg-background shadow-sm text-[10px] font-black uppercase tracking-widest">Todos</Button>
                    <Button variant="ghost" className="h-10 px-6 rounded-xl text-muted-foreground text-[10px] font-black uppercase tracking-widest">Nuevos</Button>
                    <Button variant="ghost" className="h-10 px-6 rounded-xl text-muted-foreground text-[10px] font-black uppercase tracking-widest">Contactados</Button>
                 </div>
                 <Button variant="outline" className="h-12 w-12 rounded-xl border-border/60 p-0 flex items-center justify-center">
                    <Filter className="w-5 h-5" />
                 </Button>
              </div>
           </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {recentLeads.length > 0 ? recentLeads.map((lead: any) => (
              <div key={lead.id} className="p-10 hover:bg-muted/30 transition-all group grid lg:grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-10 cursor-pointer">
                
                {/* User Info */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] border-2 border-brand-indigo/20 bg-brand-indigo/5 flex items-center justify-center text-brand-indigo font-black uppercase text-lg shadow-inner group-hover:brand-gradient group-hover:text-white transition-all duration-700">
                    {lead.nombre_cliente.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground tracking-tight line-clamp-1">{lead.nombre_cliente}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground opacity-60">
                       <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {lead.email_cliente}</span>
                       <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {lead.telefono_cliente}</span>
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-widest border-border/80 px-4 py-1.5 opacity-60 flex items-center gap-2">
                     <LayoutGrid className="w-3 h-3" /> {lead.modelo?.nombre || 'General'}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground italic px-2">
                     <MapPin className="w-3 h-3" /> {lead.region_cliente || 'RM'}
                  </div>
                </div>

                {/* Status & Timing */}
                <div className="flex flex-col gap-2 items-center lg:items-end">
                   <Badge className={cn(
                     "rounded-full px-6 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase border-none shadow-xl transition-all",
                     lead.estado === "nuevo" ? "bg-brand-coral text-white shadow-brand-coral/20 hover:scale-105" : "bg-muted text-muted-foreground"
                   )}>
                      {lead.estado}
                   </Badge>
                   <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-30 italic">{formatRelative(lead.created_at)}</span>
                </div>

                {/* Quick Action */}
                <div className="flex items-center gap-3">
                   <Link 
                     href={`#lead-${lead.id}`}
                     className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-12 w-12 rounded-xl group-hover:border-primary/40 group-hover:text-primary transition-all")}
                   >
                      <ExternalLink className="w-5 h-5" />
                   </Link>
                </div>

              </div>
            )) : (
              <div className="p-24 text-center space-y-6">
                 <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto opacity-10">
                    <Users className="w-12 h-12" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-xl font-black tracking-tighter uppercase opacity-30 italic">Sin prospectos registrados</p>
                    <p className="text-muted-foreground font-medium text-sm">Tu catálogo está activo, las nuevas consultas aparecerán aquí en segundos.</p>
                 </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-foreground text-background rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-coral text-white flex items-center justify-center shadow-lg"><CheckCircle2 className="w-6 h-6" /></div>
                  <h4 className="text-2xl font-black tracking-tighter uppercase">Potencia tus ventas</h4>
               </div>
               <p className="text-lg opacity-60 font-medium max-w-xl">Activa las notificaciones Push y SMS para responder a tus prospectos en menos de 5 minutos, aumentando el cierre de ventas en un 40%.</p>
            </div>
            <Link 
              href="/dashboard/settings"
              className={cn(buttonVariants({ variant: "default" }), "h-16 px-12 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shrink-0")}
            >
              Activar Notificaciones
            </Link>
         </div>
      </div>
    </div>
  );
}

function LayoutGrid(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
