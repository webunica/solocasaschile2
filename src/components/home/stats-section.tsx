import { Users, Building2, TrendingUp, ShieldCheck } from "lucide-react";

export function StatsSection() {
  return (
    <section className="bg-background py-32 overflow-hidden relative border-y border-border/40">
      <div className="absolute inset-0 bg-muted/20 mix-blend-multiply pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-border/40 hidden lg:block" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-border/40 hidden lg:block" />
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center">
          {[
            { label: "Familias / Mes", val: "+50.000", icon: Users, border: "lg:border-r" },
            { label: "Constructoras", val: "+226", icon: Building2, border: "lg:border-r" },
            { label: "Modelos Activos", val: "+5.000", icon: TrendingUp, border: "lg:border-r" },
            { label: "Plataforma de Confianza", val: "Auditadas", icon: ShieldCheck, border: "" },
          ].map((stat, i) => (
            <div 
              key={stat.label} 
              className={`p-10 lg:p-16 flex flex-col gap-6 group transition-all duration-700 bg-background hover:bg-muted/30 ${stat.border} border-border/40`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:brand-gradient group-hover:text-white transition-all transform group-hover:scale-110">
                 <stat.icon className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-[-0.08em] leading-none text-foreground mix-blend-multiply group-hover:text-primary transition-colors">
                  {stat.val}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 leading-relaxed">
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
