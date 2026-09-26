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
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface EditarRolDialogProps {
  userId: string;
  userEmail: string;
  userNombre: string | null;
  currentRole: AppRole | null;
  onClose: () => void;
}

const ROLE_OPTIONS: { role: AppRole; icon: React.ElementType; color: string }[] = [
  { role: ROLES.SUPERADMIN, icon: ShieldAlert, color: "text-red-500" },
  { role: ROLES.ADMIN, icon: ShieldCheck, color: "text-amber-500" },
  { role: ROLES.VENDEDOR, icon: ShoppingBag, color: "text-emerald-500" },
];

export function EditarRolDialog({
  userId,
  userEmail,
  userNombre,
  currentRole,
  onClose,
}: EditarRolDialogProps) {
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(currentRole);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const hasChanged = selectedRole !== currentRole;

  function handleSave() {
    if (!hasChanged || !selectedRole) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/usuarios/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message ?? data.error ?? "Error al actualizar el rol.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border/60">
          <h2 className="font-heading font-black text-xl text-foreground">
            Cambiar Rol de Usuario
          </h2>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {userNombre ?? userEmail}
            {userNombre && (
              <span className="ml-1 text-muted-foreground/60">· {userEmail}</span>
            )}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rol actual:</span>
            <RoleBadge role={currentRole} size="sm" />
          </div>
        </div>

        {/* Selector de roles */}
        <div className="p-6 space-y-3">
          {ROLE_OPTIONS.map(({ role, icon: Icon, color }) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border/60 hover:border-border hover:bg-muted/30"
                }`}
              >
                <div
                  className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-primary/15" : "bg-muted"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isSelected ? "text-primary" : color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {ROLE_LABELS[role]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {ROLE_DESCRIPTIONS[role]}
                  </p>
                </div>
                <div
                  className={`mt-1 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}

          {/* Advertencia si se sube a superadmin */}
          {selectedRole === ROLES.SUPERADMIN && currentRole !== ROLES.SUPERADMIN && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 p-3.5 mt-1">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400 font-semibold leading-relaxed">
                Estás otorgando acceso <strong>total al sistema</strong>. El usuario podrá
                gestionar usuarios, planes, configuración y datos de todas las constructoras.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 font-semibold text-center py-1">{error}</p>
          )}
        </div>

        {/* Footer / Acciones */}
        <div className="p-6 border-t border-border/60 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-sm font-bold text-foreground transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanged || isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar Cambio
          </button>
        </div>
      </div>
    </div>
  );
}
