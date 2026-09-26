"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  type AppRole,
} from "@/lib/security/roles";
import { RoleBadge } from "./role-badge";
import {
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Building2,
  AlertTriangle,
  Loader2,
  Phone,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  UserX,
} from "lucide-react";
import type { UserWithProfile } from "./usuarios-client";

interface EditarPerfilDialogProps {
  user: UserWithProfile;
  onClose: () => void;
  onOpenDeactivate?: () => void;
}

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter (1 modelo gratis)" },
  { value: "gratis", label: "Básico / Gratis" },
  { value: "crece", label: "Plan Crece" },
  { value: "avanza", label: "Plan Avanza" },
  { value: "pro", label: "Plan Pro" },
  { value: "premium", label: "Plan Premium" },
  { value: "pro_plus", label: "Plan Pro Plus" },
];

export function EditarPerfilDialog({
  user,
  onClose,
  onOpenDeactivate,
}: EditarPerfilDialogProps) {
  const [nombre, setNombre] = useState(user.nombre ?? "");
  const [telefono, setTelefono] = useState(user.telefono ?? "");
  const [selectedRole, setSelectedRole] = useState<AppRole | "constructora">(
    user.role ?? "constructora"
  );
  const [selectedPlan, setSelectedPlan] = useState(user.plan ?? "starter");
  const [verificada, setVerificada] = useState(user.verificada ?? false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isNewProfile = !user.has_profile || !user.nombre;

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/usuarios/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.trim(),
            telefono: telefono.trim(),
            role: selectedRole === "constructora" ? null : selectedRole,
            plan: selectedPlan,
            verificada,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message ?? data.error ?? "Error al actualizar el usuario.");
          return;
        }

        router.refresh();
        onClose();
      } catch {
        setError("Error de conexión. Intenta nuevamente.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading font-black text-lg sm:text-xl text-foreground">
                {isNewProfile ? "Crear / Asignar Perfil" : "Gestionar Usuario y Perfil"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                {user.email}
              </p>
            </div>
            {isNewProfile ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
                <Sparkles className="h-3 w-3" /> Sin perfil
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0">
                <CheckCircle2 className="h-3 w-3" /> Perfil Activo
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>Rol actual:</span>
            <RoleBadge role={user.role} size="sm" />
            {user.plan && (
              <span className="text-[11px] font-bold text-muted-foreground/70 uppercase">
                · Plan {user.plan}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {isNewProfile && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-900/50 p-3.5 space-y-1">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Este usuario aún no tiene perfil de constructora asociado
              </p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-400 leading-relaxed">
                Ingresa el nombre de su empresa para vincularlo inmediatamente y permitirle gestionar catálogo y recibir leads.
              </p>
            </div>
          )}

          {/* Nombre / Empresa */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-black text-foreground" htmlFor="ed-nombre">
              Nombre de Constructora / Contacto *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="ed-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Constructora Casas del Sur"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-black text-foreground" htmlFor="ed-telefono">
              Teléfono de Contacto
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="ed-telefono"
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-black text-foreground" htmlFor="ed-plan">
              Plan de Publicación
            </label>
            <select
              id="ed-plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium cursor-pointer"
            >
              {PLAN_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Rol */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-foreground">
              Rol del Usuario en el Sistema
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  value: "constructora" as const,
                  label: "Constructora",
                  desc: "Usuario estándar sin permisos administrativos.",
                  icon: Building2,
                  color: "text-blue-500",
                },
                {
                  value: ROLES.VENDEDOR,
                  label: "Vendedor",
                  desc: "Acceso comercial: ve constructoras y todos los leads.",
                  icon: ShoppingBag,
                  color: "text-emerald-500",
                },
                {
                  value: ROLES.ADMIN,
                  label: "Administrador",
                  desc: "Acceso operativo: pagos, sellos e invitaciones.",
                  icon: ShieldCheck,
                  color: "text-amber-500",
                },
                {
                  value: ROLES.SUPERADMIN,
                  label: "Super Admin",
                  desc: "Acceso total a usuarios, configuración y finanzas.",
                  icon: ShieldAlert,
                  color: "text-red-500",
                },
              ].map(({ value, label, desc, icon: Icon, color }) => {
                const isSelected = selectedRole === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedRole(value)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border/60 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary/15" : "bg-muted"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-primary" : color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-black text-xs ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedRole === ROLES.SUPERADMIN && user.role !== ROLES.SUPERADMIN && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 p-2.5 mt-2">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-700 dark:text-red-400 font-semibold leading-relaxed">
                  Estás otorgando acceso <strong>total al sistema</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Sello de verificación */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-black text-foreground">
                Constructora Verificada
              </p>
              <p className="text-[11px] text-muted-foreground">
                Habilita el sello oficial de verificación en su ficha pública.
              </p>
            </div>
            <input
              type="checkbox"
              checked={verificada}
              onChange={(e) => setVerificada(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-border accent-emerald-600 cursor-pointer shrink-0"
            />
          </div>

          {error && (
            <p className="text-xs sm:text-sm text-red-600 font-semibold text-center py-1">
              {error}
            </p>
          )}

          {/* Acciones complementarias */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 flex-wrap text-xs">
            {user.slug ? (
              <a
                href={`/constructora/${user.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver ficha pública
              </a>
            ) : (
              <span className="text-muted-foreground/60 italic text-[11px]">
                Sin ficha pública activa
              </span>
            )}

            {onOpenDeactivate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeactivate();
                }}
                disabled={user.is_banned}
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer disabled:opacity-40"
              >
                <UserX className="h-3.5 w-3.5" />
                Desactivar usuario
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-border/60 flex justify-end gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs sm:text-sm font-bold text-foreground transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-black transition-all cursor-pointer disabled:opacity-50 hover:bg-primary/90"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNewProfile ? "Crear y Guardar Perfil" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
