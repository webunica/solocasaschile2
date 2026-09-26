// Definición centralizada de roles del sistema.
// Usar siempre estas constantes en lugar de strings literales.

export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  VENDEDOR: "vendedor",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<AppRole, string> = {
  superadmin: "Super Admin",
  admin: "Administrador",
  vendedor: "Vendedor",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  superadmin:
    "Acceso total. Gestiona usuarios, planes, configuración del sitio y todas las constructoras.",
  admin:
    "Acceso operativo. Puede gestionar leads, sellos, pagos e invitaciones.",
  vendedor:
    "Acceso comercial. Puede ver constructoras (solo lectura) y gestionar leads.",
};

/** Orden para mostrar roles de mayor a menor privilegio */
export const ROLE_ORDER: AppRole[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.VENDEDOR,
];

/** Colores de badge por rol (clases Tailwind) */
export const ROLE_BADGE_CLASSES: Record<AppRole, string> = {
  superadmin:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
  admin:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
  vendedor:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
};
