"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, MessageSquare, Clock, CheckCircle2, 
  Download, Search, Phone, Mail, MessageCircle,
  ExternalLink, ArrowRight, Filter, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLeadStatus } from "@/lib/supabase/actions";
import { Button, buttonVariants } from "@/components/ui/button";

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
const STATUS_CONFIG: Record<string, { 
  label: string; 
  className: string; 
  gradient: string;
  next: string; 
  nextLabel: string;
  icon: any;
}> = {
  nuevo: { 
    label: "Nuevo Lead", 
    className: "text-brand-teal border-brand-teal/20 bg-brand-teal/5", 
    gradient: "from-brand-teal/20 to-transparent",
    next: "contactado", 
    nextLabel: "Marcar Contactado",
    icon: MessageSquare
  },
  contactado: { 
    label: "En Seguimiento", 
    className: "text-blue-500 border-blue-500/20 bg-blue-500/5", 
    gradient: "from-blue-500/20 to-transparent",
    next: "convertido", 
    nextLabel: "Cerrar Venta",
    icon: Phone
  },
  convertido: { 
    label: "Venta Cerrada", 
    className: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5", 
    gradient: "from-emerald-500/20 to-transparent",
    next: "nuevo", 
    nextLabel: "Reabrir Caso",
    icon: CheckCircle2
  },
};

const formatRelative = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
};

interface Props {
  initialLeads: Lead[];
}

