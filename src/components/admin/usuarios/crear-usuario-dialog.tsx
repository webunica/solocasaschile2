"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type AppRole } from "@/lib/security/roles";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

interface CrearUsuarioDialogProps {
  onClose: () => void;
}

export function CrearUsuarioDialog({ onClose }: CrearUsuarioDialogProps) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState<"admin" | "vendedor">("vendedor");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleCreate() {
    if (!email.trim() || !nombre.trim()) {
      setError("Email y nombre son requeridos.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El email no tiene un formato válido.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), nombre: nombre.trim(), role }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error === "email_already_exists") {
            setError("Ya existe un usuario con ese email.");
          } else {
            setError(data.message ?? "Error al crear el usuario.");
          }
          return;
        }

        setSuccess({ email: data.user.email, tempPassword: data.tempPassword });
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta nuevamente.");
      }
    });
  }

  // Vista de éxito — mostrar contraseña temporal
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
          <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-heading font-black text-lg sm:text-xl text-foreground">
                  ¡Usuario creado!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{success.email}</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3.5 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-400">
                Contraseña temporal generada
              </p>
              <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-500">
                Comparte esta contraseña de forma segura. El usuario deberá cambiarla al iniciar sesión.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-background border border-amber-300 text-xs sm:text-sm font-mono font-bold text-foreground tracking-wider overflow-x-auto">
                  {showPassword ? success.tempPassword : "••••••••••••"}
                </code>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-black text-sm cursor-pointer hover:bg-primary/90 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg sm:text-xl text-foreground">
              Crear Usuario Interno
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Administrador o vendedor del equipo SoloCasasChile
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-black text-foreground" htmlFor="uc-email">
              Email corporativo *
            </label>
            <input
              id="uc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendedor@solocasaschile.com"
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-black text-foreground" htmlFor="uc-nombre">
              Nombre completo *
            </label>
            <input
              id="uc-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Carlos González"
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-foreground">Rol *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {(["vendedor", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    role === r
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-border"
                  }`}
                >
                  <p className={`text-xs sm:text-sm font-black ${role === r ? "text-primary" : "text-foreground"}`}>
                    {r === "vendedor" ? "Vendedor" : "Administrador"}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {r === "vendedor"
                      ? "Ve constructoras y leads. Sin acceso a pagos ni configuración."
                      : "Acceso operativo completo. No puede gestionar usuarios."}
                  </p>
                </button>
              ))}
            </div>
          </div>

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
            onClick={handleCreate}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-black transition-all cursor-pointer disabled:opacity-60 hover:bg-primary/90"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear Usuario
          </button>
        </div>
      </div>
    </div>
  );
}
