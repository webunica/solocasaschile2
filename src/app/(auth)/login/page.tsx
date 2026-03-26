"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { login } from "@/lib/supabase/actions";

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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo via-brand-indigo to-brand-teal opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <Link href="/" className="relative z-10 flex items-center space-x-2">
          <span className="font-heading font-black text-3xl tracking-tighter">SolocasasChile</span>
        </Link>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="text-[10px] tracking-widest font-black uppercase rounded-full px-3 py-1 border border-white/20 bg-white/10 text-white inline-block">
            CONSTRUCTORAS
          </div>
          <h1 className="text-5xl font-heading font-black leading-tight tracking-tighter">
            Potencia tu alcance <br /> 
            <span className="text-brand-teal">llega a más clientes</span>
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Únete a la plataforma líder de casas prefabricadas en Chile. Gestiona tus modelos, recibe prospectos y haz crecer tu empresa.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-12 text-sm font-bold opacity-60">
          <div>+226 Constructoras</div>
          <div>+5.000 Modelos</div>
          <div>Impacto Nacional</div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-black tracking-tight">Acceso Constructor</h2>
            <p className="text-muted-foreground font-medium">Ingresa tus credenciales para gestionar tu catálogo.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl px-4 py-3 text-sm font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo</Label>
                <Input id="email" name="email" type="email" placeholder="nombre@empresa.cl" className="h-12" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-primary hover:underline underline-offset-4">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" className="h-12" required />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/95 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Iniciar Sesión <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>
          </form>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-center text-muted-foreground font-medium">
              ¿Aún no eres parte?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Registra tu constructora
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
