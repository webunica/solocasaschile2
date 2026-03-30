import { Metadata } from "next";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { AnnouncementSettings } from "@/components/dashboard/admin/announcement-settings";
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

  const isSuperAdmin = user.app_metadata?.is_superadmin === true;
  const isAdmin = isSuperAdmin || constructora?.role === 'superadmin' || constructora?.role === 'admin' || user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';

  // Fetch current announcement settings if admin
  let announcementSettings = null;
  if (isAdmin) {
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'announcement_bar')
      .maybeSingle();
    announcementSettings = setting?.value || {
      active: false,
      text: "¡Anuncio de ejemplo! Edítame en el panel.",
      link: "",
      buttonText: "Ver más",
      theme: "brand"
    };
  }

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading font-black tracking-tight italic">Configuración</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona los ajustes de tu cuenta y de la plataforma.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Perfil de Constructora
           </div>
           <SettingsForm initialData={constructora} userEmail={user.email} />
        </section>

        {isAdmin && (
          <section className="space-y-6 pt-6 border-t border-border/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Administración Global (Solo Admins)
            </div>
            
            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Barra de Anuncios del Sitio</h3>
                  <p className="text-sm text-muted-foreground">Este ajuste afecta a toda la plataforma SolocasasChile.</p>
                </div>
                
                <AnnouncementSettings initialSettings={announcementSettings} />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
