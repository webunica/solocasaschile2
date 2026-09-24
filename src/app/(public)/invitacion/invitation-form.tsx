"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerFromInvitation } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle2, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import type { ConstructoraInvitation } from "@/lib/invitations/generate";

interface InvitationFormProps {
  invitation: ConstructoraInvitation;
}

export function InvitationForm({ invitation }: InvitationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [needsConfirmEmail, setNeedsConfirmEmail] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState(invitation.empresa_nombre);
  const [repName, setRepName] = useState(invitation.contacto_nombre || "");
  const [email, setEmail] = useState(invitation.email);
  const [phone, setPhone] = useState("");
  const [rut, setRut] = useState("");
  const [region, setRegion] = useState(invitation.region || "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("token", invitation.token);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("companyName", companyName);
      formData.append("repName", repName);
      formData.append("phone", phone);
      formData.append("rut", rut);
      formData.append("region", region);

      const result = await registerFromInvitation(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.needsConfirmation) {
        setNeedsConfirmEmail(result.email || email);
        setDone(true);
        return;
      }

      toast.success("¡Cuenta activada con éxito! Redirigiendo...");
      router.push(result.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error al registrar:", err);
      toast.error("Ocurrió un error inesperado al procesar tu registro.");
    } finally {
      setLoading(false);
    }
  };

  if (done && needsConfirmEmail) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black font-heading">Revisa tu correo electrónico</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Hemos enviado un enlace de confirmación a <strong>{needsConfirmEmail}</strong>. Haz clic en él para acceder inmediatamente a tu panel de control.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Nombre de la Empresa *
          </Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="repName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Nombre de Contacto / Representante
          </Label>
          <Input
            id="repName"
            placeholder="Ej: Juan Pérez"
            value={repName}
            onChange={(e) => setRepName(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Correo Electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/80 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Teléfono o WhatsApp de Contacto
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+56 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rut" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            RUT de la Empresa (opcional)
          </Label>
          <Input
            id="rut"
            placeholder="Ej: 76.123.456-7"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="region" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Región Principal
          </Label>
          <Input
            id="region"
            placeholder="Ej: Región Metropolitana"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20"
          />
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Crea tu Contraseña *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-sm transition-all hover:border-slate-400 dark:hover:border-slate-500 focus-visible:border-brand-teal focus-visible:ring-2 focus-visible:ring-brand-teal/20 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Te servirá para iniciar sesión en tu panel y administrar tus modelos.
        </p>
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg hover:opacity-95 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Activando Plan Starter...
            </>
          ) : (
            <>
              Activar cuenta y publicar modelo <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground leading-normal">
        Al hacer clic en activar, aceptas los{" "}
        <a href="/terminos" target="_blank" className="underline hover:text-foreground">términos de servicio</a> y la{" "}
        <a href="/privacidad" target="_blank" className="underline hover:text-foreground">política de privacidad</a>.
      </p>
    </form>
  );
}
