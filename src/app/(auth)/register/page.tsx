"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle,
  Eye, EyeOff, ShieldCheck, Mail, RefreshCw, Crown, Zap, Building2,
} from "lucide-react";
import { register, resendConfirmation } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

const PLAN_META = {
  premium: { label: "Premium", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", isPaid: true },
  pro:     { label: "Pro",     icon: Zap,   color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/20", isPaid: true },
  gratis:  { label: "Gratis",  icon: Building2, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40", isPaid: false },
} as const;
type PlanKey = keyof typeof PLAN_META;

// ── Email confirmation screen ────────────────────────────────────────────────
function EmailSentScreen({
  sentTo, plan, onResend, onChangeEmail, resendLoading, resendDone,
}: {
  sentTo: string; plan: PlanKey; onResend: () => void;
  onChangeEmail: () => void; resendLoading: boolean; resendDone: boolean;
}) {
  const isPaid = PLAN_META[plan].isPaid;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-8"
      >
        {/* Icon */}
        <div className="text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Mail className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-black tracking-tighter leading-tight">
              {isPaid ? "Confirma tu correo\npara continuar" : "Revisa tu correo\npara activar tu cuenta"}
            </h1>
          </div>
        </div>

        {/* Message card */}
        <div className="bg-card/60 border border-border/40 rounded-3xl p-8 space-y-4 text-center">
          <p className="text-muted-foreground font-medium leading-relaxed">
            Hemos enviado un enlace de activación a
          </p>
          <p className="font-black text-foreground text-lg tracking-tight">{sentTo}</p>
          {isPaid ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Por favor revisa tu correo y haz clic en el enlace para validar tu cuenta.
              Mientras tanto, tu acceso inicial quedará habilitado con funciones base.
              Después de validar, podrás agendar una demostración para activar tu plan{" "}
              <span className="font-black capitalize">{plan}</span>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Haz clic en el enlace del email para activar tu cuenta en solocasaschile.com.
              El correo puede tardar unos breves minutos.
            </p>
          )}
        </div>

        {/* Spam warning */}
        <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Si no encuentras el correo en tu bandeja principal, revisa también tu carpeta de{" "}
            <span className="font-black text-foreground">spam o correo no deseado</span>.
          </p>
        </div>

        {/* Resend confirmation */}
        <AnimatePresence>
          {resendDone && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-emerald-600 font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Correo reenviado correctamente
            </motion.p>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={onResend}
            disabled={resendLoading || resendDone}
            variant="outline"
            className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest gap-2 border-border/40"
          >
            {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Reenviar correo de activación
          </Button>
          <Button
            onClick={onChangeEmail}
            variant="ghost"
            className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3 h-3" /> Cambiar correo electrónico
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 h-12 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main registration form ───────────────────────────────────────────────────
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get("plan") || "gratis";
  const plan: PlanKey = (rawPlan in PLAN_META ? rawPlan : "gratis") as PlanKey;
  const planMeta = PLAN_META[plan];
  const PlanIcon = planMeta.icon;

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentFormData = new FormData(e.currentTarget);
    
    if (step < 2) { 
      setStep1Data(Object.fromEntries(currentFormData.entries()) as Record<string, string>);
      setStep(2); 
      return; 
    }

    setLoading(true);
    setError(null);
    
    // Combine step 1 data with step 2 data
    const finalFormData = new FormData();
    Object.entries(step1Data).forEach(([k, v]) => finalFormData.append(k, v));
    Array.from(currentFormData.entries()).forEach(([k, v]) => finalFormData.append(k, v as string));

    const password = finalFormData.get("password") as string;
    const confirm = finalFormData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const result = await register(finalFormData);
      if (result?.error) {
        const msg = result.error.includes("already registered")
          ? "Este email ya está registrado. Inicia sesión en su lugar."
          : result.error;
        setError(msg);
        setLoading(false);
      } else if (result?.needsConfirmation) {
        setSentTo(finalFormData.get("email") as string);
        setEmailSent(true);
        setLoading(false);
      } else if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendDone(false);
    try { await resendConfirmation(sentTo); setResendDone(true); } catch {}
    setResendLoading(false);
  };

  if (emailSent) return (
    <EmailSentScreen
      sentTo={sentTo} plan={plan}
      onResend={handleResend} onChangeEmail={() => { setEmailSent(false); setSentTo(""); setResendDone(false); }}
      resendLoading={resendLoading} resendDone={resendDone}
    />
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_550px]">
      {/* ── Side panel ── */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo via-brand-indigo to-brand-teal" />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />

        <Link href="/" className="relative z-10 flex items-center space-x-2 group">
          <Image
            src="/images/logo-vertical.png"
            alt="SolocasasChile"
            width={160}
            height={120}
            className="h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
        </Link>

        <div className="relative z-10 space-y-16">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[2rem] bg-white text-primary flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-6xl font-heading font-black leading-[0.9] tracking-tighter">
              {planMeta.isPaid
                ? <>{plan.charAt(0).toUpperCase() + plan.slice(1)}<br /><span className="text-brand-teal">Activado</span></>
                : <>Únete a la<br /><span className="text-brand-teal">Élite Industrial</span></>}
            </h2>
            <p className="text-xl text-white/70 max-w-sm font-medium">
              {planMeta.isPaid
                ? `Estás a un paso de activar tu plan ${planMeta.label}. Conecta tu constructora con +50.000 familias chilenas.`
                : "Conecta tu constructora con la mayor audiencia calificada en Chile."}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {[
              { t: "Exposición Masiva", d: "+50.000 visitas mensuales buscando casas." },
              { t: "CRM Integrado", d: "Gestiona leads calificados en tiempo real." },
              { t: "Catálogo Pro", d: "Digitaliza tus modelos con nuestra tecnología." },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-brand-teal transition-all duration-500">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="font-black leading-none uppercase text-[12px]">{item.t}</p>
                  <p className="text-sm font-medium text-white/50">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          SolocasasChile · V2 Performance Platform
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-col bg-background p-10 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-10">

          {/* Plan badge for paid plans */}
          {planMeta.isPaid && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl border", planMeta.bg, planMeta.border)}
            >
              <PlanIcon className={cn("w-4 h-4 shrink-0", planMeta.color)} />
              <span className={cn("text-[11px] font-black uppercase tracking-widest", planMeta.color)}>
                Registrándote en Plan {planMeta.label}
              </span>
            </motion.div>
          )}

          {/* Step indicator */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 1 ? "bg-brand-indigo" : "bg-muted")} />
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 2 ? "bg-brand-indigo" : "bg-muted")} />
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-heading font-black tracking-tighter flex items-baseline gap-3">
                {step === 1 ? "Empresa" : "Cuenta"}
                <span className="text-xs font-bold text-muted-foreground opacity-30 tracking-widest uppercase">Paso {step}/2</span>
              </h1>
              {step === 2 && (
                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowLeft className="w-3 h-3" /> Atrás
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 text-destructive rounded-3xl p-5 text-xs font-black uppercase tracking-widest leading-relaxed"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            <input type="hidden" name="plan" value={plan} />

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Razón Social</Label>
                    <Input id="companyName" name="companyName" placeholder="Constructora SpA" required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">RUT Empresa</Label>
                    <Input id="rut" name="rut" placeholder="76.xxx.xxx-k" required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Teléfono Corporativo</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+56 9 ..." required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Email Corporativo</Label>
                    <Input id="email" name="email" type="email" placeholder="contacto@empresa.cl" required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Contraseña</Label>
                    <Input id="password" name="password" type={showPass ? "text" : "password"} minLength={6} required className="h-14 rounded-2xl border-border/40 px-6 font-bold pr-12" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-4 text-muted-foreground opacity-40 hover:opacity-100 transition-opacity">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Confirmar</Label>
                    <Input id="confirmPassword" name="confirmPassword" type={showPass ? "text" : "password"} minLength={6} required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-14 bg-brand-indigo text-white font-black tracking-[0.2em] text-[10px] uppercase rounded-[2rem] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-3">
                  {step === 1 ? "Siguiente Paso" : "Finalizar Registro"} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-[9px] text-muted-foreground text-center font-bold px-4 leading-relaxed opacity-40 uppercase tracking-widest">
            Al registrarte, declaras conocer los <Link href="/terminos" className="underline hover:text-primary transition-colors">Términos</Link> y la <Link href="/privacidad" className="underline hover:text-primary transition-colors">Privacidad</Link>.
          </p>

          <div className="pt-8 border-t border-border/40">
            <Link href="/login" className="flex items-center justify-center gap-4 group">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">¿Ya tienes cuenta?</span>
              <span className="h-10 px-6 rounded-full border border-border/40 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Iniciar Sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
