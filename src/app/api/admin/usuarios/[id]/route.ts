import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAdminRole } from "@/lib/security/admin-guard";
import { canManageUsers } from "@/lib/security/permissions";
import { ROLES, type AppRole } from "@/lib/security/roles";

// ─── PATCH /api/admin/usuarios/[id] ──────────────────────────────────────────
// Actualiza rol y/o nombre de un usuario. Solo superadmin.

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

    // Prevenir que el superadmin se modifique a sí mismo el rol accidentalmente
    if (targetId === user.id) {
      return NextResponse.json(
        { error: "cannot_modify_self", message: "No puedes cambiar tu propio rol desde aquí." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { role, nombre } = body as {
      role?: AppRole;
      nombre?: string;
    };

    const allowedRoles: AppRole[] = [ROLES.ADMIN, ROLES.VENDEDOR, ROLES.SUPERADMIN];
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: "invalid_role" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Actualizar fila en constructoras
    const updatePayload: Record<string, unknown> = {};
    if (role) updatePayload.role = role;
    if (nombre) updatePayload.nombre = nombre;

    const { error: profileError } = await admin
      .from("constructoras")
      .update(updatePayload)
      .eq("id", targetId);

    if (profileError) throw profileError;

    // Si el nuevo rol es superadmin → actualizar app_metadata también
    if (role === ROLES.SUPERADMIN) {
      await admin.auth.admin.updateUserById(targetId, {
        app_metadata: { is_superadmin: true, role: "superadmin" },
      });
    } else if (role) {
      // Limpiar flag de superadmin si se baja de nivel
      await admin.auth.admin.updateUserById(targetId, {
        app_metadata: { is_superadmin: false, role },
      });
    }

    return NextResponse.json({ success: true, updated: { role, nombre } });
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
