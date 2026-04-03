import { createClient } from "@/lib/supabase/server";
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminPagosPage() {
  const supabase = await createClient();

  // 1. Fetch de Pagos con nombre de constructora
  const { data, error } = await supabase
    .from('pagos')
    .select(`
      *,
      constructoras (
        nombre,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  const pagos = data as any[] | null;

  if (error) {
    console.error('Error fetching payments:', error);
  }

  // 2. Estadísticas Rápidas
  const totalIngresos = pagos?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  const pagosExitosos = pagos?.filter((p: any) => p.status === 'paid').length || 0;
  const pagosFallidos = pagos?.filter((p: any) => p.status === 'rejected').length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-3 h-3" /> Pagado</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold"><XCircle className="w-3 h-3" /> Rechazado</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold"><AlertCircle className="w-3 h-3" /> Anulado</Badge>;
      default:
        return <Badge variant="secondary" className="px-2 py-0.5 rounded-full flex items-center gap-1.5 font-bold"><Clock className="w-3 h-3" /> Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Pagos Globales</h1>
          <p className="text-slate-500 font-medium">Historial completo de suscripciones y transacciones de Flow.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-brand-indigo" />
          </div>
          <CardHeader className="pb-2">
             <CardDescription className="font-bold uppercase tracking-wider text-[10px]">Ingresos Totales (Pagados)</CardDescription>
             <CardTitle className="text-3xl font-black text-brand-indigo">${totalIngresos.toLocaleString('es-CL')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 font-medium">Suma de todas las transacciones exitosas.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
           <CardHeader className="pb-2">
              <CardDescription className="font-bold uppercase tracking-wider text-[10px]">Tasa de Conversión</CardDescription>
              <CardTitle className="text-3xl font-black text-emerald-600">
                {pagos?.length ? Math.round((pagosExitosos / pagos.length) * 100) : 0}%
              </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-xs text-slate-400 font-medium">{pagosExitosos} éxitos de {pagos?.length} intentos.</p>
           </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
           <CardHeader className="pb-2">
              <CardDescription className="font-bold uppercase tracking-wider text-[10px]">Pagos Fallidos</CardDescription>
              <CardTitle className="text-3xl font-black text-rose-500">{pagosFallidos}</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-xs text-slate-400 font-medium text-rose-400/80 font-bold underline cursor-help">Requiere atención del equipo.</p>
           </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Constructora</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Plan / Ciclo</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Monto</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Flow Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pagos && pagos.length > 0 ? (
                pagos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-4 text-sm font-semibold text-slate-500">
                      {format(new Date(p.created_at), "dd MMM yyyy", { locale: es })}
                      <span className="block text-[10px] opacity-40 italic">{format(new Date(p.created_at), "HH:mm")}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                           <span className="text-[10px] font-black text-brand-indigo">{p.constructoras?.nombre?.[0].toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{p.constructoras?.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase text-brand-indigo tracking-tight">{p.plan}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.billing_cycle === 'yearly' ? 'Anual' : 'Mensual'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-black text-slate-900">${Number(p.amount).toLocaleString('es-CL')}</td>
                    <td className="p-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="p-4 text-right">
                       <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">#{p.flow_order}</code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400 font-bold italic">No se han registrado pagos todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
