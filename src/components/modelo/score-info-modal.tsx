"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck, FileText, History, BadgeCheck, Clock, Shield } from "lucide-react";

export function ScoreInfoModal() {
  const points = [
    {
      icon: FileText,
      title: "Documentación Legal",
      desc: "Verificación de iniciación de actividades, RUT y representante legal.",
    },
    {
      icon: History,
      title: "Historial de Proyectos",
      desc: "Validación de obras entregadas y antigüedad en el mercado.",
    },
    {
      icon: BadgeCheck,
      title: "Respaldo Comercial",
      desc: "Evaluación de solvencia y comportamiento con proveedores.",
    },
    {
      icon: Clock,
      title: "Tiempos de Respuesta",
      desc: "Métricas de atención y cumplimiento de plazos de entrega.",
    },
    {
      icon: Shield,
      title: "Garantías Activas",
      desc: "Confirmación de protocolos de postventa y seguros de obra.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className="text-[10px] font-black uppercase tracking-widest text-brand-indigo hover:text-brand-teal transition-colors underline underline-offset-4 decoration-brand-indigo/30">
        ¿Cómo se calcula?
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 md:p-12">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-indigo/10 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-brand-indigo" />
          </div>
          <DialogTitle className="text-3xl font-heading font-black tracking-tight text-center">
            Score de Confianza
          </DialogTitle>
          <DialogDescription className="text-center text-balance font-medium text-muted-foreground">
            Nuestro sistema de auditoría técnica evalúa a las constructoras bajo 5 pilares críticos para garantizar tu inversión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-8">
          {points.map((p, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center shrink-0 group-hover:bg-brand-indigo/10 transition-colors">
                <p.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand-indigo transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest leading-none">{p.title}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border/40">
          <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest">
            Auditoría Independiente por SolocasasChile
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
