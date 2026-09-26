"use client";

import { useState } from "react";
import { type AppRole } from "@/lib/security/roles";
import { RoleBadge } from "./role-badge";
import { EditarPerfilDialog } from "./editar-perfil-dialog";
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
  Sparkles,
  Edit3,
  ChevronRight,
} from "lucide-react";

export interface UserWithProfile {
  id: string;
  email: string;
  nombre: string | null;
  telefono?: string | null;
  slug?: string | null;
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
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
        <EditarPerfilDialog
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onOpenDeactivate={() => {
            setDeactivateTarget(editTarget);
          }}
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

      <div className="space-y-6 pb-28 sm:pb-12">
        {/* ─── Cabecera ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
              Gestión de Usuarios
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {superAdmins} super admins · {admins} admins · {vendedores} vendedores ·{" "}
              {constructoras} constructoras
            </p>
          </div>
          <button
            onClick={() => setShowCrear(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md shadow-primary/20 w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            Crear Usuario
          </button>
        </div>

        {/* ─── KPI Cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              label: "Super Admins",
              value: superAdmins,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/30",
              icon: ShieldCheck,
            },
            {
              label: "Administradores",
              value: admins,
              color: "text-amber-500",
              bg: "bg-amber-50 dark:bg-amber-950/30",
              icon: ShieldCheck,
            },
            {
              label: "Vendedores",
              value: vendedores,
              color: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
              icon: Users,
            },
            {
              label: "Constructoras",
              value: constructoras,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/30",
              icon: Users,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-2xl border border-border/60 ${kpi.bg} p-3 sm:p-4 space-y-0.5 sm:space-y-1`}
            >
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
                {kpi.label}
              </p>
              <p className={`text-2xl sm:text-3xl font-heading font-black ${kpi.color}`}>
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
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-border/80 bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterRole(opt.value)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* ─── Vista Móvil: Tarjetas táctiles (< md) ───── */}
        <div className="md:hidden space-y-2.5">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
              No se encontraron usuarios con esos criterios.
            </div>
          ) : (
            filtered.map((u) => (
              <div
                key={u.id}
                onClick={() => setEditTarget(u)}
                className={`p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                  u.is_banned ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-black text-sm">
                        {(u.nombre ?? u.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {u.nombre || (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1 text-xs">
                            <Sparkles className="h-3 w-3 inline shrink-0" /> Sin perfil (Tocar para agregar)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTarget(u);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Editar</span>
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <RoleBadge role={u.role} size="sm" />
                    {u.plan && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                        {u.plan}
                      </span>
                    )}
                    {u.verificada && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200">
                        ✓ Verificada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(u.last_sign_in_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── Vista Desktop: Tabla completa (>= md) ───── */}
        <div className="hidden md:block rounded-2xl border border-border/60 bg-card overflow-hidden">
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
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Último acceso
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Acción
                  </th>
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
                    onClick={() => setEditTarget(u)}
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                      u.is_banned ? "opacity-50" : ""
                    }`}
                    title="Haz clic para cambiar o agregar perfil"
                  >
                    {/* Email + Nombre */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-primary font-black text-xs">
                            {(u.nombre ?? u.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {u.nombre || (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1 text-xs">
                                <Sparkles className="h-3 w-3 inline" /> Sin perfil (Clic para agregar)
                              </span>
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {u.plan ? (
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
                            {u.plan}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                        {u.verificada && (
                          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                            ✓
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Último acceso */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatRelativeTime(u.last_sign_in_at)}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4">
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

                    {/* Botón de acción directo */}
                    <td className="px-4 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setEditTarget(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          {u.has_profile ? "Editar perfil" : "Agregar perfil"}
                        </button>
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
