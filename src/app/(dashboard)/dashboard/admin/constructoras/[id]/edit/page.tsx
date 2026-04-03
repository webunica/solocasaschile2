import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { AdminEditForm } from "@/components/dashboard/admin/constructora-edit-form";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin: Editar Constructora | SolocasasChile",
  description: "Edición maestra de perfil de constructora.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditConstructoraPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata?.is_superadmin !== true) {
    redirect("/dashboard");
  }

  // Fetch constructora data
  const { data: constructora, error } = await supabase
    .from('constructoras')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !constructora) {
    return (
      <div className="p-10 border border-destructive text-destructive">
        <h1>Error loading constructora</h1>
        <p>ID: {id}</p>
        <p>Error MSG: {error?.message}</p>
        <p>Error details: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6">
        <Link 
          href="/dashboard/admin/constructoras"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Volver a Administración Global
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="w-6 h-6 text-amber-500 opacity-60" />
             <h1 className="text-4xl font-heading font-black tracking-tighter leading-none italic">
                Editar Perfil: <span className="text-muted-foreground">{constructora.nombre}</span>
             </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Modifica directamente los datos públicos de esta constructora como Administrador Maestro.</p>
        </div>
      </div>

      <AdminEditForm initialData={constructora} />
    </div>
  );
}
