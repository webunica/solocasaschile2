import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Megaphone, 
  Settings2, 
  Globe, 
  Layout, 
  Database,
  ShieldCheck,
  Palette
} from "lucide-react";
import { AnnouncementSettings } from "@/components/dashboard/admin/announcement-settings";
import { MegaMenuSettings } from "@/components/dashboard/admin/mega-menu-settings";
import { getModelosByConstructora } from "@/lib/supabase/services";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();

  const isSuperAdmin = user.app_metadata?.is_superadmin === true || user.user_metadata?.role === 'superadmin' || user.app_metadata?.role === 'superadmin' || profile?.role === 'superadmin';
  const isAdmin = isSuperAdmin || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin' || profile?.role === 'admin';
  
  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch current announcement settings
  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'announcement_bar')
    .maybeSingle();

  const currentSettings = setting?.value || {
    active: false,
    text: "¡Anuncio de ejemplo! Edítame en el panel.",
    link: "",
    buttonText: "Ver más",
    theme: "brand"
  };

  // Fetch mega menu settings
  const { data: megaMenuSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'mega_menu_ads')
    .maybeSingle();

  // Fetch constructoras and models for the selecting dropdowns
  const { data: constructorasData } = await supabase.from('constructoras')
    .select('id, nombre')
    .order('nombre', { ascending: true });

  const { data: modelosData } = await supabase.from('modelos')
    .select(`id, nombre, constructora:constructoras (nombre)`)
    .order('nombre', { ascending: true });

  const constructoras = (constructorasData || []).map((c: any) => ({ id: c.id, nombre: c.nombre }));
  const modelos = (modelosData || []).map((m: any) => ({ 
    id: m.id, 
    nombre: m.nombre, 
    constructora_nombre: (m.constructora as any)?.nombre || 'Desconocida' 
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <div className="flex items-center gap-3 mb-2">
           <div className="w-10 h-10 rounded-2xl bg-brand-indigo flex items-center justify-center text-white ring-4 ring-primary/10">
              <Settings2 className="w-5 h-5" />
           </div>
           <h1 className="text-4xl font-heading font-black tracking-tighter leading-none italic">
             Configuración Global
           </h1>
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          Control maestro de la plataforma SolocasasChile. Cambia configuraciones globales del sitio.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Sección: Barra de Anuncios */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            <Megaphone className="w-4 h-4" />
            <span>Marketing & Notificaciones</span>
          </div>
          
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Barra de Anuncios</h3>
                  <p className="text-sm text-muted-foreground">Muestra una barra informativa en la parte superior de todas las páginas para promociones o avisos importantes.</p>
                </div>
              </div>
              
              <AnnouncementSettings initialSettings={currentSettings} />
            </div>
          </div>
        </section>

        {/* Sección: Mega Menú Desktop */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
             <Layout className="w-4 h-4" />
             <span>Navegación & Catálogo</span>
          </div>
          <MegaMenuSettings 
            initialSettings={megaMenuSetting?.value} 
            constructoras={constructoras} 
            modelos={modelos} 
          />
        </section>

        {/* Sección: Otras Configuraciones (Placeholders) */}
        <section className="space-y-4 opacity-50 grayscale select-none">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
             <ShieldCheck className="w-4 h-4" />
             <span>Mantenimiento & Seguridad</span>
          </div>
          
          <div className="bg-muted/5 border border-dashed border-border/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Layout className="w-6 h-6 text-muted-foreground" />
             </div>
             <div>
                <p className="font-bold text-sm">Más controles próximamente</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">Pronto podrás gestionar el modo mantenimiento, SEO global y configuraciones de analíticas desde aquí.</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
