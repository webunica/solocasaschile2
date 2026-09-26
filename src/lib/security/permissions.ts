// Funciones de permisos centralizadas.
// Usar estas helpers en vez de comparar roles manualmente en cada página.

import type { AppRole } from "./roles";
import { ROLES } from "./roles";

export interface ResolvedRole {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isVendedor: boolean;
  role: AppRole | null;
}

// ─── Permisos por capacidad ───────────────────────────────────────────────────

/** Solo superadmin puede gestionar usuarios internos */
export function canManageUsers(r: ResolvedRole) {
  return r.isSuperAdmin;
}

/** Admin y superadmin pueden crear/gestionar invitaciones */
export function canCreateInvitations(r: ResolvedRole) {
  return r.isAdmin || r.isSuperAdmin;
}

/** Admin, superadmin y vendedor pueden ver leads (vendedor: todos; constructora: solo los suyos) */
export function canViewAllLeads(r: ResolvedRole) {
  return r.isAdmin || r.isSuperAdmin || r.isVendedor;
}

/** Solo admin y superadmin pueden ver pagos globales */
export function canViewPayments(r: ResolvedRole) {
  return r.isAdmin || r.isSuperAdmin;
}

/** Admin y superadmin pueden editar configuración del sitio */
export function canEditSiteSettings(r: ResolvedRole) {
  return r.isAdmin || r.isSuperAdmin;
}

/** Solo superadmin puede ver/editar constructoras en modo admin */
export function canAdminConstructoras(r: ResolvedRole) {
  return r.isSuperAdmin;
}

/** Admin, superadmin y vendedor pueden ver constructoras (vendedor solo lectura) */
export function canViewConstructoras(r: ResolvedRole) {
  return r.isAdmin || r.isSuperAdmin || r.isVendedor;
}

/** Solo superadmin puede cambiar roles de otros usuarios */
export function canChangeRoles(r: ResolvedRole) {
  return r.isSuperAdmin;
}

/** Solo superadmin puede crear usuarios internos */
export function canCreateInternalUsers(r: ResolvedRole) {
  return r.isSuperAdmin;
}

/** Cualquier usuario autenticado con rol interno puede ver el panel admin */
export function hasAnyAdminAccess(r: ResolvedRole) {
  return r.isSuperAdmin || r.isAdmin || r.isVendedor;
}
