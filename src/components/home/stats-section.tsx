import { Users, Building2, TrendingUp, ShieldCheck } from "lucide-react";

export function StatsSection() {
  return (
    <section className="bg-muted/30 border-y border-border/40 py-20 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] brand-gradient opacity-20" />
      
      <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
        {[
          { label: "Familias / Mes", val: "+50.000", icon: Users },
          { label: "Constructoras", val: "+220", icon: Building2 },
          { label: "Casas Publicadas", val: "+5.000", icon: TrendingUp },
          { label: "Filtros de Calidad", val: "Auditadas", icon: ShieldCheck },
        ].map((stat) => (
          <div key={stat.label} className="space-y-4 group">
            <div className="mx-auto w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-primary group-hover:brand-gradient group-hover:text-white transition-all duration-500 scale-110">
               <stat.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black tracking-tighter text-foreground">{stat.val}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
