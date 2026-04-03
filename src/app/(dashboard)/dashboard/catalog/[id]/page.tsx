import { getModelById } from "@/lib/supabase/services";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditModelForm } from "./edit-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditModelPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const modelo = await getModelById(id);

  if (!modelo) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Super-admin master key: check if user is admin in constructoras table
  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user?.id || '').maybeSingle();
  const isSuperAdmin = profile?.role === 'superadmin' || user?.app_metadata?.is_superadmin === true;
  
  if (!user || (modelo.constructora_id !== user.id && !isSuperAdmin)) {
    redirect("/dashboard/catalog");
  }

  return (
    <div className="py-12 space-y-12 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
           <Link href="/dashboard/catalog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
           </Link>
           <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter leading-tight text-foreground">
             Edición <span className="bg-brand-indigo bg-clip-text text-transparent italic">Maestra</span>
           </h1>
           <p className="text-sm md:text-base text-muted-foreground font-medium max-w-xl">
             Refina cada detalle de tu {modelo.nombre}. La precisión en la ficha técnica acelera el cierre de ventas.
           </p>
        </div>
      </div>
      
      <EditModelForm modelo={modelo} />
    </div>
  );
}
