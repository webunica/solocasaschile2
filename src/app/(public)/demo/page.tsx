import Script from "next/script";

export const metadata = {
  title: "Agendar Demo | SolocasasChile",
  description: "Agenda una demostración con nuestro equipo para activar tu plan y configurar tu perfil en SolocasasChile.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Header ────────────────────────────────────────────── */}
      <section className="relative py-20 text-center overflow-hidden border-b border-border/40 bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none">
            Agenda tu <span className="gradient-text">Demostración</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Elige el horario que más te acomode para reunirnos. Te ayudaremos a sacar el máximo provecho a la plataforma según tu plan.
          </p>
        </div>
      </section>

      {/* ── Calendly Widget ────────────────────────────────────── */}
      <section className="container max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-card border border-border/40 rounded-[2rem] shadow-2xl overflow-hidden min-h-[700px]">
          {/* Principio del widget integrado de Calendly */}
          <div 
            className="calendly-inline-widget w-full" 
            data-url="https://calendly.com/agenda-solocasaschile/reunion-solocasaschile-com" 
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          <Script 
            type="text/javascript" 
            src="https://assets.calendly.com/assets/external/widget.js" 
            strategy="lazyOnload" 
          />
          {/* Final del widget integrado de Calendly */}
        </div>
      </section>
    </div>
  );
}
