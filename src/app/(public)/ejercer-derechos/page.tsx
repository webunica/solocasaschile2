import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, CheckCircle2, Lock } from "lucide-react";
import type { Metadata } from "next";
import { LeyRightsForm } from "@/components/legal/ley21719-embeds";

export const metadata: Metadata = {
  title: "Ejercicio de Derechos de Datos Personales (Ley 21.719) | SolocasasChile",
  description: "Ejerce tus derechos ARSOP+ (Acceso, Rectificación, Supresión, Oposición, Portabilidad y Bloqueo) conforme a la Ley N° 21.719 sobre protección de la vida privada en Chile.",
  alternates: {
    canonical: "/ejercer-derechos",
  },
};

export default function EjercerDerechosPage() {
  return (
    <main className="min-h-screen pt-40 pb-24 bg-background">
      <div className="container max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>

        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" /> Cumplimiento Normativo Chileno · Ley 21.719
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground">
            Ejercicio de Derechos de <span className="text-brand-teal">Datos Personales</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Conforme a la Ley N° 21.719 sobre protección de datos personales en Chile, puedes ejercer en cualquier momento tus derechos de Acceso, Rectificación, Supresión, Oposición, Portabilidad y Bloqueo (ARSOP+).
          </p>
        </div>

        {/* Plazos y garantías legales */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> Acuse de Recibo
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo <strong>5 días hábiles</strong> para la confirmación de recepción formal de tu solicitud.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
              <ShieldCheck className="w-4 h-4" /> Plazo de Resolución
            </div>
            <p className="text-xs text-muted-foreground">
              Hasta <strong>30 días hábiles</strong> para responder y ejecutar la resolución correspondiente.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2">
            <div className="flex items-center gap-2 text-brand-teal font-bold text-sm">
              <Lock className="w-4 h-4" /> Procedimiento Gratuito
            </div>
            <p className="text-xs text-muted-foreground">
              El trámite de tus derechos sobre datos personales no tiene ningún costo asociado.
            </p>
          </div>
        </div>

        {/* Contenedor del Formulario oficial ARSOP+ */}
        <div className="bg-card border border-border/60 rounded-[2rem] p-6 md:p-10 shadow-sm mb-12">
          <LeyRightsForm />
        </div>

        {/* Enlace y notas complementarias */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileText className="w-4 h-4 text-brand-teal" /> ¿Quieres revisar nuestra política completa?
            </div>
            <p className="text-xs text-muted-foreground">
              Conoce en detalle cómo tratamos y protegemos tus datos en SoloCasasChile.
            </p>
          </div>
          <Link
            href="/privacidad"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Ver Política de Privacidad
          </Link>
        </div>
      </div>
    </main>
  );
}
