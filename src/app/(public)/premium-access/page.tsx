import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getMegaMenuAds, getLatestBlogPosts } from "@/lib/supabase/services";
import { Crown, CheckCircle2, Zap, ArrowRight, ShieldCheck, TrendingUp, BarChart3, Star } from "lucide-react";

export default async function PremiumAccessPage() {
  const [megaMenuAds, latestBlogPosts] = await Promise.all([
    getMegaMenuAds(),
    getLatestBlogPosts(2)
  ]);

  const benefits = [
    { title: "Tutoriales Exclusivos", desc: "Aprende paso a paso cómo optimizar tus procesos constructivos con expertos.", icon: Zap },
    { title: "Casos de Éxito Reales", desc: "Análisis profundos de obras terminadas, costos y lecciones aprendidas.", icon: ShieldCheck },
    { title: "Glosario Técnico Pro", desc: "Acceso ilimitado a términos específicos y normativas legales vigentes.", icon: BarChart3 },
    { title: "Análisis de Mercado", desc: "Reportes mensuales sobre tendencias de demanda y precios en tu región.", icon: TrendingUp },
    { title: "Soporte VIP 24/7", desc: "Prioridad máxima en consultas técnicas y comerciales por WhatsApp.", icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header megaMenuAds={megaMenuAds} latestBlogPosts={latestBlogPosts} />
      
      <main className="flex-1 pt-44 pb-20">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Message */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black uppercase tracking-widest">
                <Crown className="w-4 h-4" />
                Contenido Exclusivo
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none text-brand-indigo italic">
                Solo para <span className="text-amber-500">Premium Partners</span>
              </h1>
              
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Este recurso está reservado para las constructoras que forman parte de nuestro ecosistema Premium. 
                Escala tu negocio con información privilegiada y herramientas de análisis avanzado.
              </p>

              <div className="space-y-4 pt-4">
                {benefits.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border/40 flex items-center justify-center text-amber-500 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-brand-indigo">{item.title}</h3>
                      <p className="text-sm text-muted-foreground opacity-70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: CTA Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/20 blur-[100px] rounded-full opacity-50" />
              <div className="relative p-10 md:p-16 rounded-[3rem] bg-white border border-amber-500/30 shadow-2xl flex flex-col gap-8 text-center">
                <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-heading tracking-tight text-brand-indigo">Únete al Círculo Elite</h2>
                  <p className="text-muted-foreground font-medium">Activa tu plan Premium hoy mismo y desbloquea todo el ecosistema de Recursos.</p>
                </div>

                <div className="space-y-4 pt-4 text-left">
                   <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-border/40">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold">50% DCTO en suscripción anual</span>
                   </div>
                   <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-border/40">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold">Badge Premium en todo tu catálogo</span>
                   </div>
                </div>

                <Link 
                  href="/planes"
                  className="w-full h-16 bg-brand-indigo text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg shadow-brand-indigo/20 group"
                >
                  Ver Planes y Beneficios <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40 italic">Inversión 100% deducible de impuestos · Cancela cuando quieras</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
