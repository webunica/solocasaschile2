import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, ArrowRight } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateSynchronizedConstructora } from "@/lib/supabase/constructora-sync";

export const metadata: Metadata = {
  title: "Dashboard | SolocasasChile",
  robots: {
    index: false,
    follow: false,
  },
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

  // Buscar / sincronizar constructora centralizada y unívoca
  const profile = await getOrCreateSynchronizedConstructora(user);

  const isSuperAdmin = user?.app_metadata?.is_superadmin === true || profile?.role === 'superadmin';
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
  const userName = profile?.nombre || user?.user_metadata?.nombre || user?.email?.split('@')[0] || 'Constructor';

  let userPlan = profile?.plan || (user?.user_metadata?.plan as string) || 'starter';
  if (userPlan === 'gratis' && user?.user_metadata?.plan === 'starter') {
    userPlan = 'starter';
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950/50">
        <DashboardSidebar isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} plan={userPlan} userName={userName} userEmail={user.email} />
        <SidebarInset>
          <div className="flex flex-col h-full w-full">
            <DashboardHeader userName={userName} isSuperAdmin={isSuperAdmin} />

            {/* Recordatorio amigable de plan pendiente sin bloquear el uso del panel */}
            {profile?.plan_status === 'pending' && !isSuperAdmin && (
              <div className="px-4 pt-4 md:px-8 md:pt-6 max-w-7xl mx-auto w-full">
                <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-orange-50/50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-300/60 shadow-xs">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-amber-950">Recordatorio: Activación de plan pendiente</span>
                        <span className="inline-flex items-center rounded-full bg-amber-100 border border-amber-300/60 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-800">
                          Suscripción pendiente
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/85 mt-1 leading-relaxed">
                        Tu cuenta está operativa. Puedes explorar tu panel y configurar tu catálogo con normalidad, y completar tu pago cuando desees publicar sin límites.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href="/planes"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#073E48] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0a4d59] transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>Ver Planes</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
