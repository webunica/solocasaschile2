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
  Eye, EyeOff, Mail, RefreshCw, Crown, Zap, Building2,
} from "lucide-react";
import { register, resendConfirmation } from "@/lib/supabase/actions";

const PLAN_META = {
  starter: {
    label: "Plan Starter · Invitación", icon: Zap, color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/30", isPaid: false,
    prices: { monthly: "0", yearly: "0" }, original: "0"
  },
  prueba: { 
    label: "Prueba 30D", icon: Building2, color: "text-brand-indigo", bg: "bg-brand-indigo/10", border: "border-brand-indigo/20", isPaid: false,
    prices: { monthly: "0", yearly: "0" }, original: "0"
  },
  gratis: { 
    label: "Acceso Gratuito", icon: Building2, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40", isPaid: false,
    prices: { monthly: "0", yearly: "0" }, original: "0"
  },
  basic: { 
    label: "Basic", icon: Building2, color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300", isPaid: true,
    prices: { monthly: "1.0", yearly: "0.8" }, original: "1.0"
  },
  crece: { 
    label: "Crece", icon: Zap, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200", isPaid: true,
    prices: { monthly: "2.0", yearly: "1.6" }, original: "2.0"
  },
  avanza: { 
    label: "Crece", icon: Zap, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200", isPaid: true,
    prices: { monthly: "2.0", yearly: "1.6" }, original: "2.0"
  },
  pro: { 
    label: "Pro", icon: Zap, color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/20", isPaid: true,
    prices: { monthly: "3.0", yearly: "2.4" }, original: "3.0"
  },
  premium: { 
    label: "Pro+", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", isPaid: true,
    prices: { monthly: "4.0", yearly: "3.2" }, original: "4.0" 
  },
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

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setLoading(true);
    setError(null);
    
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result?.error) {
        const msg = result.error.includes("already registered")
          ? "Este email ya está registrado. Inicia sesión en su lugar."
          : result.error;
        setError(msg);
        setLoading(false);
      } else if (result?.needsConfirmation) {
        setSentTo(formData.get("email") as string);
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-50 dark:bg-background"
    >
      {/* Decorative Brand accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-teal/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 mx-auto">
        
        {/* Header centrado */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <Image
              src="/images/solocasaschile-logo.png"
              alt="SolocasasChile"
              width={260}
              height={42}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
              {planMeta.isPaid
                ? "Registro Directo"
                : plan === "prueba"
                  ? "Prueba 30 días"
                  : plan === "starter"
                    ? "Plan Starter"
                    : "Crea tu cuenta gratis"}
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
              {plan === "starter"
                ? "Solo por invitación · 1 modelo gratuito y permanente."
                : plan === "prueba"
                  ? "30 días sin costo · Sin tarjeta de crédito."
                  : "Solo necesitas tu correo para comenzar."}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-border/60 flex flex-col space-y-6">
          
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl p-4 text-xs font-bold leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="plan" value={plan} />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">
                  Email Corporativo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contacto@empresa.cl"
                  required
                  className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
                />
              </div>

              <div className="space-y-1.5 relative">
                <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    minLength={6}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-4 pr-11 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPass ? "text" : "password"}
                  minLength={6}
                  required
                  placeholder="Repite tu contraseña"
                  className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-12 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-black tracking-widest text-xs uppercase rounded-xl shadow-lg shadow-brand-indigo/20 transition-all hover:scale-[1.01] active:scale-95 border-none"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span className="flex items-center justify-center gap-2 text-white">
                    Crear Cuenta <ArrowRight className="w-4 h-4 text-white" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <p className="text-[10px] text-muted-foreground text-center font-medium px-2 leading-relaxed">
            Al registrarte, declaras conocer los{" "}
            <Link href="/terminos" className="text-primary hover:underline font-bold transition-colors">
              Términos
            </Link>{" "}
            y la{" "}
            <Link href="/privacidad" className="text-primary hover:underline font-bold transition-colors">
              Privacidad
            </Link>.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 group text-xs font-semibold">
            <span className="text-muted-foreground">¿Ya tienes cuenta?</span>
            <span className="text-brand-teal font-black uppercase tracking-wider hover:underline">
              Iniciar Sesión
            </span>
          </Link>
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
