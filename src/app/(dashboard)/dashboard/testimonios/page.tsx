import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TestimoniosManager } from "@/components/dashboard/testimonios-manager";
import { getModelsByConstructoraId } from "@/lib/supabase/services";

export default async function TestimoniosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: constructora } = await supabase
    .from('constructoras')
    .select('plan, testimonios')
    .eq('id', user.id)
    .single();

  const isEligible = constructora?.plan !== 'gratis';
  const testimonios = (constructora?.testimonios as any[]) || [];
  
  // Fetch models for target selection
  const models = await getModelsByConstructoraId(user.id);

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

  return <TestimoniosManager initialTestimonios={testimonios} models={models} />;
}
