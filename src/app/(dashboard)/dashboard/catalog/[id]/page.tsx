import { getModelById } from "@/lib/supabase/services";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditModelForm } from "./edit-form";

export default async function EditModelPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const modelo = await getModelById(id);

  if (!modelo) {
    notFound();
  }

  // Security check: ensure the model belongs to the logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || modelo.constructora_id !== user.id) {
    redirect("/dashboard/catalog");
  }

  return (
    <div className="py-12 space-y-10 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black tracking-tighter uppercase">Editar <span className="gradient-text">Modelo</span></h1>
        <p className="text-muted-foreground font-medium">Actualiza las especificaciones y el estado de tu modelo.</p>
      </div>
      
      <EditModelForm modelo={modelo} />
    </div>
  );
}
