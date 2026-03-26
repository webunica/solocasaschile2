"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { register } from "@/lib/supabase/actions";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Side Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo via-brand-indigo to-brand-coral opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        <Link href="/" className="relative z-10 flex items-center space-x-2">
          <span className="font-heading font-black text-3xl tracking-tighter">SolocasasChile</span>
        </Link>

        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
             <h1 className="text-5xl font-heading font-black leading-tight tracking-tighter">
               Registra tu <br /> <span className="text-brand-coral">Constructora</span>
             </h1>
             <p className="text-lg text-white/70 max-w-sm">Únete a la mayor vitrina de construcción modular de Chile en minutos.</p>
          </div>

          <div className="space-y-6">
             {[
               "Exposición a +50.000 visitas mensuales",
               "Gestión directa de prospectos (leads)",
               "CRUD completo de modelos y catálogos",
               "Verificación de constructora certificada",
             ].map((text, i) => (
               <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-brand-coral transition-colors">
                     <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold">{text}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="relative z-10 text-xs font-bold opacity-60">
          © 2026 SolocasasChile v2 — Constructoras
        </div>
      </div>

      {/* Form Card */}
      <div className="flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 py-10"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-black tracking-tight">Crea tu Cuenta</h2>
            <p className="text-muted-foreground font-medium">Completa los datos de tu empresa para comenzar.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="companyName">Razón Social</Label>
                  <Input id="companyName" name="companyName" placeholder="Constructora SpA" required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="rut">RUT Empresa</Label>
                  <Input id="rut" name="rut" placeholder="76.xxx.xxx-k" required />
               </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="repName">Representante Legal</Label>
                  <Input id="repName" name="repName" placeholder="Nombre completo" required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email Corporativo</Label>
                  <Input id="email" name="email" type="email" placeholder="contacto@empresa.cl" required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono de Contacto</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+56 9 ..." required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="password">Establecer Contraseña</Label>
                  <Input id="password" name="password" type="password" minLength={6} required />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" minLength={6} required />
               </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/95 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all">
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Registrar Constructora <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>
          </form>

          <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed">
            Al registrarte, declaras conocer y aceptar los <Link href="/terminos" className="underline hover:text-primary">Términos y Condiciones</Link> así como la <Link href="/privacidad" className="underline hover:text-primary">Política de Privacidad</Link> de SolocasasChile.
          </p>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-center text-muted-foreground font-medium">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
