import { Metadata } from "next";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Perfil y Configuración | SolocasasChile",
  description: "Gestiona la información pública de tu constructora.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  // Fetch current company data
  const { data: constructora } = await supabase
    .from("constructoras")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading font-black tracking-tight">Configuración del Perfil</h1>
        <p className="text-muted-foreground text-lg">
          Personaliza cómo los clientes ven tu constructora en el catálogo oficial.
        </p>
      </div>

      <div className="grid gap-8">
        <SettingsForm initialData={constructora} userEmail={user.email} />
      </div>
    </div>
  );
}
