"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMMUNICATION_TEMPLATES,
  LEAD_FUNNEL_STAGE_MAP,
  normalizeLeadStage,
  type LeadFunnelStage,
} from "@/lib/communications/funnel";
import {
  advancePotentialConstructoraLeadStage,
  createPotentialConstructoraLead,
  markPotentialConstructoraLeadLost,
  sendPotentialConstructoraLeadEmail,
} from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowRight, Mail, Plus, RefreshCw } from "lucide-react";

export type PotentialConstructoraLead = {
  id: string;
  empresa_nombre: string;
  contacto_nombre: string | null;
  email: string;
  telefono: string | null;
  region: string | null;
  etapa: string;
  estado: string;
  ultimo_contacto_at: string | null;
  created_at: string;
  last_email_subject: string | null;
  last_email_sent_at: string | null;
};

export type PotentialLeadTouch = {
  lead_id: string;
  tipo: string;
  asunto: string | null;
  resultado: string | null;
  created_at: string;
};

interface Props {
  initialLeads: PotentialConstructoraLead[];
  recentTouches: PotentialLeadTouch[];
}

export function PotentialConstructoraLeads({ initialLeads, recentTouches }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [isPending, startTransition] = useTransition();
  const [newLead, setNewLead] = useState({
    empresa_nombre: "",
    contacto_nombre: "",
    email: "",
    telefono: "",
    region: "",
    notas: "",
  });
  const [emailDrafts, setEmailDrafts] = useState<Record<string, { subject: string; message: string; contentMode: "text" | "html" }>>({});

  const touchesByLead = useMemo(() => {
    const map = new Map<string, PotentialLeadTouch[]>();
    for (const touch of recentTouches) {
      const list = map.get(touch.lead_id) ?? [];
      list.push(touch);
      map.set(touch.lead_id, list);
    }
    return map;
  }, [recentTouches]);

  const onCreateLead = () => {
    if (!newLead.empresa_nombre.trim() || !newLead.email.trim()) {
      toast.error("Empresa y correo son obligatorios.");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("empresa_nombre", newLead.empresa_nombre);
      fd.append("contacto_nombre", newLead.contacto_nombre);
      fd.append("email", newLead.email);
      fd.append("telefono", newLead.telefono);
      fd.append("region", newLead.region);
      fd.append("notas", newLead.notas);

      const result = await createPotentialConstructoraLead(fd);
      if (result.success) {
        toast.success("Prospecto creado. Recarga para ver datos actualizados.");
        setNewLead({
          empresa_nombre: "",
          contacto_nombre: "",
          email: "",
          telefono: "",
          region: "",
          notas: "",
        });
      } else {
        toast.error(result.error || "No se pudo crear el prospecto.");
      }
    });
  };

  const onAdvanceLead = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const current = normalizeLeadStage(lead.etapa);
        const next = LEAD_FUNNEL_STAGE_MAP[current].next;
        return {
          ...lead,
          etapa: next,
          estado: next === "cerrado_ganado" ? "ganado" : next === "cerrado_perdido" ? "perdido" : "activo",
        };
      })
    );

    startTransition(async () => {
      const result = await advancePotentialConstructoraLeadStage(leadId);
      if (!result.success) {
        toast.error(result.error || "No se pudo avanzar etapa.");
      }
    });
  };

  const onMarkLost = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, etapa: "cerrado_perdido", estado: "perdido" } : lead
      )
    );

    startTransition(async () => {
      const result = await markPotentialConstructoraLeadLost(leadId);
      if (!result.success) {
        toast.error(result.error || "No se pudo marcar como perdido.");
      }
    });
  };

  const applyTemplate = (lead: PotentialConstructoraLead, stage: LeadFunnelStage) => {
    const template = COMMUNICATION_TEMPLATES.find((t) => t.stage === stage);
    if (!template) return;
    const defaultName = lead.contacto_nombre || lead.empresa_nombre;
    const draft = {
      subject: template.subject
        .replaceAll("{{modelo}}", "alianza comercial")
        .replaceAll("{{nombre}}", defaultName),
      message: template.message
        .replaceAll("{{nombre}}", defaultName)
        .replaceAll("{{modelo}}", "alianza comercial")
        .replaceAll("{{ejecutivo}}", "equipo comercial SoloCasasChile")
        .replaceAll("{{opcion_1}}", "Plan Pro")
        .replaceAll("{{opcion_2}}", "Plan Premium")
        .replaceAll("{{opcion_3}}", "Plan Growth")
        .replaceAll("{{hito_siguiente}}", "sesion de onboarding")
        .replaceAll("{{fecha}}", "por confirmar"),
      contentMode: template.mode,
    };
    setEmailDrafts((prev) => ({ ...prev, [lead.id]: draft }));
    toast.success(`Plantilla "${template.name}" aplicada.`);
  };

  const onSendEmail = (lead: PotentialConstructoraLead) => {
    const draft = emailDrafts[lead.id];
    if (!draft?.subject?.trim() || !draft?.message?.trim()) {
      toast.error("Completa asunto y mensaje para enviar.");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("leadId", lead.id);
      fd.append("subject", draft.subject);
      fd.append("message", draft.message);
      fd.append("contentMode", draft.contentMode);
      const result = await sendPotentialConstructoraLeadEmail(fd);
      if (result.success) {
        toast.success("Correo enviado al prospecto.");
      } else {
        toast.error(result.error || "No se pudo enviar el correo.");
      }
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg md:text-2xl font-black tracking-tight">Prospeccion de Constructoras Potenciales</h2>
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
          {leads.length} prospectos
        </Badge>
      </div>

      <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nuevo prospecto</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Input placeholder="Empresa*" value={newLead.empresa_nombre} onChange={(e) => setNewLead((p) => ({ ...p, empresa_nombre: e.target.value }))} />
          <Input placeholder="Contacto" value={newLead.contacto_nombre} onChange={(e) => setNewLead((p) => ({ ...p, contacto_nombre: e.target.value }))} />
          <Input placeholder="Email*" type="email" value={newLead.email} onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))} />
          <Input placeholder="Telefono" value={newLead.telefono} onChange={(e) => setNewLead((p) => ({ ...p, telefono: e.target.value }))} />
          <Input placeholder="Region" value={newLead.region} onChange={(e) => setNewLead((p) => ({ ...p, region: e.target.value }))} />
          <Input placeholder="Fuente (opcional)" value="manual_admin" disabled />
        </div>
        <Textarea
          placeholder="Notas iniciales..."
          value={newLead.notas}
          onChange={(e) => setNewLead((p) => ({ ...p, notas: e.target.value }))}
          className="min-h-[88px]"
        />
        <Button onClick={onCreateLead} disabled={isPending} className="rounded-xl font-black uppercase text-xs tracking-widest">
          {isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
          Guardar Prospecto
        </Button>
      </div>

      <div className="grid gap-4">
        {leads.map((lead) => {
          const stage = normalizeLeadStage(lead.etapa);
          const stageDef = LEAD_FUNNEL_STAGE_MAP[stage];
          const draft = emailDrafts[lead.id] ?? { subject: "", message: "", contentMode: "text" as const };
          const touches = touchesByLead.get(lead.id) ?? [];

          return (
            <div key={lead.id} className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{lead.empresa_nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.contacto_nombre || "Sin contacto"} - {lead.email}
                    {lead.telefono ? ` - ${lead.telefono}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-[10px] uppercase">{stageDef.label}</Badge>
                  <Badge variant="outline" className={cn("text-[10px] uppercase", lead.estado === "perdido" ? "border-rose-500/30 text-rose-500" : lead.estado === "ganado" ? "border-emerald-500/30 text-emerald-600" : "")}>
                    {lead.estado}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => onAdvanceLead(lead.id)}
                  disabled={isPending}
                  className="rounded-xl text-[10px] uppercase font-black tracking-widest"
                >
                  {stageDef.nextLabel}
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
                {stage !== "cerrado_perdido" && stage !== "cerrado_ganado" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkLost(lead.id)}
                    disabled={isPending}
                    className="rounded-xl text-[10px] uppercase font-black tracking-widest border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white"
                  >
                    Marcar perdido
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate(lead, stage)}
                  disabled={isPending}
                  className="rounded-xl text-[10px] uppercase font-black tracking-widest"
                >
                  Cargar plantilla etapa
                </Button>
              </div>

              <div className="space-y-2 border border-border/30 rounded-xl p-3 bg-muted/5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email de seguimiento</Label>
                </div>
                <Input
                  placeholder="Asunto"
                  value={draft.subject}
                  onChange={(e) =>
                    setEmailDrafts((prev) => ({ ...prev, [lead.id]: { ...draft, subject: e.target.value } }))
                  }
                />
                <Textarea
                  placeholder="Mensaje..."
                  value={draft.message}
                  onChange={(e) =>
                    setEmailDrafts((prev) => ({ ...prev, [lead.id]: { ...draft, message: e.target.value } }))
                  }
                  className="min-h-[110px]"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => onSendEmail(lead)}
                    disabled={isPending}
                    className="rounded-xl text-[10px] uppercase font-black tracking-widest"
                  >
                    Enviar correo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEmailDrafts((prev) => ({ ...prev, [lead.id]: { ...draft, contentMode: draft.contentMode === "text" ? "html" : "text" } }))
                    }
                    disabled={isPending}
                    className="rounded-xl text-[10px] uppercase font-black tracking-widest"
                  >
                    Modo {draft.contentMode.toUpperCase()}
                  </Button>
                </div>
              </div>

              {touches.length > 0 && (
                <div className="border-t border-border/20 pt-3">
                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">Trazabilidad reciente</p>
                  <div className="space-y-1">
                    {touches.slice(0, 3).map((touch, i) => (
                      <p key={`${touch.lead_id}-${touch.created_at}-${i}`} className="text-xs text-muted-foreground">
                        [{new Date(touch.created_at).toLocaleDateString()}] {touch.tipo}: {touch.asunto || touch.resultado || "Sin detalle"}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
