import { NextResponse } from "next/server";
import { syncSuppliersForCategory } from "@/lib/services/suppliers";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 300; // 5 minutos (Vercel Pro)

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { regionName, regionSlug } = await request.json();
    if (!regionName || !regionSlug) {
      return NextResponse.json({ error: "Faltan parámetros: regionName y regionSlug" }, { status: 400 });
    }

    // Cargar todas las categorías desde la DB
    const { data: categories, error: catError } = await supabase
      .from('material_categories')
      .select('id, name, slug')
      .order('name');

    if (catError || !categories?.length) {
      return NextResponse.json({ error: "No se encontraron categorías" }, { status: 500 });
    }

    const results: { category: string; count: number; error?: string }[] = [];

    // Procesar cada categoría secuencialmente
    for (const cat of categories) {
      try {
        const result = await syncSuppliersForCategory(cat.id, cat.slug, cat.name, regionName, regionSlug);
        results.push({ category: cat.name, count: result.count });
      } catch (err: any) {
        results.push({ category: cat.name, count: 0, error: err.message });
      }
    }

    const totalSynced = results.reduce((sum, r) => sum + r.count, 0);
    const errors = results.filter(r => r.error);

    return NextResponse.json({
      success: true,
      region: regionName,
      totalSynced,
      categoriesProcessed: categories.length,
      errors: errors.length,
      results,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
