import { createClient } from "@/lib/supabase/server";
import { ConstruAdminSync } from "@/components/dashboard/admin/constru-admin-sync";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConstruAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificar si es admin/superadmin
  const { data: profile } = await supabase
    .from('constructoras')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
    redirect("/dashboard");
  }

  // Cargar categorías para el panel de sincronización
  const { data: categories } = await supabase
    .from('material_categories')
    .select('*')
    .order('name');

  return (
    <div className="space-y-12 py-12">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none">
          Gestión <span className="text-[#fa8823] italic">Constru</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Administra el catálogo de materiales y sincroniza proveedores reales usando inteligencia geoespacial.
        </p>
      </div>

      <ConstruAdminSync categories={categories || []} />
    </div>
  );
}
