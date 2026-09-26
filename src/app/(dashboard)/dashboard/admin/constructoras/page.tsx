import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { resolveAdminRole } from "@/lib/security/admin-guard";
import { canAdminConstructoras } from "@/lib/security/permissions";
import { AdminConstructorasClient, type ConstructoraAdminItem } from "@/components/dashboard/admin/admin-constructoras-client";

export default async function AdminConstructorasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const resolved = await resolveAdminRole(supabase, user);
  if (!canAdminConstructoras(resolved)) {
    redirect("/dashboard");
  }

  // Obtener todas las constructoras
  const { data: constructoras, error } = await supabase
    .from('constructoras')
    .select('id, slug, nombre, logo_url, plan, verificada, email, telefono, direccion, sitio_web, score_confianza, regiones, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-3xl bg-muted/20">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Error al cargar constructoras</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const typedConstructoras = (constructoras ?? []) as ConstructoraAdminItem[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-heading font-black tracking-tighter leading-none italic mb-2">
          Administración Global
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Gestión maestra de todos los perfiles de constructoras en SolocasasChile.
        </p>
      </div>

      <AdminConstructorasClient initialConstructoras={typedConstructoras} />
    </div>
  );
}
