import { NextResponse } from "next/server";
import { syncSuppliersForCategory } from "@/lib/services/suppliers";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resolveAdminRole } from "@/lib/security/admin-guard";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const role = await resolveAdminRole(supabase, user);
    if (!role.isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit({
      key: `admin-sync-suppliers:${user.id}:${ip}`,
      limit: 10,
      windowMs: 60_000,
    });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { categoryId, categorySlug, categoryName, regionName, regionSlug } = await request.json();

    if (!categoryId || !categorySlug || !categoryName || !regionName || !regionSlug) {
      return NextResponse.json({ 
        error: "Faltan parámetros requeridos",
        received: { categoryId, categorySlug, categoryName, regionName, regionSlug }
      }, { status: 400 });
    }

    console.info("[admin.sync-suppliers] start", {
      userId: user.id,
      role: role.role,
      categoryId,
      regionSlug,
    });

    const result = await syncSuppliersForCategory(categoryId, categorySlug, categoryName, regionName, regionSlug);

    console.info("[admin.sync-suppliers] success", {
      userId: user.id,
      role: role.role,
      count: result.count,
      regionSlug,
      categoryId,
    });

    return NextResponse.json({ 
      success: true, 
      message: result.count > 0
        ? `✅ ${result.count} proveedores sincronizados para "${categoryName}" en ${regionName}`
        : `ℹ️ No se encontraron resultados (búsqueda: "${result.query}")`,
      count: result.count,
      query: result.query,
    });

  } catch (error: unknown) {
    console.error("Sync Error:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ 
      error: message,
      hint: message.includes('SERPAPI_KEY') 
        ? 'Ve a Vercel > Settings > Environment Variables y agrega SERPAPI_KEY' 
        : 'Revisa los logs de Vercel para más detalles'
    }, { status: 500 });
  }
}
