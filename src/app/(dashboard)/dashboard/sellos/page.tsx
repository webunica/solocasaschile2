import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSellosDeConstructora } from "@/lib/supabase/services";
import { SellosGrid } from "@/components/constructora/sellos-grid";
import { ShieldCheck, BadgeCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { solicitarSello } from "@/lib/supabase/actions";
import { SolicitarSelloForm } from "@/components/dashboard/sellos/solicitar-sello-form";
import Link from "next/link";

export const metadata = {
  title: "Mis Sellos de Confianza | Dashboard",
};

async function getAllSellos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sellos_catalogo")
    .select("*")
    .eq("activo", true)
    .order("tipo", { ascending: false }); // manuales primero
  return data || [];
}

async function getMisSellos(constructoraId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("constructora_sellos")
    .select("*, sello:sello_id(*)")
    .eq("constructora_id", constructoraId);
  return data || [];
}

export default async function SellosDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [catalogo, misSellos] = await Promise.all([
    getAllSellos(),
    getMisSellos(user.id),
  ]);

  const aprobados = misSellos.filter((s: any) => s.estado === "aprobado");
  const pendientes = misSellos.filter((s: any) => s.estado === "pendiente");
  const rechazados = misSellos.filter((s: any) => s.estado === "rechazado");

  const aprobadosIds = new Set(aprobados.map((s: any) => s.sello_id));
  const pendientesIds = new Set(pendientes.map((s: any) => s.sello_id));

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black tracking-tight flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-brand-indigo" />
          Sellos de Confianza
        </h1>
        <p className="text-muted-foreground text-lg">
          Aumenta la confianza de tus clientes completando tu perfil y solicitando verificaciones.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border/40 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-4xl font-black text-brand-teal">{aprobados.length}</span>
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Activos</span>
        </div>
        <div className="bg-card border border-border/40 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-4xl font-black text-amber-500">{pendientes.length}</span>
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">En Revisión</span>
        </div>
        <div className="bg-card border border-border/40 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-4xl font-black text-foreground/30">{catalogo.length - aprobados.length}</span>
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Disponibles</span>
        </div>
      </div>

      {/* Sellos actuales */}
      {aprobados.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight">Mis sellos activos</h2>
          <SellosGrid sellos={aprobados as any} />
        </section>
      )}

      {/* Catálogo completo */}
      <section className="space-y-6">
        <h2 className="text-xl font-black tracking-tight">Todos los sellos disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catalogo.map((sello: any) => {
            const isAprobado = aprobadosIds.has(sello.id);
            const isPendiente = pendientesIds.has(sello.id);
            const isManual = sello.tipo === "manual";

            return (
              <div
                key={sello.id}
                className={`bg-card border rounded-[2rem] p-6 flex items-start gap-5 transition-all ${
                  isAprobado
                    ? "border-brand-teal/30 bg-brand-teal/5"
                    : "border-border/40 opacity-70"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAprobado
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {isManual ? (
                    <BadgeCheck className="w-6 h-6" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-sm">{sello.nombre}</h3>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        isManual
                          ? "border-brand-indigo/20 text-brand-indigo"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      {isManual ? "Manual" : "Automático"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sello.descripcion}
                  </p>
                  <div className="pt-2">
                    {isAprobado ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-teal uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Obtenido
                      </span>
                    ) : isPendiente ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> En revisión
                      </span>
                    ) : isManual ? (
                      <SolicitarSelloForm sello={sello} />
                    ) : (
                      <Link 
                        href={sello.slug === 'empresa-activa' ? '/dashboard/catalog' : '/dashboard/settings'}
                        className="h-8 inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand-indigo transition-colors"
                      >
                        Ir a completar →
                      </Link>
                    )}
                  </div>
                </div>
                {isAprobado && (
                  <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                )}
                {isPendiente && !isAprobado && (
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Rechazados */}
      {rechazados.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black tracking-tight text-destructive/80 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Solicitudes rechazadas
          </h2>
          <div className="space-y-3">
            {rechazados.map((s: any) => (
              <div key={s.id} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-1">
                <p className="font-black text-sm">{s.sello?.nombre}</p>
                {s.comentario_admin && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold">Motivo:</span> {s.comentario_admin}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
