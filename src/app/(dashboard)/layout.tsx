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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950/50">
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex flex-col h-full w-full">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
