import Link from "next/link";
import { getObraKPIs } from "@/lib/supabase/obra-services";
import type { ObraKPIs } from "@/types/obra";
import { HardHat, CheckCircle2, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export async function ProjectKPICards() {
  const kpis: ObraKPIs = await getObraKPIs();

  const cards = [
    {
      label: "Proyectos Activos",
      value: kpis.total_activos,
      icon: HardHat,
      color: "text-brand-indigo bg-brand-indigo/5",
      iconColor: "text-brand-indigo",
    },
    {
      label: "Completados",
      value: kpis.total_completados,
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-500/5",
      iconColor: "text-emerald-500",
    },
    {
      label: "Con Retraso",
      value: kpis.total_atrasados,
      icon: AlertTriangle,
      color: "text-red-700 bg-red-500/5",
      iconColor: "text-red-500",
    },
    {
      label: "Cumplimiento",
      value: `${kpis.promedio_cumplimiento}%`,
      icon: TrendingUp,
      color: "text-brand-teal bg-brand-teal/5",
      iconColor: "text-brand-teal",
    },
    {
      label: "Próximos a Vencer",
      value: kpis.proximos_a_vencer,
      icon: Clock,
      color: "text-amber-700 bg-amber-400/5",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-3 p-6 bg-white rounded-[2rem] border border-border/40 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", card.color)}>
            <card.icon className={cn("w-5 h-5", card.iconColor)} />
          </div>
          <div>
            <p className="text-3xl font-black text-foreground tracking-tight">{card.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-1">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
