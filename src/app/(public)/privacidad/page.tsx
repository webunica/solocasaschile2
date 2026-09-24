import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { LeyPolicyEmbed } from "@/components/legal/ley21719-embeds";

export const metadata: Metadata = {
  title: "Política de Privacidad | SolocasasChile",
  description: "Conoce cómo protegemos y gestionamos tus datos personales en SolocasasChile conforme a la Ley N° 21.719.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen pt-40 pb-24 bg-background">
      <div className="container max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>

        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Transparencia y Cumplimiento Normativo
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground">
            Política de <span className="text-brand-teal">Privacidad</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            En SolocasasChile valoramos tu privacidad y protegemos tus datos de acuerdo con los más altos estándares y la normativa chilena vigente (Ley N° 21.719).
          </p>
        </div>

        {/* Banner destacado para ejercer derechos ARSOP+ */}
        <div className="mb-10 p-6 md:p-8 rounded-[2rem] bg-brand-evergreen-dark text-white border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest">
              <Scale className="w-3.5 h-3.5" /> Derechos Ley 21.719
            </div>
            <h2 className="text-xl font-heading font-bold text-white">
              ¿Deseas acceder, rectificar o eliminar tus datos?
            </h2>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed">
              Puedes presentar tu solicitud ARSOP+ de forma rápida y gratuita a través de nuestro formulario oficial con plazos legales garantizados.
            </p>
          </div>
          <Link
            href="/ejercer-derechos"
            className="inline-flex items-center gap-2 shrink-0 px-6 py-3 rounded-xl bg-accent text-brand-evergreen-dark text-xs font-black uppercase tracking-wider hover:bg-white transition-colors shadow-lg"
          >
            Ejercer Derechos ARSOP+ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Contenedor oficial para sincronización automática de la política desde la plataforma */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-4 h-4 text-brand-teal" /> Texto Oficial de la Política
          </div>
          <LeyPolicyEmbed />
        </div>

        {/* Contacto de privacidad adicional */}
        <div className="mt-16 p-8 rounded-[2rem] bg-card border border-border/60 text-center space-y-4">
          <h3 className="text-xl font-black font-heading text-foreground">¿Tienes dudas adicionales sobre tus datos?</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Nuestro equipo de cumplimiento y privacidad responderá cualquier consulta relacionada con el tratamiento de tus datos personales.
          </p>
          <div className="pt-2">
            <a
              href="mailto:privacidad@solocasaschile.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Contactar a privacidad@solocasaschile.com
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
          SoloCasasChile · Cumplimiento Ley N° 21.719
        </p>
      </div>
    </main>
  );
}
