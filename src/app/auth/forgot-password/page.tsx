"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const siteUrl = window.location.origin;

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-black tracking-tight">Email Enviado</h2>
          <p className="text-muted-foreground font-medium">
            Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer tu contraseña.
          </p>
        </div>
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-all pt-8">
          <ArrowLeft className="w-4 h-4" /> Volver al login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase italic">Recuperar <span className="gradient-text">Password</span></h1>
          <p className="text-muted-foreground font-medium">Ingresa tu email y te enviaremos un enlace de acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-60">Correo Electrónico</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input id="email" name="email" type="email" required placeholder="tu@email.com" className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl brand-gradient font-black uppercase tracking-widest text-[10px] text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Instrucciones"}
          </Button>
        </form>

        <Link href="/login" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver al Inicio de Sesión
        </Link>
      </div>
    </div>
  );
}
