"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, AlertCircle, ShieldCheck, CheckCircle2, LayoutGrid } from "lucide-react";
import { login } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error === "Invalid login credentials"
        ? "Email o contraseña incorrectos. Verifica tus datos."
        : result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_550px]">
      {/* Left: Branding & Animation */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo via-brand-indigo to-brand-teal opacity-100" />
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
             <h1 className="text-6xl font-heading font-black leading-[0.9] tracking-tighter">
               Potencia tu <br /> <span className="text-brand-teal">Alcance Industrial</span>
             </h1>
             <p className="text-xl text-white/70 max-w-sm font-medium leading-relaxed">Gestiona tu catálogo, recibe leads calificados y digitaliza tu constructora con nuestra tecnología.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
             {[
               { t: "Gestión Centralizada", d: "Control total sobre tus modelos y visibilidad." },
               { t: "Pipeline de Ventas", d: "Recibe prospectos perfilados directamente." },
               { t: "Analytics Pro", d: "Mide el impacto de tu marca en tiempo real." },
             ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                   <div className="w-10 h-10 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-brand-teal transition-all duration-500">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                   </div>
                   <div className="space-y-1">
                      <p className="font-black text-xs tracking-widest leading-none uppercase">{item.t}</p>
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

      {/* Right: Form */}
      <div className="flex flex-col bg-background p-10 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-12">
          
          <div className="space-y-4">
             <div className="h-1.5 w-full bg-muted rounded-full relative overflow-hidden">
                <div className="absolute inset-0 w-1/2 bg-brand-indigo rounded-full" />
             </div>
             <h2 className="text-4xl font-heading font-black tracking-tighter">
               Acceso <span className="gradient-text">Constructor</span>
             </h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 text-destructive rounded-3xl p-5 text-[10px] font-black uppercase tracking-widest leading-relaxed"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Email Corporativo</Label>
                <Input id="email" name="email" type="email" placeholder="admin@constructora.cl" required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Contraseña</Label>
                  <Link href="/auth/forgot-password" title="password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-14 bg-brand-indigo text-white font-black tracking-[0.2em] text-[10px] uppercase rounded-[2rem] shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-3">Iniciar Sesión <ArrowRight className="w-4 h-4" /></span>}
            </Button>
          </form>

          <div className="pt-10 border-t border-border/40">
             <Link href="/register" className="flex items-center justify-center gap-4 group">
               <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">¿Aún no eres parte?</span>
               <span className="h-10 px-6 rounded-full border border-border/40 flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Regístrate</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
