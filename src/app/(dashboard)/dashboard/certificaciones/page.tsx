import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, Plus, Trash2, ShieldCheck, Award, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function CertificacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: constructora } = await supabase
    .from('constructoras')
    .select('plan')
    .eq('id', user.id)
    .single();

  const isEligible = constructora?.plan !== 'gratis';

  if (!isEligible) {
    return (
      <div className="py-20 text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
          <Award className="w-12 h-12 text-amber-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic">Sellos de <span className="gradient-text">Máxima Calidad</span></h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Las certificaciones de calidad como ISO, CChC o SERVIU atraen a compradores profesionales. 
            Mejora tu plan para empezar a mostrar tus sellos de confianza.
          </p>
        </div>
        <Link 
          href="/planes"
          className={cn(buttonVariants({ variant: "default" }), "bg-brand-indigo h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-widest text-white hover:text-white shadow-2xl shadow-primary/20")}
        >
          Ver Planes Pro y Premium
        </Link>
      </div>
    );
  }

  const { data: certificaciones } = await supabase
    .from('certificaciones')
    .select('*')
    .eq('constructora_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic">Sellos <span className="gradient-text">Industriales</span></h1>
          <p className="text-muted-foreground font-medium">Gestiona tus certificaciones de calidad y gremiales.</p>
        </div>
        <Button className="bg-brand-indigo h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:text-white shadow-xl">
          <Plus className="w-4 h-4 mr-2" /> Agregar Certificación
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificaciones?.map((cert: any) => (
          <Card key={cert.id} className="rounded-3xl border-border/40 bg-card/40 backdrop-blur-xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-9 w-9 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white">
                   <Trash2 className="w-4 h-4" />
                </Button>
             </div>
             <CardContent className="p-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center p-3">
                   <Award className="w-8 h-8 text-amber-500" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-lg font-black tracking-tight">{cert.nombre}</h3>
                   <p className="text-xs font-bold text-muted-foreground opacity-60 uppercase tracking-widest leading-none">Institución: {cert.institucion}</p>
                </div>
                {cert.anio_obtencion && (
                  <Badge variant="outline" className="text-[10px] font-bold border-border/60">
                    Otorgada en {cert.anio_obtencion}
                  </Badge>
                )}
             </CardContent>
          </Card>
        ))}

        {(!certificaciones || certificaciones.length === 0) && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] space-y-4">
             <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8 text-muted-foreground opacity-20" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40">Sin certificaciones registradas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
