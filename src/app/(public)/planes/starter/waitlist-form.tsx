"use client";

import { useState } from "react";
import { requestInvitation } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Mail,
  Building2,
  Phone,
  MapPin,
  MessageSquare,
  User,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REGIONES_CHILE = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana de Santiago",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén",
  "Región de Magallanes",
];

type FormState = "idle" | "loading" | "success" | "already_pending" | "error";

export function WaitlistRequestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await requestInvitation(formData);

    if (result.success) {
      setState("success");
    } else if ("already_pending" in result && result.already_pending) {
      setState("already_pending");
    } else if (result.error) {
      setErrorMsg(result.error);
      setState("error");
    } else {
      setState("error");
      setErrorMsg("Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="py-10 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-black tracking-tight">
            ¡Solicitud recibida!
          </h3>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm mx-auto">
            Hemos registrado tu solicitud. Nuestro equipo la revisará y te
            enviaremos la invitación a tu correo en los próximos días.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl px-5 py-3 text-xs font-bold text-brand-teal max-w-xs mx-auto">
          <Mail className="w-4 h-4 shrink-0" />
          Revisa también tu carpeta de spam
        </div>
      </div>
    );
  }

  if (state === "already_pending") {
    return (
      <div className="py-10 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto">
          <Mail className="w-10 h-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-black tracking-tight">
            Ya estás en la lista
          </h3>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm mx-auto">
            Tu solicitud ya fue registrada previamente. Serás de los primeros en
            recibir tu invitación cuando haya cupo disponible.
          </p>
        </div>
      </div>
    );
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error global */}
      {state === "error" && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-red-600 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Empresa y Contacto */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="empresa_nombre"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
          >
            <Building2 className="w-3 h-3" />
            Nombre de la empresa *
          </Label>
          <Input
            id="empresa_nombre"
            name="empresa_nombre"
            placeholder="Constructora Ejemplo Ltda."
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="contacto_nombre"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
          >
            <User className="w-3 h-3" />
            Nombre de contacto
          </Label>
          <Input
            id="contacto_nombre"
            name="contacto_nombre"
            placeholder="Juan Pérez"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Email y Teléfono */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
          >
            <Mail className="w-3 h-3" />
            Correo electrónico *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="contacto@empresa.cl"
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="telefono"
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3" />
            Teléfono / WhatsApp
          </Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="+56 9 1234 5678"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Región */}
      <div className="space-y-1.5">
        <Label
          htmlFor="region"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
        >
          <MapPin className="w-3 h-3" />
          Región donde opera tu constructora
        </Label>
        <select
          id="region"
          name="region"
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-background px-3 py-2",
            "text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal/40",
            "transition-colors"
          )}
        >
          <option value="">Selecciona tu región (opcional)</option>
          {REGIONES_CHILE.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Mensaje opcional */}
      <div className="space-y-1.5">
        <Label
          htmlFor="mensaje"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
        >
          <MessageSquare className="w-3 h-3" />
          Cuéntanos sobre tu constructora{" "}
          <span className="font-medium normal-case tracking-normal text-muted-foreground/60">
            (opcional)
          </span>
        </Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          placeholder="Ej: Somos una constructora con 10 años de experiencia en casas modulares en la Región del Biobío. Publicamos alrededor de 5 modelos por año..."
          className="rounded-xl resize-none min-h-[90px] text-sm"
          maxLength={500}
        />
      </div>

      <Button
        type="submit"
        disabled={state === "loading"}
        className="w-full h-12 rounded-2xl bg-brand-indigo hover:bg-brand-indigo/90 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-brand-indigo/20 transition-all hover:scale-[1.01] active:scale-95"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          <>
            Solicitar invitación al Plan Starter
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
        Tu solicitud será revisada por nuestro equipo. Te contactaremos al
        correo ingresado cuando haya cupo disponible. Sin spam, te lo prometemos.
      </p>
    </form>
  );
}
