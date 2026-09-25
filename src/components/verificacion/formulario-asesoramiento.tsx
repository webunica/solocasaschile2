"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  FileSearch,
} from "lucide-react";
import { REGIONES_CHILE } from "@/lib/constructoras-data";

export function FormularioAsesoramiento() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    region: "",
    constructoraInteres: "",
    tipoAsesoria: "Revisión de presupuesto y precio UF/m²",
    mensaje: "",
    // Honeypot fields
    website: "",
    b_website: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Silent drop for bot submissions
    if (formData.website || formData.b_website) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      const payloadMensaje = `[SOLICITUD DE ASESORÍA - CONSTRUCTORA NO VERIFICADA O EN REVISIÓN]
- Tipo de asesoría: ${formData.tipoAsesoria}
- Región: ${formData.region || "No especificada"}
- Constructora evaluada: ${formData.constructoraInteres || "No indicada"}
- Consulta: ${formData.mensaje || "Solicita asesoramiento de especialista para evaluar constructora y presupuesto."}`;

      const res = await fetch("/api/leads/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_cliente: formData.nombre.trim(),
          email_cliente: formData.email.trim(),
          telefono_cliente: formData.telefono.trim(),
          mensaje: payloadMensaje,
          website: formData.website,
          b_website: formData.b_website,
          _form_time: Date.now(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud. Por favor intenta nuevamente.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al enviar tu solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/70 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-brand-teal/5">
      {/* Decorative gradient corner */}
      <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-teal/10 blur-3xl pointer-events-none" />

      {success ? (
        <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-heading font-black tracking-tight text-foreground">
              ¡Solicitud de asesoría recibida con éxito!
            </h3>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              Uno de nuestros especialistas técnicos en construcción modular y contratos se pondrá en contacto contigo vía WhatsApp o correo en menos de 24 horas hábiles.
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 max-w-md mx-auto text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            Te orientaremos sin costo para evaluar si la constructora que estás analizando cuenta con garantías, planos aprobados y solidez técnica.
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setFormData({
                nombre: "",
                email: "",
                telefono: "",
                region: "",
                constructoraInteres: "",
                tipoAsesoria: "Revisión de presupuesto y precio UF/m²",
                mensaje: "",
                website: "",
                b_website: "",
              });
            }}
            className="rounded-xl font-bold uppercase tracking-wider text-xs h-11"
          >
            Enviar otra consulta
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot anti-spam fields */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="text"
              name="b_website"
              value={formData.b_website}
              onChange={(e) => setFormData({ ...formData, b_website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="border-b border-border/40 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-brand-teal text-xs font-black uppercase tracking-widest">
              <PhoneCall className="w-4 h-4" />
              <span>Atención Técnica Gratuita</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground">
              Solicita asesoramiento con un especialista
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Si la constructora que te interesa no cuenta con verificación o tienes dudas con un presupuesto o contrato, déjanos tus datos para orientarte antes de pagar.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-bold text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="asesoria-nombre" className="text-xs font-bold text-foreground">
                Nombre y Apellido *
              </Label>
              <Input
                id="asesoria-nombre"
                required
                placeholder="Ej. Rodrigo Tapia"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="h-12 rounded-xl bg-background/60 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asesoria-email" className="text-xs font-bold text-foreground">
                Correo Electrónico *
              </Label>
              <Input
                id="asesoria-email"
                type="email"
                required
                placeholder="rodrigo@ejemplo.cl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl bg-background/60 border-border/60 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="asesoria-telefono" className="text-xs font-bold text-foreground">
                Teléfono / WhatsApp *
              </Label>
              <Input
                id="asesoria-telefono"
                type="tel"
                required
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="h-12 rounded-xl bg-background/60 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asesoria-region" className="text-xs font-bold text-foreground">
                Región de tu proyecto
              </Label>
              <Select
                value={formData.region}
                onValueChange={(val) => setFormData({ ...formData, region: val ?? "" })}
              >
                <SelectTrigger id="asesoria-region" className="h-12 rounded-xl bg-background/60 border-border/60 text-sm">
                  <SelectValue placeholder="Selecciona tu región" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Object.values(REGIONES_CHILE).map((r) => (
                    <SelectItem key={r.slug} value={r.capital}>
                      {r.emoji} {r.capital}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="asesoria-constructora" className="text-xs font-bold text-foreground">
                Constructora que estás evaluando (opcional)
              </Label>
              <Input
                id="asesoria-constructora"
                placeholder="Nombre de la empresa o fábrica"
                value={formData.constructoraInteres}
                onChange={(e) => setFormData({ ...formData, constructoraInteres: e.target.value })}
                className="h-12 rounded-xl bg-background/60 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asesoria-tipo" className="text-xs font-bold text-foreground">
                ¿Qué necesitas revisar?
              </Label>
              <Select
                value={formData.tipoAsesoria}
                onValueChange={(val) => setFormData({ ...formData, tipoAsesoria: val ?? "" })}
              >
                <SelectTrigger id="asesoria-tipo" className="h-12 rounded-xl bg-background/60 border-border/60 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Revisión de presupuesto y precio UF/m²">
                    Revisión de presupuesto y precio UF/m²
                  </SelectItem>
                  <SelectItem value="Validación de antecedentes de constructora">
                    Validación de antecedentes de constructora
                  </SelectItem>
                  <SelectItem value="Revisión de contrato y cláusulas de garantía">
                    Revisión de contrato y cláusulas de garantía
                  </SelectItem>
                  <SelectItem value="Asesoría integral antes de transferir pie">
                    Asesoría integral antes de transferir pie
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asesoria-mensaje" className="text-xs font-bold text-foreground">
              Detalles de tu consulta o dudas sobre el proyecto
            </Label>
            <Textarea
              id="asesoria-mensaje"
              rows={3}
              placeholder="Cuéntanos: ¿te enviaron una cotización? ¿qué modelo o metros cuadrados buscas? ¿tienes dudas sobre la entrega o la calidad de los materiales?"
              value={formData.mensaje}
              onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
              className="rounded-xl bg-background/60 border-border/60 text-sm leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-2xl bg-brand-teal hover:bg-brand-teal/90 text-white font-black tracking-widest text-xs uppercase shadow-xl shadow-brand-teal/20 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Solicitar Asesoramiento Especializado Gratis
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal shrink-0" />
            <span>Tus datos son 100% confidenciales. No compartiremos tu información con constructoras no autorizadas.</span>
          </div>
        </form>
      )}
    </div>
  );
}
