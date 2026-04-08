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
  premium: { 
    label: "Premium", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", isPaid: true,
    prices: { monthly: "2.9", yearly: "1.45" }, original: "2.9" 
  },
  pro: { 
    label: "Pro", icon: Zap, color: "text-brand-teal", bg: "bg-brand-teal/10", border: "border-brand-teal/20", isPaid: true,
    prices: { monthly: "1.9", yearly: "0.95" }, original: "1.9"
  },
  gratis: { 
    label: "Gratis", icon: Building2, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/40", isPaid: false,
    prices: { monthly: "0", yearly: "0" }, original: "0"
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
  const billing: 'monthly' | 'yearly' = (searchParams.get("billing") === 'monthly' ? 'monthly' : 'yearly');
  const plan: PlanKey = (rawPlan in PLAN_META ? rawPlan : "gratis") as PlanKey;
  const planMeta = PLAN_META[plan];
  const PlanIcon = planMeta.icon;
  const currentPrice = planMeta.prices[billing as keyof typeof planMeta.prices] || "0";

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-slate-50"
    >
      {/* Decorative Brand accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <Image
              src="/images/logo-vertical.png"
              alt="SolocasasChile"
              width={160}
              height={120}
              className="h-24 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-heading font-black tracking-tighter text-brand-indigo whitespace-nowrap">
              {planMeta.isPaid ? "Último paso" : "Únete a la plataforma"}
            </h1>
            <p className="text-muted-foreground font-semibold text-sm md:text-base leading-relaxed max-w-sm mx-auto">
              {planMeta.isPaid 
                ? `Activa ahora tu Plan ${planMeta.label} y comienza a recibir leads.`
                : "Cientos de constructoras de casas prefabricadas en todo Chile confían en nosotros."}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-border/50 flex flex-col space-y-10">
          
          {/* Step indicator */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 1 ? "bg-brand-teal" : "bg-slate-100")} />
              <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 2 ? "bg-brand-teal" : "bg-slate-100")} />
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-indigo">
                {step === 1 ? "Paso 1: Empresa" : "Paso 2: Acceso"}
              </span>
              {step === 2 && (
                <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest hover:text-brand-indigo transition-colors flex items-center gap-2">
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
                className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl p-5 text-xs font-bold uppercase tracking-widest leading-relaxed"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="plan" value={plan} />

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">Razón Social</Label>
                    <Input id="companyName" name="companyName" placeholder="Ej: Constructora SpA" required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">RUT Empresa</Label>
                    <Input id="rut" name="rut" placeholder="76.xxx.xxx-k" required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">Teléfono</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+56 9 ..." required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">Email Corporativo</Label>
                    <Input id="email" name="email" type="email" placeholder="contacto@empresa.cl" required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">Contraseña</Label>
                    <Input id="password" name="password" type={showPass ? "text" : "password"} minLength={6} required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 pr-12 placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-4 text-slate-400 hover:text-slate-700 transition-colors">
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-brand-teal ml-2">Confirmar</Label>
                    <Input id="confirmPassword" name="confirmPassword" type={showPass ? "text" : "password"} minLength={6} required className="h-14 rounded-2xl bg-slate-50 border-slate-200 px-6 font-bold focus:ring-2 focus:ring-brand-teal transition-all text-slate-800 placeholder:text-slate-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-16 bg-brand-teal text-brand-indigo font-black tracking-[0.2em] text-xs uppercase rounded-[2rem] shadow-xl shadow-brand-teal/20 transition-transform active:scale-95 border-none hover:bg-[#34dac5]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-3">
                  {step === 1 ? "Siguiente Paso" : "Finalizar Registro"} <ArrowRight className="w-4 h-4 opacity-70" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-[10px] text-muted-foreground text-center font-bold px-4 leading-relaxed uppercase tracking-widest">
            Al registrarte, declaras conocer los <Link href="/terminos" className="text-brand-indigo hover:underline transition-colors">Términos</Link> y la <Link href="/privacidad" className="text-brand-indigo hover:underline transition-colors">Privacidad</Link>.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-4 group">
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">¿Ya tienes cuenta?</span>
            <span className="text-xs font-black uppercase tracking-widest text-brand-indigo border-b-2 border-brand-teal pb-0.5">Iniciar Sesión</span>
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
