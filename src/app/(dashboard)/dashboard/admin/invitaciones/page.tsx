import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { resolveAdminRole } from "@/lib/security/admin-guard";
import { listInvitations, type ConstructoraInvitation } from "@/lib/invitations/generate";
import { InvitationManager } from "@/components/dashboard/admin/invitation-manager";
import { Mail, Sparkles } from "lucide-react";
import { headers } from "next/headers";

export const metadata = {
  title: "Gestión de Invitaciones | Admin SoloCasasChile",
  robots: { index: false, follow: false },
};

export default async function AdminInvitacionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await resolveAdminRole(supabase, user);
  if (!role.isAdmin) {
    redirect("/dashboard");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "solocasaschile.com";
  const proto = headerList.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  let initialInvitations: ConstructoraInvitation[] = [];
  try {
    initialInvitations = await listInvitations();
  } catch (err) {
    console.error("Error loading invitations in admin page:", err);
  }

  const { data: rawConstructoras } = await supabase
    .from("constructoras")
    .select("id, nombre, email, telefono, regiones, plan, slug")
    .order("nombre", { ascending: true });

  const constructoras = (rawConstructoras ?? []) as Array<{
    id: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    regiones: string[] | null;
    plan: string | null;
    slug: string | null;
  }>;

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Adquisición B2B
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight flex items-center gap-3">
            <Mail className="w-7 h-7 text-primary" />
            Invitaciones a Constructoras
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            Envía correos con enlaces únicos para que empresas constructoras activen su Plan Starter (1 modelo gratis).
          </p>
        </div>
      </div>

      <InvitationManager
        initialInvitations={initialInvitations}
        constructoras={constructoras}
        baseUrl={baseUrl}
      />
    </div>
  );
}
