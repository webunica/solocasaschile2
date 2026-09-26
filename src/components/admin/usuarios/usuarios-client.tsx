"use client";

import { useState } from "react";
import { type AppRole } from "@/lib/security/roles";
import { RoleBadge } from "./role-badge";
import { EditarRolDialog } from "./editar-rol-dialog";
import { DesactivarUsuarioDialog } from "./desactivar-usuario-dialog";
import { CrearUsuarioDialog } from "./crear-usuario-dialog";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";

export interface UserWithProfile {
  id: string;
  email: string;
  nombre: string | null;
  role: AppRole | null;
  plan: string | null;
  plan_status: string | null;
  verificada: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  is_banned: boolean;
  has_profile: boolean;
}

interface UsuariosClientProps {
  initialUsers: UserWithProfile[];
}

type FilterRole = AppRole | "constructora" | "todos";

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Nunca";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

export function UsuariosClient({ initialUsers }: UsuariosClientProps) {
  const [users] = useState<UserWithProfile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<FilterRole>("todos");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Dialogs
  const [editTarget, setEditTarget] = useState<UserWithProfile | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<UserWithProfile | null>(null);
  const [showCrear, setShowCrear] = useState(false);

  // Stats rápidas
  const superAdmins = users.filter((u) => u.role === "superadmin").length;
  const admins = users.filter((u) => u.role === "admin").length;
  const vendedores = users.filter((u) => u.role === "vendedor").length;
  const constructoras = users.filter((u) => !u.role).length;

  // Filtrado
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nombre ?? "").toLowerCase().includes(search.toLowerCase());

    const matchRole =
      filterRole === "todos"
        ? true
        : filterRole === "constructora"
        ? !u.role
        : u.role === filterRole;

    return matchSearch && matchRole;
  });

  const FILTER_OPTIONS: { value: FilterRole; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "vendedor", label: "Vendedor" },
    { value: "constructora", label: "Constructora" },
  ];

  return (
    <>
      {/* ─── Dialogs ────────────────────────────────────── */}
      {showCrear && <CrearUsuarioDialog onClose={() => setShowCrear(false)} />}
      {editTarget && (
        <EditarRolDialog
          userId={editTarget.id}
          userEmail={editTarget.email}
          userNombre={editTarget.nombre}
          currentRole={editTarget.role}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deactivateTarget && (
        <DesactivarUsuarioDialog
          userId={deactivateTarget.id}
          userEmail={deactivateTarget.email}
          userNombre={deactivateTarget.nombre}
          currentRole={deactivateTarget.role}
          onClose={() => setDeactivateTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* ─── Cabecera ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
              Gestión de Usuarios
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {superAdmins} super admins · {admins} admins · {vendedores} vendedores ·{" "}
              {constructoras} constructoras
            </p>
          </div>
          <button
            onClick={() => setShowCrear(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-sm font-black transition-all cursor-pointer shadow-md shadow-primary/20"
          >
            <UserPlus className="h-4 w-4" />
            Crear Usuario
          </button>
        </div>

        {/* ─── KPI Cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Super Admins", value: superAdmins, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30", icon: ShieldCheck },
            { label: "Administradores", value: admins, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", icon: ShieldCheck },
            { label: "Vendedores", value: vendedores, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: Users },
            { label: "Constructoras", value: constructoras, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", icon: Users },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-2xl border border-border/60 ${kpi.bg} p-4 space-y-1`}
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className={`text-3xl font-heading font-black ${kpi.color}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Filtros y Buscador ──────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por email o nombre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterRole(opt.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterRole === opt.value
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Tabla de Usuarios ──────────────────────── */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Usuario
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Rol
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Último acceso
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Estado
                  </th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                      No se encontraron usuarios con esos criterios.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-muted/20 transition-colors ${
                      u.is_banned ? "opacity-50" : ""
                    }`}
                  >
                    {/* Email + Nombre */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-primary font-black text-xs">
                            {(u.nombre ?? u.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {u.nombre ?? (
                              <span className="text-muted-foreground italic">Sin nombre</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-4">
                      <RoleBadge role={u.role} size="sm" />
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      {u.plan ? (
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {u.plan}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>

                    {/* Último acceso */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatRelativeTime(u.last_sign_in_at)}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {u.is_banned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Desactivado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Activo
                        </span>
                      )}
                    </td>

                    {/* Menú de acciones */}
                    <td className="px-4 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === u.id ? null : u.id)
                          }
                          className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          aria-label="Acciones"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openMenu === u.id && (
                          <>
                            {/* Overlay para cerrar */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenu(null)}
                            />
                            <div className="absolute right-0 top-9 z-20 w-52 rounded-xl border border-border/80 bg-background shadow-xl overflow-hidden py-1">
                              {u.has_profile && (
                                <a
                                  href={`/dashboard/admin/constructoras/${u.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                  Ver perfil de constructora
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setOpenMenu(null);
                                  setEditTarget(u);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left"
                              >
                                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                Cambiar rol
                              </button>
                              <div className="h-px bg-border/60 my-1" />
                              <button
                                onClick={() => {
                                  setOpenMenu(null);
                                  setDeactivateTarget(u);
                                }}
                                disabled={u.is_banned}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <UserX className="h-4 w-4" />
                                Desactivar usuario
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer con contador */}
          <div className="px-5 py-3 border-t border-border/40 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Mostrando {filtered.length} de {users.length} usuarios
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
