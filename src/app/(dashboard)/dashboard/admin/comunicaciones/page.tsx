import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EmailBulkForm } from "@/components/dashboard/admin/email-bulk-form";
import { 
  Building2, History, Send, 
  CheckCircle2, Clock, Mail
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminComunicacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get all constructoras for selection
  const { data: constructoras } = await supabase
    .from('constructoras')
    .select('id, nombre, email, plan')
    .order('nombre', { ascending: true });

  // Get recent communications history
  const { data: history } = await supabase
    .from('comunicaciones_historial')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-none italic mb-2">Comunicaciones Globales</h1>
          <p className="text-muted-foreground text-sm font-medium">Envía anuncios, actualizaciones y noticias a las constructoras de la plataforma.</p>
        </div>
      </div>

      <EmailBulkForm constructoras={constructoras || []} />

      <div className="space-y-6 pt-10 border-t border-border/10">
        <div className="flex items-center gap-3">
           <History className="w-5 h-5 text-muted-foreground opacity-40" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Últimos Envíos Registrados</h3>
        </div>

        <div className="grid gap-4">
           {history && history.length > 0 ? history.map((item: any) => (
             <div key={item.id} className="bg-card/40 border border-border/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4 flex-1">
                   <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 opacity-40" />
                   </div>
                   <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.asunto}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.mensaje}</p>
                      <div className="flex items-center gap-3 pt-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
                         </span>
                         <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter px-2 h-4 border-primary/20 text-primary/60">
                           {item.audiencia_plan.toUpperCase()}
                         </Badge>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-4 border-l border-border/10 pl-6">
                   <div className="text-right">
                      <p className="text-xl font-black tracking-tighter text-foreground decoration-primary decoration-2">{item.total_destinatarios}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Empresas Alcanzadas</p>
                   </div>
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-60" />
                </div>
             </div>
           )) : (
             <p className="text-xs text-muted-foreground italic opacity-50 py-10 text-center">No hay envíos previos registrados en el historial.</p>
           )}
        </div>
      </div>
    </div>
  );
}
