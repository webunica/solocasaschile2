import { NextResponse } from "next/server";
import { syncSuppliersForCategory } from "@/lib/services/suppliers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { categoryId, categorySlug, categoryName, regionName, regionSlug } = await request.json();

    if (!categoryId || !categorySlug || !categoryName || !regionName || !regionSlug) {
      return NextResponse.json({ 
        error: "Faltan parámetros requeridos",
        received: { categoryId, categorySlug, categoryName, regionName, regionSlug }
      }, { status: 400 });
    }

    const result = await syncSuppliersForCategory(categoryId, categorySlug, categoryName, regionName, regionSlug);

    return NextResponse.json({ 
      success: true, 
      message: result.count > 0
        ? `✅ ${result.count} proveedores sincronizados para "${categoryName}" en ${regionName}`
        : `ℹ️ No se encontraron resultados (búsqueda: "${result.query}")`,
      count: result.count,
      query: result.query,
    });

  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ 
      error: error.message,
      hint: error.message.includes('SERPAPI_KEY') 
        ? 'Ve a Vercel > Settings > Environment Variables y agrega SERPAPI_KEY' 
        : 'Revisa los logs de Vercel para más detalles'
    }, { status: 500 });
  }
}
