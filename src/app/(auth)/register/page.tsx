"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { register } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) {
       setStep(2);
       return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    // Validate passwords match
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (result?.error) {
      const msg = result.error.includes('already registered')
        ? 'Este email ya está registrado. Inicia sesión en su lugar.'
        : result.error;
      setError(msg);
      setLoading(false);
    } else if (result?.needsConfirmation) {
      setSentTo(formData.get('email') as string);
      setEmailSent(true);
      setLoading(false);
    }
  };

  // Pantalla de confirmación de email
  if (emailSent) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-black tracking-tight">¡Revisa tu correo!</h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Hemos enviado un enlace de confirmación a <br />
            <span className="font-black text-foreground">{sentTo}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Haz clic en el enlace del email para activar tu cuenta y acceder al dashboard.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-sm text-left space-y-2">
          <p className="font-bold text-xs uppercase tracking-widest opacity-50">¿No llegó el correo?</p>
          <p className="text-muted-foreground text-xs">Revisa tu carpeta de spam. Si el problema persiste, intenta registrarte nuevamente.</p>
        </div>
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-3 h-3" /> Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_550px]">
      {/* Side Info */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo via-brand-indigo to-brand-teal opacity-100" />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070')] bg-cover bg-center mix-blend-overlay" />
        
        <Link href="/" className="relative z-10 flex items-center space-x-2 group">
          <span className="font-heading font-black text-4xl tracking-tighter group-hover:scale-105 transition-transform">SolocasasChile</span>
        </Link>

        <div className="relative z-10 space-y-16">
          <div className="space-y-6">
             <div className="w-16 h-16 rounded-[2rem] bg-white text-primary flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <h1 className="text-6xl font-heading font-black leading-[0.9] tracking-tighter">
               Únete a la <br /> <span className="text-brand-teal">Élite Industrial</span>
             </h1>
             <p className="text-xl text-white/70 max-w-sm font-medium">Conecta tu constructora con la mayor audiencia calificada en Chile.</p>
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
                      <p className="font-black text-lg tracking-tight leading-none uppercase text-[12px]">{item.t}</p>
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

      {/* Form Card */}
      <div className="flex flex-col bg-background p-10 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-12">
          
          <div className="space-y-4">
            <div className="flex gap-2">
               <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 1 ? "brand-gradient" : "bg-muted")} />
               <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-700", step >= 2 ? "brand-gradient" : "bg-muted")} />
            </div>
            <div className="flex justify-between items-center group">
               <h2 className="text-4xl font-heading font-black tracking-tighter flex items-baseline gap-3">
                 {step === 1 ? "Empresa" : "Cuenta"} <span className="text-xs font-bold text-muted-foreground opacity-30 tracking-widest uppercase">Paso {step}/2</span>
               </h2>
               {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3" /> Atrás
                  </button>
               )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 text-destructive rounded-3xl p-5 text-xs font-black uppercase tracking-widest leading-relaxed"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
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
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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

            <Button type="submit" size="lg" disabled={loading} className="w-full h-14 brand-gradient text-white font-black tracking-[0.2em] text-[10px] uppercase rounded-[2rem] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none">
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

          <div className="pt-10 border-t border-border/40">
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
