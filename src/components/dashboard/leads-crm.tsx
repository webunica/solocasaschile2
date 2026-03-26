"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, MessageSquare, Clock, CheckCircle2, 
  ExternalLink, Download, Search, Phone, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLeadStatus } from "@/lib/supabase/actions";

type Lead = {
  id: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente?: string;
  region_cliente?: string;
  mensaje?: string;
  estado: string;
  created_at: string;
  modelo?: { nombre: string } | null;
};

const STATUS_ORDER = ["nuevo", "contactado", "convertido"];
const STATUS_CONFIG: Record<string, { label: string; className: string; next: string; nextLabel: string }> = {
  nuevo: { label: "Nuevo", className: "bg-brand-teal/10 text-brand-teal border-brand-teal/20", next: "contactado", nextLabel: "Marcar Contactado" },
  contactado: { label: "Contactado", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", next: "convertido", nextLabel: "Marcar Convertido" },
  convertido: { label: "Convertido ✓", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", next: "nuevo", nextLabel: "Restablecer" },
};

const formatRelative = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
};

interface Props {
  initialLeads: Lead[];
}

export function LeadsCRM({ initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (leadId: string, nextStatus: string) => {
    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, estado: nextStatus } : l));
    startTransition(async () => {
      await updateLeadStatus(leadId, nextStatus);
    });
  };

  const filtered = leads.filter((l) =>
    !search ||
    l.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
    l.email_cliente.toLowerCase().includes(search.toLowerCase())
  );

  const statsByStatus = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.estado === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-10 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter">Gestión de <span className="gradient-text">Prospectos</span></h1>
          <p className="text-muted-foreground font-medium text-lg italic opacity-80">Convierte tus consultas en ventas reales con el CRM integrado.</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(
            ["Nombre,Email,Teléfono,Modelo,Estado,Fecha",
              ...leads.map((l) => `"${l.nombre_cliente}","${l.email_cliente}","${l.telefono_cliente || ""}","${l.modelo?.nombre || ""}","${l.estado}","${l.created_at}"`)
            ].join("\n")
          )}`}
          download="prospectos.csv"
          className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border font-black text-xs uppercase tracking-widest hover:bg-muted/50 transition-all"
        >
          <Download className="w-5 h-5" /> Exportar CSV
        </a>
      </div>

      {/* Stats mini cards */}
      <div className="grid grid-cols-3 gap-4">
        {STATUS_ORDER.map((s) => (
          <div key={s} className={cn("rounded-2xl border p-5 text-center", STATUS_CONFIG[s].className)}>
            <p className="text-3xl font-black">{statsByStatus[s] || 0}</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">{STATUS_CONFIG[s].label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="h-12 pl-11 rounded-2xl bg-muted/30 border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Leads list */}
      <Card className="rounded-[3.5rem] border-border/40 shadow-2xl bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="px-10 pt-10 pb-6 border-b border-border/30">
          <CardTitle className="font-heading font-black text-2xl tracking-tight">Todas las Consultas</CardTitle>
          <CardDescription className="font-medium">{filtered.length} prospectos encontrados</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-20 text-center space-y-4 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto opacity-20" />
              <p className="font-black text-xl opacity-40 uppercase tracking-wider">Sin prospectos</p>
              <p className="text-sm font-medium">Cuando alguien cotice un modelo, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filtered.map((lead, i) => {
                const status = STATUS_CONFIG[lead.estado] || STATUS_CONFIG.nuevo;
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-10 py-7 hover:bg-muted/20 transition-colors group"
                  >
                    {/* Lead info */}
                    <div className="flex items-start gap-5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-indigo/20 to-brand-teal/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-brand-indigo" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="font-black text-base tracking-tight">{lead.nombre_cliente}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email_cliente}</span>
                          {lead.telefono_cliente && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.telefono_cliente}</span>}
                          {lead.modelo?.nombre && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />Consulta: {lead.modelo.nombre}</span>}
                        </div>
                        {lead.mensaje && <p className="text-xs text-muted-foreground italic truncate max-w-md opacity-60">"{lead.mensaje}"</p>}
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                        <Clock className="w-3 h-3" />{formatRelative(lead.created_at)}
                      </span>
                      <Badge className={cn("border font-black text-[10px] uppercase tracking-widest px-3 py-1", status.className)}>
                        {status.label}
                      </Badge>
                      <button
                        onClick={() => handleStatusChange(lead.id, status.next)}
                        disabled={isPending}
                        className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-muted hover:bg-muted/80 transition-colors border border-border/60"
                      >
                        {status.nextLabel}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
