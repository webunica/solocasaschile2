"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { COLD_CAMPAIGN_TEMPLATES } from "@/lib/communications/funnel";
import {
  createConstructoraCommsLead,
  sendConstructoraCampaign,
  updateConstructoraCommsSegment,
} from "@/lib/supabase/actions";
import { Plus, Send, Users } from "lucide-react";

export type ConstructoraCommsLead = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  plan: string | null;
  regiones: string[] | null;
  comms_segmento: string | null;
  comms_step: string | null;
  last_contact_at: string | null;
  next_contact_at: string | null;
  comms_opt_out: boolean | null;
};

type Props = {
  leads: ConstructoraCommsLead[];
  regions: string[];
};

export function ConstructoraCommsStage1({ leads, regions }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<"all" | "frio" | "interesado" | "embudo">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [campaignStep, setCampaignStep] = useState<"cold_1" | "cold_2" | "cold_3">("cold_1");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contentMode, setContentMode] = useState<"text" | "html">("text");
  const [isPending, startTransition] = useTransition();

  const [manualLead, setManualLead] = useState({
    empresa_nombre: "",
    contacto_nombre: "",
    email: "",
    telefono: "",
    region: "",
    notes: "",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        lead.nombre.toLowerCase().includes(q) ||
        (lead.email || "").toLowerCase().includes(q) ||
        (lead.telefono || "").toLowerCase().includes(q);

      const segment = (lead.comms_segmento || "frio") as "frio" | "interesado" | "embudo" | "cliente";
      const matchesSegment = segmentFilter === "all" ? true : segment === segmentFilter;
      return matchesSearch && matchesSegment && !lead.comms_opt_out;
    });
  }, [leads, search, segmentFilter]);

  const selectedCount = selectedIds.size;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds(new Set(filteredLeads.map((lead) => lead.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const applyTemplate = (step: "cold_1" | "cold_2" | "cold_3") => {
    const tpl = COLD_CAMPAIGN_TEMPLATES.find((template) => template.step === step);
    if (!tpl) return;
    setCampaignStep(step);
    setSubject(tpl.subject);
    setMessage(tpl.message);
    setContentMode("text");
    toast.success(`Plantilla ${tpl.label} cargada.`);
  };

  const onSendCampaign = () => {
    if (selectedCount === 0) {
      toast.error("Selecciona al menos una constructora.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error("Completa asunto y mensaje.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("selected_ids", JSON.stringify(Array.from(selectedIds)));
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("content_mode", contentMode);
      formData.append("campaign_step", campaignStep);

      const result = await sendConstructoraCampaign(formData);
      if (result.success) {
        toast.success(`Campaña enviada a ${result.count} constructoras.`);
        router.refresh();
      } else {
        toast.error(result.error || "No se pudo enviar la campaña.");
      }
    });
  };

  const onMoveSegment = (segment: "interesado" | "embudo") => {
    if (selectedCount === 0) {
      toast.error("Selecciona al menos una constructora.");
      return;
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.append("selected_ids", JSON.stringify(Array.from(selectedIds)));
      formData.append("segment", segment);
      const result = await updateConstructoraCommsSegment(formData);
      if (result.success) {
        toast.success(`Seleccion movida a ${segment}.`);
        router.refresh();
      } else {
        toast.error(result.error || "No se pudo mover el segmento.");
      }
    });
  };

  const onAddManualLead = () => {
    if (!manualLead.empresa_nombre.trim() || !manualLead.email.trim()) {
      toast.error("Empresa y email son obligatorios.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("empresa_nombre", manualLead.empresa_nombre);
      formData.append("contacto_nombre", manualLead.contacto_nombre);
      formData.append("email", manualLead.email);
      formData.append("telefono", manualLead.telefono);
      formData.append("region", manualLead.region);
      formData.append("notes", manualLead.notes);
      const result = await createConstructoraCommsLead(formData);
      if (result.success) {
        toast.success("Lead de constructora agregado.");
        setManualLead({
          empresa_nombre: "",
          contacto_nombre: "",
          email: "",
          telefono: "",
          region: "",
          notes: "",
        });
        router.refresh();
      } else {
        toast.error(result.error || "No se pudo agregar el lead.");
      }
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg md:text-2xl font-black tracking-tight">Etapa 1 - Campañas en Frío a Constructoras</h2>
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
          {filteredLeads.length} leads visibles
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-card border border-border/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agregar lead manual</p>
          </div>
          <Input placeholder="Empresa*" value={manualLead.empresa_nombre} onChange={(e) => setManualLead((p) => ({ ...p, empresa_nombre: e.target.value }))} />
          <Input placeholder="Contacto" value={manualLead.contacto_nombre} onChange={(e) => setManualLead((p) => ({ ...p, contacto_nombre: e.target.value }))} />
          <Input type="email" placeholder="Email*" value={manualLead.email} onChange={(e) => setManualLead((p) => ({ ...p, email: e.target.value }))} />
          <Input placeholder="Telefono" value={manualLead.telefono} onChange={(e) => setManualLead((p) => ({ ...p, telefono: e.target.value }))} />
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Region</Label>
            <select
              value={manualLead.region}
              onChange={(e) => setManualLead((p) => ({ ...p, region: e.target.value }))}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Seleccionar region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <Textarea placeholder="Notas..." className="min-h-[90px]" value={manualLead.notes} onChange={(e) => setManualLead((p) => ({ ...p, notes: e.target.value }))} />
          <Button onClick={onAddManualLead} disabled={isPending} className="w-full rounded-xl text-[10px] uppercase tracking-widest font-black">
            Guardar Lead
          </Button>
        </div>

        <div className="lg:col-span-2 bg-card border border-border/40 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar empresa, email o telefono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            {(["all", "frio", "interesado", "embudo"] as const).map((segment) => (
              <Button
                key={segment}
                size="sm"
                variant={segmentFilter === segment ? "default" : "outline"}
                onClick={() => setSegmentFilter(segment)}
                className="rounded-xl text-[10px] uppercase tracking-widest font-black"
              >
                {segment}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={selectAllFiltered} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
              Seleccionar visibles
            </Button>
            <Button size="sm" variant="outline" onClick={clearSelection} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
              Limpiar
            </Button>
          </div>

          <div className="max-h-[280px] overflow-y-auto border border-border/30 rounded-xl p-2 space-y-1 bg-muted/5">
            {filteredLeads.map((lead) => {
              const isSelected = selectedIds.has(lead.id);
              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => toggleSelect(lead.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    isSelected ? "border-primary/40 bg-primary/5" : "border-transparent hover:border-border/40 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-black truncate">{lead.nombre}</p>
                    <Badge variant="outline" className="text-[9px] uppercase">{lead.comms_segmento || "frio"}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{lead.email || "Sin email"}</p>
                  <p className="text-[10px] text-muted-foreground/80 truncate">{lead.telefono || "-"} {lead.regiones?.[0] ? `| ${lead.regiones[0]}` : ""}</p>
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Plantillas cold</Label>
              <div className="flex flex-wrap gap-2">
                {COLD_CAMPAIGN_TEMPLATES.map((tpl) => (
                  <Button key={tpl.step} size="sm" variant="outline" onClick={() => applyTemplate(tpl.step)} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
                    {tpl.label}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => onMoveSegment("interesado")} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
                  Mover a Interesado
                </Button>
                <Button size="sm" variant="outline" onClick={() => onMoveSegment("embudo")} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
                  Mover a Embudo
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Paso de campaña</Label>
              <div className="flex gap-2">
                {(["cold_1", "cold_2", "cold_3"] as const).map((step) => (
                  <Button
                    key={step}
                    size="sm"
                    variant={campaignStep === step ? "default" : "outline"}
                    onClick={() => setCampaignStep(step)}
                    className="rounded-xl text-[10px] uppercase tracking-widest font-black"
                  >
                    {step}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={contentMode === "text" ? "default" : "outline"}
                  onClick={() => setContentMode("text")}
                  className="rounded-xl text-[10px] uppercase tracking-widest font-black"
                >
                  Texto
                </Button>
                <Button
                  size="sm"
                  variant={contentMode === "html" ? "default" : "outline"}
                  onClick={() => setContentMode("html")}
                  className="rounded-xl text-[10px] uppercase tracking-widest font-black"
                >
                  HTML
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Asunto</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Asunto del correo..." />
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mensaje</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[140px]" placeholder="Mensaje de campaña..." />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Seleccionados: <span className="font-black text-foreground">{selectedCount}</span>
            </div>
            <Button onClick={onSendCampaign} disabled={isPending || selectedCount === 0} className="rounded-xl text-[10px] uppercase tracking-widest font-black">
              <Send className="w-4 h-4 mr-2" />
              Enviar Campaña
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
