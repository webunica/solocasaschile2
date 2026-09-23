"use client";

import { useState } from "react";
import { Plus, Copy, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ConstructoraInvitation } from "@/lib/invitations/generate";

interface InvitationManagerProps {
  initialInvitations: ConstructoraInvitation[];
  baseUrl: string;
}

export function InvitationManager({
  initialInvitations,
  baseUrl,
}: InvitationManagerProps) {
  const [invitations, setInvitations] = useState<ConstructoraInvitation[]>(initialInvitations);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contactoNombre, setContactoNombre] = useState("");
  const [region, setRegion] = useState("");
  const [sendNow, setSendNow] = useState(true);

  // Metrics
  const total = invitations.length;
  const accepted = invitations.filter((i) => i.status === "accepted").length;
  const pending = invitations.filter((i) => i.status === "pending").length;
  const expired = invitations.filter((i) => i.status === "expired").length;
  const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const filtered = invitations.filter((item) => {
    const matchesFilter =
      filter === "all" ? true : item.status === filter;
    const matchesSearch =
      item.empresa_nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.contacto_nombre && item.contacto_nombre.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCopyLink = (token: string, id: string) => {
    const url = `${baseUrl}/invitacion?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Enlace de invitación copiado al portapapeles.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !empresaNombre) {
      toast.error("Nombre de empresa y correo electrónico son requeridos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          empresa_nombre: empresaNombre,
          contacto_nombre: contactoNombre || undefined,
          region: region || undefined,
          send_now: sendNow,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al generar invitación");
      }

      setInvitations([data.invitation, ...invitations]);
      toast.success(
        sendNow
          ? `Invitación enviada por correo a ${email}`
          : "Invitación creada exitosamente"
      );

      // Reset form
      setEmpresaNombre("");
      setEmail("");
      setContactoNombre("");
      setRegion("");
      setIsFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (
    invitation: ConstructoraInvitation,
    step: "cold_1" | "cold_2" | "cold_3"
  ) => {
    setResendingId(invitation.id);
    try {
      const res = await fetch(`/api/admin/invitations/${invitation.id}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al reenviar");
      }

      toast.success(`Paso ${step.replace("_", " ")} enviado con éxito a ${invitation.email}`);

      // Actualizar listado localmente
      setInvitations((prev) =>
        prev.map((i) =>
          i.id === invitation.id ? { ...i, cold_step: step } : i
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al reenviar email";
      toast.error(msg);
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Enviadas</span>
          <p className="text-3xl font-black font-heading">{total}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Aceptadas (Registros)</span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black font-heading text-emerald-600 dark:text-emerald-400">{accepted}</p>
            <span className="text-xs font-bold text-muted-foreground">({conversionRate}% conversión)</span>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Pendientes</span>
          <p className="text-3xl font-black font-heading text-amber-600 dark:text-amber-400">{pending}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Expiradas</span>
          <p className="text-3xl font-black font-heading text-muted-foreground">{expired}</p>
        </div>
      </div>

      {/* Barra de Acciones */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-card border-border/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filter === "pending" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${filter === "accepted" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Aceptadas
            </button>
          </div>

          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="h-11 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider gap-2 px-5"
          >
            <Plus className="w-4 h-4" />
            Nueva Invitación
          </Button>
        </div>
      </div>

      {/* Formulario desplegable para nueva invitación */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateInvitation}
          className="bg-card border-2 border-primary/20 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-lg font-black font-heading">Enviar Invitación para Plan Starter</h3>
              <p className="text-xs text-muted-foreground">
                La empresa recibirá un correo publicitario con su link exclusivo para activar 1 modelo gratis.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-bold"
            >
              Cerrar
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Empresa Constructora *
              </Label>
              <Input
                placeholder="Ej: Casas Prefabricadas Andes"
                value={empresaNombre}
                onChange={(e) => setEmpresaNombre(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Correo Electrónico *
              </Label>
              <Input
                type="email"
                placeholder="contacto@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Nombre de Contacto (Opcional)
              </Label>
              <Input
                placeholder="Ej: Rodrigo Valenzuela"
                value={contactoNombre}
                onChange={(e) => setContactoNombre(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Región (Opcional)
              </Label>
              <Input
                placeholder="Ej: Región de Valparaíso"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="sendNow"
              checked={sendNow}
              onChange={(e) => setSendNow(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <Label htmlFor="sendNow" className="text-xs font-semibold cursor-pointer">
              Enviar correo electrónico de presentación (Cold #1) inmediatamente con Resend
            </Label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="h-11 rounded-xl font-bold text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider px-6"
            >
              {loading ? "Creando..." : "Generar y Enviar Invitación"}
            </Button>
          </div>
        </form>
      )}

      {/* Tabla de Invitaciones */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-4 px-5">Empresa</th>
                <th className="py-4 px-5">Contacto / Región</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5">Paso Campaña</th>
                <th className="py-4 px-5">Fecha Envío</th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                    No se encontraron invitaciones con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filtered.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-black text-sm text-foreground">{invitation.empresa_nombre}</p>
                        <p className="text-muted-foreground font-medium">{invitation.email}</p>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <p className="font-semibold text-foreground">{invitation.contacto_nombre || "—"}</p>
                      <p className="text-[11px] text-muted-foreground">{invitation.region || "Sin región"}</p>
                    </td>

                    <td className="py-4 px-5">
                      {invitation.status === "accepted" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold uppercase text-[9px]">
                          ✓ Aceptada
                        </Badge>
                      )}
                      {invitation.status === "pending" && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold uppercase text-[9px]">
                          Pendiente
                        </Badge>
                      )}
                      {invitation.status === "expired" && (
                        <Badge variant="outline" className="text-muted-foreground font-bold uppercase text-[9px]">
                          Expirada
                        </Badge>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-mono text-[11px] font-bold text-foreground">
                        {invitation.cold_step === "none"
                          ? "Sin envío"
                          : invitation.cold_step.toUpperCase().replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-muted-foreground text-[11px]">
                      {invitation.sent_at
                        ? new Date(invitation.sent_at).toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón copiar link */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(invitation.token, invitation.id)}
                          className="h-8 px-2.5 rounded-lg text-xs"
                          title="Copiar enlace directo"
                        >
                          {copiedId === invitation.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </Button>

                        {/* Botones de reenvío si está pendiente */}
                        {invitation.status === "pending" && (
                          <div className="flex items-center gap-1">
                            {invitation.cold_step === "cold_1" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={resendingId === invitation.id}
                                onClick={() => handleResend(invitation, "cold_2")}
                                className="h-8 text-[10px] font-black uppercase rounded-lg px-2 text-primary"
                                title="Enviar Cold #2 (Seguimiento)"
                              >
                                Enviar Cold #2
                              </Button>
                            )}

                            {invitation.cold_step === "cold_2" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={resendingId === invitation.id}
                                onClick={() => handleResend(invitation, "cold_3")}
                                className="h-8 text-[10px] font-black uppercase rounded-lg px-2 text-amber-500"
                                title="Enviar Cold #3 (Último aviso)"
                              >
                                Enviar Cold #3
                              </Button>
                            )}

                            {(invitation.cold_step === "none" || invitation.cold_step === "cold_3") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={resendingId === invitation.id}
                                onClick={() => handleResend(invitation, "cold_1")}
                                className="h-8 text-[10px] font-bold rounded-lg px-2 text-muted-foreground"
                                title="Reenviar Cold #1"
                              >
                                Reenviar #1
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
