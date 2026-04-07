import { getModelosByConstructora } from "@/lib/supabase/services";
import { deleteModelo, toggleFeaturedModelo } from "@/lib/supabase/actions";
import { 
  Plus, Search, Edit2, Trash2, 
  Eye, LayoutGrid, List, Filter, Home, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPlanLimits } from "@/lib/constants/plans";
import { createClient } from "@/lib/supabase/server";

export default async function CatalogManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let modelos: any[] = [];
  let constructora: any = null;
  let errorMsg = null;

  try {
    modelos = await getModelosByConstructora();
    if (user) {
      const { data } = await supabase.from('constructoras').select('plan, role').eq('id', user.id).single();
      constructora = data;
    }
  } catch (err: any) {
    console.error("CRITICAL DASHBOARD ERROR:", err);
    errorMsg = err.message || "Error al conectar con la base de datos";
  }

  const isSuperAdmin = constructora?.role === 'superadmin' || user?.app_metadata?.is_superadmin === true;
  const limits = getPlanLimits(isSuperAdmin ? 'premium' : (constructora?.plan || 'gratis'));
  const usedCount = modelos.length;
  // Solo aplicamos límites reales si no es admin, para evitar bloqueos visuales
  const isLimitReached = !isSuperAdmin && usedCount >= limits.maxModels;

  if (errorMsg) {
    return (
      <div className="p-12 text-center bg-destructive/10 rounded-[3rem] border border-destructive/20">
        <h2 className="text-2xl font-black text-destructive uppercase">Error de Sistema</h2>
        <p className="text-muted-foreground mt-4 font-medium">{errorMsg}</p>
        <Button className="mt-8" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground font-heading">
            Gestión de <span className="gradient-text">Modelos</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg italic opacity-80">
            Tu catálogo digital activo en SolocasasChile.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 w-full md:w-auto">
          <div className="bg-muted/30 p-4 rounded-2xl border border-border/40 min-w-[200px]">
             <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Uso de Catálogo</p>
                <span className="text-[10px] font-black">{usedCount} / {limits.maxModels < 1000 ? limits.maxModels : '∞'}</span>
             </div>
             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", isLimitReached ? "bg-red-500" : "bg-brand-indigo")} 
                  style={{ width: `${Math.min(100, (usedCount / limits.maxModels) * 100)}%` }} 
                />
             </div>
          </div>
          <Link 
            href={isLimitReached ? "#" : "/dashboard/catalog/new"} 
            className={cn(
              buttonVariants({ variant: "default" }), 
              "rounded-2xl h-14 px-10 font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all text-white hover:text-white",
              isLimitReached ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : "bg-brand-indigo shadow-primary/20 hover:scale-[1.03] active:scale-95"
            )}
          >
            <Plus className="w-5 h-5 mr-3" /> Nuevo Modelo
          </Link>
        </div>
      </div>

      <Card className="rounded-[3.5rem] border-border/40 shadow-2xl shadow-primary/5 bg-card/10 backdrop-blur-xl overflow-hidden">
        <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30" />
                <Input 
                  placeholder="Filtrar por nombre o tipo..." 
                  className="pl-14 h-14 bg-background/40 border-border/40 rounded-2xl focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
             </div>
             <div className="flex items-center gap-4">
                <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40">
                   <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background shadow-lg shadow-black/5"><LayoutGrid className="w-4 h-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground/40 hover:text-foreground"><List className="w-4 h-4" /></Button>
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/40 gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-muted/50 transition-all">
                   <Filter className="w-4 h-4 opacity-40" /> Filtros Avanzados
                </Button>
             </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/20">
            {modelos.length > 0 ? modelos.map((modelo: any) => (
              <div key={modelo.id} className="p-8 hover:bg-primary/[0.01] transition-all flex flex-col md:grid md:grid-cols-[120px_1fr_220px] items-center gap-8 group border-l-4 border-l-transparent hover:border-l-primary/40">
                {/* Image */}
                <div className="relative w-28 h-28 rounded-3xl overflow-hidden border border-border/40 shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-700 bg-muted/20">
                  {modelo.imagenes_urls?.[0] ? (
                    <Image 
                      src={modelo.imagenes_urls[0]} 
                      alt={modelo.nombre || "Vivienda"} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-10 h-10 text-muted-foreground/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                     <h3 className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-all duration-300">{modelo.nombre || "Modelo sin nombre"}</h3>
                     <div className="flex items-center gap-2 mx-auto md:mx-0">
                        <Badge className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-none shadow-sm",
                          modelo.tipo === "sip" ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                        )}>
                          {modelo.tipo || "estándar"}
                        </Badge>
                        {!modelo.disponible && (
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-red-200 text-red-500">Privado</Badge>
                        )}
                     </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                     <div className="flex items-center gap-2">
                        <span className="text-foreground/60">{modelo.superficie_m2 || 0}</span>
                        <span>M² Proyectados</span>
                     </div>
                     <span className="w-1.5 h-1.5 rounded-full bg-border" />
                     <div className="flex items-center gap-2">
                        <span className="text-foreground/60">{modelo.dormitorios || 0}</span>
                        <span>Dormitorios</span>
                     </div>
                     <span className="w-1.5 h-1.5 rounded-full bg-border" />
                     <div className="text-primary font-black tracking-tighter text-lg normal-case">
                        {(modelo.precio_desde_uf || 0).toLocaleString('es-CL')} <span className="text-[10px] uppercase tracking-widest opacity-60">UF</span>
                     </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                   {isSuperAdmin && (
                      <form action={toggleFeaturedModelo.bind(null, modelo.id, !modelo.is_featured)}>
                         <button
                           type="submit"
                           title={modelo.is_featured ? "Quitar de destacados" : "Marcar como destacado"}
                           className={cn(
                              buttonVariants({ variant: "outline" }), 
                              "h-14 w-14 rounded-2xl border-border/40 p-0 hover:scale-105 transition-all shadow-sm",
                              modelo.is_featured ? "bg-amber-50 border-amber-200 text-amber-500 hover:text-amber-600 hover:bg-amber-100" : "hover:text-amber-500"
                           )}
                         >
                            <Star className={cn("w-5 h-5", modelo.is_featured && "fill-current")} />
                         </button>
                      </form>
                   )}
                   <Link 
                     href={`/modelo/${modelo.slug || '#'}`} 
                     target="_blank"
                     className={cn(buttonVariants({ variant: "outline" }), "h-14 w-14 rounded-2xl border-border/40 flex items-center justify-center p-0 hover:bg-muted hover:scale-105 transition-all shadow-sm")}
                     title="Ver en catálogo"
                   >
                     <Eye className="w-5 h-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                   </Link>
                   <Link
                     href={`/dashboard/catalog/${modelo.id}`}
                     className={cn(buttonVariants({ variant: "outline" }), "h-14 w-14 rounded-2xl border-border/40 p-0 hover:border-blue-500/40 hover:text-blue-600 hover:scale-105 transition-all shadow-sm")}
                     title="Editar modelo"
                   >
                      <Edit2 className="w-5 h-5" />
                   </Link>
                   <form action={deleteModelo.bind(null, modelo.id)}>
                      <button
                        type="submit"
                        className={cn(buttonVariants({ variant: "outline" }), "h-14 w-14 rounded-2xl border border-border/40 p-0 hover:border-red-500/40 hover:text-red-600 hover:scale-105 transition-all shadow-sm")}
                        title="Eliminar modelo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </form>
                </div>
              </div>
            )) : (
              <div className="p-32 text-center space-y-8 bg-muted/5">
                <div className="w-24 h-24 bg-muted/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700">
                   <Home className="w-12 h-12 text-muted-foreground/20" />
                </div>
                <div className="space-y-3">
                   <p className="text-3xl font-black tracking-tighter uppercase text-foreground/20">Catálogo Desierto</p>
                   <p className="text-muted-foreground font-medium text-lg max-w-sm mx-auto leading-tight italic opacity-60">Tu vitrina digital está esperando tu primer gran proyecto.</p>
                </div>
                <Link 
                   href="/dashboard/catalog/new" 
                   className={cn(buttonVariants({ variant: "default" }), "rounded-2xl h-16 px-12 font-bold uppercase tracking-widest bg-brand-indigo shadow-2xl shadow-primary/20 text-white hover:text-white hover:scale-[1.03] transition-all")}
                >
                   Lanzar Primer Modelo
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="p-12 rounded-[3.5rem] bg-foreground text-background overflow-hidden relative group transition-all hover:shadow-2xl hover:shadow-black/10">
         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-2 text-center md:text-left">
               <h4 className="text-3xl font-black tracking-tighter text-white">Indexación SEO de Élite</h4>
               <p className="text-lg font-medium text-white/60 italic">Cada modelo que publicas se optimiza para buscadores automáticamente.</p>
            </div>
            <Button variant="outline" className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-white/20 text-white hover:bg-white hover:text-foreground transition-all">Ver Guide de Growth</Button>
         </div>
      </div>
    </div>
  );
}
