import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAdminRole, checkRateLimit } from "@/lib/security/admin-guard";
import { canManageUsers } from "@/lib/security/permissions";
import { ROLES, type AppRole } from "@/lib/security/roles";

// ─── GET /api/admin/usuarios ─────────────────────────────────────────────────
// Lista todos los usuarios (auth.users ⊕ constructoras).
// Solo superadmin.

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const resolved = await resolveAdminRole(supabase, user);
    if (!canManageUsers(resolved)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const rl = checkRateLimit({
      key: `admin-usuarios-get:${user.id}`,
      limit: 30,
      windowMs: 60_000,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limited" },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds) },
        }
      );
    }

    const admin = createAdminClient();

    // 1. Obtener todos los usuarios de auth
    const { data: authData, error: authError } =
      await admin.auth.admin.listUsers({ perPage: 1000 });
    if (authError) throw authError;

    // 2. Obtener perfiles de constructoras para cruzar
    const userIds = authData.users.map((u) => u.id);
    const { data: profiles } = await admin
      .from("constructoras")
      .select("id, nombre, role, plan, plan_status, verificada, created_at, email, telefono, slug")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

    // 3. Combinar auth + profile
    const users = authData.users.map((u) => {
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
    });

    // Ordenar: superadmins primero, luego admins, luego vendedores, luego el resto
    const roleOrder: (AppRole | null)[] = [
      ROLES.SUPERADMIN,
      ROLES.ADMIN,
      ROLES.VENDEDOR,
      null,
    ];
    users.sort(
      (a, b) =>
        roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
    );

    return NextResponse.json({ users });
  } catch (err: unknown) {
    console.error("[GET /api/admin/usuarios]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

// ─── POST /api/admin/usuarios ─────────────────────────────────────────────────
// Crea un nuevo usuario interno (admin o vendedor).
// Solo superadmin.

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const resolved = await resolveAdminRole(supabase, user);
    if (!canManageUsers(resolved)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const rl = checkRateLimit({
      key: `admin-usuarios-post:${user.id}`,
      limit: 5,
      windowMs: 60_000,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limited" },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();
    const { email, nombre, role } = body as {
      email: string;
      nombre: string;
      role: "admin" | "vendedor";
    };

    // Validaciones básicas
    if (!email || !nombre || !role) {
      return NextResponse.json(
        { error: "missing_fields", message: "email, nombre y role son requeridos" },
        { status: 400 }
      );
    }
    if (!["admin", "vendedor"].includes(role)) {
      return NextResponse.json(
        { error: "invalid_role", message: "Solo se pueden crear usuarios con rol admin o vendedor" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // 1. Generar contraseña temporal segura
    const tempPassword =
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10).toUpperCase() +
      "!1";

    // 2. Crear usuario en Supabase Auth
    const { data: newAuthUser, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { nombre, role },
      });

    if (createError) {
      if (createError.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "email_already_exists" },
          { status: 409 }
        );
      }
      throw createError;
    }

    const newUserId = newAuthUser.user.id;

    // 3. Crear fila en constructoras con el rol asignado
    const { error: profileError } = await admin.from("constructoras").upsert(
      {
        id: newUserId,
        email,
        nombre,
        role,
        plan: "starter",
        plan_status: "active",
        slug: `interno-${newUserId.slice(0, 8)}`,
        verificada: false,
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      // Si falló crear el perfil, limpiar el usuario auth para no dejar huérfano
      await admin.auth.admin.deleteUser(newUserId);
      throw profileError;
    }

    return NextResponse.json(
      {
        success: true,
        user: { id: newUserId, email, nombre, role },
        tempPassword, // El superadmin deberá compartir esta contraseña de forma segura
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[POST /api/admin/usuarios]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
