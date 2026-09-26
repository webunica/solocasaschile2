import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAdminRole } from "@/lib/security/admin-guard";
import { canManageUsers } from "@/lib/security/permissions";
import { ROLES, type AppRole } from "@/lib/security/roles";
import {
  UsuariosClient,
  type UserWithProfile,
} from "@/components/admin/usuarios/usuarios-client";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  // ── Auth guard: solo superadmin ──────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const resolved = await resolveAdminRole(supabase, user);
  if (!canManageUsers(resolved)) redirect("/dashboard");

  // ── Obtener datos ────────────────────────────────────────────────────────
  const admin = createAdminClient();

  const { data: authData, error: authError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });

  if (authError) {
    throw new Error(`Error al listar usuarios: ${authError.message}`);
  }

  const userIds = authData.users.map((u) => u.id);

  const { data: profiles } = await admin
    .from("constructoras")
    .select("id, nombre, role, plan, plan_status, verificada, created_at, email, telefono, slug")
    .in("id", userIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  // ── Combinar auth + perfil ───────────────────────────────────────────────
  const roleOrder: (AppRole | null)[] = [
    ROLES.SUPERADMIN,
    ROLES.ADMIN,
    ROLES.VENDEDOR,
    null,
  ];

  const users: UserWithProfile[] = authData.users
    .map((u) => {
      const profile = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        nombre: profile?.nombre ?? null,
        telefono: profile?.telefono ?? null,
        slug: profile?.slug ?? null,
        role: (profile?.role as AppRole | null) ?? null,
        plan: profile?.plan ?? null,
        plan_status: profile?.plan_status ?? null,
        verificada: profile?.verificada ?? false,
        last_sign_in_at: u.last_sign_in_at ?? null,
        created_at: u.created_at,
        is_banned: u.banned_until != null,
        has_profile: !!profile,
      };
    })
    .sort(
      (a, b) =>
        roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
    );

  return (
    <div className="py-4 sm:py-6">
      <UsuariosClient initialUsers={users} />
    </div>
  );
}
