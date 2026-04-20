import { createClient } from "@/lib/supabase/server";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";

function getCycleLabel(cycle?: string | null) {
  if (cycle === "yearly") return "Facturacion Anual";
  if (cycle === "semiannual") return "Facturacion Semestral";
  return "Facturacion Mensual";
}

function formatClp(amount: number | string) {
  return `$${Number(amount).toLocaleString("es-CL")}`;
}

type FacturacionProfile = {
  plan?: string | null;
  plan_cycle?: string | null;
  plan_status?: string | null;
  next_billing_date?: string | null;
  verificada?: boolean | null;
};

type FacturacionPago = {
  id: string;
  created_at: string;
  plan: string;
  amount: number | string;
  status: string;
  billing_cycle?: string | null;
  flow_order?: string | number | null;
};

export default async function FacturacionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("constructoras")
    .select("plan, plan_cycle, plan_status, next_billing_date, verificada")
    .eq("id", user.id)
    .single();

  const { data: pagos } = await supabase
    .from("pagos")
    .select("id, created_at, plan, amount, status, billing_cycle, flow_order")
    .eq("constructora_id", user.id)
    .order("created_at", { ascending: false });

  const typedProfile = profile as FacturacionProfile | null;
  const typedPagos = (pagos ?? []) as FacturacionPago[];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3 h-3" /> Pagado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold">
            <XCircle className="w-3 h-3" /> Rechazado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold">
            Incompleto
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-indigo/10 text-brand-indigo">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Plan y Facturacion
            </h1>
            <p className="text-slate-500 font-medium italic">
              Gestiona tu suscripcion y revisa tus comprobantes de pago.
            </p>
          </div>
        </div>
        <Link
          href="/planes"
          className="bg-brand-indigo hover:bg-brand-indigo/90 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-brand-indigo/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Zap className="w-4 h-4 fill-current" /> Cambiar de Plan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="border-none shadow-2xl shadow-indigo-200/40 relative overflow-hidden h-full group">
            <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10 group-hover:scale-125 transition-transform">
              <ShieldCheck className="w-32 h-32 text-brand-indigo" />
            </div>
            <CardHeader className="relative z-10">
              <CardDescription className="font-extrabold uppercase text-[10px] tracking-[0.2em] text-brand-indigo opacity-60">
                Suscripcion Actual
              </CardDescription>
              <CardTitle className="text-4xl font-black text-slate-800 uppercase flex items-center gap-2">
                {typedProfile?.plan}
                {typedProfile?.verificada && (
                  <ShieldCheck className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-indigo/5 border border-brand-indigo/10">
                <Calendar className="w-5 h-5 text-brand-indigo" />
                <div>
                  <p className="text-[10px] font-black uppercase text-brand-indigo/60 tracking-widest">
                    Proximo Cobro
                  </p>
                  <p className="font-black text-slate-700">
                    {typedProfile?.next_billing_date
                      ? format(new Date(typedProfile.next_billing_date), "dd MMMM yyyy", { locale: es })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold">Estado:</span>
                  <span className="text-emerald-500 font-black flex items-center gap-1 capitalize">
                    <CheckCircle2 className="w-4 h-4" /> {typedProfile?.plan_status || "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold">Ciclo:</span>
                  <span className="text-slate-700 font-black uppercase">
                    {getCycleLabel(typedProfile?.plan_cycle)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-xl shadow-slate-200/50 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Historial de Transacciones
              </CardTitle>
              <CardDescription className="italic font-medium">
                Todos los recibos emitidos por Flow a tu constructora.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 italic">
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Concepto</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Orden</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Monto</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {typedPagos.length > 0 ? (
                      typedPagos.map((p) => (
                        <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 text-xs font-bold text-slate-500">
                            {format(new Date(p.created_at), "dd MMM, yyyy", { locale: es })}
                          </td>
                          <td className="py-4">
                            <span className="text-xs font-black uppercase text-brand-indigo">
                              Suscripcion {p.plan}
                            </span>
                            <span className="block text-[10px] font-bold uppercase tracking-tight text-slate-400">
                              {getCycleLabel(p.billing_cycle)}
                            </span>
                          </td>
                          <td className="py-4">
                            <code className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                              {p.flow_order ? `#${p.flow_order}` : "Pendiente"}
                            </code>
                          </td>
                          <td className="py-4 text-xs font-bold text-slate-900">{formatClp(p.amount)}</td>
                          <td className="py-4 text-right">{getStatusBadge(p.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">
                          Aun no tienes registros de facturacion.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
