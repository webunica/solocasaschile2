import { NextResponse } from "next/server";
import { syncSuppliersForCategory } from "@/lib/services/suppliers";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resolveAdminRole } from "@/lib/security/admin-guard";

export const maxDuration = 300; // 5 minutos (Vercel Pro)

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const role = await resolveAdminRole(supabase, user);
    if (!role.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit({
      key: `admin-sync-region:${user.id}:${ip}`,
      limit: 3,
      windowMs: 5 * 60_000,
    });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes para sincronización regional." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { regionName, regionSlug } = await request.json();
    if (!regionName || !regionSlug) {
      return NextResponse.json(
        { error: "Faltan parámetros: regionName y regionSlug" },
        { status: 400 }
      );
    }

    console.info("[admin.sync-region] start", {
      userId: user.id,
      role: role.role,
      regionSlug,
    });

    const { data: categories, error: catError } = await supabase
      .from("material_categories")
      .select("id, name, slug")
      .order("name");

    if (catError || !categories?.length) {
      return NextResponse.json({ error: "No se encontraron categorías" }, { status: 500 });
    }

    const results: { category: string; count: number; error?: string }[] = [];

    for (const cat of categories) {
      try {
        const result = await syncSuppliersForCategory(
          cat.id,
          cat.slug,
          cat.name,
          regionName,
          regionSlug
        );
        results.push({ category: cat.name, count: result.count });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        results.push({ category: cat.name, count: 0, error: message });
      }
    }

    const totalSynced = results.reduce((sum, r) => sum + r.count, 0);
    const errors = results.filter((r) => r.error);

    console.info("[admin.sync-region] finish", {
      userId: user.id,
      role: role.role,
      regionSlug,
      totalSynced,
      categoriesProcessed: categories.length,
      errors: errors.length,
    });

    return NextResponse.json({
      success: true,
      region: regionName,
      totalSynced,
      categoriesProcessed: categories.length,
      errors: errors.length,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
