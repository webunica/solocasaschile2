"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import {
  CheckCircle2, LayoutDashboard, UserCircle,
  Home, Calendar, BookOpen, Star, Zap, Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLAN_META = {
  avanza:  { label: "Avanza",  icon: Zap,   color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/20", isPaid: true },
  prueba:  { label: "Prueba",  icon: Star,  color: "text-brand-indigo", bg: "bg-brand-indigo/10", border: "border-brand-indigo/20", isPaid: false },
  premium: { label: "Premium", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", isPaid: true },
  pro:     { label: "Pro",     icon: Zap,   color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/20", isPaid: true },
  gratis:  { label: "Gratis",  icon: Star,  color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40", isPaid: false },
} as const;
type PlanKey = keyof typeof PLAN_META;

const FREE_STEPS = [
  { icon: UserCircle, title: "Completa los datos de tu empresa", desc: "Agrega logo, descripción y contacto para impresionar a tus futuros clientes." },
  { icon: Home, title: "Sube tu primer modelo de casa", desc: "Publica tus primeros modelos durante la prueba gratuita de 4 meses sin costo." },
  { icon: BookOpen, title: "Revisa los leads que lleguen", desc: "Cada solicitud de cotización llega directo a tu panel. Responde y convierte." },
];

const PAID_STEPS = [
  { icon: LayoutDashboard, title: "Ingresa a tu panel", desc: "Tu acceso inicial ya está habilitado con funciones base." },
  { icon: UserCircle, title: "Completa la información básica", desc: "Agrega los datos de tu empresa para estar listo para la demo." },
  { icon: Calendar, title: "Agenda una demo personalizada", desc: "Te ayudaremos a configurar tu perfil y activar correctamente tu plan." },
];

function BienvenidaContent() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get("plan") || "gratis";
  const plan: PlanKey = (rawPlan in PLAN_META ? rawPlan : "gratis") as PlanKey;
  const meta = PLAN_META[plan];
  const PlanIcon = meta.icon;
  const isPaid = meta.isPaid;
  const steps = isPaid ? PAID_STEPS : FREE_STEPS;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 via-brand-teal/3 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-brand-teal/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-4 md:px-8 pt-36 pb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {/* Check icon */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.25rem] md:rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              {isPaid && (
                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-black", meta.bg, meta.border, meta.color)}>
                  <PlanIcon className="w-4 h-4" />
                  Plan {meta.label} activado
                </div>
              )}
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter leading-tight">
                ¡Bienvenido a{" "}
                <span className="gradient-text">solocasaschile.com</span>!
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                {isPaid
                  ? "Tu correo fue validado correctamente y tu cuenta ya está activa. Ya puedes ingresar a la plataforma con acceso inicial y continuar el proceso para activar tu plan."
                  : "Tu correo fue validado correctamente y tu cuenta ya está activa. Ya puedes ingresar a tu panel para completar tu perfil de empresa, publicar tus modelos y comenzar a recibir solicitudes de cotización."}
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 bg-brand-indigo text-white font-bold uppercase tracking-widest rounded-2xl gap-2 border-none shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all")}>
                <LayoutDashboard className="w-4 h-4" /> Ir a mi panel
              </Link>
              {isPaid ? (
                <Link href="/demo" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 font-bold uppercase tracking-widest rounded-2xl gap-2 border-border/40 hover:border-primary hover:text-primary transition-all")}>
                  <Calendar className="w-4 h-4" /> Agendar demo
                </Link>
              ) : (
                <Link href="/dashboard/settings" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 font-bold uppercase tracking-widest rounded-2xl gap-2 border-border/40 hover:border-primary hover:text-primary transition-all")}>
                  <UserCircle className="w-4 h-4" /> Completar perfil
                </Link>
              )}
              {!isPaid && (
                <Link href="/dashboard/catalog/new" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-14 px-8 font-bold uppercase tracking-widest rounded-2xl gap-2 text-muted-foreground hover:text-foreground transition-all")}>
                  <Home className="w-4 h-4" /> Publicar mi primer modelo
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="container max-w-4xl mx-auto px-4 md:px-8 pb-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Tus próximos pasos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex flex-col gap-4 bg-card/60 border border-border/40 rounded-3xl p-5 hover:border-primary/20 hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                     <div className="w-10 h-10 shrink-0 rounded-[1.25rem] bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all">
                       <StepIcon className="w-5 h-5 text-primary" />
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                       Paso {i + 1}
                     </span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-foreground text-sm leading-tight">{step.title}</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Demo block — paid plans only */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-brand-indigo rounded-3xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=60&w=800')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Para ti · Plan {meta.label}</p>
                <h2 className="text-3xl font-heading font-black tracking-tighter">¿Quieres avanzar con tu plan?</h2>
                <p className="text-white/75 font-medium leading-relaxed max-w-md">
                  Agenda una demo y te ayudaremos a configurar tu perfil, resolver dudas y activar correctamente tu cuenta según el plan elegido.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/demo" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 bg-white text-brand-indigo hover:bg-white/95 font-bold uppercase tracking-widest rounded-2xl gap-2 border-none shadow-xl transition-all hover:scale-105")}>
                  <Calendar className="w-4 h-4" /> Agendar demo
                </Link>
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-12 px-7 text-white hover:bg-white/10 font-bold uppercase tracking-widest rounded-2xl gap-2 border border-white/20")}>
                  <LayoutDashboard className="w-4 h-4" /> Ir a mi panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function BienvenidaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BienvenidaContent />
    </Suspense>
  );
}
