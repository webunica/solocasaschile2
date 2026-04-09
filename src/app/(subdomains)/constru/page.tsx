import { createClient } from "@/lib/supabase/server";
import { SuppliersDirectory } from "@/components/constru/suppliers-directory";
import { redirect } from "next/navigation";
import { Lock, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ConstruHomePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Si no está logueado, redirigir al login del sitio principal
  if (!user) redirect("https://solocasaschile.com/login");

  // Verificar que sea plan Premium (o superadmin/admin que siempre tiene acceso)
  const { data: profile } = await supabase
    .from('constructoras')
    .select('plan, role')
    .eq('id', user.id)
    .single();

  const isSuperAdmin = profile?.role === 'superadmin' || profile?.role === 'admin';
  const isPremium = profile?.plan === 'premium';

  // Si no es premium ni admin, mostrar pantalla de upgrade
  if (!isPremium && !isSuperAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Lock Icon */}
          <div className="relative mx-auto w-28 h-28">
            <div className="absolute inset-0 bg-[#fa8823]/10 rounded-[2rem] blur-xl" />
            <div className="relative w-28 h-28 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10">
              <Lock className="w-12 h-12 text-[#fa8823]" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#fa8823]">Acceso exclusivo</p>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              Constru es <span className="text-[#fa8823]">Premium</span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              El directorio de proveedores de materiales SIP y el catálogo técnico están disponibles 
              exclusivamente para suscriptores del plan <strong>Premium</strong>.
            </p>
          </div>

          {/* Features teaser */}
          <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3 text-left border border-slate-200">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Lo que obtienes con Premium</p>
            {[
              "Directorio de proveedores SIP por región",
              "12 categorías técnicas de materiales",
              "Datos actualizados de Google Maps",
              "Contacto directo con Teléfono y Web",
              "Motor de sincronización con SerpApi",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fa8823]/10 flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-[#fa8823]" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="https://solocasaschile.com/planes"
              className="flex-1 flex items-center justify-center gap-3 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#fa8823] transition-all shadow-xl shadow-slate-900/20"
            >
              Ver Planes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="https://solocasaschile.com/dashboard"
              className="flex-1 flex items-center justify-center h-16 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold uppercase tracking-widest text-sm hover:border-[#fa8823]/30 transition-all"
            >
              Volver al Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usuario Premium: mostrar el directorio
  const { data: categories } = await supabase
    .from('material_categories')
    .select('*')
    .order('name');

  return (
    <div className="container mx-auto px-4 py-12">
      <SuppliersDirectory categories={categories || []} />
    </div>
  );
}
