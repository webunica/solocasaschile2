"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CheckCircle2, ShieldCheck, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_550px]">
      {/* Left: Branding & Animation */}
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
               Nueva <br /> <span className="text-brand-teal">Identidad</span>
             </h1>
             <p className="text-xl text-white/70 max-w-sm font-medium leading-relaxed">Actualiza tus credenciales para mantener el control de tu constructora.</p>
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
                <div className="absolute inset-0 w-2/3 bg-brand-indigo rounded-full" />
             </div>
             <h2 className="text-4xl font-heading font-black tracking-tighter">
               Crear <span className="gradient-text">Contraseña</span>
             </h2>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                 <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-3">
                 <p className="font-bold uppercase tracking-widest text-emerald-600">Actualización Exitosa</p>
                 <p className="text-muted-foreground font-medium leading-relaxed italic">
                   Tu contraseña ha sido actualizada. Serás redirigido al login en segundos...
                 </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-5 rounded-3xl bg-destructive/5 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  {error}
                </div>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest opacity-40">Nueva Contraseña</Label>
                  <Input id="password" name="password" type={showPass ? "text" : "password"} required placeholder="••••••••" className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-4 text-muted-foreground opacity-40 hover:opacity-100 transition-opacity">
                     {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-[10px] uppercase font-black tracking-widest opacity-40">Confirmar</Label>
                  <Input id="confirm" name="confirm" type={showPass ? "text" : "password"} required placeholder="••••••••" className="h-14 rounded-2xl border-border/40 px-6 font-bold" />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 rounded-[2rem] bg-brand-indigo font-black uppercase tracking-widest text-[10px] text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Actualizar Contraseña"}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