export function LeadsCRM({ initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (leadId: string, nextStatus: string) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, estado: nextStatus } : l));
    startTransition(async () => {
      await updateLeadStatus(leadId, nextStatus);
    });
  };

  const filtered = leads.filter((l) => {
    const matchesSearch = !search || 
      l.nombre_cliente.toLowerCase().includes(search.toLowerCase()) ||
      l.email_cliente.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || l.estado === filter;
    return matchesSearch && matchesFilter;
  });

  const statsByStatus = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.estado === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-12 py-12">
      {/* Header Premium */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">CRM Industrial v2</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
            Centro de <span className="gradient-text italic">Negocios</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Administra tus prospectos en tiempo real. Unifica la comunicación y optimiza tu tasa de conversión.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
           <a
             href={`data:text/csv;charset=utf-8,${encodeURIComponent(
               ["Nombre,Email,Teléfono,Modelo,Estado,Fecha",
                 ...leads.map((l) => `"${l.nombre_cliente}","${l.email_cliente}","${l.telefono_cliente || ""}","${l.modelo?.nombre || ""}","${l.estado}","${l.created_at}"`)
               ].join("\n")
             )}`}
             download="prospectos_solocasaschile.csv"
             className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl h-14 px-8 font-bold uppercase tracking-widest gap-3 shadow-xl shadow-black/5")}
           >
             <Download className="w-4 h-4" /> Exportar Base de Datos
           </a>
        </div>
      </div>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_ORDER.map((s) => {
           const config = STATUS_CONFIG[s];
           return (
            <button 
              key={s} 
              onClick={() => setFilter(filter === s ? null : s)}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] p-8 text-left transition-all duration-500 border-2",
                filter === s ? "border-primary bg-primary/[0.03] scale-[1.02] shadow-2xl" : "border-border/40 hover:border-border hover:bg-muted/30",
              )}
            >
              <div className="relative z-10 flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter">{statsByStatus[s] || 0}</p>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] opacity-60", filter === s && "opacity-100")}>{config.label}</p>
                 </div>
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", config.className)}>
                    <config.icon className="w-5 h-5 text-current" />
                 </div>
              </div>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-1000", config.gradient, filter === s && "opacity-100")} />
            </button>
           );
        })}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
           <Input
             placeholder="Buscar por nombre, email o proyecto solicitado..."
             className="h-16 pl-14 pr-6 rounded-[2rem] bg-card/60 backdrop-blur-xl border-border/40 focus:border-primary/40 focus:ring-0 shadow-lg text-lg font-medium transition-all"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        {filter && (
          <Button 
            variant="ghost" 
            onClick={() => setFilter(null)}
            className="rounded-2xl h-16 px-6 font-bold text-xs uppercase tracking-widest text-primary hover:bg-primary/5"
          >
            Limpiar Filtros
          </Button>
        )}
      </div>

      {/* Leads List Premium */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-8">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Listado Maestro</h3>
           <Badge variant="outline" className="rounded-full px-4 border-border/40 text-[10px] font-bold">{filtered.length} Coincidencias</Badge>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 rounded-[4rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-muted/30 flex items-center justify-center">
                 <Users className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                 <p className="text-2xl font-black tracking-tight opacity-40">No se encontraron prospectos</p>
                 <p className="text-muted-foreground font-medium max-w-xs block">Intenta ajustar los términos de búsqueda o filtros.</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((lead, i) => {
                const config = STATUS_CONFIG[lead.estado] || STATUS_CONFIG.nuevo;
                return (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.02 }}
                    className="relative overflow-hidden group bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 hover:bg-card/60 hover:border-primary/20 transition-all duration-300 shadow-xl shadow-black/[0.02]"
                  >
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative z-10">
                      
                      {/* Left Side: Avatar & Identity */}
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-brand-indigo flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                            {lead.nombre_cliente.charAt(0).toUpperCase()}
                         </div>
                         <div className="space-y-1.5 min-w-0">
                           <div className="flex items-center gap-3">
                              <h4 className="text-2xl font-black tracking-tight truncate">{lead.nombre_cliente}</h4>
                              <span className="hidden md:block text-[10px] text-muted-foreground font-bold opacity-30 uppercase tracking-widest">•</span>
                              <span className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold opacity-50 uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> hace {formatRelative(lead.created_at)}
                              </span>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
                              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                 <Mail className="w-4 h-4 opacity-50" /> {lead.email_cliente}
                              </button>
                              {lead.telefono_cliente && (
                                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                                   <Phone className="w-4 h-4 opacity-50" /> {lead.telefono_cliente}
                                </button>
                              )}
                           </div>
                         </div>
                      </div>

                      {/* Middle: Inquiry Info */}
                      <div className="hidden lg:flex flex-col gap-2 min-w-[200px]">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Interés en Modelo:</span>
                         <Badge variant="outline" className="w-fit rounded-xl border-primary/20 bg-primary/5 text-primary font-bold py-1.5 px-4 gap-2">
                            <MessageSquare className="w-4 h-4 shrink-0" />
                            {lead.modelo?.nombre || "Consulta General"}
                         </Badge>
                      </div>

                      {/* Right Side: Status UI & Quick Actions */}
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full xl:w-auto pt-6 xl:pt-0 border-t border-border/20 xl:border-none">
                         <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-current flex items-center gap-2",
                              config.className
                            )}>
                               <config.icon className="w-3 h-3" />
                               {config.label}
                            </span>
                         </div>

                         <div className="flex items-center gap-2 shrink-0 ml-auto xl:ml-0">
                            {/* Fast Actions */}
                            <a 
                              href={`https://wa.me/${lead.telefono_cliente?.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "w-12 h-12 rounded-xl bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5 group")}
                            >
                               <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            
                            <a 
                              href={`mailto:${lead.email_cliente}`}
                              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "w-12 h-12 rounded-xl bg-blue-500/5 border-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/5 group")}
                            >
                               <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>

                            <div className="w-px h-8 bg-border/40 mx-2" />

                            <Button
                              onClick={() => handleStatusChange(lead.id, config.next)}
                              disabled={isPending}
                              className={cn(
                                "h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
                                lead.estado === "convertido" ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-brand-indigo text-white shadow-primary/20 hover:scale-[1.03]"
                              )}
                            >
                              {config.nextLabel}
                              <ArrowRight className="w-4 h-4 ml-3" />
                            </Button>
                         </div>
                      </div>

                    </div>

                    {/* Expandable Message (Optional Preview logic could go here) */}
                    {lead.mensaje && (
                       <div className="mt-8 pt-6 border-t border-border/40">
                          <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
                            "{lead.mensaje}"
                          </p>
                       </div>
                    )}

                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-100 opacity-20 transition-opacity duration-1000" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* SEO/Motivation Note */}
      <div className="p-12 rounded-[4rem] bg-brand-indigo/5 border border-brand-indigo/10 text-center space-y-4">
         <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center mx-auto text-brand-indigo mb-6">
            <CheckCircle2 className="w-6 h-6" />
         </div>
         <h4 className="text-2xl font-black tracking-tight">Optimiza tu Conversión</h4>
         <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Un seguimiento rápido aumenta las posibilidades de cierre en un 70%. Recuerda que puedes filtrar por estado para priorizar los prospectos nuevos.
         </p>
      </div>
    </div>
  );
}
