"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ROLE_LABELS, type AppRole } from "@/lib/security/roles";
import { AlertTriangle, Loader2, UserX } from "lucide-react";

interface DesactivarUsuarioDialogProps {
  userId: string;
  userEmail: string;
  userNombre: string | null;
  currentRole: AppRole | null;
  onClose: () => void;
}

export function DesactivarUsuarioDialog({
  userId,
  userEmail,
  userNombre,
  currentRole,
  onClose,
}: DesactivarUsuarioDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleDesactivar() {
    if (!confirmed) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/usuarios/${userId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.error === "cannot_deactivate_self") {
            setError("No puedes desactivar tu propia cuenta.");
          } else {
            setError(data.message ?? "Error al desactivar el usuario.");
          }
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
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <UserX className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="font-heading font-black text-xl text-foreground">
              Desactivar Usuario
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Estás a punto de desactivar a{" "}
            <strong className="text-foreground">{userNombre ?? userEmail}</strong>
            {currentRole && (
              <span className="ml-1">
                ({ROLE_LABELS[currentRole]})
              </span>
            )}
            .
          </p>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-sm text-amber-800 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              ¿Qué ocurre al desactivar?
            </div>
            <ul className="text-xs text-amber-700 dark:text-amber-500 space-y-1 pl-6 list-disc leading-relaxed">
              <li>El usuario no podrá iniciar sesión.</li>
              <li>Sus datos y perfil <strong>no se eliminarán</strong>.</li>
              <li>Se puede reactivar manualmente desde Supabase.</li>
            </ul>
          </div>

          {/* Checkbox de confirmación */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-red-500 cursor-pointer"
            />
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Confirmo que quiero desactivar a <em>{userNombre ?? userEmail}</em> y comprendo
              que perderá el acceso al sistema.
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-600 font-semibold text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/60 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-sm font-bold text-foreground transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleDesactivar}
            disabled={!confirmed || isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Desactivar Usuario
          </button>
        </div>
      </div>
    </div>
  );
}
