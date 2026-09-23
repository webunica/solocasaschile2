"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Copy,
  Check,
  Search,
  Building2,
  Mail,
  Edit2,
  Send,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateConstructoraEmail } from "@/lib/supabase/actions";
import type { ConstructoraInvitation } from "@/lib/invitations/generate";

export interface ConstructoraDirectoryItem {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  regiones: string[] | null;
  plan: string | null;
  slug: string | null;
}

interface InvitationManagerProps {
  initialInvitations: ConstructoraInvitation[];
  constructoras?: ConstructoraDirectoryItem[];
  baseUrl: string;
}

const ITEMS_PER_PAGE = 25;

export function InvitationManager({
  initialInvitations,
  constructoras = [],
  baseUrl,
}: InvitationManagerProps) {
  // Pestaña activa: "directorio" | "invitaciones"
  const [activeTab, setActiveTab] = useState<"directorio" | "invitaciones">("directorio");

  // Estado de invitaciones
  const [invitations, setInvitations] = useState<ConstructoraInvitation[]>(initialInvitations);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Estado del directorio de constructoras
  const [constructorasList, setConstructorasList] = useState<ConstructoraDirectoryItem[]>(constructoras);
  const [directorioSearch, setDirectorioSearch] = useState("");
  const [directorioFilter, setDirectorioFilter] = useState<"all" | "sin_correo" | "con_correo" | "no_invitadas" | "invitadas">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Edición inline de correo
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editingEmailValue, setEditingEmailValue] = useState("");
  const [savingEmailId, setSavingEmailId] = useState<string | null>(null);

  // Envío directo desde la tabla
  const [invitingConstructoraId, setInvitingConstructoraId] = useState<string | null>(null);

  // Formulario manual de nueva invitación externa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contactoNombre, setContactoNombre] = useState("");
  const [region, setRegion] = useState("");
  const [sendNow, setSendNow] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);

  // Mapa rápido de invitaciones por email para cruzar con el directorio
  const invitationsByEmail = useMemo(() => {
    const map = new Map<string, ConstructoraInvitation>();
    for (const inv of invitations) {
      if (inv.email) {
        map.set(inv.email.toLowerCase().trim(), inv);
      }
    }
    return map;
  }, [invitations]);

  // Métricas de invitaciones
  const totalInvitations = invitations.length;
  const acceptedInvitations = invitations.filter((i) => i.status === "accepted").length;
  const pendingInvitations = invitations.filter((i) => i.status === "pending").length;
  const conversionRate = totalInvitations > 0 ? Math.round((acceptedInvitations / totalInvitations) * 100) : 0;

  // Filtrado del Directorio
  const filteredConstructoras = useMemo(() => {
    return constructorasList.filter((c) => {
      const emailLower = c.email?.toLowerCase().trim() || "";
      const hasEmail = Boolean(emailLower && emailLower.includes("@"));
      const isInvited = Boolean(hasEmail && invitationsByEmail.has(emailLower));

      // Filtro de estado
      if (directorioFilter === "sin_correo" && hasEmail) return false;
      if (directorioFilter === "con_correo" && !hasEmail) return false;
      if (directorioFilter === "no_invitadas" && isInvited) return false;
      if (directorioFilter === "invitadas" && !isInvited) return false;

      // Búsqueda
      if (!directorioSearch.trim()) return true;
      const searchLower = directorioSearch.toLowerCase();
      const matchName = c.nombre.toLowerCase().includes(searchLower);
      const matchEmail = emailLower.includes(searchLower);
      const matchRegion = c.regiones?.some((r) => r.toLowerCase().includes(searchLower)) || false;
      return matchName || matchEmail || matchRegion;
    });
  }, [constructorasList, directorioFilter, directorioSearch, invitationsByEmail]);

  // Paginación del directorio
  const totalPages = Math.ceil(filteredConstructoras.length / ITEMS_PER_PAGE) || 1;
  const paginatedConstructoras = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredConstructoras.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredConstructoras, currentPage]);

  // Contadores para filtros
  const countSinCorreo = useMemo(() => constructorasList.filter((c) => !c.email).length, [constructorasList]);
  const countConCorreo = useMemo(() => constructorasList.filter((c) => Boolean(c.email)).length, [constructorasList]);

  // Copiar link de invitación
  const handleCopyLink = (token: string, id: string) => {
    const url = `${baseUrl}/invitacion?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Enlace de invitación copiado al portapapeles.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Iniciar edición de correo
  const startEditEmail = (constructora: ConstructoraDirectoryItem) => {
    setEditingEmailId(constructora.id);
    setEditingEmailValue(constructora.email || "");
  };

  // Guardar correo editado inline en base de datos
  const handleSaveEmail = async (constructoraId: string) => {
    const trimmed = editingEmailValue.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Ingresa un correo electrónico válido.");
      return;
    }

    setSavingEmailId(constructoraId);
    try {
      await updateConstructoraEmail(constructoraId, trimmed);
      setConstructorasList((prev) =>
        prev.map((c) => (c.id === constructoraId ? { ...c, email: trimmed } : c))
      );
      toast.success("Correo guardado exitosamente.");
      setEditingEmailId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error guardando correo.";
      toast.error(msg);
    } finally {
      setSavingEmailId(null);
    }
  };

  // Invitar constructora directamente desde el directorio
  const handleInviteFromDirectory = async (constructora: ConstructoraDirectoryItem) => {
    if (!constructora.email) {
      toast.error("Esta constructora no tiene correo. Agrégalo antes de enviar la invitación.");
      return;
    }

    setInvitingConstructoraId(constructora.id);
    try {
      const regionStr = constructora.regiones?.[0] || undefined;
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: constructora.email,
          empresa_nombre: constructora.nombre,
          region: regionStr,
          send_now: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al generar invitación");
      }

      setInvitations((prev) => [data.invitation, ...prev]);
      toast.success(`Invitación enviada por correo a ${constructora.email}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al invitar";
      toast.error(msg);
    } finally {
      setInvitingConstructoraId(null);
    }
  };

  // Crear invitación manual externa
  const handleCreateManualInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !empresaNombre) {
      toast.error("Nombre de empresa y correo electrónico son requeridos.");
      return;
    }

    setLoadingNew(true);
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

      setEmpresaNombre("");
      setEmail("");
      setContactoNombre("");
      setRegion("");
      setIsFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast.error(msg);
    } finally {
      setLoadingNew(false);
    }
  };

  // Reenviar email desde la pestaña de invitaciones
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
      setInvitations((prev) =>
        prev.map((i) => (i.id === invitation.id ? { ...i, cold_step: step } : i))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al reenviar email";
      toast.error(msg);
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pestañas Principal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40 text-xs">
          <button
            onClick={() => setActiveTab("directorio")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black uppercase tracking-wider transition-all ${
              activeTab === "directorio"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Directorio de Constructoras ({constructorasList.length})
          </button>

          <button
            onClick={() => setActiveTab("invitaciones")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black uppercase tracking-wider transition-all ${
              activeTab === "invitaciones"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-4 h-4" />
            Invitaciones Enviadas ({invitations.length})
          </button>
        </div>

        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="h-11 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider gap-2 px-5"
        >
          <UserPlus className="w-4 h-4" />
          Nueva Empresa Externa
        </Button>
      </div>

      {/* Formulario desplegable para nueva empresa externa */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateManualInvitation}
          className="bg-card border-2 border-primary/20 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl animate-in fade-in-50 duration-200"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-lg font-black font-heading">Invitar Nueva Constructora Externa</h3>
              <p className="text-xs text-muted-foreground">
                Para empresas que aún no están en el directorio. Recibirán un enlace personal para registrarse con 1 modelo gratis.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-bold"
            >
              <X className="w-4 h-4" />
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
              disabled={loadingNew}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider px-6"
            >
              {loadingNew ? "Creando..." : "Generar y Enviar Invitación"}
            </Button>
          </div>
        </form>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* VISTA 1: DIRECTORIO DE CONSTRUCTORAS CON EDICIÓN DE CORREO E INVITACIÓN */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "directorio" && (
        <div className="space-y-5 animate-in fade-in-50 duration-300">
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, correo o región..."
                value={directorioSearch}
                onChange={(e) => {
                  setDirectorioSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-10 rounded-xl bg-background border-border/50 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => {
                  setDirectorioFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  directorioFilter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas ({constructorasList.length})
              </button>
              <button
                onClick={() => {
                  setDirectorioFilter("sin_correo");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  directorioFilter === "sin_correo" ? "bg-amber-500 text-white shadow-sm" : "bg-muted/40 text-amber-600 dark:text-amber-400 hover:bg-muted"
                }`}
              >
                Sin Correo ({countSinCorreo})
              </button>
              <button
                onClick={() => {
                  setDirectorioFilter("con_correo");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  directorioFilter === "con_correo" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Con Correo ({countConCorreo})
              </button>
              <button
                onClick={() => {
                  setDirectorioFilter("no_invitadas");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  directorioFilter === "no_invitadas" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                No Invitadas
              </button>
              <button
                onClick={() => {
                  setDirectorioFilter("invitadas");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  directorioFilter === "invitadas" ? "bg-emerald-500 text-white shadow-sm" : "bg-muted/40 text-emerald-600 dark:text-emerald-400 hover:bg-muted"
                }`}
              >
                Ya Invitadas
              </button>
            </div>
          </div>

          {/* Tabla del Directorio */}
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-5">Constructora</th>
                    <th className="py-3.5 px-5">Región / Plan</th>
                    <th className="py-3.5 px-5">Correo Electrónico (Editable)</th>
                    <th className="py-3.5 px-5">Estado Invitación</th>
                    <th className="py-3.5 px-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedConstructoras.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                        No se encontraron constructoras con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    paginatedConstructoras.map((c) => {
                      const emailLower = c.email?.toLowerCase().trim() || "";
                      const existingInv = emailLower ? invitationsByEmail.get(emailLower) : undefined;
                      const isEditing = editingEmailId === c.id;

                      return (
                        <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-foreground">
                            <div className="space-y-0.5">
                              <p className="text-sm font-black">{c.nombre}</p>
                              {c.telefono && (
                                <p className="text-[11px] text-muted-foreground font-medium">{c.telefono}</p>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-5">
                            <div className="space-y-1">
                              <p className="text-[11px] text-foreground font-semibold">
                                {c.regiones?.[0] || "Sin región"}
                              </p>
                              <Badge variant="outline" className="text-[9px] uppercase font-bold px-1.5 py-0">
                                {c.plan || "gratis"}
                              </Badge>
                            </div>
                          </td>

                          {/* Celda de correo electrónico editable */}
                          <td className="py-3.5 px-5">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5 max-w-xs">
                                <Input
                                  type="email"
                                  placeholder="correo@constructora.cl"
                                  value={editingEmailValue}
                                  onChange={(e) => setEditingEmailValue(e.target.value)}
                                  className="h-8 text-xs rounded-lg bg-background"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveEmail(c.id);
                                    if (e.key === "Escape") setEditingEmailId(null);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEmail(c.id)}
                                  disabled={savingEmailId === c.id}
                                  className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                                  title="Guardar correo"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingEmailId(null)}
                                  className="h-8 px-2 rounded-lg text-xs"
                                  title="Cancelar"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            ) : c.email ? (
                              <div className="flex items-center gap-2 group">
                                <span className="font-medium text-foreground">{c.email}</span>
                                <button
                                  onClick={() => startEditEmail(c)}
                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"
                                  title="Modificar correo"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditEmail(c)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400 font-bold text-[11px] hover:bg-amber-500/10 transition-colors"
                              >
                                <Plus className="w-3 h-3" /> Agregar Correo
                              </button>
                            )}
                          </td>

                          {/* Estado de invitación */}
                          <td className="py-3.5 px-5">
                            {existingInv ? (
                              <div className="space-y-1">
                                {existingInv.status === "accepted" ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[9px] uppercase">
                                    ✓ Registrada
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold text-[9px] uppercase">
                                    {existingInv.cold_step.toUpperCase().replace("_", " ")}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-[11px] font-medium">
                                No invitada
                              </span>
                            )}
                          </td>

                          {/* Acción directa de invitación */}
                          <td className="py-3.5 px-5 text-right">
                            {existingInv ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyLink(existingInv.token, existingInv.id)}
                                className="h-8 px-2.5 rounded-lg text-xs"
                                title="Copiar enlace de invitación"
                              >
                                {copiedId === existingInv.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={!c.email || invitingConstructoraId === c.id}
                                onClick={() => handleInviteFromDirectory(c)}
                                className="h-8 rounded-lg bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-wider px-3 gap-1.5"
                                title={c.email ? "Enviar correo de invitación Plan Starter" : "Agrega un correo primero"}
                              >
                                <Send className="w-3 h-3" />
                                {invitingConstructoraId === c.id ? "Enviando..." : "Invitar"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginador */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">
                  Página <strong className="text-foreground">{currentPage}</strong> de {totalPages} ({filteredConstructoras.length} empresas)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 rounded-lg"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-8 px-3 rounded-lg"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* VISTA 2: INVITACIONES ENVIADAS, SEGUIMIENTO CRON Y MÉTRICAS          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeTab === "invitaciones" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Tarjetas de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Enviadas</span>
              <p className="text-3xl font-black font-heading">{totalInvitations}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Aceptadas (Registros)</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black font-heading text-emerald-600 dark:text-emerald-400">{acceptedInvitations}</p>
                <span className="text-xs font-bold text-muted-foreground">({conversionRate}% conversión)</span>
              </div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Pendientes</span>
              <p className="text-3xl font-black font-heading text-amber-600 dark:text-amber-400">{pendingInvitations}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Automatización Cron</span>
              <p className="text-xs font-bold text-muted-foreground pt-2">Cold #2 (día 3) · Cold #3 (día 7)</p>
            </div>
          </div>

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
                  {invitations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium">
                        Aún no se han enviado invitaciones. Ve al Directorio de Constructoras o crea una nueva arriba.
                      </td>
                    </tr>
                  ) : (
                    invitations.map((invitation) => (
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
      )}
    </div>
  );
}
