import { createClient } from "@/lib/supabase/server";
import { EmailBulkForm } from "@/components/dashboard/admin/email-bulk-form";
import {
  PotentialConstructoraLeads,
  type PotentialConstructoraLead,
  type PotentialLeadTouch,
} from "@/components/dashboard/admin/potential-constructora-leads";
import { History, CheckCircle2, Clock, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COMMUNICATION_TEMPLATES, LEAD_FUNNEL_STAGES } from "@/lib/communications/funnel";

type ComunicacionHistorialItem = {
  id: string;
  asunto: string;
  mensaje: string;
  created_at: string;
  audiencia_plan: string;
  total_destinatarios: number;
};

export default async function AdminComunicacionesPage() {
  const supabase = await createClient();

  const { data: constructoras } = await supabase
    .from("constructoras")
    .select("id, nombre, email, plan")
    .order("nombre", { ascending: true });

  const { data: history } = await supabase
    .from("comunicaciones_historial")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: potentialLeadsData } = await supabase
    .from("potential_constructora_leads")
    .select(
      "id, empresa_nombre, contacto_nombre, email, telefono, region, etapa, estado, ultimo_contacto_at, created_at, last_email_subject, last_email_sent_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: potentialTouchesData } = await supabase
    .from("potential_constructora_lead_touches")
    .select("lead_id, tipo, asunto, resultado, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  const typedHistory = (history ?? []) as ComunicacionHistorialItem[];
  const potentialLeads = (potentialLeadsData ?? []) as PotentialConstructoraLead[];
  const potentialTouches = (potentialTouchesData ?? []) as PotentialLeadTouch[];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-none italic mb-2">
            Comunicaciones Globales
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Activa mensajes por etapa para mover leads hasta cliente y postventa.
          </p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg md:text-2xl font-black tracking-tight">Embudo Operativo Lead a Cliente</h2>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
            {LEAD_FUNNEL_STAGES.length} etapas
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LEAD_FUNNEL_STAGES.map((stage, index) => (
            <div key={stage.key} className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Paso {index + 1}
                </p>
                <Badge variant="outline" className="text-[9px] uppercase font-black">
                  SLA {stage.sla}
                </Badge>
              </div>
              <h3 className="text-sm font-black tracking-tight">{stage.label}</h3>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Objetivo:</span> {stage.objective}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Accion:</span> {stage.action}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">KPI:</span> {stage.kpi}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PotentialConstructoraLeads initialLeads={potentialLeads} recentTouches={potentialTouches} />

      <EmailBulkForm constructoras={constructoras || []} templates={COMMUNICATION_TEMPLATES} />

      <section className="space-y-6 pt-10 border-t border-border/10">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-muted-foreground opacity-40" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Ultimos envios registrados</h3>
        </div>

        <div className="grid gap-4">
          {typedHistory.length > 0 ? (
            typedHistory.map((item) => (
              <div
                key={item.id}
                className="bg-card/40 border border-border/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all"
              >
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
                      <Badge
                        variant="outline"
                        className="text-[8px] font-black uppercase tracking-tighter px-2 h-4 border-primary/20 text-primary/60"
                      >
                        {item.audiencia_plan.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-l border-border/10 pl-6">
                  <div className="text-right">
                    <p className="text-xl font-black tracking-tighter text-foreground decoration-primary decoration-2">
                      {item.total_destinatarios}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                      Empresas alcanzadas
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-60" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic opacity-50 py-10 text-center">
              No hay envios previos registrados en el historial.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
