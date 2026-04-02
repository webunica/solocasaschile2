import { Users, Building2, TrendingUp, ShieldCheck } from "lucide-react";

export function StatsSection() {
  return (
    <section className="bg-background py-32 overflow-hidden relative border-y border-border/40">
      <div className="absolute inset-0 bg-muted/20 mix-blend-multiply pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-border/40 hidden lg:block" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-border/40 hidden lg:block" />
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 items-stretch divide-x divide-y divide-border/20 border-l border-t border-border/20">
          {[
            { label: "Familias / Mes", val: "+50.000", icon: Users },
            { label: "Constructoras", val: "+226", icon: Building2 },
            { label: "Modelos Activos", val: "+5.000", icon: TrendingUp },
            { label: "Plataforma Pro", val: "Auditadas", icon: ShieldCheck },
          ].map((stat, i) => (
            <div 
              key={stat.label} 
              className="p-8 md:p-12 lg:p-16 flex flex-col gap-8 group transition-all duration-700 bg-background hover:bg-muted/30 border-r border-b border-border/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-brand-indigo group-hover:text-white transition-all transform group-hover:scale-110 border border-border/20">
                 <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="text-[clamp(2rem,4vw,4.5rem)] font-black tracking-[-0.06em] leading-[0.9] text-foreground group-hover:text-primary transition-colors">
                  {stat.val}
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50 leading-tight max-w-[140px]">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
