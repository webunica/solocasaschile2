import { getModelosByConstructora } from "@/lib/supabase/services";
import { deleteModelo } from "@/lib/supabase/actions";
import { 
  Plus, Search, Edit2, Trash2, 
  Eye, LayoutGrid, List, Filter, Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function CatalogManagementPage() {
  const modelos = await getModelosByConstructora();

  return (
    <div className="space-y-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter text-foreground font-heading">
            Gestión de <span className="gradient-text">Modelos</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg leading-tight">
            Administra tu catálogo digital de viviendas en tiempo real.
          </p>
        </div>
        <Link 
          href="/dashboard/catalog/new" 
          className={cn(buttonVariants({ variant: "default" }), "rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest brand-gradient shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white hover:text-white")}
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo Modelo
        </Link>
      </div>

      <Card className="rounded-[3rem] border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-xl overflow-hidden">
        <CardHeader className="p-10 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
                <Input 
                  placeholder="Buscar modelos..." 
                  className="pl-12 h-14 bg-background/50 border-border/60 rounded-2xl focus:bg-background transition-all"
                />
             </div>
             <div className="flex items-center gap-3">
                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/60">
                   <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg bg-background shadow-sm"><LayoutGrid className="w-4 h-4" /></Button>
                   <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-muted-foreground"><List className="w-4 h-4" /></Button>
                </div>
                <Button variant="outline" className="h-12 px-5 rounded-xl border-border/60 gap-2 font-bold text-[10px] uppercase tracking-widest leading-none">
                   <Filter className="w-4 h-4" /> Filtros
                </Button>
             </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {modelos.length > 0 ? modelos.map((modelo: any) => (
              <div key={modelo.id} className="p-8 hover:bg-muted/30 transition-all flex flex-col md:grid md:grid-cols-[100px_1fr_200px] items-center gap-8 group">
                {/* Image */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/40 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500 bg-muted/30">
                  {modelo.imagenes_urls?.[0] ? (
                    <Image 
                      src={modelo.imagenes_urls[0]} 
                      alt={modelo.nombre || "Vivienda"} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                     <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{modelo.nombre || "Modelo sin nombre"}</h3>
                     <Badge className={cn(
                       "w-fit mx-auto md:mx-0 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none",
                       modelo.tipo === "sip" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                     )}>
                       {modelo.tipo || "estándar"}
                     </Badge>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-bold text-muted-foreground opacity-60">
                     <span>{modelo.superficie_m2 || 0} m²</span>
                     <span className="w-1 h-1 rounded-full bg-border" />
                     <span>{modelo.dormitorios || 0} Dormitorios</span>
                     <span className="w-1 h-1 rounded-full bg-border" />
                     <span className="text-foreground font-black tracking-tight">{(modelo.precio_desde_uf || 0).toLocaleString('es-CL')} UF</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                   <Link 
                     href={`/modelo/${modelo.slug || '#'}`} 
                     target="_blank"
                     className={cn(buttonVariants({ variant: "outline" }), "h-12 w-12 rounded-xl border-border/60 flex items-center justify-center p-0 hover:bg-muted transition-colors")}
                   >
                     <Eye className="w-5 h-5 text-muted-foreground" />
                   </Link>
                   <Link
                     href={`/dashboard/catalog/${modelo.id}`}
                     className={cn(buttonVariants({ variant: "outline" }), "h-12 w-12 rounded-xl border-border/60 p-0 hover:border-blue-500/40 hover:text-blue-600 transition-all")}
                     title="Editar modelo"
                   >
                      <Edit2 className="w-5 h-5" />
                   </Link>
                   <form action={deleteModelo.bind(null, modelo.id)}>
                      <button
                        type="submit"
                        className={cn(buttonVariants({ variant: "outline" }), "h-12 w-12 rounded-xl border border-border/60 p-0 hover:border-red-500/40 hover:text-red-600 transition-all")}
                        title="Eliminar modelo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                   </form>
                </div>
              </div>
            )) : (
              <div className="p-24 text-center space-y-6 bg-muted/5">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                   <Home className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                   <p className="text-xl font-black tracking-tighter uppercase opacity-40">Catálogo Vacío</p>
                   <p className="text-muted-foreground text-sm font-medium">Aún no has registrado modelos para tu constructora.</p>
                </div>
                <Link 
                   href="/dashboard/catalog/new" 
                   className={cn(buttonVariants({ variant: "default" }), "rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-widest brand-gradient shadow-xl shadow-primary/20 text-white hover:text-white")}
                >
                   Agregar Primer Modelo
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="p-10 rounded-[3rem] bg-brand-indigo/5 border-2 border-dashed border-brand-indigo/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left transition-all hover:bg-brand-indigo/[0.08]">
         <div className="space-y-1">
            <h4 className="text-xl font-black tracking-tighter text-brand-indigo">Optimización de SEO Proactiva</h4>
            <p className="text-sm font-medium text-muted-foreground">Tus modelos se indexan automáticamente en Google con fragmentos enriquecidos.</p>
         </div>
         <Button variant="link" className="text-brand-indigo font-black text-[10px] uppercase tracking-[0.2em] p-0 h-auto">Ver guía de optimización →</Button>
      </div>
    </div>
  );
}
