import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Quote, User, Plus, Trash2, MessageSquare, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function TestimoniosPage() {
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
        <div className="w-24 h-24 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto">
          <MessageSquare className="w-12 h-12 text-brand-teal" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic">Función <span className="gradient-text">Pro & Premium</span></h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Los testimonios verificados aumentan la confianza de tus clientes en un <strong className="text-foreground">75%</strong>. 
            Mejora tu plan para empezar a mostrar las opiniones de tus compradores.
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

  const { data: testimonios } = await supabase
    .from('testimonios')
    .select('*')
    .eq('constructora_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic">Testimonios <span className="gradient-text">Verificados</span></h1>
          <p className="text-muted-foreground font-medium">Gestiona la reputación social de tu constructora.</p>
        </div>
        <Button className="bg-brand-indigo h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:text-white shadow-xl">
          <Plus className="w-4 h-4 mr-2" /> Agregar Testimonio
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonios?.map((t: any) => (
          <Card key={t.id} className="rounded-3xl border-border/40 bg-card/40 backdrop-blur-xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-9 w-9 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white">
                   <Trash2 className="w-4 h-4" />
                </Button>
             </div>
             <CardContent className="p-8 space-y-5">
                <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-4 h-4 ${i < t.estrellas ? "fill-amber-400 text-amber-400" : "text-muted opacity-20"}`} />
                   ))}
                </div>
                <p className="text-sm font-medium italic text-muted-foreground leading-relaxed overflow-hidden line-clamp-4">
                  "{t.comentario}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <p className="text-sm font-black tracking-tight">{t.nombre_cliente}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground opacity-60">Cliente Verificado</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}

        {(!testimonios || testimonios.length === 0) && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] space-y-4">
             <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                <Quote className="w-8 h-8 text-muted-foreground opacity-20" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40">Aún no tienes testimonios publicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
