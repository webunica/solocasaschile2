import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Building2, Mail, MapPin, Search, 
  ShieldCheck, ShieldAlert, Globe, Star,
  CheckCircle2, XCircle, MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ConstructoraAdminControls } from "@/components/dashboard/admin/constructora-controls";

export default async function AdminConstructorasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata?.is_superadmin !== true) {
    redirect("/dashboard");
  }

  // Get all constructoras
  const { data: constructoras, error } = await supabase
    .from('constructoras')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-3xl bg-muted/20">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Error al cargar constructoras</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tighter leading-none italic mb-2">Administración Global</h1>
          <p className="text-muted-foreground text-sm font-medium">Gestión maestra de todos los perfiles de constructoras en SolocasasChile.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input placeholder="Buscar por nombre o slug..." className="pl-10 h-11 w-64 md:w-80 bg-background border-border/50 rounded-xl" />
           </div>
        </div>
      </div>

      <div className="grid gap-4">
        {constructoras?.map((cons: any) => (
          <div key={cons.id} className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all group p-5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/10 flex items-center justify-center p-3 overflow-hidden relative group-hover:scale-105 transition-transform">
               {cons.logo_url ? (
                 <Image src={cons.logo_url} alt={cons.nombre} fill className="object-contain p-2" />
               ) : (
                 <Building2 className="w-8 h-8 text-muted-foreground opacity-30" />
               )}
            </div>

            <div className="flex-1 space-y-1.5 min-w-0 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link href={`/constructora/${cons.slug}`} target="_blank" className="hover:underline">
                    <h3 className="text-lg font-black tracking-tight truncate max-w-[250px]">{cons.nombre}</h3>
                </Link>
                <div className="flex gap-2">
                  <Badge className={cons.plan === 'premium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-muted/50 text-muted-foreground border-border/50'}>
                    {(cons.plan || 'gratis').toUpperCase()}
                  </Badge>
                  {cons.verificada && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verificada
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {cons.email || 'Sin email'}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {cons.direccion || 'Sin dirección'}</span>
                {cons.sitio_web && <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {cons.sitio_web.replace('https://', '')}</span>}
              </div>
            </div>

            <div className="flex-1 space-y-4 pt-4 md:pt-0">
               <ConstructoraAdminControls constructora={cons} />
            </div>

            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
               <Link 
                 href={`/dashboard/admin/constructoras/${cons.id}/edit`}
                 className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted transition-colors"
               >
                  <MoreVertical className="w-4 h-4 opacity-40" />
               </Link>
            </div>
          </div>
        ))}

        {(!constructoras || constructoras.length === 0) && (
          <div className="py-20 text-center space-y-4 border-2 border-dashed border-border/30 rounded-3xl">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto opacity-20">
                <Building2 className="w-8 h-8" />
             </div>
             <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs italic">No hay constructoras registradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
