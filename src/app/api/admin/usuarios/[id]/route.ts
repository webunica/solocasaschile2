import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAdminRole } from "@/lib/security/admin-guard";
import { canManageUsers } from "@/lib/security/permissions";
import { ROLES, type AppRole } from "@/lib/security/roles";

// ─── PATCH /api/admin/usuarios/[id] ──────────────────────────────────────────
// Actualiza rol y/o nombre de un usuario. Solo superadmin.

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const resolved = await resolveAdminRole(supabase, user);
    if (!canManageUsers(resolved)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { role, nombre, telefono, plan, verificada } = body as {
      role?: AppRole | null | "constructora";
      nombre?: string;
      telefono?: string;
      plan?: string;
      verificada?: boolean;
    };

    // Prevenir que el superadmin se degrade a sí mismo de rol accidentalmente
    if (targetId === user.id && role !== undefined && role !== ROLES.SUPERADMIN) {
      return NextResponse.json(
        { error: "cannot_modify_self", message: "No puedes degradar tu propio rol de Super Admin." },
        { status: 400 }
      );
    }

    const allowedRoles = [ROLES.ADMIN, ROLES.VENDEDOR, ROLES.SUPERADMIN, "constructora", null];
    if (role !== undefined && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Obtener usuario de Auth para asegurar que existe y obtener su email
    const { data: authUserData, error: authUserErr } = await admin.auth.admin.getUserById(targetId);
    if (authUserErr || !authUserData?.user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    // 2. Obtener perfil actual de constructoras si existe
    const { data: existingProfile } = await admin
      .from("constructoras")
      .select("id, slug, nombre, role, plan, telefono, verificada, email")
      .eq("id", targetId)
      .maybeSingle();

    const cleanNombre = nombre !== undefined ? nombre.trim() : (existingProfile?.nombre ?? "");
    let slug = existingProfile?.slug;
    if (!slug) {
      const baseSlug = cleanNombre ? slugify(cleanNombre) : `constructora-${targetId.slice(0, 8)}`;
      slug = baseSlug || `constructora-${targetId.slice(0, 8)}`;
    }

    const finalRole: AppRole | null =
      role === "constructora" || role === null
        ? null
        : role !== undefined
        ? (role as AppRole)
        : ((existingProfile?.role as AppRole | null) ?? null);

    const upsertPayload: Record<string, unknown> = {
      id: targetId,
      email: authUserData.user.email ?? existingProfile?.email ?? "",
      nombre: cleanNombre || "Constructora",
      slug,
      role: finalRole,
      plan: plan !== undefined ? plan : (existingProfile?.plan || "starter"),
      plan_status: "active",
      telefono: telefono !== undefined ? (telefono.trim() || null) : (existingProfile?.telefono ?? null),
      verificada: verificada !== undefined ? verificada : (existingProfile?.verificada ?? false),
    };

    const { error: upsertError } = await admin
      .from("constructoras")
      .upsert(upsertPayload, { onConflict: "id" });

    if (upsertError) throw upsertError;

    // 3. Sincronizar app_metadata y user_metadata en Supabase Auth
    if (finalRole === ROLES.SUPERADMIN) {
      await admin.auth.admin.updateUserById(targetId, {
        app_metadata: { is_superadmin: true, role: "superadmin" },
        user_metadata: { ...(authUserData.user.user_metadata || {}), nombre: cleanNombre || undefined },
      });
    } else {
      await admin.auth.admin.updateUserById(targetId, {
        app_metadata: { is_superadmin: false, role: finalRole },
        user_metadata: { ...(authUserData.user.user_metadata || {}), nombre: cleanNombre || undefined },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: targetId,
        nombre: cleanNombre,
        role: finalRole,
        plan: upsertPayload.plan,
        telefono: upsertPayload.telefono,
        verificada: upsertPayload.verificada,
        slug,
      },
    });
  } catch (err) {
    console.error("[PATCH /api/admin/usuarios/[id]]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/usuarios/[id] ─────────────────────────────────────────
// Desactiva (ban) un usuario. No lo borra. Solo superadmin.

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const resolved = await resolveAdminRole(supabase, user);
    if (!canManageUsers(resolved)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (targetId === user.id) {
      return NextResponse.json(
        { error: "cannot_deactivate_self" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Ban indefinido — no borra los datos, solo bloquea el acceso
    const { error } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: "876600h", // ~100 años = efectivamente permanente hasta reactivar
    });

    if (error) throw error;

    return NextResponse.json({ success: true, action: "deactivated", userId: targetId });
  } catch (err) {
    console.error("[DELETE /api/admin/usuarios/[id]]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
