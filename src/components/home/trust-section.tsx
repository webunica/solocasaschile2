import { Building2, Shield, CheckCircle2, Users } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-20 border-b border-border/40 overflow-hidden bg-background">
      <div className="container max-w-7xl mx-auto px-6 text-center space-y-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
          CONECTANDO CON LAS MEJORES ENTIDADES DE CHILE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {/* Chile Industry Trust Logos */}
           <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <Building2 className="w-8 h-8 text-primary" /> <span>CChC</span>
           </div>
           <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <Shield className="w-8 h-8 text-primary" /> <span>MINVU</span>
           </div>
           <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
              <CheckCircle2 className="w-8 h-8 text-primary" /> <span>SERVIU</span>
           </div>
           <div className="flex items-center gap-3 font-black text-2xl tracking-tighter decoration-primary/30 underline underline-offset-8">
              <Users className="w-8 h-8 text-primary" /> <span>CORFO</span>
           </div>
        </div>
      </div>
    </section>
  );
}
