import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BadgeCheck, Clock, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { SelloActionButtons } from "@/components/dashboard/admin/sello-action-buttons";

export const metadata = {
  title: "Verificación de Sellos | Admin",
};

async function getSolicitudesPendientes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("constructora_sellos")
    .select(`
      id,
      estado,
      evidencia_url,
      created_at,
      constructora:constructora_id (id, nombre, slug, email),
      sello:sello_id (id, slug, nombre, descripcion, tipo)
    `)
    .eq("estado", "pendiente")
    .order("created_at", { ascending: true });
  return data || [];
}

async function getHistorial() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("constructora_sellos")
    .select(`
      id,
      estado,
      comentario_admin,
      otorgado_at,
      constructora:constructora_id (id, nombre),
      sello:sello_id (id, slug, nombre)
    `)
    .in("estado", ["aprobado", "rechazado"])
    .order("otorgado_at", { ascending: false })
    .limit(30);
  return data || [];
}

export default async function AdminSellosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("constructoras")
    .select("role")
    .eq("id", user.id)
    .single();

  const isSuperAdmin =
    user.app_metadata?.is_superadmin === true || profile?.role === "superadmin";
  if (!isSuperAdmin) redirect("/dashboard");

  const [pendientes, historial] = await Promise.all([
    getSolicitudesPendientes(),
    getHistorial(),
  ]);

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-heading font-black tracking-tight flex items-center gap-4">
            <BadgeCheck className="w-10 h-10 text-brand-indigo" />
            Verificación de Sellos
          </h1>
          <p className="text-muted-foreground">
            Revisa y gestiona las solicitudes de sellos verificables.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-6 py-3 text-center">
            <p className="text-2xl font-black text-amber-500">{pendientes.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Pending requests */}
      <section className="space-y-4">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Solicitudes pendientes
        </h2>

        {pendientes.length === 0 ? (
          <div className="bg-muted/20 border border-border/40 rounded-[2rem] p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-teal mx-auto mb-4 opacity-60" />
            <p className="font-black text-muted-foreground">Todo al día. No hay solicitudes pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendientes.map((s: any) => (
              <div key={s.id} className="bg-card border border-amber-500/20 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-start gap-6">
                {/* Seal info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-6 h-6 text-brand-indigo" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black">{s.sello?.nombre}</h3>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-brand-indigo/20 text-brand-indigo">
                        Manual
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.sello?.descripcion}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-bold">{s.constructora?.nombre}</span>
                      <span className="text-[10px] text-muted-foreground/60">({s.constructora?.email})</span>
                    </div>
                    {s.evidencia_url && (
                      <a
                        href={s.evidencia_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-brand-indigo hover:underline flex items-center gap-1 mt-1"
                      >
                        Ver evidencia adjunta →
                      </a>
                    )}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      Solicitado: {new Date(s.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <SelloActionButtons selloId={s.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {historial.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight text-muted-foreground">Historial reciente</h2>
          <div className="bg-card border border-border/40 rounded-[2rem] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Constructora</th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sello</th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado</th>
                  <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-bold">{s.constructora?.nombre}</td>
                    <td className="p-4 text-muted-foreground">{s.sello?.nombre}</td>
                    <td className="p-4">
                      {s.estado === "aprobado" ? (
                        <span className="flex items-center gap-1.5 text-brand-teal font-black text-[10px] uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-destructive font-black text-[10px] uppercase tracking-widest">
                          <XCircle className="w-3.5 h-3.5" /> Rechazado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {s.otorgado_at ? new Date(s.otorgado_at).toLocaleDateString("es-CL") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
