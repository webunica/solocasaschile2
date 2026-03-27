"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (success) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-heading font-black tracking-tight">¡Contraseña Cambiada!</h2>
          <p className="text-muted-foreground font-medium">
            Tu contraseña ha sido actualizada con éxito. Redirigiendo al login...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase italic">Nueva <span className="gradient-text">Password</span></h1>
          <p className="text-muted-foreground font-medium">Establece tu nueva contraseña de acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest opacity-60">Nueva Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="password" name="password" type="password" required placeholder="••••••••" className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-widest opacity-60">Confirmar Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input id="confirm" name="confirm" type="password" required placeholder="••••••••" className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/40 focus:ring-primary/20 transition-all font-medium" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl brand-gradient font-black uppercase tracking-widest text-[10px] text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Actualizar Contraseña"}
          </Button>
        </form>
      </div>
    </div>
  );
}
