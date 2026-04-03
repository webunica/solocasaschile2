import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | SolocasasChile",
  description: "Administra tu constructora, modelos y prospectos desde el panel central de SolocasasChile.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Buscar rol en la tabla de perfiles (constructoras)
  const { data: profile } = await supabase
    .from('constructoras')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isSuperAdmin = user?.app_metadata?.is_superadmin === true || profile?.role === 'superadmin';
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
  const userName = user?.user_metadata?.nombre || user?.email?.split('@')[0] || 'Constructor';

  // Bloqueo de Dashboard si el pago está pendiente
  if (profile?.plan_status === 'pending' && !isSuperAdmin) {
    redirect('/planes?status=pending');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950/50">
        <DashboardSidebar isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} userName={userName} userEmail={user.email} />
        <SidebarInset>
          <div className="flex flex-col h-full w-full">
            <DashboardHeader userName={userName} isSuperAdmin={isSuperAdmin} />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
