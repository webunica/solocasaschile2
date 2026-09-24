import { Suspense } from "react";
import { getInvitationByToken } from "@/lib/invitations/generate";
import { InvitationForm } from "./invitation-form";
import { TokenInputForm } from "./token-input-form";
import { ShieldCheck, Sparkles, Building2, CheckCircle2, AlertTriangle, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Invitación para Constructoras | SoloCasasChile",
  description: "Activa tu Plan Starter por invitación y publica tu primer modelo de casa gratis en SoloCasasChile.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitacionPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-muted/30 via-background to-background">
        <div className="max-w-xl w-full bg-card border border-border/60 rounded-3xl p-6 sm:p-10 text-center space-y-8 shadow-xl">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground">
              Activar Plan Starter
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              El Plan Starter es exclusivo para constructoras invitadas y permite publicar 1 modelo de casa de forma gratuita y permanente.
            </p>
          </div>

          {/* Opción 1: ¿Aún no tienes invitación? */}
          <div className="bg-gradient-to-br from-brand-teal/5 to-transparent border border-brand-teal/20 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-teal text-white text-xs font-black flex items-center justify-center shrink-0">1</span>
              <h2 className="text-sm font-bold text-foreground">¿Aún no tienes un enlace de invitación?</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              Si representas a una constructora o fabricante y deseas publicar tu primer modelo gratis, puedes solicitar ser incluido en la lista.
            </p>
            <div className="pl-8 pt-1">
              <Link
                href="/planes/starter#solicitar"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                Solicitar mi invitación gratis
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Opción 2: ¿Ya recibiste un código o enlace? */}
          <div className="border border-border/60 rounded-2xl p-5 text-left space-y-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-muted-foreground/30 text-foreground text-xs font-black flex items-center justify-center shrink-0">2</span>
              <h2 className="text-sm font-bold text-foreground">¿Ya recibiste una invitación por correo?</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">
              Pega a continuación el código o el enlace completo recibido en tu correo:
            </p>
            <div className="pl-8 pt-1">
              <TokenInputForm />
            </div>
          </div>

          {/* Enlaces secundarios */}
          <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <Link href="/planes" className="font-bold hover:text-foreground transition-colors underline underline-offset-4">
              Ver todos los planes de suscripción →
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-muted/30 via-background to-background">
        <div className="max-w-xl w-full bg-card border border-border/60 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black font-heading tracking-tight text-foreground">Invitación no encontrada</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              El código o enlace ingresado no existe, es incorrecto o ha caducado.
            </p>
          </div>

          <div className="border border-border/60 rounded-2xl p-5 text-left space-y-3 bg-muted/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Intentar con otro código o enlace</h2>
            <TokenInputForm />
          </div>

          <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-2xl p-5 space-y-3 text-left">
            <h2 className="text-sm font-bold text-foreground">¿No tienes un enlace válido?</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Puedes solicitar una invitación gratuita para tu constructora o revisar los planes de suscripción disponibles.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/planes/starter#solicitar"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-brand-teal text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-teal/90 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Solicitar invitación
              </Link>
              <Link
                href="/planes"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-foreground font-bold text-xs uppercase tracking-wider hover:bg-muted transition-colors"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (invitation.status === "accepted") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-muted/20">
        <div className="max-w-md w-full bg-card border border-border/50 rounded-3xl p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight">Invitación ya utilizada</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La invitación para <strong>{invitation.empresa_nombre}</strong> ya fue activada. Puedes ingresar directamente a tu panel de control con tu cuenta.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Iniciar sesión <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invitation.expires_at) < new Date();
  if (invitation.status === "expired" || isExpired) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-muted/20">
        <div className="max-w-md w-full bg-card border border-border/50 rounded-3xl p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight">Invitación expirada</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El plazo de 30 días para esta invitación ha finalizado. Puedes escribirnos a soporte@solocasaschile.com para renovar tu acceso preferencial.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-muted/30 via-background to-background py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Cabecera */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Invitación Exclusiva para Constructoras
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-foreground leading-tight">
            Bienvenido, <span className="text-primary">{invitation.empresa_nombre}</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            Has sido invitado a publicar tu oferta en el catálogo de casas más visitado de Chile. Activa tu cuenta para publicar tu primer modelo sin costo.
          </p>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Columna izquierda: Información del Plan Starter */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Nivel de Acceso</span>
                  <h3 className="text-2xl font-black font-heading">Plan Starter</h3>
                </div>
                <div className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-wider">
                  Gratis
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Este plan especial bajo invitación te permite probar la plataforma con 1 modelo de casa activo para siempre, sin comisiones por cotización.
              </p>

              <div className="border-t border-border/40 pt-4 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                  Beneficios incluidos
                </span>
                <ul className="space-y-2.5 text-xs text-foreground/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>1 modelo de casa</strong> en el catálogo nacional</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Hasta 3 fotos de alta resolución y planos</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Perfil de constructora con tus datos de contacto</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Botón de cotización directo hacia tu WhatsApp/correo</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Sin costo de mantención ni cobros sorpresa</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/40 rounded-2xl p-4 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Sin tarjeta de crédito
                </div>
                <p>
                  No solicitamos datos bancarios. Si en el futuro deseas publicar más modelos o destacar en tu región, podrás elegir un plan superior.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Formulario de activación */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/[0.02]">
              <div className="mb-6 space-y-1">
                <h2 className="text-xl font-black font-heading">Completa tu registro</h2>
                <p className="text-xs text-muted-foreground">
                  Crea tu acceso para ingresar al panel de control de {invitation.empresa_nombre}.
                </p>
              </div>

              <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs text-muted-foreground">Cargando formulario...</div>}>
                <InvitationForm invitation={invitation} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
