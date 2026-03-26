import { Building2, Shield, CheckCircle2, Users } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-20 border-b border-border/40 overflow-hidden bg-background">
      <div className="container max-w-7xl mx-auto px-6 text-center space-y-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
          CONECTANDO CON LAS MEJORES ENTIDADES DE CHILE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {/* Chile Industry Trust Logos */}
           <div className="flex items-center gap-2 font-bold text-lg">
              <Building2 className="w-6 h-6" /> <span className="tracking-tighter uppercase">CChC</span>
           </div>
           <div className="flex items-center gap-2 font-bold text-lg">
              <Shield className="w-6 h-6" /> <span className="tracking-tighter uppercase">MINVU</span>
           </div>
           <div className="flex items-center gap-2 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6" /> <span className="tracking-tighter uppercase">SERVIU</span>
           </div>
           <div className="flex items-center gap-2 font-bold text-lg underline underline-offset-4 decoration-primary">
              <Users className="w-6 h-6" /> <span className="tracking-tighter uppercase">CORFO</span>
           </div>
        </div>
      </div>
    </section>
  );
}
