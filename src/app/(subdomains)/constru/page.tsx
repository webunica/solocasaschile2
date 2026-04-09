import { SuppliersDirectory } from "@/components/constru/suppliers-directory";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ConstruHomePage() {
  const supabase = await createClient();
  
  // Obtener las categorías que insertamos en la migración
  const { data: categories } = await supabase
    .from('material_categories')
    .select('*')
    .order('name');

  return (
    <div className="container mx-auto px-4 py-12">
      <SuppliersDirectory categories={categories || []} />
    </div>
  );
}
