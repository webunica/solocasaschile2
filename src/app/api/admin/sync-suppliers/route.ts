import { NextResponse } from "next/server";
import { syncSuppliersForCategory } from "@/lib/services/suppliers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Solo permitir a usuarios autenticados (Idealmente chequear rol admin)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { categoryId, categoryName, regionName, regionSlug } = await request.json();

    if (!categoryId || !categoryName || !regionName || !regionSlug) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const result = await syncSuppliersForCategory(categoryId, categoryName, regionName, regionSlug);

    return NextResponse.json({ 
      success: true, 
      message: `Sincronizados ${result.count} proveedores para ${categoryName} en ${regionName}` 
    });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
